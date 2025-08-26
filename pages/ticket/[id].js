import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tickets/${id}`)
      .then(res => res.json())
      .then(data => {
        setTicket(data);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin');
    } else {
      alert('Failed to delete ticket.');
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) return alert('Please select a status.');
    setUpdating(true);
    const res = await fetch(`/api/tickets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if required:
        // 'Authorization': `Bearer ${yourToken}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      // Refetch ticket data
      fetch(`/api/tickets/${id}`)
        .then(res => res.json())
        .then(data => setTicket(data));
      alert('Status updated!');
    } else {
      alert('Failed to update status.');
    }
    setUpdating(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!ticket || ticket.error) return <div>Ticket not found.</div>;

  return (
    <div>
      <h1>Ticket: {ticket.ticketID}</h1>
      <p>Status: {ticket.status}</p>
      <p>Description: {ticket.description}</p>
      <p>Requester: {ticket.email}</p>
      <p>Created At: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</p>
      <p>Priority: {ticket.priority || 'N/A'}</p>

      <div style={{ marginTop: 24 }}>
        <label>
          Update Status:&nbsp;
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            <option value="">Select status</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </label>
        <button
          onClick={handleUpdateStatus}
          disabled={updating}
          style={{ marginLeft: 8, padding: '6px 12px', background: '#007BFF', color: 'white', border: 'none', borderRadius: 4 }}
        >
          {updating ? 'Updating...' : 'Update'}
        </button>
      </div>

      <button
        onClick={handleDelete}
        style={{ color: 'white', background: 'red', padding: '8px 16px', border: 'none', borderRadius: '4px', marginTop: '16px' }}
      >
        Delete Ticket
      </button>
    </div>
  );
}