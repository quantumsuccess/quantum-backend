import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id:any) => {
  console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const matchPassword = async (enteredPassword: string, hashedPassword: string) => {
  console.log("await bcrypt.compare(enteredPassword, hashedPassword)",await bcrypt.compare(enteredPassword, hashedPassword))
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

export default generateToken;
export { matchPassword };
