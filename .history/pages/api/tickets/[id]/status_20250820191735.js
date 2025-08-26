import ticketsData from '../../../../data/ticketsData'; // adjust path as needed

export default async function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  if (method === "PUT") {
    // Find and update the ticket in your data
    const ticket = ticketsData.find(t => t._id === id || t.id === id || t.ticketID === id);
    if (ticket) {
      ticket.status = body.status;
      return res.status(200).json({ success: true, id, status: body.status });
    }
    return res.status(404).json({ success: false, message: "Ticket not found" });
  }

  // Method not allowed
  res.setHeader("Allow", ["PUT"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}