import Borrowing from "../models/borrow.models.js";
import Equipments from "../models/equipment.models.js";
import { User } from "../models/user.models.js";
import { isStudentFreeNow } from "../utils/schedule.js";
import { checkRollNow } from "../utils/scheduleCsv.js";
import Approval from "../models/approval.models.js";
import Counsellor from "../models/counsellor.models.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const listBorrow = asyncHandler(async (req, res) => {
    const { mine, status } = req.query;
    const query = {};
    
    if (mine && req.user?._id) query.studentId = req.user._id;
    if (status && String(status).toLowerCase() !== 'all') query.status = status;
    // Default for admin listing: show currently borrowed (active) when no status provided
    if (!status && !mine) query.status = 'active';
    
    const items = await Borrowing.find(query)
        .populate('studentId', 'name email studentId')
        .populate('equipmentId', 'name category sport price')
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    
    // Calculate penalty for overdue items
    const now = new Date();
    const itemsWithPenalty = items.map(item => {
        if (item.status === 'active' && item.returnBy < now) {
            const equipment = item.equipmentId;
            const penaltyAmount = equipment?.price ? Math.round(equipment.price * 0.1 * item.count) : 0;
            return {
                ...item,
                penaltyAmount,
                isOverdue: true
            };
        }
        return {
            ...item,
            penaltyAmount: item.penaltyAmount || 0,
            isOverdue: false
        };
    });
    // Summary counts (useful for student history and admin dashboards)
    const summary = {
        total: itemsWithPenalty.length,
        pending: itemsWithPenalty.filter(i => i.status === 'pending').length,
        active: itemsWithPenalty.filter(i => i.status === 'active').length,
        overdue: itemsWithPenalty.filter(i => i.status === 'overdue' || i.isOverdue).length,
        returned: itemsWithPenalty.filter(i => i.status === 'returned').length,
    };
    
    return res.status(200).json(new apiResponse(200, { items: itemsWithPenalty, summary }, "Borrow list"));
});

export const createBorrowRequest = asyncHandler(async (req, res) => {
    try {
        let { studentId, equipmentId, barcode, durationHours = 1, count = 1, imageUrl, verifiedName, verifiedPhone } = req.body;
        console.log('Borrow request body:', req.body);

        // Normalize inputs
        durationHours = Math.max(1, Number(durationHours) || 1);
        count = Math.max(1, Number(count) || 1);

        // Allow client to provide either equipmentId or barcode
        if (!equipmentId && barcode) {
            const equipmentDoc = await Equipments.findOne({ barcode: String(barcode).trim() }).select('_id');
            if (!equipmentDoc) {
                throw new apiError(404, 'Equipment not found for provided barcode');
            }
            equipmentId = equipmentDoc._id;
        }

        if (!equipmentId) throw new apiError(400, 'equipmentId or barcode required');

        // For student requests, get studentId from auth
        if (!studentId && req.user?._id) {
            studentId = req.user._id;
        }

        if (!studentId) {
            // For student requests, they should be logged in
            throw new apiError(401, 'Authentication required');
        }

        // Do NOT decrement stock here; request stays pending until admin approval
        // Optionally, we could pre-check existence
        const eqExists = await Equipments.findById(equipmentId).select('_id available');
        if (!eqExists) {
            throw new apiError(404, 'Equipment not found');
        }

        const now = new Date();
        const returnBy = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

        // Load user profile for schedule check
        const user = await User.findById(studentId).lean();

        // Default borrow payload
        const borrowData = {
            studentId,
            adminId: null,
            equipmentId,
            returnBy,
            imageUrl: imageUrl || null,
            count,
            verifiedName: verifiedName || user?.name || null,
            verifiedPhone: verifiedPhone || null,
            status: 'pending'
        };

                // If the request provided a scanned roll string, prefer CSV-based quick-check
                let check;
                if (req.body?.roll) {
                    check = await checkRollNow(req.body.roll);
                } else {
                    // Fallback to DB timetable check using user profile
                    check = await isStudentFreeNow(user || {});
                }

                // If free, atomically decrement and activate immediately
                if (check.free) {
            const updatedEquipment = await Equipments.findOneAndUpdate(
                { _id: equipmentId, available: { $gte: count } },
                { $inc: { available: -count }, $set: { status: 'borrowed' } },
                { new: true }
            );
            if (!updatedEquipment) throw new apiError(400, 'Insufficient stock for this item');
            borrowData.status = 'active';
            borrowData.borrowedAt = new Date();
            const created = await Borrowing.create(borrowData);
            return res.status(201).json(new apiResponse(201, { borrow: created, autoApproved: true }, 'Borrow created and auto-approved (free slot)'));
        }

        // Not free -> create pending and send approval to counsellor
        const created = await Borrowing.create(borrowData);

                // Find counsellor: if we used CSV check and it returned counsellor, use that
                let counsellor = null;
                if (check && check.counsellor) {
                    // convert to shape similar to Counsellor model
                    counsellor = { email: check.counsellor.Email || check.counsellor.EmailAddress || check.counsellor.email, name: check.counsellor.Name || check.counsellor.name };
                } else {
                    const department = user?.department;
                    const year = user?.year;
                    counsellor = department && year ? await Counsellor.findOne({ department, year, active: true }).lean() : null;
                }

                let emailResult = null;
                if (counsellor?.email) {
            const token = crypto.randomBytes(24).toString('hex');
            const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6h
                        const deptVal = (user?.department) || (check?.parsed?.department) || 'unknown';
                        const yearVal = (user?.year) || (check?.parsed?.year) || 0;

                        await Approval.create({
                                borrowId: created._id,
                                studentId,
                                equipmentId,
                                department: deptVal,
                                year: yearVal,
                                approverEmail: counsellor.email,
                                approverName: counsellor.name,
                                token,
                                tokenExpiresAt
                        });

                        const baseUrl = process.env.APP_BASE_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
                        const approveLink = `${baseUrl}/approvals/${token}`;
                        const subject = `Borrow approval required for ${user?.name || 'student'}`;
                        const html = `
                            <p>Dear ${counsellor.name || 'Counsellor'},</p>
                            <p>A borrow request was made during a scheduled class.</p>
                            <ul>
                                <li>Student: <strong>${user?.name || 'N/A'}</strong> (${user?.studentId || ''})</li>
                                <li>Department/Year: <strong>${deptVal || 'N/A'}/${yearVal || 'N/A'}</strong></li>
                                <li>Equipment ID: <strong>${String(equipmentId)}</strong></li>
                            </ul>
                            <p>Please review and approve or reject:</p>
                            <p><a href="${approveLink}">Open approval in system</a> (link valid for 6 hours)</p>
                        `;
                            try {
                                const info = await sendEmail({ to: counsellor.email, subject, html, text: `${subject}\n${approveLink}` });
                                emailResult = { success: true, info };
                            } catch (err) {
                                const msg = err && err.message ? err.message : String(err);
                                console.error('Failed to send approval email to counsellor:', msg);
                                emailResult = { success: false, error: msg };
                            }
        }

                    return res.status(201).json(new apiResponse(201, { borrow: created, approvalRequired: true, emailResult }, 'Borrow request created; approval required'));
    } catch (error) {
        console.error('Borrow creation error:', error);
        throw error;
    }
});

export const approveBorrow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Load the borrow record
    const borrow = await Borrowing.findById(id);
    if (!borrow) throw new apiError(404, 'Borrow record not found');

    // Atomically decrement stock if enough available
    const updatedEquipment = await Equipments.findOneAndUpdate(
        { _id: borrow.equipmentId, available: { $gte: borrow.count } },
        { $inc: { available: -borrow.count }, $set: { status: 'borrowed' } },
        { new: true }
    );
    if (!updatedEquipment) throw new apiError(400, 'Insufficient stock for this item');

    // Mark borrow as active and stamp admin/borrowedAt
    const updated = await Borrowing.findByIdAndUpdate(
        id,
        { status: 'active', adminId: req.user?._id || null, borrowedAt: new Date() },
        { new: true }
    );

    return res.status(200).json(new apiResponse(200, updated, "Borrow approved"));
});

export const denyBorrow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Borrowing.findByIdAndUpdate(id, { status: "denied" }, { new: true });
    return res.status(200).json(new apiResponse(200, updated, "Borrow denied"));
});

export const returnBorrow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const borrowItem = await Borrowing.findById(id).populate('equipmentId', 'price');
    
    if (!borrowItem) {
        throw new apiError(404, "Borrow record not found");
    }
    
    const now = new Date();
    let penaltyAmount = 0;
    let status = "returned";
    
    // Calculate penalty if overdue
    if (borrowItem.returnBy < now) {
        const equipment = borrowItem.equipmentId;
        penaltyAmount = equipment?.price ? Math.round(equipment.price * 0.1 * borrowItem.count) : 0;
        status = "overdue";
    }
    
    const updated = await Borrowing.findByIdAndUpdate(id, { 
        status, 
        returnedAt: now,
        penaltyAmount 
    }, { new: true });
    
    if (updated?.equipmentId) {
        await Equipments.findByIdAndUpdate(
            updated.equipmentId,
            { $set: { status: "available" }, $inc: { available: updated.count } }
        );
    }
    
    return res.status(200).json(new apiResponse(200, updated, "Item returned"));
});

export const markOverdueItems = asyncHandler(async (req, res) => {
    const now = new Date();
    const overdueItems = await Borrowing.find({
        status: 'active',
        returnBy: { $lt: now }
    }).populate('equipmentId', 'price');
    
    let updatedCount = 0;
    for (const item of overdueItems) {
        const penaltyAmount = item.equipmentId?.price ? 
            Math.round(item.equipmentId.price * 0.1 * item.count) : 0;
        
        await Borrowing.findByIdAndUpdate(item._id, {
            status: 'overdue',
            penaltyAmount
        });
        updatedCount++;
    }
    
    return res.status(200).json(new apiResponse(200, { updatedCount }, `${updatedCount} items marked as overdue`));
});

export const payPenalty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Borrowing.findByIdAndUpdate(id, { 
        penaltyPaid: true 
    }, { new: true });
    
    if (!updated) {
        throw new apiError(404, "Borrow record not found");
    }
    
    return res.status(200).json(new apiResponse(200, updated, "Penalty paid successfully"));
});

export const getStudentHistory = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    
    const borrowings = await Borrowing.find({ studentId })
        .populate('studentId', 'name email studentId')
        .populate('equipmentId', 'name category sport price')
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    
    const now = new Date();
    const historyWithPenalty = borrowings.map(item => {
        let penaltyAmount = item.penaltyAmount || 0;
        let isOverdue = false;
        
        if (item.status === 'active' && item.returnBy < now) {
            const equipment = item.equipmentId;
            penaltyAmount = equipment?.price ? Math.round(equipment.price * 0.1 * item.count) : 0;
            isOverdue = true;
        }
        
        return {
            ...item,
            penaltyAmount,
            isOverdue
        };
    });
    
    return res.status(200).json(new apiResponse(200, { items: historyWithPenalty }, "Student borrowing history"));
});

