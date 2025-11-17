import express from 'express';
import Budget from '../models/Budget.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get budgets for a specific month/year
router.get('/:year/:month', protect, async (req, res) => {
  try {
    const { year, month } = req.params;
    const budgets = await Budget.find({
      userId: req.user._id,
      year: parseInt(year),
      month: parseInt(month)
    }).populate('categoryId');
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update budget
router.post('/', protect, async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;
    
    const budget = await Budget.findOneAndUpdate(
      { categoryId, userId: req.user._id, month, year },
      { amount },
      { new: true, upsert: true }
    ).populate('categoryId');
    
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete budget
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;