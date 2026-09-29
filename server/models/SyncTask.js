import mongoose from 'mongoose';

const SyncTaskSchema = new mongoose.Schema({
  clientTaskId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  endpoint: { type: String, required: true },
  method: { type: String, enum: ['POST', 'PUT'], required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  receivedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['received', 'processed', 'failed'],
    default: 'received',
  },
});

export default mongoose.models.SyncTask || mongoose.model('SyncTask', SyncTaskSchema);
