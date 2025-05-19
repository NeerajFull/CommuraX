
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'audio', 'photo'], required: true },
});

messageSchema.index({ sender: 1, receiver: 1, content: 1 }, { unique: true });
export default mongoose.model('Message', messageSchema);
