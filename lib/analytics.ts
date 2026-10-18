export type AnalyticsEvent =
  | "session_started"
  | "onboarding_completed"
  | "answer_submitted"
  | "session_completed";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const SESSION_KEY = "pausa:anonymous-session";

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const sessionId = window.crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  void fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: event, sessionId: getSessionId(), payload }),
    keepalive: true,
  }).catch(() => undefined);
}
