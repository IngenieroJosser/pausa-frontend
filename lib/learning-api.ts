import type { OnboardingResult } from "@/components/onboarding";
import type { RiskSignal } from "./scenarios";
import type { Answer } from "./session";

// El backend vive en este mismo Next.js; no hay URL externa ni configuración CORS.
const API_URL = "/api/v1";

export type SessionResponse = { id: string; accessToken: string; nextScenario: { id: string } };
export type SessionDetails = {
  id: string;
  status: "active" | "completed" | "abandoned";
  nextScenario: { id: string } | null;
  decisionCount: number;
  answers: Answer[];
};
export type DecisionResponse = {
  scenarioId: string;
  correct: boolean;
  signal: RiskSignal;
  skill: string;
  nextScenario: { id: string } | null;
};
export type CompleteResponse = {
  totalCorrect: number;
  diagnosticCorrect: boolean;
  transferCorrect: boolean;
  demonstratedTransfer: boolean;
  recommendation: string;
};
const frictionMap = {
  urgencia: "urgencia",
  marca: "autoridad",
  miedo: "oportunidad",
  canal: "aislamiento",
} as const;

export class LearningApiError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
  }
}

async function request<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "request_failed" }));
    throw new LearningApiError(body.error || "request_failed", response.status);
  }
  return response.json() as Promise<T>;
}

export function createLearningSession(onboarding: OnboardingResult) {
  return request<SessionResponse>("/sessions", {
    method: "POST",
    body: JSON.stringify({
      goal: onboarding.goal, friction: frictionMap[onboarding.friction],
      habit: onboarding.habit, confidence: onboarding.confidence,
      context: onboarding.context, calibration: onboarding.calibration ?? [],
    }),
  });
}
export function getLearningSession(sessionId: string, accessToken: string) {
  return request<SessionDetails>(`/sessions/${sessionId}`, {}, accessToken);
}
export function getLearningResults(sessionId: string, accessToken: string) {
  return request<CompleteResponse>(`/sessions/${sessionId}/results`, {}, accessToken);
}
export function submitLearningDecision(sessionId: string, accessToken: string, input: {
  requestId: string;
  scenarioId: string;
  choiceId: string;
  elapsedMs?: number;
}) {
  return request<DecisionResponse>(`/sessions/${sessionId}/decisions`, {
    method: "POST", body: JSON.stringify(input),
  }, accessToken);
}
export function completeLearningSession(sessionId: string, accessToken: string) {
  return request<CompleteResponse>(`/sessions/${sessionId}/complete`, {
    method: "POST", body: "{}",
  }, accessToken);
}
export function recordInteraction(sessionId: string, accessToken: string, input: {
  requestId: string;
  scenarioId?: string;
  eventType: "hint_opened" | "lesson_viewed" | "scenario_started" | "feedback_viewed";
  payload?: Record<string, string | number | boolean | null>;
}) {
  return request(`/sessions/${sessionId}/interactions`, {
    method: "POST", body: JSON.stringify(input),
  }, accessToken).catch(() => undefined);
}
