const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  email: String,
  subject: String,
  category: String,
  department: String,
  priority: String,
  message: String, // <-- Ensure this is present
  status: String,
  // ...other fields...
});

module.exports = mongoose.model('Ticket', TicketSchema);