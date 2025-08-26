import fs from 'fs';
import path from 'path';

const ticketsFile = path.join(process.cwd(), 'data', 'tickets.json'); // Adjust path if needed

function readTickets() {
  if (!fs.existsSync(ticketsFile)) return [];
  const data = fs.readFileSync(ticketsFile, 'utf-8');
  return JSON.parse(data);
}

function writeTickets(tickets) {
  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
}

export default function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  if (method === 'PUT') {
    const { status } = body;
    let tickets = readTickets();
    const idx = tickets.findIndex(t => String(t.id || t.ticketId) === String(id));
    if (idx === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    tickets[idx].status = status;
    tickets[idx].updatedAt = new Date().toISOString();
    writeTickets(tickets);
    return res.status(200).json({ success: true, ticket: tickets[idx] });
  }

  res.setHeader('Allow', ['PUT']);
  res.status(405).end(`Method ${method} Not Allowed`);
}