const express = require('express');
const Ticket = require('../models/Ticket');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ User: GET all my tickets
router.get('/', protect, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id });
  res.json(tickets);
});

// ✅ User: GET specific ticket by ID
router.get('/:id', protect, async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
});

// ✅ User: POST create ticket
router.post('/', protect, async (req, res) => {
  const ticket = new Ticket({ ...req.body, createdBy: req.user.id });
  await ticket.save();
  res.status(201).json(ticket);
});

// ✅ User: PUT update ticket
router.put('/:id', protect, async (req, res) => {
  const updated = await Ticket.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// ✅ User: DELETE ticket
router.delete('/:id', protect, async (req, res) => {
  await Ticket.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
  res.json({ message: 'Ticket deleted' });
});

// ✅ Admin: GET all tickets
router.get('/admin/all', protect, admin, async (req, res) => {
  const tickets = await Ticket.find({});
  res.json(tickets);
});

// ✅ Admin: GET specific ticket by ID
router.get('/admin/:id', protect, admin, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
});

// ✅ Admin: Assign agent to ticket
router.put('/admin/:id/assign', protect, admin, async (req, res) => {
  const { agentId } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  ticket.assignedTo = agentId;
  await ticket.save();
  res.json(ticket);
});

module.exports = router;
