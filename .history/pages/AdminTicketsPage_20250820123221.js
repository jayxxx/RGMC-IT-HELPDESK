import React, { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Open', 'Pending', 'Closed'];

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({}); // Track selected status per ticket

  // Fetch tickets on mount
  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data));
  }, []);

  // Handle dropdown change
  const handleStatusChange = (ticketId, newStatus) => {
    setStatusUpdates(prev => ({
      ...prev,
      [ticketId]: newStatus,
    }));
  };

  // Handle update button click
  const handleUpdateStatus = async (ticketId) => {
    const newStatus = statusUpdates[ticketId];
    if (!newStatus) return;

    await fetch(`/api/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    // Update local state to reflect change
    setTickets(tickets =>
      tickets.map(t =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>All tickets</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 16 }}>
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
            <th>Status Update</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
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
              <td>
                <select
                  value={statusUpdates[ticket.id] || ticket.status}
                  onChange={e => handleStatusChange(ticket.id, e.target.value)}
                  style={{ marginRight: 4 }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleUpdateStatus(ticket.id)}
                  style={{ background: '#007bff', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTicketsPage;