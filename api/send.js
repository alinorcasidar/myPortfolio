import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await client.connect();

    const db = client.db("portfolio");
    const collection = db.collection("messages");

    const { fullname, email, message } = req.body;

    await collection.insertOne({
      name: fullname, // ✅ fix here
      email,
      message,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}