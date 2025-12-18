import "dotenv/config";
import { PrismaClient } from "@prisma/client/extension";
import { CustomError } from "../errors/CustomError";

// Instantiate Prisma Client
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], 
});

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");
  } catch (err) {
    console.error("Failed to connect to PostgreSQL via Prisma:", err);
    throw new CustomError(
      "Database connection failed",
      500,
      "DBConnectionError",
      true
    );
  }
}

export async function closeDB(): Promise<void> {
  await prisma.$disconnect();
  console.log("PostgreSQL disconnected");
}

export { prisma };
