import clientPromise from '../lib/mongodb';

async function init() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const maxTicket = await db.collection('tickets').find({})
    .project({ ticketID: 1 })
    .sort({ _id: -1 })
    .toArray();

  let maxSeq = 0;
  for (const t of maxTicket) {
    if (!t.ticketID) continue;
    const m = t.ticketID.match(/TICKET-(\d+)/);
    if (m) maxSeq = Math.max(maxSeq, parseInt(m[1], 10));
  }

  await db.collection('counters').updateOne(
    { _id: 'ticketid' },
    { $set: { seq: maxSeq } },
    { upsert: true }
  );
  console.log('initialized counter to', maxSeq);
  process.exit(0);
}

init().catch(e => { console.error(e); process.exit(1); });