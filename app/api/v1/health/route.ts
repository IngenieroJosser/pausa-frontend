import { getPrisma } from "@/lib/server/prisma";
import { apiJson, withApiErrors } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return withApiErrors(async () => {
    const db = getPrisma();
    await db.$queryRaw`SELECT 1`;
    const publishedScenarios = await db.scenario.count({ where: { isPublished: true } });
    return apiJson({ status: publishedScenarios >= 135 ? "ok" : "not_ready", service: "pausa-next-api", publishedScenarios }, publishedScenarios >= 135 ? 200 : 503);
  });
}
