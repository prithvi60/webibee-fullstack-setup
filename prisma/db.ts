import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure Neon for WebSocket and fetch
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true; // Required for edge environments
neonConfig.fetchConnectionCache = true; // Cache connections for performance

// Type definitions
declare global {
  var prisma: PrismaClient | undefined;
}

// Ensure DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const connectionString = `${process.env.DATABASE_URL}&connect_timeout=10&pool_timeout=10&connection_limit=5`;
console.log("Using DATABASE_URL:", connectionString); // Debug log

const adapter = new PrismaNeon({ connectionString });
const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"], // Enable query logging for debugging
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
