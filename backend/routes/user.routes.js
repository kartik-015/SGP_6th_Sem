import {Router} from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import {register ,  loginUser , logoutUser} from '../controllers/user.controllers.js';
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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

export default router;