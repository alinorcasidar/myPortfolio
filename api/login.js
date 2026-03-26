import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

// 🔥 Prevent multiple connections (VERY IMPORTANT in Vercel)
if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {
        const { email, password } = req.body;

        // ✅ Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        // ✅ Connect to DB
        const client = await clientPromise;
        const db = client.db("portfolio");

        // 🔥 Find admin by email (NOT empty {})
        const admin = await db.collection("admin").findOne({
            email: cleanEmail
        });

        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found"
            });
        }

        // ✅ Compare password
        if (admin.password !== cleanPassword) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

        // ✅ SUCCESS
        return res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}