import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT: number | string = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/reports", reportRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL as string)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err: unknown) => console.error('❌ MongoDB connection error:', err));

// Basic route
app.get('/', (req: Request, res: Response): void => {
  res.send('Hello from Express server!');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
