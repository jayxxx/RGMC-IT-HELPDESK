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

const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    requester,
    subject,
    category,
    department,
    priority,
    message, // <-- make sure this is included!
    // ...other fields
  };
  await axios.post('/api/tickets', payload);
  // ...existing code...
};