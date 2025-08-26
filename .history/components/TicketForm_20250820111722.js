import React, { useState } from 'react';

const TicketForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      subject,
      category,
      department,
      priority,
      message, // <-- ensure this is included
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
      {/* ...form fields for email, subject, category, department, priority, message... */}
      <button type="submit">Submit Ticket</button>
    </form>
  );
};

export default TicketForm;