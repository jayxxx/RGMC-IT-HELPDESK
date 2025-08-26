import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await getDb();
  const ticketsCol = db.collection('tickets');

  if (req.method === 'POST') {
    const {
      subject,
      description,
      category,
      department,
      priority,
      message,
      email,
      // ...other fields...
    } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ticket = {
      subject,
      description,
      category,
      department,
      priority,
      message, // <-- ensure this is saved
      email,
      status: 'Open',
      createdAt: new Date(),
      updatedAt: new Date(),
      // ...other fields...
    };

    const result = await ticketsCol.insertOne(ticket);
    res.status(201).json({ ...ticket, _id: result.insertedId });
    return;
  }

  if (req.method === 'GET') {
    const tickets = await ticketsCol.find({}).toArray();
    res.status(200).json(tickets);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}