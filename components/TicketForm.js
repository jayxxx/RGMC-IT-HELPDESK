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

export default TicketForm;