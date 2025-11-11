import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpDocument extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  lastSentAt: Date;
}

const otpSchema = new Schema<IOtpDocument>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastSentAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOtpDocument>('Otp', otpSchema);
