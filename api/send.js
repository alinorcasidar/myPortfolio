import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await client.connect();
      const db = client.db("portfolio");
      const collection = db.collection("messages");

      const { name, email, message } = req.body;

      await collection.insertOne({
        name,
        email,
        message,
        createdAt: new Date(),
      });

      res.status(200).json({ message: "Message sent!" });
    } catch (error) {
      res.status(500).json({ message: "Error saving message" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}