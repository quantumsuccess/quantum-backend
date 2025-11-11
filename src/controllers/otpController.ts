import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { generateOTP } from '../utils/helper.js';
import Otp, { IOtpDocument } from '../models/otp.js';
import { Request, Response } from 'express';

/** -------------------------------
 * Helper: Send OTP Email
 * ------------------------------- */
export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const msg: MailDataRequired = {
    to: email,
    from: process.env.SENDER_EMAIL || '', // must be a verified sender
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  await sgMail.send(msg);
};

/** -------------------------------
 * Controller: Send OTP
 * ------------------------------- */
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const otp = generateOTP();
    const now = new Date();

    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: now, lastSentAt: now },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

/** -------------------------------
 * Controller: Resend OTP
 * ------------------------------- */
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const record: IOtpDocument | null = await Otp.findOne({ email });
    const now = new Date();

    if (!record) {
      res.status(400).json({ message: 'No OTP found, please request a new one' });
      return;
    }

    const diffInSeconds = (now.getTime() - record.lastSentAt.getTime()) / 1000;
    if (diffInSeconds < 60) {
      res.status(400).json({ message: 'You can resend OTP only after 1 minute' });
      return;
    }

    const otp = generateOTP();
    record.otp = otp;
    record.createdAt = now;
    record.lastSentAt = now;
    await record.save();

    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resending OTP' });
  }
};

/** -------------------------------
 * Controller: Verify OTP
 * ------------------------------- */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const record: IOtpDocument | null = await Otp.findOne({ email });
    if (!record) {
      res.status(400).json({ message: 'OTP not found or expired' });
      return;
    }

    const now = new Date();
    const diffInSeconds = (now.getTime() - record.createdAt.getTime()) / 1000;

    if (diffInSeconds > 300) {
      await Otp.deleteOne({ email });
      res.status(400).json({ message: 'OTP expired' });
      return;
    }

    if (record.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    await Otp.deleteOne({ email });
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};
