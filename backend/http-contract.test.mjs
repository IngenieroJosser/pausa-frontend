import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import test from "node:test";
import { createAssessmentService } from "./assessment-service.mjs";
import { createDatabase } from "./database.mjs";
import { createHttpHandler } from "./http-app.mjs";

async function setup() {
  const database = createDatabase(":memory:");
  const server = createServer(createHttpHandler(createAssessmentService(database)));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    database,
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
    async close() {
      await new Promise((resolve) => server.close(resolve));
      database.close();
    },
  };
}

async function createSession(baseUrl) {
  const response = await fetch(`${baseUrl}/api/v1/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal: "empleo", friction: "oportunidad" }),
  });
  assert.equal(response.status, 201);
  return response.json();
}

function authenticated(token, body) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  };
}

async function decide(baseUrl, session, scenarioId, choiceId, requestId = randomUUID(), extra = {}) {
  return fetch(`${baseUrl}/api/v1/sessions/${session.id}/decisions`, authenticated(session.accessToken, {
    requestId, scenarioId, choiceId, ...extra,
  }));
}

test("crea una sesión con credencial opaca y no la expone al consultarla", async () => {
  const context = await setup();
  try {
    const session = await createSession(context.baseUrl);
    assert.match(session.accessToken, /^[A-Za-z0-9_-]{40,}$/);
    const response = await fetch(`${context.baseUrl}/api/v1/sessions/${session.id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    const details = await response.json();
    assert.equal(response.status, 200);
    assert.equal("accessToken" in details, false);
  } finally {
    await context.close();
  }
});

test("deniega consultar o modificar una sesión con credencial ajena", async () => {
  const context = await setup();
  try {
    const owner = await createSession(context.baseUrl);
    const stranger = await createSession(context.baseUrl);
    const read = await fetch(`${context.baseUrl}/api/v1/sessions/${owner.id}`, {
      headers: { Authorization: `Bearer ${stranger.accessToken}` },
    });
    const write = await fetch(`${context.baseUrl}/api/v1/sessions/${owner.id}/decisions`, authenticated(stranger.accessToken, {
      requestId: randomUUID(), scenarioId: "oferta-auxiliar", choiceId: "verify",
    }));
    assert.equal(read.status, 403);
    assert.equal(write.status, 403);
  } finally {
    await context.close();
  }
});

test("ignora la evaluación manipulada del cliente y rechaza propiedades extra", async () => {
  const context = await setup();
  try {
    const session = await createSession(context.baseUrl);
    const response = await decide(context.baseUrl, session, "oferta-auxiliar", "pay", randomUUID(), { isCorrect: true });
    assert.equal(response.status, 400);
    const details = await fetch(`${context.baseUrl}/api/v1/sessions/${session.id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }).then((result) => result.json());
    assert.equal(details.decisionCount, 0);
  } finally {
    await context.close();
  }
});

test("repite el mismo requestId pero rechaza reutilizarlo con otra decisión", async () => {
  const context = await setup();
  try {
    const session = await createSession(context.baseUrl);
    const requestId = randomUUID();
    const first = await decide(context.baseUrl, session, "oferta-auxiliar", "verify", requestId);
    const replay = await decide(context.baseUrl, session, "oferta-auxiliar", "verify", requestId);
    const conflict = await decide(context.baseUrl, session, "oferta-auxiliar", "pay", requestId);
    assert.equal(first.status, 201);
    assert.equal(replay.status, 201);
    assert.equal((await replay.json()).replayed, true);
    assert.equal(conflict.status, 409);
    assert.equal((await conflict.json()).error, "idempotency_conflict");
  } finally {
    await context.close();
  }
});

test("dos decisiones simultáneas solo producen una transición", async () => {
  const context = await setup();
  try {
    const session = await createSession(context.baseUrl);
    const responses = await Promise.all([
      decide(context.baseUrl, session, "oferta-auxiliar", "pay"),
      decide(context.baseUrl, session, "oferta-auxiliar", "verify"),
    ]);
    assert.deepEqual(responses.map((response) => response.status).sort(), [201, 409]);
    const details = await fetch(`${context.baseUrl}/api/v1/sessions/${session.id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }).then((result) => result.json());
    assert.equal(details.decisionCount, 1);
  } finally {
    await context.close();
  }
});

test("no revela escenarios futuros y cerrar dos veces devuelve el mismo resultado", async () => {
  const context = await setup();
  try {
    const session = await createSession(context.baseUrl);
    const future = await fetch(`${context.baseUrl}/api/v1/scenarios/banco-premio?sessionId=${session.id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    assert.equal(future.status, 403);

    await decide(context.baseUrl, session, "oferta-auxiliar", "pay");
    await decide(context.baseUrl, session, "uniforme-restaurante", "refuse");
    await decide(context.baseUrl, session, "banco-premio", "app");
    const first = await fetch(`${context.baseUrl}/api/v1/sessions/${session.id}/complete`, authenticated(session.accessToken, {}));
    const second = await fetch(`${context.baseUrl}/api/v1/sessions/${session.id}/complete`, authenticated(session.accessToken, {}));
    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.deepEqual(await second.json(), await first.json());
  } finally {
    await context.close();
  }
});
