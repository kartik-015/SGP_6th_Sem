import Approval from "../models/approval.models.js";
import Borrowing from "../models/borrow.models.js";
import Equipments from "../models/equipment.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export async function getApprovalByToken(req, res) {
  const { token } = req.params;
  const approval = await Approval.findOne({ token }).lean();
  if (!approval) throw new apiError(404, "Invalid approval link");
  const expired = approval.tokenExpiresAt && new Date(approval.tokenExpiresAt) < new Date();
  return res.status(200).json(new apiResponse(200, { approval, expired }, "Approval fetched"));
}

export async function decideApproval(req, res) {
  const { token } = req.params;
  const { decision } = req.body; // 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(decision)) throw new apiError(400, 'Invalid decision');
  const approval = await Approval.findOne({ token });
  if (!approval) throw new apiError(404, "Invalid approval link");
  if (approval.status !== 'pending') return res.status(200).json(new apiResponse(200, { approval }, "Already decided"));
  if (new Date(approval.tokenExpiresAt) < new Date()) throw new apiError(410, "Approval link expired");

  if (decision === 'approved') {
    // Decrement stock and activate borrow
    const borrow = await Borrowing.findById(approval.borrowId);
    if (!borrow) throw new apiError(404, 'Borrow record not found');
    const updatedEquipment = await Equipments.findOneAndUpdate(
      { _id: borrow.equipmentId, available: { $gte: borrow.count } },
      { $inc: { available: -borrow.count }, $set: { status: 'borrowed' } },
      { new: true }
    );
    if (!updatedEquipment) throw new apiError(400, 'Insufficient stock');
    borrow.status = 'active';
    borrow.borrowedAt = new Date();
    await borrow.save();
  }

  approval.status = decision;
  approval.decidedAt = new Date();
  await approval.save();
  return res.status(200).json(new apiResponse(200, { approval }, `Approval ${decision}`));
}
