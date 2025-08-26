import React from "react";

export default function AdminTicketsTable({
  tickets,
  onDelete,
  onBulkDelete,
  onBulkClose,
  onEditStatus,
  onView,
  selectedTickets,
  setSelectedTickets,
  formatTicketID,
}) {
  const handleSelect = (id) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTickets(tickets.map((t) => t.ticketID));
    } else {
      setSelectedTickets([]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          style={{ background: "red", color: "white", marginRight: 8, padding: "6px 14px", border: "none", borderRadius: 4 }}
          onClick={onBulkDelete}
          disabled={selectedTickets.length === 0}
        >
          Delete Selected
        </button>
        <button
          style={{ background: "#007bff", color: "white", padding: "6px 14px", border: "none", borderRadius: 4 }}
          onClick={onBulkClose}
          disabled={selectedTickets.length === 0}
        >
          Close Selected
        </button>
      </div>
      <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedTickets.length === tickets.length && tickets.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Ticket ID</th>
            <th>Requester</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Description</th> {/* Changed from Message to Description */}
            <th>Status</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticketID}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedTickets.includes(ticket.ticketID)}
                  onChange={() => handleSelect(ticket.ticketID)}
                />
              </td>
              <td>{formatTicketID(ticket)}</td>
              <td>{ticket.email}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.category}</td>
              <td>{ticket.department}</td>
              <td>{ticket.priority}</td>
              <td>
                {ticket.description && ticket.description.trim()
                  ? ticket.description
                  : <span style={{ color: '#888' }}>No description entered</span>
                }
              </td>
              <td>
                <span style={{
                  color: ticket.status === "Open"
                    ? "#007bff"
                    : ticket.status === "Pending"
                    ? "#ffc107"
                    : ticket.status === "Closed"
                    ? "#28a745"
                    : "#6c757d",
                  fontWeight: "bold"
                }}>
                  {ticket.status}
                </span>
                <button
                  style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 4, border: "1px solid #ccc", background: "#f5f6fa" }}
                  onClick={() => onEditStatus(ticket.ticketID)}
                >
                  Edit
                </button>
              </td>
              <td>
                {ticket.updatedAt
                  ? new Date(ticket.updatedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <button
                  style={{ background: "#00b0ff", color: "#fff", border: "none", borderRadius: 4, marginRight: 4, padding: "4px 10px" }}
                  onClick={() => onView(ticket.ticketID)}
                >
                  View
                </button>
                <button
                  style={{ background: "red", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px" }}
                  onClick={() => onDelete(ticket.ticketID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td colSpan={11} style={{ textAlign: "center", color: "#888" }}>
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}