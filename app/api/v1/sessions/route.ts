import { getPrisma } from "@/lib/server/prisma";
import { createLearningService } from "@/lib/server/learning-service";
import { apiJson, readBody, withApiErrors, checkRateLimit } from "@/lib/server/http";
import { createSessionSchema } from "@/lib/server/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return withApiErrors(async () => {
    checkRateLimit(request, 20);
    const input = await readBody(request, createSessionSchema);
    return apiJson(await createLearningService(getPrisma()).createSession(input), 201);
  });
}
