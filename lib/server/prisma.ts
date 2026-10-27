import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var pausaPrisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (globalThis.pausaPrisma) return globalThis.pausaPrisma;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está configurada en el servidor");
  }
  const adapter = new PrismaPg({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 8_000,
    idleTimeoutMillis: 20_000,
  });
  const client = new PrismaClient({ adapter });
  // Reutilizar el pool en desarrollo y durante invocaciones calientes en serverless.
  globalThis.pausaPrisma = client;
  return client;
}
