import { Router } from 'express';
import { resendOtp, sendOtp, verifyOtp } from '../controllers/otpController.js';

const router = Router();

router.route('/send').post(sendOtp);
router.route('/resend').post(resendOtp);
router.route('/verify-otp').post(verifyOtp);


export default router;