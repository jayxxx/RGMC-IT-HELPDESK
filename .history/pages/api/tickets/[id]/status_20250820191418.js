export default async function handler(req, res) {
  async function updateTicketStatus(ticketId) {
    const newStatus = statusUpdates[ticketId];
    if (!newStatus) return;
    await fetch(`/api/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    // Optionally refresh tickets here
  }

  // ...your code...
}