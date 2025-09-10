import { Request, Response } from 'express';
import AdminUser from '../models/AdminUser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// POST /api/auth/register  (You may restrict this in production)
export const registerAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const exists = await AdminUser.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Admin with that email exists' });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = new AdminUser({ email, passwordHash });
  await admin.save();
  res.status(201).json({ message: 'Admin created' });
};

// POST /api/auth/login
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await AdminUser.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token });
};
