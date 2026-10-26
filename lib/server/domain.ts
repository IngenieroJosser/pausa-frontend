import { createHash } from "node:crypto";
import type { Difficulty, LearningPhase, Topic } from "@/src/generated/prisma/client";

export type RiskSignal = "pago" | "urgencia" | "canal" | "datos";
export type PublicStage = "diagnostico" | "practica" | "transferencia";
export const MAX_EVALUATED_DECISIONS = 3;

export const goalsToTopic: Record<"empleo" | "dinero" | "datos", Topic> = {
  empleo: "EMPLOYMENT",
  dinero: "MONEY",
  datos: "IDENTITY",
};
export const phaseToStage: Record<LearningPhase, PublicStage> = {
  CALIBRATION: "diagnostico",
  PRACTICE: "practica",
  TRANSFER: "transferencia",
};
export const stageToPhase: Record<PublicStage, LearningPhase> = {
  diagnostico: "CALIBRATION",
  practica: "PRACTICE",
  transferencia: "TRANSFER",
};
export const frictionToSignal: Record<string, RiskSignal> = {
  urgencia: "urgencia", autoridad: "canal", oportunidad: "pago", aislamiento: "datos",
};

export type Candidate = {
  id: string;
  slug: string;
  fraudPattern: string | null;
  difficulty: Difficulty;
  conversation: unknown;
};

export function getMeta(conversation: unknown): { family: string | null; stage: PublicStage | null; skill: string | null; choices: Array<{id: string; signal: RiskSignal}> } {
  const value = conversation && typeof conversation === "object" && !Array.isArray(conversation)
    ? conversation as Record<string, unknown> : {};
  const stage = value.stage === "diagnostico" || value.stage === "practica" || value.stage === "transferencia" ? value.stage : null;
  const choices = Array.isArray(value.choices)
    ? value.choices.flatMap((c: unknown) => {
        if (!c || typeof c !== "object") return [];
        const entry = c as Record<string, unknown>;
        if (typeof entry.id !== "string") return [];
        const signal = entry.signal;
        return [{ id: entry.id, signal: isRiskSignal(signal) ? signal : "canal" as const }];
      }) : [];
  return {
    family: typeof value.family === "string" ? value.family : null,
    stage,
    skill: typeof value.skill === "string" ? value.skill : null,
    choices,
  };
}

export function isRiskSignal(value: unknown): value is RiskSignal {
  return value === "pago" || value === "urgencia" || value === "canal" || value === "datos";
}

export function selectScenario({
  candidates, sessionId, phase, usedFamilies, targetSignal, avoidSignal, confidence,
}: {
  candidates: Candidate[];
  sessionId: string;
  phase: LearningPhase;
  usedFamilies?: string[];
  targetSignal?: RiskSignal | null;
  avoidSignal?: RiskSignal | null;
  confidence?: "baja" | "media" | "alta" | null;
}): Candidate | null {
  let pool = candidates.filter((candidate) => getMeta(candidate.conversation).stage === phaseToStage[phase]);
  const remaining = pool.filter((candidate) => !usedFamilies?.includes(getMeta(candidate.conversation).family ?? candidate.slug));
  if (remaining.length) pool = remaining;

  if (targetSignal) {
    const matched = pool.filter((candidate) => candidate.fraudPattern === targetSignal);
    if (matched.length) pool = matched;
  }
  if (avoidSignal) {
    const different = pool.filter((candidate) => candidate.fraudPattern !== avoidSignal);
    if (different.length) pool = different;
  }
  if (confidence) {
    const wanted: Difficulty = confidence === "baja" ? "BASIC" : confidence === "media" ? "INTERMEDIATE" : "ADVANCED";
    const difficultyMatched = pool.filter((candidate) => candidate.difficulty === wanted);
    if (difficultyMatched.length) pool = difficultyMatched;
  }
  if (!pool.length) return null;
  // Deterministic retry/resume selection, without a mutable global index or client trust.
  pool.sort((a, b) => a.slug.localeCompare(b.slug));
  const fingerprint = createHash("sha256").update(`${sessionId}:${phase}:${pool.map((s) => s.slug).join(",")}`).digest();
  return pool[fingerprint.readUInt32BE(0) % pool.length];
}

export function recommendationFor(signals: RiskSignal[]): string {
  if (signals.includes("pago")) return "No adelantes pagos por una oportunidad sin comprobar el destinatario y el procedimiento.";
  if (signals.includes("urgencia")) return "Ante un plazo inmediato, detente y verifica por un canal que conozcas.";
  if (signals.includes("datos")) return "Evita enviar documentos o códigos hasta comprobar quién los solicita y para qué.";
  if (signals.includes("canal")) return "Busca por tu cuenta el canal oficial; el contacto que te envían puede formar parte del engaño.";
  return "Conserva el hábito: detente, contrasta la información y decide sin presión.";
}
