import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

budgetSchema.index({ categoryId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);