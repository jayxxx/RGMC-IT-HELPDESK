import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Login from './login';
import AdminTicketsTable from './AdminTicketsTable';

function formatTicketID(src) {
  // src can be a ticket object or numeric id or string
  if (!src) return '';
  // If caller passed full ticket object, prefer ticketNumber + createdAt
  if (typeof src === 'object') {
    const ticket = src;
    const num = ticket.ticketNumber ?? ticket.seq ?? null;
    const year = ticket.createdAt ? new Date(ticket.createdAt).getFullYear() : new Date().getFullYear();
    if (num != null && !isNaN(num)) {
      return `HD-${year}-${String(num).padStart(3, '0')}`; // HD-2025-001
    }
    // fallthrough to immutable id/hash below
    src = ticket._id ?? ticket.id ?? ticket.ticketID ?? '';
  }

  const str = String(src);
  // If this looks like a Mongo ObjectId use a stable slice (won't be reused)
  if (/^[a-fA-F0-9]{24}$/.test(str)) {
    const year = new Date().getFullYear();
    return `HD-${year}-${str.slice(-6).toUpperCase()}`;
  }

  // numeric fallback
  const num = typeof src === 'number' ? src : parseInt(str.replace(/\D/g, ''), 10);
  if (!isNaN(num)) return `HD-${new Date().getFullYear()}-${String(num).padStart(3, '0')}`;

  // deterministic 6-digit hash fallback (stable per id)
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return `HD-${new Date().getFullYear()}-${(hash % 1000).toString().padStart(3, '0')}`;
}

// Added helper to safely derive and format a ticket's ID (avoids errors when fields are missing)
function getTicketID(ticket) {
  if (!ticket) return '';
  // prefer permanent sequence field ticketNumber/seq, then _id, id, ticketID
  return formatTicketID(ticket);
}

export default function Admin() {
  const [token, setToken] = useState('');
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [statusEdit, setStatusEdit] = useState({});
  const [statusValue, setStatusValue] = useState({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const ticketsPerPage = 10;

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) fetchTickets();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [token]);

  const fetchTickets = async () => {
    const res = await axios.get('/api/tickets');
    const mapped = res.data.map(ticket => {
      // prefer backend-provided permanent ticketNumber/seq; keep _deleteId for API calls
      const deleteId = ticket._id ?? ticket.id ?? ticket.ticketID;
      return {
        ...ticket,
        ticketID: ticket.ticketID ?? ticket.id ?? ticket._id,
        _deleteId: deleteId,
        stableTicketNumber: formatTicketID(ticket) // will use ticket.ticketNumber if present
      };
    });
    setTickets(mapped);
    setLoading(false);
  };

  const handleDelete = async (ticketID) => {
    if (!ticketID) {
      console.error('Ticket ID is undefined.');
      alert('Unable to delete ticket. Ticket ID is missing.');
      return;
    }

    // Find ticket and prefer its immutable delete id (_deleteId) when calling backend
    const ticket = tickets.find(t =>
      t.ticketID === ticketID ||
      t._id === ticketID ||
      t.id === ticketID ||
      t.stableTicketNumber === ticketID
    );

    const deleteKey = ticket?._deleteId ?? ticket?.ticketID ?? ticketID;
    if (!deleteKey) {
      console.error('No delete key available for ticket:', ticketID);
      alert('Unable to delete ticket. Ticket identifier not found.');
      return;
    }

    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const response = await fetch(`/api/tickets/${deleteKey}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTickets(tickets.filter(t => (t._deleteId ?? t.ticketID) !== deleteKey));
        setSelectedTickets(selectedTickets.filter(id => id !== ticketID));
      } else {
        alert('Failed to delete ticket.');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm('Are you sure you want to delete selected tickets?')) return;
    for (const sel of selectedTickets) {
      const ticket = tickets.find(t =>
        t.ticketID === sel ||
        t._id === sel ||
        t.id === sel ||
        t.stableTicketNumber === sel
      );
      const deleteKey = ticket?._deleteId ?? ticket?.ticketID ?? sel;
      if (deleteKey) {
        await fetch(`/api/tickets/${deleteKey}`, { method: 'DELETE' });
      }
    }
    setTickets(tickets.filter(t => !selectedTickets.includes(t.ticketID) && !selectedTickets.includes(t.stableTicketNumber) && !selectedTickets.includes(t._deleteId)));
    setSelectedTickets([]);
  };

  const handleBulkUpdateStatus = async (newStatus) => {
    for (const sel of selectedTickets) {
      const ticket = tickets.find(t =>
        t.ticketID === sel ||
        t._id === sel ||
        t.id === sel ||
        t.stableTicketNumber === sel
      );
      const patchKey = ticket?._deleteId ?? ticket?.ticketID ?? sel;
      if (patchKey) {
        await fetch(`/api/tickets/${patchKey}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    }
    setTickets(tickets.map(t =>
      selectedTickets.includes(t.ticketID) || selectedTickets.includes(t.stableTicketNumber) ? { ...t, status: newStatus } : t
    ));
    setSelectedTickets([]);
  };

  // Filtering, searching, and sorting
  let filteredTickets = tickets.filter(ticket => {
    if (filter !== 'all' && ticket.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        (ticket.subject && ticket.subject.toLowerCase().includes(s)) ||
        (ticket.email && ticket.email.toLowerCase().includes(s)) ||
        (ticket.message && ticket.message.toLowerCase().includes(s))
      );
    }
    return true;
  });

  if (sort) {
    const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
    filteredTickets = filteredTickets.sort((a, b) => {
      const aVal = priorityOrder[a.priority] || 0;
      const bVal = priorityOrder[b.priority] || 0;
      return sort === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const paginatedTickets = filteredTickets.slice((page - 1) * ticketsPerPage, page * ticketsPerPage);

  // Show the styled login form if not logged in
  if (!token) {
    return <Login onLogin={setToken} />;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif', background: '#f5f6fa' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <img
          src="/rgmc-logo.png"
          alt="RGMC Logo"
          style={{
            width: 200,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: 220,
          background: '#fff',
          padding: 24,
          borderRight: '1px solid #ddd'
        }}>
          <h3>Tickets</h3>
          <div style={{ marginBottom: 24 }}>
            <button onClick={() => { setFilter('all'); setPage(1); }} style={{ display: 'block', marginBottom: 8 }}>All tickets</button>
            <button onClick={() => { setFilter('Open'); setPage(1); }} style={{ display: 'block', marginBottom: 8 }}>Open</button>
            <button onClick={() => { setFilter('Pending'); setPage(1); }} style={{ display: 'block', marginBottom: 8 }}>Pending</button>
            <button onClick={() => { setFilter('Closed'); setPage(1); }} style={{ display: 'block', marginBottom: 8 }}>Closed</button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: 32 }}>
          <h1>All tickets</h1>
          {/* Search and Sort */}
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                width: 250,
                fontSize: 15
              }}
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{ marginLeft: 16, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}
            >
              <option value="">Sort by Priority</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
          <AdminTicketsTable
            tickets={paginatedTickets}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onBulkClose={() => handleBulkUpdateStatus('Closed')}
            onEditStatus={(id) => {
              const ticket = tickets.find(t => t.ticketID === id);
              if (ticket) {
                setStatusEdit({ ...statusEdit, [id]: true });
                setStatusValue({ ...statusValue, [id]: ticket.status });
              }
            }}
            onView={(id) => setSelectedTicket(tickets.find(t => t.ticketID === id))}
            selectedTickets={selectedTickets}
            setSelectedTickets={setSelectedTickets}
            formatTicketID={formatTicketID} // <-- add this line
          />
          {/* Pagination Controls */}
          <div style={{ marginTop: 16 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  margin: 2,
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: i + 1 === page ? '2px solid #007bff' : '1px solid #ccc',
                  background: i + 1 === page ? '#007bff' : '#fff',
                  color: i + 1 === page ? '#fff' : '#333',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {/* Ticket Details Modal */}
          {selectedTicket && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div style={{
                background: '#fff', padding: 32, borderRadius: 10, minWidth: 350, maxWidth: 500, boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
              }}>
                <h2>Ticket Details</h2>
                <p><b>Requester:</b> {selectedTicket.email}</p>
                <p><b>Subject:</b> {selectedTicket.subject}</p>
                <p><b>Category:</b> {selectedTicket.category}</p>
                <p><b>Department:</b> {selectedTicket.department}</p>
                <p><b>Priority:</b> {selectedTicket.priority}</p>
                <p><b>Message:</b> {selectedTicket.message}</p>
                <p><b>Status:</b> <span style={{
                  color: selectedTicket.status === 'Open' ? '#007bff' : selectedTicket.status === 'Pending' ? '#ffc107' : selectedTicket.status === 'Closed' ? '#28a745' : '#6c757d',
                  fontWeight: 'bold'
                }}>{selectedTicket.status}</span></p>
                <p><b>Last Updated:</b> {selectedTicket.updatedAt ? new Date(selectedTicket.updatedAt).toLocaleString() : 'N/A'}</p>
                <p><b>Ticket ID:</b> {selectedTicket.stableTicketNumber || getTicketID(selectedTicket)}</p>
                <button
                  style={{ marginTop: 16, padding: '6px 18px', background: '#e040fb', color: '#fff', border: 'none', borderRadius: 6 }}
                  onClick={() => setSelectedTicket(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </main>
      </div
    </div>
  );
}
