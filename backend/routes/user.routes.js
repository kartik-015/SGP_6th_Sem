import {Router} from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import {register ,  loginUser , logoutUser} from '../controllers/user.controllers.js';
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createOtp, verifyOtp, getOtpPhone } from "../utils/otpStore.js";
// import { loginUser } from '../controllers/user.controllers.js';
const router = Router();
// const { register, loginUser, logoutUser } = userController;
router.route('/register').post(register);
router.route('/login').post(loginUser);
// for logout jwt verifed required
router.route('/logout').post(verifyJwt , logoutUser)

// Scan endpoint: find by studentId barcode
router.get('/scan/:barcode', asyncHandler(async (req, res) => {
  const user = await User.findOne({ studentId: req.params.barcode }).select("-password");
  if (!user) return res.status(404).json({ statusCode:404, data:null, message:'Not found', success:false });
  return res.status(200).json({ statusCode:200, data:{ user }, success:true });
}));

// Basic CRUD for users (needed by frontend ManageUsers)
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  res.status(200).json({ users });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, email, role = 'user', studentId, password = 'changeme' } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message:'User already exists' });
  const user = await User.create({ name, email, role, studentId, password });
  res.status(201).json({ user });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success:true });
}));

// OTP: issue code (mock - logs to server, returns masked)
router.post('/otp/request', asyncHandler(async (req, res) => {
  const { userId, phone } = req.body;
  if (!phone) return res.status(400).json({ success:false, message:'phone required' });
  const key = `user:${userId || 'guest'}`;
  const code = createOtp(key, phone);
  console.log(`OTP for ${phone}: ${code}`); // Integrate SMS provider in production
  return res.status(200).json({ success:true, message:'OTP sent', masked:`******${String(phone).slice(-4)}` });
}));

// OTP: verify code
router.post('/otp/verify', asyncHandler(async (req, res) => {
  const { userId, code } = req.body;
  if (!code) return res.status(400).json({ success:false, message:'code required' });
  const key = `user:${userId || 'guest'}`;
  const ok = verifyOtp(key, String(code));
  if (!ok) return res.status(401).json({ success:false, message:'Invalid or expired OTP' });
  return res.status(200).json({ success:true, message:'OTP verified' });
}));

export default router;