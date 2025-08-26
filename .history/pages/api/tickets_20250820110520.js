// Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Create a new ticket
router.post('/tickets', async (req, res) => {
  try {
    // When creating a ticket
    const newTicket = new Ticket({
      email: req.body.email,
      subject: req.body.subject,
      category: req.body.category,
      department: req.body.department,
      priority: req.body.priority,
      message: req.body.message, // <-- Make sure this is present
      status: 'Open',
      // ...other fields...
    });
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tickets
router.get('/tickets', async (req, res) => {
  try {
    // When returning tickets
    const tickets = await Ticket.find({});
    res.json(tickets); // <-- message should be included
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ...existing code...

module.exports = router;