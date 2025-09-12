import Borrowing from "../models/borrow.models.js";
import Equipments from "../models/equipment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const listBorrow = asyncHandler(async (req, res) => {
    const { mine } = req.query;
    const query = {};
    if (mine && req.user?._id) query.studentId = req.user._id;
    const items = await Borrowing.find(query)
        .populate('studentId', 'name email studentId')
        .populate('equipmentId', 'name category')
        .lean();
    return res.status(200).json(new apiResponse(200, { items }, "Borrow list"));
});

export const createBorrowRequest = asyncHandler(async (req, res) => {
    const { studentId, equipmentId, durationDays = 7 } = req.body;
    if (!studentId || !equipmentId) throw new apiError(400, "studentId and equipmentId required");
    const now = new Date();
    const returnBy = new Date(now.getTime() + Number(durationDays) * 24 * 60 * 60 * 1000);
    const created = await Borrowing.create({ studentId, adminId: req.user?._id, equipmentId, returnBy });
    await Equipments.findByIdAndUpdate(equipmentId, { status: "borrowed" });
    return res.status(201).json(apiResponse(201, created, "Borrow request created"));
});

export const approveBorrow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Borrowing.findByIdAndUpdate(id, { status: "active" }, { new: true });
    return res.status(200).json(apiResponse(200, updated, "Borrow approved"));
});

export const denyBorrow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Borrowing.findByIdAndUpdate(id, { status: "never_returned" }, { new: true });
    return res.status(200).json(apiResponse(200, updated, "Borrow denied"));
});

export const returnBorrow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Borrowing.findByIdAndUpdate(id, { status: "returned", returnedAt: new Date() }, { new: true });
    if (updated?.equipmentId) await Equipments.findByIdAndUpdate(updated.equipmentId, { status: "available" });
    return res.status(200).json(apiResponse(200, updated, "Item returned"));
});


