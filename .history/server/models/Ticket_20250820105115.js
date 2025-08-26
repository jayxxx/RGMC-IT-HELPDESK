const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
  requester: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
  priority: { type: String, required: true },
  message: { type: String, default: '' }, // <-- must be 'message'
  status: { type: String, default: 'Open' },
  ticketNumber: { type: Number, unique: true, sparse: true },
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