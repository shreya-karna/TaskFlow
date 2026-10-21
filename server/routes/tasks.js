import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';

const r = Router();
r.use((req, res, next) => {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '');
req.uid = jwt.verify(t, process.env.JWT_SECRET).id;
    next();
  } catch { res.status(401).json({ message: 'Your session expired. Log in again.' }); }
});

const pick = (b) => {
  const o = {};
  for (const k of ['title', 'status', 'priority', 'description']) if (k in b) o[k] = b[k];
  if ('due' in b) o.due = b.due || null;
  if ('tags' in b) o.tags = (Array.isArray(b.tags) ? b.tags : []).map((t) => String(t).trim()).filter(Boolean).slice(0, 6);
  return o;
};

r.get('/', async (req, res) => res.json(await Task.find({ user: req.uid }).sort('-createdAt')));
r.post('/', async (req, res) => {
  if (!req.body.title?.trim()) return res.status(400).json({ message: 'Give the task a title.' });
  res.status(201).json(await Task.create({ ...pick(req.body), user: req.uid }));
});
r.put('/:id', async (req, res) => {
  const t = await Task.findOneAndUpdate({ _id: req.params.id, user: req.uid }, pick(req.body), { new: true, runValidators: true });
  t ? res.json(t) : res.status(404).json({ message: 'Task not found.' });
});
r.delete('/:id', async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.uid });
  res.json({ ok: true });
});

export default r;
