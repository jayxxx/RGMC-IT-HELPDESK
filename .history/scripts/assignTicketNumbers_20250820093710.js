// Run: node scripts\assignTicketNumbers.js
const mongoose = require('mongoose');
const Ticket = require('../server/models/Ticket');
const Counter = require('../server/models/Counter');

(async () => {
  await mongoose.connect('mongodb://localhost:27017/yourdb');
  const tickets = await Ticket.find({}).sort({ createdAt: 1 }); // oldest first
  let next = (await Counter.findById('ticketNumber'))?.seq ?? 0;
  for (const t of tickets) {
    if (t.ticketNumber == null) {
      next++;
      t.ticketNumber = next;
      await t.save();
      console.log('Assigned', t._id, '→', next);
    } else {
      next = Math.max(next, t.ticketNumber);
    }
  }
  await Counter.findByIdAndUpdate('ticketNumber', { seq: next }, { upsert: true });
  console.log('Migration done. Next number set to', next);
  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });