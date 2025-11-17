import express from 'express';
import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get expenses
router.get('/', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = { userId: req.user._id };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    const expenses = await Expense.find(filter).populate('categoryId');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create expense
router.post('/', protect, async (req, res) => {
  try {
    const { categoryId, amount, date, description } = req.body;
    
    const expense = await Expense.create({
      categoryId,
      amount,
      date,
      description,
      userId: req.user._id
    });
    
    await expense.populate('categoryId');
    
    // Check budget status
    const expenseDate = new Date(date);
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();
    
    const budget = await Budget.findOne({
      categoryId,
      userId: req.user._id,
      month,
      year
    });
    
    let budgetStatus = 'no_budget';
    if (budget) {
      const totalSpent = await Expense.aggregate([
        {
          $match: {
            categoryId: expense.categoryId._id,
            userId: req.user._id,
            date: {
              $gte: new Date(year, month - 1, 1),
              $lte: new Date(year, month, 0)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const spent = totalSpent[0]?.total || 0;
      budgetStatus = spent <= budget.amount ? 'within_budget' : 'over_budget';
    }
    
    res.status(201).json({ expense, budgetStatus });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;