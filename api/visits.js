import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false });
    }

    try {
        await client.connect();
        const db = client.db("portfolio");

        const visit = await db.collection("visits").findOne({});

        return res.json({
            success: true,
            count: visit ? visit.count : 0
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}