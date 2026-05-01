import { Router } from 'express';
import { checkRollNow } from '../utils/scheduleCsv.js';
import { sendEmail, isSmtpConfigured } from '../utils/email.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Public endpoint to notify a student's counsellor based on roll number.
// This endpoint does not require DB connection and can be used in dev mode (SKIP_DB=true).
// Body: { roll: string, studentName?: string, details?: string }
router.post('/notify-counsellor', asyncHandler(async (req, res) => {
  const { roll, studentName, details } = req.body || {};
  if (!roll) return res.status(400).json({ success: false, message: 'roll is required' });

  const result = await checkRollNow(roll);
  const counsellor = result.counsellor;
  if (!counsellor) return res.status(404).json({ success: false, message: 'Counsellor not found for this roll', data: result });

  const to = counsellor.Email || counsellor.EmailAddress || counsellor.email;
  const name = counsellor.Name || counsellor.name || 'Counsellor';

  if (!to) return res.status(404).json({ success: false, message: 'Counsellor email not available', data: counsellor });

  const subject = `Approval request: ${studentName || roll} attempted to borrow during class`;
  const text = `Dear ${name},\n\nStudent ${studentName || roll} (Dept: ${result.parsed.department}, Year: ${result.parsed.year}) attempted to borrow equipment during their scheduled class (${result.busyEntry?.Subject || 'a scheduled class'}).\n\nDetails: ${details || 'N/A'}\n\nPlease login to the system to approve or reject.`;

  if (!isSmtpConfigured()) {
    // Simulate
    return res.status(200).json({ success: true, simulated: true, to, subject, text, result });
  }

  try {
    const info = await sendEmail({ to, subject, text });
    return res.status(200).json({ success: true, info, result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send email', error: err && err.message ? err.message : err, result });
  }
}));

export default router;
