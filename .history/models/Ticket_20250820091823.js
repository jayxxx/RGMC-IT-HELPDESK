import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const TicketSchema = new mongoose.Schema({
  ticketID: String,
  subject: String,
  description: String,
  priority: String,
  email: String,
  category: String,
  department: String,
  status: { type: String, default: 'Open' },
}, { timestamps: true });

TicketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const c = await Counter.findByIdAndUpdate(
      'ticketid',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.ticketID = `TICKET-${String(c.seq).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);