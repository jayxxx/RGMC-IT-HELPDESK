import { getDb } from '../../../lib/db';
import { getTransporter, getTrackingLink, getAdminTicketLink } from '../../../lib/mail';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const db = await getDb();
  const ticketsCol = db.collection('tickets');
  const historyCol = db.collection('ticket_history');

  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  let decoded = null;
  if (token) {
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  const { id } = req.query;

  if (req.method === 'PATCH') {
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const { status } = req.body;
    let ticket = null;
    if (ObjectId.isValid(id)) {
      ticket = await ticketsCol.findOne({ _id: new ObjectId(id) });
    }
    if (!ticket) {
      ticket = await ticketsCol.findOne({ ticketID: id });
    }
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    await ticketsCol.updateOne({ _id: ticket._id }, { $set: { status } });

    await historyCol.insertOne({
      ticketID: ticket.ticketID,
      oldStatus: ticket.status,
      newStatus: status,
      changedBy: decoded.email,
      changedAt: new Date(),
    });

    const transporter = getTransporter();
    const trackingLink = getTrackingLink(ticket.ticketID, ticket.email);
    const adminLink = getAdminTicketLink(ticket); // Pass whole ticket, not just ticketID
    const teamRecipients = process.env.SUPPORT_TEAM_EMAILS.split(',');

    // Notify user
    await transporter.sendMail({
      from: `"IT Helpdesk" <${process.env.EMAIL_USER}>`,
      to: ticket.email,
      subject: `Ticket Update: ${ticket.ticketID}`,
      html: `
        <h2>Ticket Status Update</h2>
        <p>Your ticket <strong>${ticket.ticketID}</strong> status has been updated to <strong>${status}</strong>.</p>
        <p><a href="${trackingLink}" style="display:inline-block;padding:10px 15px;background:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">Track My Ticket</a></p>
      `
    });

    // Notify IT team
    await transporter.sendMail({
      from: `"IT Helpdesk" <${process.env.EMAIL_USER}>`,
      to: teamRecipients,
      subject: `Ticket Status Changed: ${ticket.ticketID}`,
      html: `
        <h2>Ticket Status Change Alert</h2>
        <p>Ticket <strong>${ticket.ticketID}</strong> updated by ${decoded.email}.</p>
        <p>Old Status: ${ticket.status} → New Status: ${status}</p>
        <p>
          <a href="${trackingLink}" style="display:inline-block;padding:10px 15px;background:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">User View</a>
          <a href="${adminLink}" style="display:inline-block;padding:10px 15px;background:#28A745;color:#fff;text-decoration:none;border-radius:5px;margin-left:10px;">Admin View</a>
        </p>
      `
    });

    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    let ticket = null;
    console.log('Searching for ticket:', id);

    if (ObjectId.isValid(id)) {
      ticket = await ticketsCol.findOne({ _id: new ObjectId(id) });
      if (ticket) console.log('Found by _id');
    }
    if (!ticket) {
      ticket = await ticketsCol.findOne({ ticketID: id });
      if (ticket) console.log('Found by ticketID');
    }

    if (!ticket) {
      console.log('Ticket not found');
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.status(200).json(ticket);
  }

  if (req.method === 'DELETE') {
    let result = null;
    // Try to delete by _id if valid
    if (ObjectId.isValid(id)) {
      result = await ticketsCol.deleteOne({ _id: new ObjectId(id) });
    }
    // If not found, try to delete by ticketID
    if (!result || result.deletedCount === 0) {
      result = await ticketsCol.deleteOne({ ticketID: id });
    }
    if (result && result.deletedCount === 1) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: 'Ticket not found' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
