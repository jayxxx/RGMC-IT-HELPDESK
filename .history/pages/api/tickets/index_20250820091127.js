import clientPromise from '../../../lib/mongodb'; // adapt to your mongo client util

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // atomically increment counter and get new seq value
    const counter = await db.collection('counters').findOneAndUpdate(
      { _id: 'ticketid' },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    const seq = counter.value.seq;
    const ticketID = `TICKET-${String(seq).padStart(6, '0')}`;

    const newTicket = {
      ...req.body,
      ticketID,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('tickets').insertOne(newTicket);
    return res.status(201).json({ ok: true, ticket: newTicket, insertedId: result.insertedId });
  }

  if (req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const tickets = await db.collection('tickets').find({}).toArray();
    res.status(200).json(tickets);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}