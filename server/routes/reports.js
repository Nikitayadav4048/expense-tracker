import express from 'express';
import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get monthly report
router.get('/:year/:month', protect, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all categories for the user
    const categories = await Category.find({ userId: req.user._id });
    
    // Get budgets for the month
    const budgets = await Budget.find({
      userId: req.user._id,
      year: parseInt(year),
      month: parseInt(month)
    });

    // Get expenses for the month
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$categoryId',
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    // Combine data
    const report = categories.map(category => {
      const budget = budgets.find(b => b.categoryId.toString() === category._id.toString());
      const expense = expenses.find(e => e._id.toString() === category._id.toString());
      
      const budgetAmount = budget?.amount || 0;
      const spent = expense?.totalSpent || 0;
      const remaining = budgetAmount - spent;

      return {
        category: {
          _id: category._id,
          name: category.name,
          color: category.color
        },
        budget: budgetAmount,
        spent,
        remaining,
        isOverBudget: remaining < 0
      };
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;