// Example Express handler for POST /api/tickets
app.post('/api/tickets', async (req, res) => {
  const { email, subject, category, department, priority, message } = req.body;
  // Validate message
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  // Save ticket with message
  const ticket = new Ticket({
    email,
    subject,
    category,
    department,
    priority,
    message, // <-- ensure this is saved
    status: 'Open',
    updatedAt: new Date(),
  });
  await ticket.save();
  res.status(201).json(ticket);
});