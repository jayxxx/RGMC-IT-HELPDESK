const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
  requester: String,
  subject: String,
  category: String,
  department: String,
  priority: String,
  message: String, // <-- must be 'message'
  status: { type: String, default: 'Open' },
  ticketNumber: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Ticket', TicketSchema);