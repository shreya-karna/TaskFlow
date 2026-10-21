import mongoose from 'mongoose';
export default mongoose.model('Task', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 140 },
  status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  tags: { type: [String], default: [] },
  due: Date,
}, { timestamps: true }));
