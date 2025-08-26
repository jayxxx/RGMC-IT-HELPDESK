import React, { useState } from 'react';

const TicketForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      subject,
      description, // <-- send description instead of message
      category,
      department,
      priority,
    };
    await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // ...existing code...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Ticket ID field if present */}
      {/* Title / Subject */}
      <input
        type="text"
        placeholder="Title / Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        required
      />

      {/* Description - moved here, right after subject */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        style={{ marginTop: '10px', width: '100%', minHeight: '80px' }}
      />

      {/* Category */}
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
        style={{ marginTop: '10px', width: '100%' }}
      >
        <option value="">Select Category</option>
        {/* ...category options... */}
      </select>

      {/* Department */}
      <select
        value={department}
        onChange={e => setDepartment(e.target.value)}
        required
        style={{ marginTop: '10px', width: '100%' }}
      >
        <option value="">Select Department</option>
        {/* ...department options... */}
      </select>

      {/* Priority */}
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        required
        style={{ marginTop: '10px', width: '100%' }}
      >
        <option value="">Select Priority</option>
        {/* ...priority options... */}
      </select>

      {/* Email */}
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ marginTop: '10px', width: '100%' }}
      />

      <button type="submit" style={{ marginTop: '16px', width: '100%' }}>
        Submit Ticket
      </button>
    </form>
  );
};

const TicketList = ({ tickets }) => {
  return (
    <table>
      <thead>
        <tr>
          {/* ...other headers... */}
          <th>Status</th>
          {/* ...other headers... */}
        </tr>
      </thead>
      <tbody>
        {tickets.map(ticket => (
          <tr key={ticket.id}>
            {/* ...other columns... */}
            <td>
              <select
                value={ticket.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  await fetch(`/api/tickets/${ticket.id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                  });
                  // Optionally, refresh the ticket list here
                }}
                style={{ marginRight: '8px' }}
              >
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                onClick={async () => {
                  // Optionally, you can trigger the update here instead of onChange
                }}
                style={{ background: '#007bff', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
              >
                Update Status
              </button>
            </td>
            {/* ...other columns... */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TicketForm;