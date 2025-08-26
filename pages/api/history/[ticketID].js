import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  const { ticketID } = req.query;
  const { email } = req.query;
  const db = await getDb();
  const ticketsCol = db.collection('tickets');
  const historyCol = db.collection('ticket_history');

  const ticket = await ticketsCol.findOne({ ticketID });
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  if (ticket.email !== email) return res.status(403).json({ error: 'Unauthorized' });

  const history = await historyCol.find({ ticketID }).sort({ changedAt: -1 }).toArray();
  res.status(200).json({ ticket, history });
}
