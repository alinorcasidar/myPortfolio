import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullname, email, message } = req.body;

  if (!fullname || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('messages');

    const result = await collection.insertOne({
      fullname,
      email,
      message,
      createdAt: new Date(),
    });

    res.status(200).json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save message' });
  } finally {
    await client.close();
  }
}