import { createHash } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const bank = require("../shared/scenario-bank.json");
export const SCENARIO_VERSION = "2026.10.3";
export const scenarios = Object.fromEntries(bank.map((scenario) => [scenario.id, {
  id: scenario.id,
  version: SCENARIO_VERSION,
  goal: scenario.goal,
  family: scenario.family,
  stage: scenario.stage,
  skill: scenario.skill,
  signal: scenario.signal,
  choiceIds: scenario.choices.map((choice) => choice.id),
  correctChoiceId: scenario.correctChoiceId,
  errorSignals: Object.fromEntries(scenario.choices.map((choice) => [choice.id, choice.signal])),
}]));

const STAGES = ["diagnostico", "practica", "transferencia"];
const FRICTION_SIGNALS = {
  urgencia: "urgencia",
  autoridad: "canal",
  oportunidad: "pago",
  aislamiento: "datos",
};

export function evaluateDecision(scenarioId, choiceId) {
  const scenario = scenarios[scenarioId];
  if (!scenario || !scenario.choiceIds.includes(choiceId)) return null;
  return {
    correct: scenario.correctChoiceId === choiceId,
    signal: scenario.errorSignals[choiceId],
    skill: scenario.skill,
    stage: scenario.stage,
  };
}

/**
 * Stable within a session, different between sessions. No mutable global indexes,
 * no client-controlled correct answers, and no new DB migration is needed.
 * A previously returned case remains the same after a retry or a restart.
 */
export function getExpectedScenario(session, decisions) {
  if (!session || decisions.length >= STAGES.length) return null;
  const stage = STAGES[decisions.length];
  const goal = ["empleo", "dinero", "datos"].includes(session.goal) ? session.goal : "empleo";
  let candidates = bank.filter((s) => s.goal === goal && s.stage === stage);
  const previousFamilies = new Set(decisions.map((d) => scenarios[d.scenario_id]?.family));
  candidates = candidates.filter((s) => !previousFamilies.has(s.family));

  // The practice targets the first observed error. If there was no mistake,
  // it prioritizes the user's declared friction in onboarding.
  if (stage === "practica") {
    const first = decisions[0];
    const target = first?.correct ? FRICTION_SIGNALS[session.friction] : first?.error_signal;
    if (target) {
      const relevant = candidates.filter((s) => s.signal === target);
      if (relevant.length) candidates = relevant;
    }
  }
  if (stage === "transferencia" && decisions.length) {
    const observedSignal = scenarios[decisions[1].scenario_id]?.signal;
    const alternate = candidates.filter((s) => s.signal !== observedSignal);
    if (alternate.length) candidates = alternate;
  }

  if (!candidates.length) return null;
  const fingerprint = createHash("sha256")
    .update(`${session.id}:${(session.scenario_version ?? session.scenarioVersion)}:${stage}:${goal}`)
    .digest();
  return candidates[fingerprint.readUInt32BE(0) % candidates.length].id;
}

export function publicScenario(scenarioId) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return null;
  return {
    id: scenario.id,
    version: scenario.version,
    stage: scenario.stage,
    skill: scenario.skill,
    choiceIds: scenario.choiceIds,
  };
}
