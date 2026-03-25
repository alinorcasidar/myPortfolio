import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add MONGODB_URI to environment variables');
}

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {

    // ✅ Allow only POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const { fullname, email, message } = req.body;

        // ✅ Validate input
        if (!fullname || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const client = await clientPromise;
        const db = client.db('portfolio');

        // ✅ Insert to MongoDB
        await db.collection('messages').insertOne({
            fullname,
            email,
            message,
            createdAt: new Date()
        });

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('SERVER ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}