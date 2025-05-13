import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

export default authRouter
