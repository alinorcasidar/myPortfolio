import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db("portfolio");

  const messages = await db.collection("messages")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  res.json({
    messages,
    total: messages.length,
    last30Days: messages.length,
    today: messages.length,
    currentPage: 1,
    totalPages: 1
  });
}