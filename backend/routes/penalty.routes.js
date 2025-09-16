import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import Borrowing from '../models/borrow.models.js';

const router = Router();

// Placeholder endpoints
router.get('/', asyncHandler(async (req, res) => {
  // Unpaid penalties: overdue, active past due, or returned with penaltyAmount > 0; and not penaltyPaid
  const now = new Date();
  const q = {
    penaltyPaid: { $ne: true },
    $or: [
      { status: 'overdue' },
      { status: 'active', returnBy: { $lt: now } },
      { status: 'returned', penaltyAmount: { $gt: 0 } },
    ]
  };
  const docs = await Borrowing.find(q)
    .populate('studentId', 'name email studentId')
    .populate('equipmentId', 'name price')
    .lean();

  // Group by student
  const groupsMap = new Map();
  for (const b of docs) {
    const sid = String(b.studentId?._id || b.studentId);
    const price = b.equipmentId?.price;
    const amount = (b.penaltyAmount && b.penaltyAmount > 0)
      ? b.penaltyAmount
      : (price ? Math.round(price * 0.1 * (b.count || 1)) : 0);
    const entry = groupsMap.get(sid) || {
      studentId: sid,
      studentName: b.studentId?.name || 'Unknown',
      studentEmail: b.studentId?.email || '',
      studentCode: b.studentId?.studentId || '',
      totalAmount: 0,
      items: [],
    };
    entry.totalAmount += amount;
    entry.items.push({
      borrowId: String(b._id),
      itemName: b.equipmentId?.name || 'Unknown',
      amount,
      status: b.status,
    });
    groupsMap.set(sid, entry);
  }

  const groups = Array.from(groupsMap.values()).map(g => ({
    ...g,
    count: g.items.length,
  })).sort((a, b) => b.totalAmount - a.totalAmount);

  const summary = {
    studentsDue: groups.length,
    totalDue: groups.reduce((s, g) => s + g.totalAmount, 0),
  };

  return res.status(200).json(new apiResponse(200, { items: groups, summary }, 'Penalties by student'));
}));

router.post('/', asyncHandler(async (req, res) => {
  return res.status(201).json(new apiResponse(201, { id: 'penalty-id' }, 'Penalty added'));
}));

router.post('/:id/settle', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Borrowing.findByIdAndUpdate(id, { penaltyPaid: true }, { new: true });
  if (!updated) return res.status(404).json(new apiResponse(404, {}, 'Borrowing not found'));
  return res.status(200).json(new apiResponse(200, { id }, 'Penalty settled'));
}));

// Settle all unpaid penalties for a student
router.post('/student/:studentId/settle', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const now = new Date();
  const q = {
    studentId,
    penaltyPaid: { $ne: true },
    $or: [
      { status: 'overdue' },
      { status: 'active', returnBy: { $lt: now } },
      { status: 'returned', penaltyAmount: { $gt: 0 } },
    ]
  };
  const result = await Borrowing.updateMany(q, { $set: { penaltyPaid: true } });
  return res.status(200).json(new apiResponse(200, { matched: result.matchedCount ?? result.n, modified: result.modifiedCount ?? result.nModified }, 'Student penalties settled'));
}));

export default router;


