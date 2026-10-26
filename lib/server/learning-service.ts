import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import {
  Prisma, CaseStatus, type PrismaClient, type LearningPhase, type SkillType,
} from "@/src/generated/prisma/client";
import { ApiError } from "./errors";
import {
  MAX_EVALUATED_DECISIONS, goalsToTopic, getMeta, phaseToStage,
  recommendationFor, selectScenario, frictionToSignal, isRiskSignal,
  type RiskSignal,
} from "./domain";
import type { CreateSessionInput, SubmitDecisionInput, InteractionInput } from "./validation";

const SCENARIO_VERSION = "2026.10.4";
const PHASES: LearningPhase[] = ["CALIBRATION", "PRACTICE", "TRANSFER"];
const SKILLS: Record<string, SkillType> = {
  deteccion_cobros: "FINANCIAL_RISK",
  control_urgencia: "URGENCY_RECOGNITION",
  verificacion_independiente: "SOURCE_VERIFICATION",
  custodia_identidad: "DATA_PROTECTION",
  transferencia_criterio: "SAFE_DECISION",
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function jsonObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function publicRef(record: { scenario: { slug: string; version: number; conversation: unknown; options: Array<{ code: string; position: number }> }; phase: LearningPhase }) {
  const meta = getMeta(record.scenario.conversation);
  return {
    id: record.scenario.slug,
    stage: phaseToStage[record.phase],
    version: `${SCENARIO_VERSION}.${record.scenario.version}`,
    skill: meta.skill ?? "SAFE_DECISION",
    choiceIds: [...record.scenario.options].sort((a, b) => a.position - b.position).map((o) => o.code),
  };
}

type DetailTx = Pick<PrismaClient, "sessionScenario">;
async function getPlacements(db: DetailTx, id: string) {
  return db.sessionScenario.findMany({
    where: { sessionId: id },
    include: {
      scenario: { include: { options: true } },
      decision: { include: { selectedOption: true } },
    },
    orderBy: { position: "asc" },
  });
}

type Placements = Awaited<ReturnType<typeof getPlacements>>;
function signalFor(placement: Placements[number], choiceId: string): RiskSignal {
  const choice = getMeta(placement.scenario.conversation).choices.find((c) => c.id === choiceId);
  return choice?.signal ?? "canal";
}
function formatAnswer(placement: Placements[number], next: Placements[number] | undefined) {
  if (!placement.decision) throw new ApiError("decision_not_found", 404);
  const decision = placement.decision;
  return {
    id: decision.id,
    scenarioId: placement.scenario.slug,
    choiceId: decision.selectedOption.code,
    stage: phaseToStage[placement.phase],
    correct: decision.isSafe,
    signal: signalFor(placement, decision.selectedOption.code),
    skill: getMeta(placement.scenario.conversation).skill ?? "SAFE_DECISION",
    nextScenario: next ? publicRef(next) : null,
    nextScenarioId: next?.scenario.slug ?? null,
  };
}
function isDbConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && ["P2034", "P2002"].includes(error.code);
}

export function createLearningService(db: PrismaClient) {
  async function authorize(id: string, accessToken: string | null) {
    if (!accessToken || !/^[A-Za-z0-9_-]{30,128}$/.test(accessToken)) throw new ApiError("session_unauthorized", 401);
    const session = await db.learningSession.findUnique({ where: { id } });
    if (!session) throw new ApiError("session_not_found", 404);
    if (!session.accessTokenHash) throw new ApiError("session_unauthorized", 401);
    const candidate = Buffer.from(hashToken(accessToken), "hex");
    const expected = Buffer.from(session.accessTokenHash, "hex");
    if (expected.length !== candidate.length || !timingSafeEqual(expected, candidate)) {
      throw new ApiError("session_forbidden", 403);
    }
    return session;
  }

  async function createSession(input: CreateSessionInput) {
    const topic = goalsToTopic[input.goal];
    const accessToken = randomBytes(32).toString("base64url");
    const sessionId = randomUUID();
    const candidates = await db.scenario.findMany({ where: { isPublished: true, topic } });
    const submitted = input.calibration ?? [];
    if (new Set(submitted.map((item) => item.scenarioId)).size !== submitted.length) {
      throw new ApiError("duplicate_calibration_scenario", 400);
    }
    const recognition = submitted.map((answer) => {
      const source = candidates.find((candidate) => candidate.slug === answer.scenarioId);
      if (!source || getMeta(source.conversation).stage !== "diagnostico") {
        throw new ApiError("invalid_calibration_scenario", 400);
      }
      const risk = jsonObject(source.conversation).risk;
      return {
        scenarioId: answer.scenarioId,
        family: getMeta(source.conversation).family ?? source.slug,
        flagged: answer.flagged,
        correct: typeof risk === "boolean" ? risk === answer.flagged : false,
        signal: isRiskSignal(source.fraudPattern) ? source.fraudPattern : "canal" as RiskSignal,
      };
    });
    const missed = recognition.find((item) => !item.correct);
    const scenario = selectScenario({
      candidates, sessionId, phase: "CALIBRATION",
      usedFamilies: recognition.map((item) => item.family),
      targetSignal: missed?.signal ?? null,
      confidence: input.confidence ?? null,
    });
    if (!scenario) throw new ApiError("catalog_not_ready_run_db_seed", 503);
    const calibrationData: Prisma.InputJsonValue = {
      friction: input.friction ?? null,
      habit: input.habit ?? null,
      confidence: input.confidence ?? null,
      context: input.context ?? null,
      recognition: recognition.map(({ scenarioId, flagged, correct, signal }) => ({ scenarioId, flagged, correct, signal })),
      recognitionScore: recognition.length ? Math.round(recognition.filter((r) => r.correct).length / recognition.length * 100) : null,
    };
    const placement = await db.$transaction(async (tx) => {
      await tx.learningSession.create({ data: {
        id: sessionId,
        accessTokenHash: hashToken(accessToken),
        topic, status: "ACTIVE", currentPhase: "CALIBRATION", currentPosition: 0,
        calibrationData,
      } });
      return tx.sessionScenario.create({
        data: {
          sessionId, scenarioId: scenario.id, position: 0, phase: "CALIBRATION",
          status: "PRESENTED", presentedAt: new Date(), selectionReason: missed ? "baseline_focus" : "initial_assessment",
        },
        include: { scenario: { include: { options: true } } },
      });
    });
    return { id: sessionId, status: "active", scenarioVersion: SCENARIO_VERSION, accessToken, nextScenario: publicRef(placement) };
  }

  async function getSessionDetails(id: string, token: string | null) {
    const session = await authorize(id, token);
    const placements = await getPlacements(db, id);
    const nextPlacement = session.status === "ACTIVE" ? placements.find((item) => item.position === session.currentPosition) : undefined;
    return {
      id: session.id,
      status: session.status === "ACTIVE" ? "active" : session.status.toLowerCase(),
      goal: session.topic === "EMPLOYMENT" ? "empleo" : session.topic === "MONEY" ? "dinero" : "datos",
      scenarioVersion: SCENARIO_VERSION,
      currentStage: nextPlacement ? phaseToStage[nextPlacement.phase] : "completado",
      decisionCount: placements.filter((p) => p.decision).length,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
      nextScenario: nextPlacement ? publicRef(nextPlacement) : null,
      answers: placements.flatMap((placement, index) => placement.decision ? [formatAnswer(placement, placements[index + 1])] : []),
    };
  }

  async function submitDecision(id: string, token: string | null, input: SubmitDecisionInput) {
    await authorize(id, token);
    // El replay es verificable incluso cuando la petición anterior sí confirmó en PostgreSQL.
    async function replay() {
      const existing = await db.decision.findUnique({
        where: { sessionId_requestId: { sessionId: id, requestId: input.requestId } },
        include: { selectedOption: true, sessionScenario: { include: { scenario: true } } },
      });
      if (!existing) return null;
      if (existing.sessionScenario.scenario.slug !== input.scenarioId || existing.selectedOption.code !== input.choiceId) {
        throw new ApiError("idempotency_conflict", 409);
      }
      const placements = await getPlacements(db, id);
      const current = placements.find((p) => p.id === existing.sessionScenarioId);
      if (!current) throw new ApiError("decision_not_found", 404);
      const next = placements.find((p) => p.position === current.position + 1);
      return { ...formatAnswer(current, next), replayed: true };
    }
    const previous = await replay();
    if (previous) return previous;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await db.$transaction(async (tx) => {
          const session = await tx.learningSession.findUnique({ where: { id } });
          if (!session || session.status !== "ACTIVE") throw new ApiError("session_not_active", 409);
          if (session.currentPosition >= MAX_EVALUATED_DECISIONS) throw new ApiError("session_decisions_complete", 409);
          const current = await tx.sessionScenario.findUnique({
            where: { sessionId_position: { sessionId: id, position: session.currentPosition } },
            include: { scenario: { include: { options: true } } },
          });
          if (!current || current.scenario.slug !== input.scenarioId || current.status !== "PRESENTED") {
            throw new ApiError("unexpected_scenario", 409);
          }
          const option = current.scenario.options.find((candidate) => candidate.code === input.choiceId);
          if (!option) throw new ApiError("invalid_choice", 400);
          const correct = option.isSafe;
          const signal = getMeta(current.scenario.conversation).choices.find((c) => c.id === option.code)?.signal ?? "canal";
          const skillName = getMeta(current.scenario.conversation).skill ?? "transferencia_criterio";
          const skill = SKILLS[skillName] ?? "SAFE_DECISION";

          const created = await tx.decision.create({ data: {
            sessionId: id, sessionScenarioId: current.id, optionId: option.id,
            requestId: input.requestId, isSafe: correct, score: option.score,
            responseTimeMs: input.elapsedMs ?? null,
            feedbackSnapshot: { signal, explanation: option.feedback, skill: skillName },
          } });
          await tx.sessionScenario.update({ where: { id: current.id }, data: { status: CaseStatus.COMPLETED, completedAt: new Date() } });
          await tx.skillAssessment.upsert({
            where: { sessionId_skill_phase: { sessionId: id, skill, phase: current.phase } },
            create: {
              sessionId: id, skill, phase: current.phase, totalDecisions: 1,
              correctDecisions: Number(correct), score: correct ? 100 : 0,
            },
            update: {
              totalDecisions: { increment: 1 }, correctDecisions: { increment: Number(correct) },
              score: correct ? 100 : 0,
            },
          });

          const nextPosition = session.currentPosition + 1;
          const nextPhase = PHASES[nextPosition];
          let nextScenarioRef: ReturnType<typeof publicRef> | null = null;
          if (nextPhase) {
            const candidates = await tx.scenario.findMany({ where: { topic: session.topic, isPublished: true } });
            const previousPlacements = await tx.sessionScenario.findMany({
              where: { sessionId: id, position: { lte: session.currentPosition } },
              include: { scenario: true, decision: { include: { selectedOption: true } } },
              orderBy: { position: "asc" },
            });
            const usedFamilies = previousPlacements.map((p) => getMeta(p.scenario.conversation).family ?? p.scenario.slug);
            const calibration = jsonObject(session.calibrationData);
            let targetSignal: RiskSignal | null = null;
            let avoidSignal: RiskSignal | null = null;
            if (nextPhase === "PRACTICE") {
              targetSignal = correct ? frictionToSignal[String(calibration.friction)] ?? null : signal;
            } else if (nextPhase === "TRANSFER") {
              const currentPattern = current.scenario.fraudPattern;
              avoidSignal = isRiskSignal(currentPattern) ? currentPattern : null;
            }
            const confidence = ["baja", "media", "alta"].includes(String(calibration.confidence))
              ? calibration.confidence as "baja" | "media" | "alta" : null;
            const chosen = selectScenario({
              candidates, sessionId: id, phase: nextPhase, usedFamilies,
              targetSignal, avoidSignal, confidence,
            });
            if (!chosen) throw new ApiError("catalog_not_ready_run_db_seed", 503);
            const nextPlacement = await tx.sessionScenario.create({
              data: {
                sessionId: id, scenarioId: chosen.id, position: nextPosition,
                phase: nextPhase, status: "PRESENTED", presentedAt: new Date(),
                selectionReason: nextPhase === "PRACTICE" ? "adaptive_practice" : "transfer_check",
                adaptationData: { signal: targetSignal ?? avoidSignal, previousCorrect: correct },
              },
              include: { scenario: { include: { options: true } } },
            });
            nextScenarioRef = publicRef(nextPlacement);
          }
          const updated = await tx.learningSession.updateMany({
            where: { id, currentPosition: session.currentPosition, status: "ACTIVE" },
            data: { currentPosition: nextPosition, ...(nextPhase ? { currentPhase: nextPhase } : {}) },
          });
          if (updated.count !== 1) throw new ApiError("concurrent_decision", 409);
          return {
            id: created.id, scenarioId: current.scenario.slug,
            stage: phaseToStage[current.phase], choiceId: option.code,
            correct, signal, skill: skillName, replayed: false,
            nextScenario: nextScenarioRef,
          };
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15_000 });
      } catch (error) {
        if (isDbConflict(error)) {
          const existing = await replay();
          if (existing) return existing;
          if (attempt < 2) continue;
          throw new ApiError("concurrent_decision", 409);
        }
        throw error;
      }
    }
    throw new ApiError("concurrent_decision", 409);
  }

  async function recordInteraction(id: string, token: string | null, input: InteractionInput) {
    await authorize(id, token);
    const previous = await db.interactionEvent.findUnique({
      where: { sessionId_requestId: { sessionId: id, requestId: input.requestId } },
      include: { sessionScenario: { include: { scenario: true } } },
    });
    const matches = (event: typeof previous) => event && event.type === input.eventType
      && (event.sessionScenario?.scenario.slug ?? undefined) === input.scenarioId
      && JSON.stringify(event.payload ?? null) === JSON.stringify(input.payload ?? null);
    if (previous) {
      if (!matches(previous)) throw new ApiError("idempotency_conflict", 409);
      return { id: previous.id, replayed: true };
    }
    let sessionScenarioId: string | null = null;
    if (input.scenarioId) {
      const placement = await db.sessionScenario.findFirst({ where: { sessionId: id, scenario: { slug: input.scenarioId } } });
      if (!placement) throw new ApiError("unexpected_scenario", 409);
      sessionScenarioId = placement.id;
    }
    try {
      const event = await db.interactionEvent.create({ data: {
        sessionId: id, sessionScenarioId, requestId: input.requestId,
        type: input.eventType, payload: input.payload ? input.payload as Prisma.InputJsonValue : Prisma.JsonNull,
      } });
      return { id: event.id, replayed: false };
    } catch (error) {
      if (isDbConflict(error)) {
        const found = await db.interactionEvent.findUnique({
          where: { sessionId_requestId: { sessionId: id, requestId: input.requestId } },
          include: { sessionScenario: { include: { scenario: true } } },
        });
        if (matches(found)) return { id: found!.id, replayed: true };
        throw new ApiError("idempotency_conflict", 409);
      }
      throw error;
    }
  }

  function formatOutcome(outcome: {
    sessionId: string; totalDecisions: number; safeDecisions: number;
    reachedTransfer: boolean; recommendations: unknown; summary: unknown; completedAt: Date;
  }) {
    const summary = jsonObject(outcome.summary);
    const rec = jsonObject(outcome.recommendations);
    return {
      sessionId: outcome.sessionId,
      totalDecisions: outcome.totalDecisions,
      totalCorrect: outcome.safeDecisions,
      finalScore: Math.round(outcome.totalDecisions ? outcome.safeDecisions / outcome.totalDecisions * 100 : 0),
      diagnosticCorrect: summary.diagnosticCorrect === true,
      transferCorrect: summary.transferCorrect === true,
      demonstratedTransfer: summary.demonstratedTransfer === true,
      recommendation: typeof rec.main === "string" ? rec.main : recommendationFor([]),
      recognitionScore: typeof summary.recognitionScore === "number" ? summary.recognitionScore : null,
      createdAt: outcome.completedAt.toISOString(),
    };
  }

  async function completeSession(id: string, token: string | null) {
    await authorize(id, token);
    const existing = await db.sessionOutcome.findUnique({ where: { sessionId: id } });
    if (existing) return formatOutcome(existing);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await db.$transaction(async (tx) => {
          const session = await tx.learningSession.findUnique({ where: { id } });
          if (!session) throw new ApiError("session_not_found", 404);
          const placements = await getPlacements(tx, id);
          if (placements.length !== MAX_EVALUATED_DECISIONS || placements.some((p) => !p.decision)) {
            throw new ApiError("session_incomplete", 409);
          }
          const decisions = placements.map((p, index) => formatAnswer(p, placements[index + 1]));
          const totalCorrect = decisions.filter((a) => a.correct).length;
          const missedSignals = decisions.filter((a) => !a.correct).map((a) => a.signal);
          const diagnosis = decisions[0].correct;
          const transfer = decisions.at(-1)!.correct;
          const calibration = jsonObject(session.calibrationData);
          const outcome = await tx.sessionOutcome.create({ data: {
            sessionId: id,
            totalCases: placements.length, totalDecisions: decisions.length,
            safeDecisions: totalCorrect, finalScore: Math.round(totalCorrect / decisions.length * 100),
            reachedTransfer: true,
            strengths: decisions.filter((a) => a.correct).map((a) => a.skill),
            improvementAreas: missedSignals,
            recommendations: { main: recommendationFor(missedSignals) },
            summary: {
              diagnosticCorrect: diagnosis,
              transferCorrect: transfer,
              demonstratedTransfer: transfer && !diagnosis,
              recognitionScore: typeof calibration.recognitionScore === "number" ? calibration.recognitionScore : null,
              note: "Simulaciones educativas, no predicción de riesgo individual",
            },
          } });
          const updated = await tx.learningSession.updateMany({
            where: { id, status: "ACTIVE", currentPosition: MAX_EVALUATED_DECISIONS },
            data: { status: "COMPLETED", completedAt: new Date() },
          });
          if (updated.count !== 1) throw new ApiError("session_not_active", 409);
          return formatOutcome(outcome);
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      } catch (error) {
        if (isDbConflict(error)) {
          const retry = await db.sessionOutcome.findUnique({ where: { sessionId: id } });
          if (retry) return formatOutcome(retry);
          if (attempt < 2) continue;
        }
        throw error;
      }
    }
    throw new ApiError("concurrent_completion", 409);
  }

  async function getResults(id: string, token: string | null) {
    await authorize(id, token);
    const outcome = await db.sessionOutcome.findUnique({ where: { sessionId: id } });
    if (!outcome) throw new ApiError("results_not_ready", 409);
    const skills = await db.skillAssessment.findMany({
      where: { sessionId: id },
      select: { skill: true, phase: true, totalDecisions: true, correctDecisions: true, score: true },
      orderBy: [{ phase: "asc" }, { skill: "asc" }],
    });
    return { ...formatOutcome(outcome), skills, strengths: outcome.strengths, improvementAreas: outcome.improvementAreas };
  }

  return { createSession, authorize, getSessionDetails, submitDecision, recordInteraction, completeSession, getResults };
}
