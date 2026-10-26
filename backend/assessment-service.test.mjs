import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { createAssessmentService, AssessmentError } from "./assessment-service.mjs";
import { createDatabase } from "./database.mjs";
import { scenarios, evaluateDecision } from "./catalog.mjs";

function setup() {
  const database = createDatabase(":memory:");
  return { database, service: createAssessmentService(database) };
}
function answer(service, session, choiceId = "verify") {
  const current = service.sessionDetails(session.id).nextScenario;
  assert.ok(current, "must have a next scenario");
  return service.submitDecision(session.id, {requestId: randomUUID(), scenarioId: current.id, choiceId});
}

test("45 distinct cases per goal and only valid answer sets", () => {
  const cases = Object.values(scenarios);
  for (const goal of ["empleo", "dinero", "datos"]) {
    assert.equal(cases.filter((s) => s.goal === goal).length, 45);
    for (const stage of ["diagnostico", "practica", "transferencia"]) {
      assert.equal(cases.filter((s) => s.goal === goal && s.stage === stage).length, 15);
    }
  }
  for (const scenario of cases) {
    assert.equal(new Set(scenario.choiceIds).size, 3);
    assert.equal(evaluateDecision(scenario.id, scenario.correctChoiceId).correct, true);
    assert.ok(scenario.choiceIds.some((id) => !evaluateDecision(scenario.id, id).correct));
  }
});

test("the initial scenario matches the session details and is stable between reads", () => {
  const { database, service } = setup();
  const session = service.createSession({goal: "datos", friction: "aislamiento"});
  assert.equal(session.nextScenario.id, service.sessionDetails(session.id).nextScenario.id);
  assert.equal(session.nextScenario.id, service.sessionDetails(session.id).nextScenario.id);
  assert.equal(scenarios[session.nextScenario.id].goal, "datos");
  database.close();
});

test("new sessions rotate the cases of each theme", () => {
  const { database, service } = setup();
  const distinct = new Set(Array.from({length: 25}, () => service.createSession({goal:"empleo"}).nextScenario.id));
  assert.ok(distinct.size >= 4, `only ${distinct.size} distinct cases after 25 sessions`);
  database.close();
});

test("the second case adapts to a missed signal; transfer does not repeat the family", () => {
  const { database, service } = setup();
  const session = service.createSession({goal:"dinero",friction:"urgencia"});
  const first = service.sessionDetails(session.id).nextScenario;
  const mistake = scenarios[first.id].choiceIds.find((choiceId) => choiceId !== "verify");
  const decision = answer(service, session, mistake);
  assert.equal(decision.correct, false);
  assert.equal(scenarios[decision.nextScenario.id].signal, decision.signal);
  assert.equal(scenarios[decision.nextScenario.id].goal, "dinero");
  const second = answer(service, session);
  assert.equal(scenarios[second.nextScenario.id].stage,"transferencia");
  assert.notEqual(scenarios[first.id].family,scenarios[second.nextScenario.id].family);
  assert.notEqual(scenarios[decision.nextScenario.id].family,scenarios[second.nextScenario.id].family);
  database.close();
});

test("idempotent replays do not duplicate decisions", () => {
  const { database, service } = setup();
  const session = service.createSession({});
  const requestId = randomUUID();
  const input = { requestId, scenarioId: session.nextScenario.id, choiceId: "verify" };
  const first = service.submitDecision(session.id, input);
  const replay = service.submitDecision(session.id, input);
  assert.equal(first.id, replay.id);
  assert.equal(replay.replayed, true);
  assert.equal(service.sessionDetails(session.id).decisionCount, 1);
  assert.throws(() => service.submitDecision(session.id,{...input,choiceId:"impulse"}),
    (error) => error instanceof AssessmentError && error.code === "idempotency_conflict");
  database.close();
});

test("cross-session credentials cannot view or mutate another user's progress", () => {
  const { database, service } = setup();
  const owner = service.createSession({});
  const stranger = service.createSession({});
  assert.equal(service.authorizeSession(owner.id, owner.accessToken), true);
  assert.throws(() => service.authorizeSession(owner.id, stranger.accessToken),
    (error) => error instanceof AssessmentError && error.code === "session_forbidden");
  database.close();
});

test("out-of-sequence scenarios are rejected", () => {
  const { database, service } = setup();
  const session = service.createSession({});
  assert.throws(() => service.submitDecision(session.id, {
    requestId: randomUUID(),scenarioId: "datos-01-t",choiceId:"verify",
  }), (error) => error instanceof AssessmentError && error.code === "unexpected_scenario");
  database.close();
});

test("result measures the three actual cases and the transfer", () => {
  const { database, service } = setup();
  const session = service.createSession({goal:"empleo"});
  const first = answer(service,session,"impulse");
  assert.equal(first.correct,false);
  answer(service,session,"verify");
  answer(service,session,"verify");
  const result = service.completeSession(session.id);
  assert.equal(result.diagnosticCorrect,false);
  assert.equal(result.transferCorrect,true);
  assert.equal(result.demonstratedTransfer,true);
  assert.equal(result.totalCorrect,2);
  assert.equal(service.sessionDetails(session.id).nextScenario,null);
  database.close();
});
