import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const r = Router();
// auth.js
const secret = () => process.env.JWT_SECRET;
const send = (res, u, code = 200) =>
  res.status(code).json({ token: jwt.sign({ id: u._id }, secret(), { expiresIn: '7d' }), user: { name: u.name, email: u.email } });

r.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Enter your name, an email, and a password of at least 6 characters.' });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(409).json({ message: 'That email already has an account. Try logging in.' });
  send(res, await User.create({ name, email, password: await bcrypt.hash(password, 10) }), 201);
});

r.post('/login', async (req, res) => {
  const u = await User.findOne({ email: (req.body.email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password)))
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  send(res, u);
});

export default r;
