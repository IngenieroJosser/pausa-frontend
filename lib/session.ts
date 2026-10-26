import type { RiskSignal } from "./scenarios";

export type Answer = {
  scenarioId: string;
  choiceId: string;
  correct: boolean;
  signal: RiskSignal;
  skill?: string;
  nextScenarioId: string | null;
};

export type SavedResult = {
  completedAt: string;
  diagnosticCorrect: boolean;
  transferCorrect: boolean;
  totalCorrect: number;
  answers?: Answer[];
};

export const RESULT_STORAGE_KEY = "pausa:last-result";

export const ACTIVE_SESSION_KEY = "pausa:active-session";
