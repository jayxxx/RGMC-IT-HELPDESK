import React, { useState } from 'react';
import axios from 'axios';

export default function NewTicket() {
  const [requester, setRequester] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      requester,
      subject,
      category,
      department,
      priority,
      message, // <-- this will be sent to backend
    };
    await axios.post('/api/tickets', payload);
    // ...handle success...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={requester} onChange={e => setRequester(e.target.value)} placeholder="Requester" required />
      <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required />
      <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
      <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" required />
      <input value={priority} onChange={e => setPriority(e.target.value)} placeholder="Priority" required />
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter your message" required />
      <button type="submit">Submit</button>
    </form>
  );
}