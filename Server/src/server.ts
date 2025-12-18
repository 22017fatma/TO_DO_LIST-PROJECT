import * as dotenv from "dotenv";
import app from "./app";
import { createServer } from "node:http";
import AppLogger from "./logger/AppLogger";
import { connectDB, closeDB } from "./config/prisma-client";

dotenv.config({ path: `${process.cwd()}/.env` });

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    console.log(" DB connected");

    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      AppLogger.initLogger();
    });

    // Handle graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      await closeDB();
      httpServer.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received. Shutting down gracefully...");
      await closeDB();
      httpServer.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
