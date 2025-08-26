const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Counter = require('../models/Counter'); // see previous answer for Counter model

async function nextSequence(name) {
  const c = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return c.seq;
}

router.post('/', async (req, res) => {
  try {
    const seq = await nextSequence('ticketNumber');
    const ticket = new Ticket({ ...req.body, ticketNumber: seq });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;