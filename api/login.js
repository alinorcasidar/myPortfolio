import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    await client.connect();
    const db = client.db("portfolio");

    const admin = await db.collection("admins").findOne({ email: cleanEmail });

    console.log("INPUT:", cleanEmail, cleanPassword);
    console.log("DB:", admin);

    if (!admin || admin.password !== cleanPassword) {
      return res.json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}