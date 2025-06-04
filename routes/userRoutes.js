const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Example GET route for fetching a user by ID:
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add more user routes here as needed...

module.exports = router;
