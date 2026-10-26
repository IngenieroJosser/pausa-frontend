/**
 * Verificación real contra PostgreSQL a través de HTTP; no escribe información personal.
 * Requiere que la app esté levantada, Prisma migrado y el banco sembrado.
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

const BASE_URL = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const bank = JSON.parse(readFileSync(new URL("../shared/public-scenario-bank.json", import.meta.url), "utf8"));

async function json(path, method = "GET", body, token) {
  const response = await fetch(`${BASE_URL}/api/v1${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

const health = await json("/health");
assert.equal(health.status, 200, `Healthcheck falló: ${JSON.stringify(health.data)}`);
assert.ok(health.data.publishedScenarios >= 135);
const started = await json("/sessions", "POST", { goal: "empleo", friction: "urgencia", habit: "verifico", confidence: "media" });
assert.equal(started.status, 201, JSON.stringify(started.data));
const { id, accessToken } = started.data;
assert.ok(id && accessToken);
assert.equal((await json(`/sessions/${id}`)).status, 401);
let nextScenario = started.data.nextScenario;
const seen = new Set();
for (let index = 0; index < 3; index++) {
  assert.ok(nextScenario && !seen.has(nextScenario.id));
  seen.add(nextScenario.id);
  const scenario = bank.find((s) => s.id === nextScenario.id);
  assert.ok(scenario);
  const input = { requestId: randomUUID(), scenarioId: scenario.id, choiceId: scenario.choices[index % scenario.choices.length].id, elapsedMs: 1200 };
  const response = await json(`/sessions/${id}/decisions`, "POST", input, accessToken);
  assert.equal(response.status, 200, JSON.stringify(response.data));
  if (index === 0) {
    const repeated = await json(`/sessions/${id}/decisions`, "POST", { ...input, elapsedMs: 3300 }, accessToken);
    assert.equal(repeated.status, 200);
    assert.equal(repeated.data.replayed, true);
    assert.equal(repeated.data.id, response.data.id);
    const conflicting = await json(`/sessions/${id}/decisions`, "POST", { ...input, choiceId: "otro" }, accessToken);
    assert.equal(conflicting.status, 409);
  }
  nextScenario = response.data.nextScenario;
}
assert.equal(nextScenario, null);
const details = await json(`/sessions/${id}`, "GET", undefined, accessToken);
assert.equal(details.data.decisionCount, 3);
assert.equal(details.data.answers.length, 3);
const done = await json(`/sessions/${id}/complete`, "POST", {}, accessToken);
assert.equal(done.status, 200);
assert.equal(done.data.totalDecisions, 3);
const again = await json(`/sessions/${id}/complete`, "POST", {}, accessToken);
assert.equal(again.status, 200);
assert.equal(again.data.totalCorrect, done.data.totalCorrect);
const results = await json(`/sessions/${id}/results`, "GET", undefined, accessToken);
assert.equal(results.status, 200);
assert.ok(Array.isArray(results.data.skills));
console.log("PAUSA API OK · autenticación, 3 decisiones, reintento, adaptación, cierre, resultados.");
