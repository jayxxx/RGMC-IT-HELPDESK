import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Login from './login';

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
    setTickets(res.data);
    setLoading(false);
  };

  const handleDelete = async (ticketID) => {
    if (!ticketID) {
      console.error('Ticket ID is undefined.');
      alert('Unable to delete ticket. Ticket ID is missing.');
      return;
    }

    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const response = await fetch(`/api/tickets/${ticketID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTickets(tickets.filter(ticket => ticket.ticketID !== ticketID)); // Remove ticket from state
        alert('Ticket deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error deleting ticket:', errorData);
        alert(`Failed to delete ticket: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('An error occurred while deleting the ticket.');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm('Are you sure you want to delete selected tickets?')) return;
    for (const ticketID of selectedTickets) {
      await fetch(`/api/tickets/${ticketID}`, { method: 'DELETE' });
    }
    setTickets(tickets.filter(t => !selectedTickets.includes(t.ticketID)));
    setSelectedTickets([]);
  };

  const handleBulkUpdateStatus = async (newStatus) => {
    for (const ticketID of selectedTickets) {
      await fetch(`/api/tickets/${ticketID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    }
    setTickets(tickets.map(t =>
      selectedTickets.includes(t.ticketID) ? { ...t, status: newStatus } : t
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
          <button
            onClick={handleBulkDelete}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              background: 'red',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Delete Selected
          </button>
          <button
            onClick={() => handleBulkUpdateStatus('Closed')}
            style={{
              marginTop: 8,
              padding: '8px 16px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Close Selected
          </button>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f5f6fa' }}>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Ticket ID</th> {/* New column */}
                <th style={{ padding: 8, border: '1px solid #eee' }}>Requester</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Subject</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Category</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Department</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Priority</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Message</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Last Updated</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map(ticket => (
                <tr key={ticket._id}>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.ticketID)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedTickets([...selectedTickets, ticket.ticketID]);
                        } else {
                          setSelectedTickets(selectedTickets.filter(id => id !== ticket.ticketID));
                        }
                      }}
                    />
                  </td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{ticket.email}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{ticket.subject || 'No Subject'}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>
                    {ticket.category && ticket.category.trim() !== '' ? ticket.category : 'No Category'}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>
                    {ticket.department && ticket.department.trim() !== '' ? ticket.department : 'No Department'}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{ticket.priority || 'No Priority'}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{ticket.message || 'No Message'}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>
                    {!statusEdit[ticket.ticketID] ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            color: ticket.status === 'Open' ? '#007bff' :
                                  ticket.status === 'Pending' ? '#ffc107' :
                                  ticket.status === 'Closed' ? '#28a745' : '#6c757d',
                            fontWeight: 'bold'
                          }}
                        >
                          {ticket.status}
                        </span>
                        <button
                          style={{
                            padding: '4px 8px',
                            background: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setStatusEdit({ ...statusEdit, [ticket.ticketID]: true });
                            setStatusValue({ ...statusValue, [ticket.ticketID]: ticket.status });
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <select
                          value={statusValue[ticket.ticketID]}
                          onChange={e => setStatusValue({ ...statusValue, [ticket.ticketID]: e.target.value })}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            fontSize: 14
                          }}
                        >
                          <option value="Open">Open</option>
                          <option value="Pending">Pending</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button
                          style={{
                            padding: '4px 8px',
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                          }}
                          onClick={async () => {
                            const newStatus = statusValue[ticket.ticketID];
                            const res = await fetch(`/api/tickets/${ticket.ticketID}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                              body: JSON.stringify({ status: newStatus }),
                            });
                            if (res.ok) {
                              setTickets(tickets =>
                                tickets.map(t =>
                                  t.ticketID === ticket.ticketID ? { ...t, status: newStatus } : t
                                )
                              );
                              setStatusEdit({ ...statusEdit, [ticket.ticketID]: false });
                            } else {
                              alert('Failed to update status.');
                            }
                          }}
                        >
                          Update
                        </button>
                        <button
                          style={{
                            padding: '4px 8px',
                            background: '#ccc',
                            color: '#333',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                          }}
                          onClick={() => setStatusEdit({ ...statusEdit, [ticket.ticketID]: false })}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>
                    {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'N/A'}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>
                    <button
                      style={{ padding: '4px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, marginRight: 8 }}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      View
                    </button>
                    <button
                      style={{ padding: '4px 12px', background: 'red', color: '#fff', border: 'none', borderRadius: 4 }}
                      onClick={() => handleDelete(ticket.ticketID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </div>
  );
}
