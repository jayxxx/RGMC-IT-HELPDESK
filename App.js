import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [tickets, setTickets] = useState([]);
    const [form, setForm] = useState({ subject: '', description: '', priority: '', email: '' });

    useEffect(() => {
        axios.get('http://localhost:3001/tickets').then(res => setTickets(res.data));
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        axios.post('http://localhost:3001/tickets', form).then(res => {
            setTickets([...tickets, res.data]);
            setForm({ subject: '', description: '', priority: '', email: '' });
        });
    };

    return (
        <div>
            <h1>IT Helpdesk</h1>
            <form onSubmit={handleSubmit}>
                <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <select name="priority" value={form.priority} onChange={handleChange} required>
                    <option value="">Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <button type="submit">Create Ticket</button>
            </form>
            <h2>Tickets</h2>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket._id}>
                        <strong>{ticket.subject}</strong> - {ticket.status} ({ticket.priority})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;