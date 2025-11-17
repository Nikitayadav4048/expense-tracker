import express from 'express';
import Category from '../models/Category.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', protect, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post('/', protect, async (req, res) => {
  try {
    const { name, color } = req.body;
    const category = await Category.create({
      name,
      color,
      userId: req.user._id
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;