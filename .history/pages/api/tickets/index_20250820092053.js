import connect from '../../../lib/mongoose';
import Ticket from '../../../models/Ticket';

export default async function handler(req, res) {
  await connect();

  try {
    if (req.method === 'GET') {
      const tickets = await Ticket.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json(tickets);
    }

    if (req.method === 'POST') {
      const { subject, description, priority, email, category, department } = req.body || {};

      if (!subject || !email) {
        return res.status(400).json({ error: 'subject and email are required' });
      }

      const t = new Ticket({ subject, description, priority, email, category, department });
      const saved = await t.save();
      return res.status(201).json(saved.toObject());
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('/api/tickets error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}