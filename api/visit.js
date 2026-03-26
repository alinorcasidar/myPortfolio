import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false });
    }

    try {
        await client.connect();
        const db = client.db("portfolio");

        // 🔥 Get or create counter
        let visit = await db.collection("visits").findOne({});

        if (!visit) {
            await db.collection("visits").insertOne({ count: 1 });
            return res.json({ success: true, count: 1 });
        }

        // 🔥 Increment
        const updated = await db.collection("visits").findOneAndUpdate(
            {},
            { $inc: { count: 1 } },
            { returnDocument: "after" }
        );

        return res.json({
            success: true,
            count: updated.value.count
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}