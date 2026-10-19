import { AssessmentError } from "./assessment-service.mjs";
import { publicScenario } from "./catalog.mjs";
import { createSessionSchema, decisionSchema, interactionSchema } from "./contracts.mjs";

const MAX_BODY_BYTES = 16_000;
const RATE_LIMIT = 120;
const RATE_WINDOW_MS = 60_000;
const requestsByAddress = new Map();

function setCors(request, response) {
  const origin = request.headers.origin;
  if (origin === "http://localhost:3000" || origin === "http://127.0.0.1:3000") {
    response.setHeader("Access-Control-Allow-Origin", origin);
  }
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function json(request, response, status, body) {
  setCors(request, response);
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function isRateLimited(address) {
  const now = Date.now();
  const current = requestsByAddress.get(address);
  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    requestsByAddress.set(address, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new AssessmentError("body_too_large", 413);
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw new AssessmentError("invalid_json", 400);
  }
}

function parse(schema, input) {
  const result = schema.safeParse(input);
  if (!result.success) throw new AssessmentError("validation_failed", 400);
  return result.data;
}

function bearerToken(request) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7);
}

export function createHttpHandler(service) {
  return async function handler(request, response) {
    if (request.method === "OPTIONS") {
      setCors(request, response);
      response.writeHead(204);
      response.end();
      return;
    }

    try {
      const url = new URL(request.url, "http://localhost");
      const parts = url.pathname.split("/").filter(Boolean);

      if (url.pathname.startsWith("/api/") && isRateLimited(request.socket.remoteAddress ?? "unknown")) {
        json(request, response, 429, { error: "rate_limit_exceeded" });
        return;
      }

      if (request.method === "GET" && url.pathname === "/health") {
        json(request, response, 200, { status: "ok", service: "pausa-learning-api", database: "up" });
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/v1/sessions") {
        json(request, response, 201, service.createSession(parse(createSessionSchema, await readJson(request))));
        return;
      }
      if (request.method === "GET" && parts.length === 4 && parts[0] === "api" && parts[1] === "v1" && parts[2] === "scenarios") {
        const sessionId = url.searchParams.get("sessionId");
        if (!sessionId) throw new AssessmentError("session_required", 401);
        service.authorizeSession(sessionId, bearerToken(request));
        const details = service.sessionDetails(sessionId);
        if (details.nextScenario?.id !== parts[3]) throw new AssessmentError("scenario_not_available", 403);
        const scenario = publicScenario(parts[3]);
        if (!scenario) throw new AssessmentError("scenario_not_found", 404);
        json(request, response, 200, scenario);
        return;
      }
      if (parts.length >= 4 && parts[0] === "api" && parts[1] === "v1" && parts[2] === "sessions") {
        const sessionId = parts[3];
        service.authorizeSession(sessionId, bearerToken(request));
        if (request.method === "GET" && parts.length === 4) {
          json(request, response, 200, service.sessionDetails(sessionId));
          return;
        }
        if (request.method === "POST" && parts[4] === "decisions") {
          json(request, response, 201, service.submitDecision(sessionId, parse(decisionSchema, await readJson(request))));
          return;
        }
        if (request.method === "POST" && parts[4] === "interactions") {
          json(request, response, 201, service.recordInteraction(sessionId, parse(interactionSchema, await readJson(request))));
          return;
        }
        if (request.method === "GET" && parts[4] === "next-scenario") {
          json(request, response, 200, { nextScenario: service.sessionDetails(sessionId).nextScenario });
          return;
        }
        if (request.method === "POST" && parts[4] === "complete") {
          json(request, response, 200, service.completeSession(sessionId));
          return;
        }
        if (request.method === "GET" && parts[4] === "results") {
          json(request, response, 200, service.getResults(sessionId));
          return;
        }
      }
      throw new AssessmentError("not_found", 404);
    } catch (error) {
      if (error instanceof AssessmentError) {
        json(request, response, error.status, { error: error.code });
        return;
      }
      console.error(error);
      json(request, response, 500, { error: "internal_error" });
    }
  };
}
