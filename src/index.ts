

import { Server } from "http";
import app from "./app";
import connectDB from "./utils/db";
import dotenv from 'dotenv';

dotenv.config();

let server: Server;
const port: number = parseInt(process.env.PORT || '5000');


export default app;

// Production এ initial connection
if (process.env.NODE_ENV === 'production') {
  connectDB().catch(console.error);
}

// Local development এর জন্য
if (process.env.NODE_ENV !== 'production') {
  async function startServer() {
    try {
      await connectDB();
      
      server = app.listen(port, () => {
        console.log(`🚀 Application running on port ${port}`);
      });
    } catch (error) {
      console.error("❌ Error starting server:", error);
    }
  }
  
  startServer();
}