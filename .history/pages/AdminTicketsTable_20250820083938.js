import React, { useState } from "react";

export default function AdminTicketsTable({
  tickets,
  onDelete,
  onBulkDelete,
  onBulkClose,
  onEditStatus,
  onView,
}) {
  const [selected, setSelected] = useState([]);

  // Keep selection in sync with parent if tickets change
  React.useEffect(() => {
    setSelected((prev) => prev.filter((id) => tickets.some((t) => t.ticketID === id)));
  }, [tickets]);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(tickets.map((t) => t.ticketID));
    } else {
      setSelected([]);
    }
  };

  // Expose selected to parent for bulk actions
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.selectedTickets = selected;
    }
  }, [selected]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          style={{ background: "red", color: "white", marginRight: 8, padding: "6px 14px", border: "none", borderRadius: 4 }}
          onClick={() => onBulkDelete(selected)}
          disabled={selected.length === 0}
        >
          Delete Selected
        </button>
        <button
          style={{ background: "#007bff", color: "white", padding: "6px 14px", border: "none", borderRadius: 4 }}
          onClick={() => onBulkClose(selected)}
          disabled={selected.length === 0}
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
                checked={selected.length === tickets.length && tickets.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Ticket ID</th>
            <th>Requester</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Message</th>
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
                  checked={selected.includes(ticket.ticketID)}
                  onChange={() => handleSelect(ticket.ticketID)}
                />
              </td>
              <td>{ticket.ticketID}</td>
              <td>{ticket.email}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.category}</td>
              <td>{ticket.department}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.message || "No Message"}</td>
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