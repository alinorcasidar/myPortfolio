import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not found");
}

// 🔥 Reuse connection (important for Vercel)
if (!global._mongoClientPromise) {
  client = new MongoClient(process.env.MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection("messages");

    const { fullname, email, message } = req.body;

    // ✅ validation
    if (!fullname || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    await collection.insertOne({
      name: fullname,
      email,
      message,
      createdAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!"
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message   // 👈 shows real error
    });
  }
}