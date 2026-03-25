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

    const admin = await db.collection("admin").findOne({});

    console.log("👉 INPUT EMAIL:", cleanEmail);
    console.log("👉 INPUT PASSWORD:", cleanPassword);
    console.log("👉 DB DATA:", admin);

    // TEMP: bypass email check
    if (!admin) {
      return res.json({ success: false, message: "No admin in DB" });
    }

    if (admin.email !== cleanEmail) {
      return res.json({ success: false, message: "Email not match" });
    }

    if (admin.password !== cleanPassword) {
      return res.json({ success: false, message: "Password not match" });
    }

    return res.json({ success: true });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}