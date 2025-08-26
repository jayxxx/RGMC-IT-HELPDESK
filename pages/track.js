import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function TrackTicket() {
  const router = useRouter();
  const [ticketID, setTicketID] = useState('');
  const [email, setEmail] = useState('');
  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const { ticketID: qID, email: qEmail } = router.query;
      if (qID && qEmail) {
        setTicketID(qID);
        setEmail(qEmail);
        fetchTicket(qID, qEmail);
      }
    }
  }, [router.isReady]);

  const fetchTicket = async (tID, mail) => {
    try {
      const res = await axios.get(`/api/history/${tID}`, { params: { email: mail } });
      setTicket(res.data.ticket);
      setHistory(res.data.history);
      setError('');
    } catch {
      setTicket(null);
      setHistory([]);
      setError('Ticket not found or email does not match.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTicket(ticketID, email);
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <h1>Track Your Ticket</h1>
      <form onSubmit={handleSearch} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        <input type="text" placeholder="Ticket ID" value={ticketID} onChange={(e) => setTicketID(e.target.value)} required />
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {ticket && (
        <div>
          <h2>Ticket Details</h2>
          <p><strong>Ticket ID:</strong> {ticket.ticketID}</p>
          <p><strong>Subject:</strong> {ticket.subject}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Description:</strong> {ticket.description}</p>

          <h3>Status Change History</h3>
          <ul>
            {history.map((h, idx) => (
              <li key={idx}>
                {new Date(h.changedAt).toLocaleString()} — <strong>{h.oldStatus}</strong> → <strong>{h.newStatus}</strong> (by {h.changedBy})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
