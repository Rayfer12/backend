const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: 'User registered' });
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// ✅ PUT /api/users/me → Update my details
router.put('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.username = req.body.username || user.username;
  // add more fields as needed, e.g., user.email

  const updatedUser = await user.save();
  res.json(updatedUser);
});

// ✅ GET /api/admin/users → Admin: list all users
router.get('/admin/users', protect, admin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = router;
