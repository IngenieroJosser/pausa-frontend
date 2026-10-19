import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { createAssessmentService, AssessmentError } from "./assessment-service.mjs";
import { createDatabase } from "./database.mjs";

function setup() {
  const database = createDatabase(":memory:");
  return { database, service: createAssessmentService(database) };
}

test("adapta el segundo escenario al error de pago", () => {
  const { database, service } = setup();
  const session = service.createSession({ goal: "empleo", friction: "oportunidad" });
  const decision = service.submitDecision(session.id, {
    requestId: randomUUID(),
    scenarioId: "oferta-auxiliar",
    choiceId: "pay",
  });
  assert.equal(decision.correct, false);
  assert.equal(decision.nextScenario.id, "uniforme-restaurante");
  database.close();
});

test("una operación idempotente no duplica decisiones", () => {
  const { database, service } = setup();
  const session = service.createSession({});
  const requestId = randomUUID();
  const input = { requestId, scenarioId: "oferta-auxiliar", choiceId: "verify" };
  const first = service.submitDecision(session.id, input);
  const replay = service.submitDecision(session.id, input);
  assert.equal(first.id, replay.id);
  assert.equal(replay.replayed, true);
  assert.equal(service.sessionDetails(session.id).decisionCount, 1);
  database.close();
});

test("rechaza reutilizar requestId con otro contenido", () => {
  const { database, service } = setup();
  const session = service.createSession({});
  const requestId = randomUUID();
  service.submitDecision(session.id, { requestId, scenarioId: "oferta-auxiliar", choiceId: "verify" });
  assert.throws(
    () => service.submitDecision(session.id, { requestId, scenarioId: "oferta-auxiliar", choiceId: "pay" }),
    (error) => error instanceof AssessmentError && error.code === "idempotency_conflict",
  );
  database.close();
});

test("la credencial de una sesión no autoriza otra", () => {
  const { database, service } = setup();
  const owner = service.createSession({});
  const stranger = service.createSession({});
  assert.equal(service.authorizeSession(owner.id, owner.accessToken), true);
  assert.throws(
    () => service.authorizeSession(owner.id, stranger.accessToken),
    (error) => error instanceof AssessmentError && error.code === "session_forbidden",
  );
  database.close();
});

test("rechaza escenarios fuera de secuencia", () => {
  const { database, service } = setup();
  const session = service.createSession({});
  assert.throws(
    () => service.submitDecision(session.id, { requestId: randomUUID(), scenarioId: "banco-premio", choiceId: "app" }),
    (error) => error instanceof AssessmentError && error.code === "unexpected_scenario",
  );
  database.close();
});

test("mide transferencia con un escenario distinto al diagnóstico", () => {
  const { database, service } = setup();
  const session = service.createSession({});
  service.submitDecision(session.id, { requestId: randomUUID(), scenarioId: "oferta-auxiliar", choiceId: "pay" });
  service.submitDecision(session.id, { requestId: randomUUID(), scenarioId: "uniforme-restaurante", choiceId: "refuse" });
  service.submitDecision(session.id, { requestId: randomUUID(), scenarioId: "banco-premio", choiceId: "app" });
  const outcome = service.completeSession(session.id);
  assert.equal(outcome.diagnosticCorrect, false);
  assert.equal(outcome.transferCorrect, true);
  assert.equal(outcome.demonstratedTransfer, true);
  assert.equal(outcome.totalCorrect, 2);
  database.close();
});
