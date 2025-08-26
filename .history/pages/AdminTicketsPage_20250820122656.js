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
  {
    ticketID: "HD-2025-919",
    email: "D@GMAIL.COM",
    subject: "SADF",
    category: "Network",
    department: "FINANCE",
    priority: "Low",
    description: "RTIOP[-0]=",
    status: "Open",
    updatedAt: "2025-08-20T10:54:23Z",
  },
  {
    ticketID: "HD-2025-920",
    email: "a@gmail.com",
    subject: "aswerf",
    category: "System",
    department: "FINANCE",
    priority: "Low",
    description: "awertyui",
    status: "Pending",
    updatedAt: "2025-08-20T11:03:45Z",
  },
  {
    ticketID: "HD-2025-497",
    email: "a@gmail.com",
    subject: "fds",
    category: "Hardware",
    department: "HR",
    priority: "Medium",
    description: "qwertyuiopoiuytre",
    status: "Closed",
    updatedAt: "2025-08-20T11:12:20Z",
  },
  {
    ticketID: "HD-2025-498",
    email: "a@gmail.com",
    subject: "aswed",
    category: "System",
    department: "FINANCE",
    priority: "High",
    description: "wertyuio",
    status: "Open",
    updatedAt: "2025-08-20T11:15:54Z",
  },
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTickets, setSelectedTickets] = useState([]);

  // If you want to fetch from API, uncomment below and remove initialTickets above
  /*
  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);
  */

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
    <div>
      <h1>Admin Tickets Page</h1>
      <AdminTicketsTable
        tickets={tickets}
        onEditStatus={handleEditStatus}
        selectedTickets={selectedTickets}
        setSelectedTickets={setSelectedTickets}
        formatTicketID={(ticket) => ticket.ticketID}
        // Add other handlers as needed
      />
    </div>
  );
}