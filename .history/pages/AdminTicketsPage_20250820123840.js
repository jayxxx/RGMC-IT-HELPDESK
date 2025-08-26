<thead>
  <tr>
    <th>Ticket ID</th>
    <th>Requester</th>
    <th>Subject</th>
    <th>Category</th>
    <th>Department</th>
    <th>Priority</th>
    <th>Description</th>
    <th>Status</th>
    <th>Last Updated</th>
    <th>Action</th>
    {/* Removed Status Update column */}
  </tr>
</thead>
<tbody>
  {tickets.map(ticket => (
    <tr key={ticket.id || ticket.ticketId}>
      <td>{ticket.ticketId || ticket.id}</td>
      <td>{ticket.email}</td>
      <td>{ticket.subject}</td>
      <td>{ticket.category}</td>
      <td>{ticket.department}</td>
      <td>{ticket.priority}</td>
      <td>{ticket.description}</td>
      <td>{ticket.status}</td>
      <td>{ticket.updatedAt}</td>
      <td>
        {/* Your existing View/Delete buttons */}
        <button style={{ marginRight: 4 }}>View</button>
        <button style={{ background: 'red', color: '#fff' }}>Delete</button>
      </td>
      {/* Removed Status Update cell */}
    </tr>
  ))}
</tbody>