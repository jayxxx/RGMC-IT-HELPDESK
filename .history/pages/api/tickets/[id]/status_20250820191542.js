export default async function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  if (method === "PUT") {
    // TODO: Update the ticket status in your database here.
    // Example: await Ticket.updateOne({ _id: id }, { status: body.status });

    // Respond with success (customize as needed)
    return res.status(200).json({ success: true, id, status: body.status });
  }

  // Method not allowed
  res.setHeader("Allow", ["PUT"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}