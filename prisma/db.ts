import ws from "ws";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// console.log("Connecting to database with URL:", connectionString);

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
