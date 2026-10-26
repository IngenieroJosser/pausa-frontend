import { getPrisma } from "@/lib/server/prisma";
import { createLearningService } from "@/lib/server/learning-service";
import { apiJson, bearer, readBody, withApiErrors, checkRateLimit } from "@/lib/server/http";
import { sessionIdSchema, interactionSchema } from "@/lib/server/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ sessionId: string }> };
export async function POST(request: Request, { params }: Context) {
  return withApiErrors(async () => {
    checkRateLimit(request);
    const { sessionId } = await params;
    const id = sessionIdSchema.parse(sessionId);
    const input = await readBody(request, interactionSchema);
    return apiJson(await createLearningService(getPrisma()).recordInteraction(id, bearer(request), input));
  });
}
