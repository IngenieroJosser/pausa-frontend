import type { OnboardingResult } from "@/components/onboarding";
import type { RiskSignal } from "./scenarios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3101";

type SessionResponse = { id: string; accessToken: string; nextScenario: { id: string } };
type DecisionResponse = {
  scenarioId: string;
  correct: boolean;
  signal: RiskSignal;
  skill: string;
  nextScenario: { id: string } | null;
};

const frictionMap = {
  urgencia: "urgencia",
  marca: "autoridad",
  miedo: "oportunidad",
  canal: "aislamiento",
} as const;

async function request<T>(path: string, init?: RequestInit, accessToken?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "request_failed" }));
    throw new Error(body.error || "request_failed");
  }
  return response.json() as Promise<T>;
}

export function createLearningSession(onboarding: OnboardingResult) {
  return request<SessionResponse>("/api/v1/sessions", {
    method: "POST",
    body: JSON.stringify({ goal: onboarding.goal, friction: frictionMap[onboarding.friction] }),
  });
}

export function submitLearningDecision(sessionId: string, accessToken: string, input: {
  requestId: string;
  scenarioId: string;
  choiceId: string;
  elapsedMs?: number;
}) {
  return request<DecisionResponse>(`/api/v1/sessions/${sessionId}/decisions`, {
    method: "POST",
    body: JSON.stringify(input),
  }, accessToken);
}

export function completeLearningSession(sessionId: string, accessToken: string) {
  return request<{
    totalCorrect: number;
    diagnosticCorrect: boolean;
    transferCorrect: boolean;
    demonstratedTransfer: boolean;
    recommendation: string;
  }>(`/api/v1/sessions/${sessionId}/complete`, { method: "POST", body: "{}" }, accessToken);
}

export function recordInteraction(sessionId: string, accessToken: string, input: {
  requestId: string;
  scenarioId?: string;
  eventType: "hint_opened" | "lesson_viewed" | "scenario_started" | "feedback_viewed";
  payload?: Record<string, string | number | boolean | null>;
}) {
  return request(`/api/v1/sessions/${sessionId}/interactions`, {
    method: "POST",
    body: JSON.stringify(input),
  }, accessToken).catch(() => undefined);
}
