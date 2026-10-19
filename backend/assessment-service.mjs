import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { evaluateDecision, getExpectedScenario, publicScenario, SCENARIO_VERSION } from "./catalog.mjs";

export class AssessmentError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

function getSession(database, sessionId) {
  return database.prepare("SELECT * FROM learning_sessions WHERE id = ?").get(sessionId);
}

function getDecisions(database, sessionId) {
  return database.prepare("SELECT * FROM decisions WHERE session_id = ? ORDER BY decided_at, rowid").all(sessionId);
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function recommendationFor(decisions) {
  const missed = decisions.filter((decision) => !decision.correct).map((decision) => decision.error_signal);
  if (missed.includes("pago")) return "No pagues para acceder a una oportunidad; verifica la organización por tu cuenta.";
  if (missed.includes("urgencia")) return "Cuando aparezca un plazo inmediato, detente y verifica antes de abrir enlaces.";
  if (missed.includes("datos")) return "No compartas documentos hasta identificar al responsable y la finalidad.";
  if (missed.includes("canal")) return "Busca siempre un canal oficial independiente del mensaje recibido.";
  return "Mantén la pausa: verifica por un canal independiente antes de actuar.";
}

export function createAssessmentService(database) {
  function createSession({ goal, friction }) {
    const accessToken = randomBytes(32).toString("base64url");
    const session = {
      id: randomUUID(),
      status: "active",
      goal: goal ?? null,
      friction: friction ?? null,
      scenarioVersion: SCENARIO_VERSION,
      currentStage: "diagnostico",
      startedAt: new Date().toISOString(),
    };
    database.prepare(`
      INSERT INTO learning_sessions
      (id, access_token_hash, status, goal, friction, scenario_version, current_stage, started_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(session.id, hashToken(accessToken), session.status, session.goal, session.friction, session.scenarioVersion, session.currentStage, session.startedAt);
    return { ...session, accessToken, nextScenario: publicScenario("oferta-auxiliar") };
  }

  function authorizeSession(sessionId, accessToken) {
    const session = getSession(database, sessionId);
    if (!session) throw new AssessmentError("session_not_found", 404);
    if (!accessToken || !session.access_token_hash) throw new AssessmentError("session_unauthorized", 401);
    const provided = Buffer.from(hashToken(accessToken));
    const expected = Buffer.from(session.access_token_hash);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      throw new AssessmentError("session_forbidden", 403);
    }
    return true;
  }

  function sessionDetails(sessionId) {
    const session = getSession(database, sessionId);
    if (!session) throw new AssessmentError("session_not_found", 404);
    const decisions = getDecisions(database, sessionId);
    return {
      id: session.id,
      status: session.status,
      goal: session.goal,
      friction: session.friction,
      scenarioVersion: session.scenario_version,
      currentStage: session.current_stage,
      startedAt: session.started_at,
      completedAt: session.completed_at,
      decisionCount: decisions.length,
      nextScenario: publicScenario(getExpectedScenario(decisions)),
    };
  }

  function submitDecision(sessionId, input) {
    const session = getSession(database, sessionId);
    if (!session) throw new AssessmentError("session_not_found", 404);

    const previous = database.prepare("SELECT * FROM decisions WHERE session_id = ? AND request_id = ?").get(sessionId, input.requestId);
    if (previous) {
      if (previous.scenario_id !== input.scenarioId || previous.choice_id !== input.choiceId || previous.elapsed_ms !== (input.elapsedMs ?? null)) {
        throw new AssessmentError("idempotency_conflict", 409);
      }
      return { ...formatDecision(previous), replayed: true };
    }
    if (session.status === "completed") throw new AssessmentError("session_already_completed", 409);

    const decisions = getDecisions(database, sessionId);
    const expectedScenario = getExpectedScenario(decisions);
    if (input.scenarioId !== expectedScenario) throw new AssessmentError("unexpected_scenario", 409);
    const evaluation = evaluateDecision(input.scenarioId, input.choiceId);
    if (!evaluation) throw new AssessmentError("invalid_choice", 400);

    const now = new Date().toISOString();
    const decisionId = randomUUID();
    const nextScenarioId = decisions.length === 0
      ? getExpectedScenario([{ correct: evaluation.correct ? 1 : 0, error_signal: evaluation.signal }])
      : decisions.length === 1 ? "banco-premio" : null;
    const nextStage = nextScenarioId ? publicScenario(nextScenarioId).stage : "completado";

    database.exec("BEGIN IMMEDIATE");
    try {
      database.prepare(`
        INSERT INTO decisions
        (id, session_id, request_id, scenario_id, scenario_version, choice_id, stage, correct, error_signal, skill, elapsed_ms, decided_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(decisionId, sessionId, input.requestId, input.scenarioId, SCENARIO_VERSION, input.choiceId, evaluation.stage, evaluation.correct ? 1 : 0, evaluation.signal, evaluation.skill, input.elapsedMs ?? null, now);

      database.prepare(`
        INSERT INTO skill_assessments
        (session_id, skill, attempts, correct_attempts, last_signal, updated_at)
        VALUES (?, ?, 1, ?, ?, ?)
        ON CONFLICT(session_id, skill) DO UPDATE SET
          attempts = attempts + 1,
          correct_attempts = correct_attempts + excluded.correct_attempts,
          last_signal = excluded.last_signal,
          updated_at = excluded.updated_at
      `).run(sessionId, evaluation.skill, evaluation.correct ? 1 : 0, evaluation.signal, now);

      database.prepare("UPDATE learning_sessions SET current_stage = ? WHERE id = ?").run(nextStage, sessionId);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }

    return {
      id: decisionId,
      scenarioId: input.scenarioId,
      stage: evaluation.stage,
      correct: evaluation.correct,
      signal: evaluation.signal,
      skill: evaluation.skill,
      replayed: false,
      nextScenario: publicScenario(nextScenarioId),
    };
  }

  function recordInteraction(sessionId, input) {
    if (!getSession(database, sessionId)) throw new AssessmentError("session_not_found", 404);
    const previous = database.prepare("SELECT * FROM interaction_events WHERE session_id = ? AND request_id = ?").get(sessionId, input.requestId);
    const payloadJson = JSON.stringify(input.payload ?? {});
    if (previous) {
      if (previous.scenario_id !== (input.scenarioId ?? null) || previous.event_type !== input.eventType || previous.payload_json !== payloadJson) {
        throw new AssessmentError("idempotency_conflict", 409);
      }
      return { id: previous.id, replayed: true };
    }
    const id = randomUUID();
    database.prepare(`
      INSERT INTO interaction_events
      (id, session_id, request_id, scenario_id, event_type, payload_json, occurred_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, sessionId, input.requestId, input.scenarioId ?? null, input.eventType, payloadJson, new Date().toISOString());
    return { id, replayed: false };
  }

  function completeSession(sessionId) {
    const session = getSession(database, sessionId);
    if (!session) throw new AssessmentError("session_not_found", 404);
    const existing = database.prepare("SELECT * FROM session_outcomes WHERE session_id = ?").get(sessionId);
    if (existing) return formatOutcome(existing);
    const decisions = getDecisions(database, sessionId);
    if (decisions.length !== 3) throw new AssessmentError("session_incomplete", 409);
    const diagnosticCorrect = Boolean(decisions[0].correct);
    const transferCorrect = Boolean(decisions[2].correct);
    const outcome = {
      totalCorrect: decisions.filter((decision) => decision.correct).length,
      diagnosticCorrect,
      transferCorrect,
      demonstratedTransfer: transferCorrect && !diagnosticCorrect,
      recommendation: recommendationFor(decisions),
      createdAt: new Date().toISOString(),
    };
    database.exec("BEGIN IMMEDIATE");
    try {
      database.prepare(`
        INSERT INTO session_outcomes
        (session_id, total_correct, diagnostic_correct, transfer_correct, demonstrated_transfer, recommendation, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(sessionId, outcome.totalCorrect, outcome.diagnosticCorrect ? 1 : 0, outcome.transferCorrect ? 1 : 0, outcome.demonstratedTransfer ? 1 : 0, outcome.recommendation, outcome.createdAt);
      database.prepare("UPDATE learning_sessions SET status = 'completed', current_stage = 'completado', completed_at = ? WHERE id = ?").run(outcome.createdAt, sessionId);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    return { sessionId, ...outcome };
  }

  function getResults(sessionId) {
    const outcome = database.prepare("SELECT * FROM session_outcomes WHERE session_id = ?").get(sessionId);
    if (!outcome) throw new AssessmentError("results_not_ready", 409);
    const skills = database.prepare("SELECT skill, attempts, correct_attempts, last_signal FROM skill_assessments WHERE session_id = ? ORDER BY skill").all(sessionId);
    return { ...formatOutcome(outcome), skills };
  }

  return { authorizeSession, createSession, sessionDetails, submitDecision, recordInteraction, completeSession, getResults };
}

function formatDecision(row) {
  return {
    id: row.id,
    scenarioId: row.scenario_id,
    stage: row.stage,
    correct: Boolean(row.correct),
    signal: row.error_signal,
    skill: row.skill,
  };
}

function formatOutcome(row) {
  return {
    sessionId: row.session_id,
    totalCorrect: row.total_correct,
    diagnosticCorrect: Boolean(row.diagnostic_correct),
    transferCorrect: Boolean(row.transfer_correct),
    demonstratedTransfer: Boolean(row.demonstrated_transfer),
    recommendation: row.recommendation,
    createdAt: row.created_at,
  };
}
