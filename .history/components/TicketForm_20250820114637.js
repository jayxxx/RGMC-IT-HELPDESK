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
        onChange={e => setSubject(e.target.value)}
        placeholder="Enter ticket title or subject"
        required
      />

      <label>Category</label>
      <select
        name="category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        {/* ...options... */}
      </select>

      <label>Message</label>
      <textarea
        name="message"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Enter your message here..."
        required
        style={{ marginTop: '10px', width: '100%', minHeight: '80px' }}
      />

      {/* ...other form fields... */}
      <button type="submit">Submit Ticket</button>
    </form>
  );
};

export default TicketForm;