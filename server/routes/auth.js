import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);

    // Create default categories for new user
    const defaultCategories = [
      { name: 'Food & Dining', color: '#FF6B6B', userId: user._id },
      { name: 'Transportation', color: '#4ECDC4', userId: user._id },
      { name: 'Shopping', color: '#45B7D1', userId: user._id },
      { name: 'Entertainment', color: '#96CEB4', userId: user._id },
      { name: 'Bills & Utilities', color: '#FFEAA7', userId: user._id },
      { name: 'Healthcare', color: '#DDA0DD', userId: user._id },
      { name: 'Education', color: '#98D8C8', userId: user._id },
      { name: 'Travel', color: '#F7DC6F', userId: user._id }
    ];

    const Category = (await import('../models/Category.js')).default;
    await Category.insertMany(defaultCategories);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        email: user.email,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;