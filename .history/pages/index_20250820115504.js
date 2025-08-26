import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketForm from '../components/TicketForm';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    ticketID: '',
    subject: '', // <-- change from title to subject
    description: '',
    priority: '',
    email: '',
    category: '',
    department: ''
  });

  useEffect(() => {
    axios.get('/api/tickets').then(res => setTickets(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    // Exclude ticketID from the data sent to the backend
    const { ticketID, ...ticketData } = form;
    const res = await axios.post('/api/tickets', ticketData);
    setTickets([res.data, ...tickets]);
    setForm({
      ticketID: '',
      subject: '',
      description: '',
      priority: '',
      email: '',
      category: '',
      department: ''
    });
  };

  // Optionally auto-generate a ticket number for display (not for backend)
  const nextTicketNumber = tickets.length > 0
    ? `TICKET-${String(Number(tickets[0].ticketID?.split('-')[1] || 0) + 1).padStart(6, '0')}`
    : 'TICKET-000001';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6fa',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Logo */}
      <img
        src="/rgmc-logo.png"
        alt="RGMC Logo"
        style={{
          width: 200,
          marginBottom: 32,
        }}
      />
      {/* Form */}
      <div style={{
        background: '#fff',
        padding: 32,
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 500,
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Create Ticket</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Ticket ID</label>
            <input
              type="text"
              value={nextTicketNumber}
              readOnly
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                background: '#f9f9f9',
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Title / Subject</label>
            <input
              name="subject"
              placeholder="Enter ticket title or subject"
              value={form.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Description</label>
            <textarea
              name="description"
              placeholder="Enter description here..."
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Category</label>
            <select
              name="category" value={form.category} onChange={handleChange} required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
              }}>
              <option value="">Select Category</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="System">System</option>
              <option value="Network">Network</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Department</label>
            <select
              name="department" value={form.department} onChange={handleChange} required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
              }}>
              <option value="">Select Department</option>
              <option value="ACCOUNTING">ACCOUNTING</option>
              <option value="FINANCE">FINANCE</option>
              <option value="SALES">SALES</option>
              <option value="PROPLAST">PROPLAST</option>
              <option value="GANA">GANA</option>
              <option value="OPERATION">OPERATION</option>
              <option value="PROCUREMENT">PROCUREMENT</option>
              <option value="WAREHOUSE">WAREHOUSE</option>
              <option value="HR">HR</option>
              <option value="SUPPLY CHAIN">SUPPLY CHAIN</option>
              <option value="TECHNICAL">TECHNICAL</option>
              <option value="QA/QC">QA/QC</option>
              <option value="SMARTPACK">SMARTPACK</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Priority</label>
            <select
              name="priority" value={form.priority} onChange={handleChange} required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
              }}>
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 6,
              border: 'none',
              background: '#007bff',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}