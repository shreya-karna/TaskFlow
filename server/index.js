import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './routes/auth.js';
import tasks from './routes/tasks.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);
app.use((err, req, res, next) => res.status(500).json({ message: 'Something went wrong on the server.' }));

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long.');
}

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow')
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('TaskFlow API ready')))
  .catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
