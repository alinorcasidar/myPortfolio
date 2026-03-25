import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  const { email, password } = req.body;

  await client.connect();
  const db = client.db("portfolio");

  const admin = await db.collection("admins").findOne({ email });

  if (!admin || admin.password !== password) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  res.json({ success: true });
}