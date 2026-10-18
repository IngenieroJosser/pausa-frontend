import { appendFile, mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || "127.0.0.1";
const MAX_BODY_BYTES = 12_000;
const allowedEvents = new Set([
  "session_started",
  "onboarding_completed",
  "answer_submitted",
  "session_completed",
]);

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const eventFile = join(currentDirectory, "data", "events.ndjson");

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(response, status, body) {
  setCors(response);
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sanitiseEvent(input) {
  if (!input || typeof input !== "object" || !allowedEvents.has(input.type)) return null;
  if (typeof input.sessionId !== "string" || input.sessionId.length > 80) return null;
  const payload = input.payload && typeof input.payload === "object" ? input.payload : {};
  return {
    type: input.type,
    sessionId: input.sessionId,
    payload,
    receivedAt: new Date().toISOString(),
  };
}

async function saveEvent(event) {
  await mkdir(dirname(eventFile), { recursive: true });
  await appendFile(eventFile, `${JSON.stringify(event)}\n`, "utf8");
}

async function getSummary() {
  try {
    const content = await readFile(eventFile, "utf8");
    const events = content.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
    const sessions = new Set(events.map((event) => event.sessionId));
    return {
      sessions: sessions.size,
      completed: events.filter((event) => event.type === "session_completed").length,
      answers: events.filter((event) => event.type === "answer_submitted").length,
    };
  } catch (error) {
    if (error.code === "ENOENT") return { sessions: 0, completed: 0, answers: 0 };
    throw error;
  }
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    setCors(response);
    response.writeHead(204);
    response.end();
    return;
  }

  try {
    if (request.method === "GET" && request.url === "/health") {
      json(response, 200, { status: "ok", service: "pausa-metrics" });
      return;
    }

    if (request.method === "GET" && request.url === "/summary") {
      json(response, 200, await getSummary());
      return;
    }

    if (request.method === "POST" && request.url === "/events") {
      const event = sanitiseEvent(await readBody(request));
      if (!event) {
        json(response, 400, { error: "invalid_event" });
        return;
      }
      await saveEvent(event);
      json(response, 202, { accepted: true });
      return;
    }

    json(response, 404, { error: "not_found" });
  } catch (error) {
    const status = error instanceof Error && error.message === "BODY_TOO_LARGE" ? 413 : 500;
    json(response, status, { error: status === 413 ? "body_too_large" : "internal_error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`PAUSA backend listo en http://${HOST}:${PORT}`);
});
