import {Router} from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import {register ,  loginUser , logoutUser} from '../controllers/user.controllers.js';
// import { loginUser } from '../controllers/user.controllers.js';
const router = Router();
// const { register, loginUser, logoutUser } = userController;
router.route('/register').post(register);
router.route('/login').post(loginUser);
// for logout jwt verifed required
router.route('/logout').post(verifyJwt , logoutUser)

export default router;