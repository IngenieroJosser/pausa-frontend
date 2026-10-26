import { ZodError, type ZodType } from "zod";
import { ApiError } from "./errors";

const MAX_BODY_BYTES = 16 * 1024;
const limits = new Map<string, { count: number; expiresAt: number }>();

export function apiJson(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function withApiErrors(action: () => Promise<Response>): Promise<Response> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof ApiError) return apiJson({ error: error.code }, error.status);
    if (error instanceof ZodError) return apiJson({ error: "validation_failed", issues: error.issues.map((i) => ({ path: i.path, code: i.code })) }, 400);
    if (error instanceof SyntaxError) return apiJson({ error: "invalid_json" }, 400);
    // No se envían errores SQL, tokens ni cadenas de conexión al navegador.
    console.error("[PAUSA API]", error);
    return apiJson({ error: "internal_server_error" }, 500);
  }
}

export function checkRateLimit(request: Request, limit = 65): void {
  // Limitador best-effort por instancia. En producción se debe acompañar de WAF/Redis distribuido.
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").at(0)?.trim() || "unknown";
  const key = `${ip}:${new URL(request.url).pathname.split("/").slice(0, 5).join("/")}`;
  const now = Date.now();
  if (limits.size > 1_500) {
    for (const [entry, state] of limits) if (state.expiresAt < now) limits.delete(entry);
    if (limits.size > 2_000) limits.clear();
  }
  const current = limits.get(key);
  if (!current || current.expiresAt <= now) {
    limits.set(key, { count: 1, expiresAt: now + 60_000 });
    return;
  }
  current.count++;
  if (current.count > limit) throw new ApiError("rate_limit_exceeded", 429);
}

export function bearer(request: Request): string | null {
  const match = /^Bearer ([A-Za-z0-9_-]+)$/.exec(request.headers.get("authorization") ?? "");
  return match?.[1] ?? null;
}

export async function readBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_BODY_BYTES) throw new ApiError("body_too_large", 413);
  const reader = request.body?.getReader();
  if (!reader) return schema.parse({});
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) throw new ApiError("body_too_large", 413);
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const text = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString("utf8");
  return schema.parse(JSON.parse(text || "{}"));
}
