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
      <label>Title / Subject</label>
      <input
        type="text"
        name="subject"
        value={subject}
        onChange={handleChange}
        placeholder="Enter ticket title or subject"
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        value={description}
        onChange={handleChange}
        placeholder="Enter description here..."
        required
        style={{ marginTop: '10px', width: '100%', minHeight: '80px' }}
      />

      <label>Category</label>
      <select
        name="category"
        value={category}
        onChange={handleChange}
      >
        {/* ...options... */}
      </select>
      {/* ...other form fields... */}
      <button type="submit">Submit Ticket</button>
    </form>
  );
};

export default TicketForm;