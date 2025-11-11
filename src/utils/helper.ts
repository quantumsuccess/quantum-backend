import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id:any) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

const matchPassword = async (enteredPassword: string, hashedPassword: string) => {
  console.log("await bcrypt.compare(enteredPassword, hashedPassword)",await bcrypt.compare(enteredPassword, hashedPassword))
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export default generateToken;
export { matchPassword,generateOTP };
