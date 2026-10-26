import { getPrisma } from "@/lib/server/prisma";
import { createLearningService } from "@/lib/server/learning-service";
import { apiJson, bearer, withApiErrors } from "@/lib/server/http";
import { sessionIdSchema } from "@/lib/server/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ sessionId: string }> };
export async function GET(request: Request, { params }: Context) {
  return withApiErrors(async () => {
    const { sessionId } = await params;
    const id = sessionIdSchema.parse(sessionId);
    return apiJson(await createLearningService(getPrisma()).getResults(id, bearer(request)));
  });
}
