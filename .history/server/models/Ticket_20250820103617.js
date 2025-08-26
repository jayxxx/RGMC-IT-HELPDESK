const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
  // ...other fields...
  message: { type: String, default: '' },
  // ...other fields...
});
module.exports = mongoose.model('Ticket', TicketSchema);