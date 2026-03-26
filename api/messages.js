import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false });
    }

    try {
        const client = await clientPromise;
        const db = client.db("portfolio");

        const messages = await db
            .collection("messages")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return res.json({ success: true, messages });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}