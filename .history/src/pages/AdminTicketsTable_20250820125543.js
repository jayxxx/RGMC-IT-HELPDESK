// ...existing code...

{tickets.map(ticket => (
  <tr key={ticket.id}>
    {/* ...other cells... */}
    <td>
      <select
        value={ticket.status}
        onChange={e => updateTicketStatus(ticket.id, e.target.value)}
      >
        <option value="Open">Open</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed/Completed</option>
      </select>
      {/* REMOVE or comment out the Update button below */}
      {/* <button onClick={() => updateTicketStatus(ticket.id)}>Update</button> */}
    </td>
    {/* ...other cells... */}
  </tr>
))}

// Add this function inside your component, above your return statement:
const updateTicketStatus = async (ticketId, newStatus) => {
  await fetch(`/api/tickets/${ticketId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });
  // Optionally refresh tickets here
};

// ...existing code...