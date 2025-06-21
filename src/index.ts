import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

let server: Server;

const port: number = parseInt(process.env.PORT || '5000');
const mongoUri = process.env.MONGODB_URI;

async function main() {
    try {
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB connected successfully");

        server = app.listen(port, () => {
            console.log(`🚀 Application running on port ${port}`);
        });

    } catch (error) {
        console.error("❌ Error starting server:", error);
    }
}

main();
