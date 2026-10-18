import type { RiskSignal, Scenario } from "./scenarios";

export type Answer = {
  scenarioId: string;
  choiceId: string;
  correct: boolean;
  signal: RiskSignal;
};

export type SavedResult = {
  completedAt: string;
  diagnosticCorrect: boolean;
  transferCorrect: boolean;
  totalCorrect: number;
};

export function evaluateAnswer(scenario: Scenario, choiceId: string): Answer {
  const choice = scenario.choices.find((item) => item.id === choiceId);
  if (!choice) throw new Error("La opción seleccionada no existe.");
  return { scenarioId: scenario.id, choiceId, correct: choice.isCorrect, signal: choice.signal };
}

export function primaryPracticeSignal(answer: Answer): RiskSignal {
  return answer.correct ? "datos" : answer.signal;
}

export const RESULT_STORAGE_KEY = "pausa:last-result";
