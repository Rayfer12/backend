const express = require('express');
const Ticket = require('../models/Ticket');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/', protect, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id });
  res.json(tickets);
});


router.get('/:id', protect, async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
});


router.post('/', protect, async (req, res) => {
  const ticket = new Ticket({ ...req.body, createdBy: req.user.id });
  await ticket.save();
  res.status(201).json(ticket);
});


router.put('/:id', protect, async (req, res) => {
  const updated = await Ticket.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});


router.delete('/:id', protect, async (req, res) => {
  await Ticket.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
  res.json({ message: 'Ticket deleted' });
});


router.get('/admin/all', protect, admin, async (req, res) => {
  const tickets = await Ticket.find({});
  res.json(tickets);
});


router.get('/admin/:id', protect, admin, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
});


router.put('/admin/:id/assign', protect, admin, async (req, res) => {
  const { agentId } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  ticket.assignedTo = agentId;
  await ticket.save();
  res.json(ticket);
});

module.exports = router;
