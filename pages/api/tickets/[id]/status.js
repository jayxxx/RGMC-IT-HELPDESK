import dbConnect from '../../../../lib/dbConnect';
import Ticket from '../../../../models/Ticket';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  await dbConnect();

  if (method === "PUT") {
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        id,
        { status: body.status },
        { new: true }
      );
      if (!ticket) {
        return res.status(404).json({ success: false, message: "Ticket not found" });
      }
      return res.status(200).json({ success: true, ticket });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.setHeader("Allow", ["PUT"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}