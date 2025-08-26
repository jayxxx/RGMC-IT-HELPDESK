import dbConnect from '../../../lib/db';
import Ticket from '../../../models/Ticket';
import sendMail from '../../../lib/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();
  try {
    const { name, email, subject, description, category, company, department } = req.body;
    const ticket = await Ticket.create({
      name, email, subject, description,
      category, company, department,
      status: 'open'
    });

    await sendMail({
      to: email,
      subject: `Ticket Received: ${subject}`,
      text: `Your ticket has been created. ID: ${ticket._id}`
    });

    await sendMail({
      to: process.env.SUPPORT_TEAM_EMAILS,
      subject: `New Ticket: ${subject}`,
      text: `Ticket ID: ${ticket._id}\nCategory: ${category}\nCompany: ${company}\nDepartment: ${department}`
    });

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
