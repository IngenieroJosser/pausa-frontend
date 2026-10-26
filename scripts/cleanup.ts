/** Ejecutar por scheduler autenticado, no por HTTP público. Elimina sesiones antiguas de forma reversible con backup. */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL es obligatoria");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 2 }) });
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000);
  try {
    const deleted = await db.learningSession.deleteMany({ where: { updatedAt: { lt: cutoff } } });
    console.log(`Limpieza de sesiones anónimas: ${deleted.count} eliminadas antes de ${cutoff.toISOString()}`);
  } finally {
    await db.$disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
