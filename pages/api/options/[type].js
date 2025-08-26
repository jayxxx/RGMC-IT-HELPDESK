import dbConnect from '../../../lib/db';
import Option from '../../../models/Option';

export default async function handler(req, res) {
  await dbConnect();
  const { type } = req.query;

  if (!['categories','companies','departments'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  if (req.method === 'GET') {
    const options = await Option.find({ type }).sort({ name: 1 });
    return res.json(options);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const opt = await Option.create({ type, name });
    return res.json(opt);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    await Option.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  res.status(405).end();
}
