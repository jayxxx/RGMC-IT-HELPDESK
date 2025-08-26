import React, { useState, useEffect } from "react";
import AdminTicketsTable from "./AdminTicketsTable";

const initialTickets = [
  {
    ticketID: "HD-2025-918",
    email: "a@gmail.com",
    subject: "AWQERTY",
    category: "Software",
    department: "FINANCE",
    priority: "Medium",
    description: "EWRYTUJOP[] ';LKJHGFD",
    status: "Open",
    updatedAt: "2025-08-20T10:52:31Z",
  },
  // ...more tickets...
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => {
    // Replace with your API call
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);

  const handleEditStatus = (ticketID, newStatus) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticketID === ticketID
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
    // Optionally: send API request to update status in backend here
  };

  return (
    <AdminTicketsTable
      tickets={tickets}
      onEditStatus={handleEditStatus}
      selectedTickets={selectedTickets}
      setSelectedTickets={setSelectedTickets}
      formatTicketID={(ticket) => ticket.ticketID}
    />
  );
}