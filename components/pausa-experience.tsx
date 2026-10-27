"use client";

import { useCallback, useEffect, useState } from "react";
import {
  completeLearningSession, createLearningSession, getLearningResults,
  getLearningSession, recordInteraction, submitLearningDecision, LearningApiError,
} from "@/lib/learning-api";
import { diagnosticScenario, getScenarioById, type Scenario } from "@/lib/scenarios";
import { ACTIVE_SESSION_KEY, RESULT_STORAGE_KEY, type Answer, type SavedResult } from "@/lib/session";
import { FeedbackStep } from "./feedback-step";
import { IntroScreen } from "./intro-screen";
import { Onboarding, type OnboardingResult } from "./onboarding";
import { Progress } from "./progress";
import { ResultScreen } from "./result-screen";
import { ScenarioStep } from "./scenario-step";
import { ServiceError } from "./service-error";

type View = "restoring" | "starting" | "intro" | "onboarding" | "scenario" | "feedback" | "result" | "service-error";
type RetryAction = "resume" | "start" | "submit" | "complete";
type StoredSession = { id: string; accessToken: string };

function getStoredSession(): StoredSession | null {
  try {
    const raw = window.sessionStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return typeof parsed.id === "string" && typeof parsed.accessToken === "string" ? parsed : null;
  } catch {
    window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
    return null;
  }
}

function getSavedResult(): SavedResult | null {
  try {
    const saved = window.localStorage.getItem(RESULT_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as SavedResult;
    return Number.isInteger(parsed.totalCorrect) && Array.isArray(parsed.answers) && parsed.answers.length === 3 ? parsed : null;
  } catch {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    return null;
  }
}

export function PausaExperience() {
  // La bienvenida debe poder renderizarse desde el servidor sin esperar a la
  // hidratación. Si existe una sesión previa, la restauración se activa tras el
  // montaje y sustituye temporalmente esta pantalla por el estado de carga.
  // En una visita nueva, el CTA está disponible desde el primer HTML.
  const [view, setView] = useState<View>("intro");
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState<Scenario>(diagnosticScenario);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [onboardingResult, setOnboardingResult] = useState<OnboardingResult | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<RetryAction>("resume");
  const [scenarioStartedAt, setScenarioStartedAt] = useState(() => Date.now());

  const restoreSession = useCallback(async () => {
    const savedResult = getSavedResult();
    if (savedResult) {
      setAnswers(savedResult.answers ?? []);
      setPreviousScore(savedResult.totalCorrect);
      setView("result");
      return;
    }
    const stored = getStoredSession();
    if (!stored) {
      // No forzar una transición ni mostrar un spinner en una visita nueva.
      return;
    }
    setView("restoring");
    try {
      const details = await getLearningSession(stored.id, stored.accessToken);
      setSessionId(stored.id);
      setSessionToken(stored.accessToken);
      setAnswers(details.answers);
      setSelected(null);
      setPendingRequestId(null);
      if (details.status === "completed" || (details.status === "active" && details.decisionCount === 3 && !details.nextScenario)) {
        const outcome = details.status === "completed"
          ? await getLearningResults(stored.id, stored.accessToken)
          : await completeLearningSession(stored.id, stored.accessToken);
        const result: SavedResult = {
          completedAt: new Date().toISOString(),
          diagnosticCorrect: outcome.diagnosticCorrect,
          transferCorrect: outcome.transferCorrect,
          totalCorrect: outcome.totalCorrect,
          answers: details.answers,
        };
        window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
        window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
        setPreviousScore(result.totalCorrect);
        setView("result");
        return;
      }
      const next = details.nextScenario?.id ? getScenarioById(details.nextScenario.id) : null;
      if (!next) throw new Error("next_scenario_missing");
      setStep(details.decisionCount + 1);
      setScenario(next);
      setScenarioStartedAt(Date.now());
      setView("scenario");
    } catch (error) {
      if (error instanceof LearningApiError && [401, 403, 404].includes(error.status)) {
        window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
        setView("intro");
      } else {
        setRetryAction("resume");
        setView("service-error");
      }
    }
  }, []);

  // Deferred to a microtask so this effect only schedules synchronization.
  // The cancellation guard prevents a duplicate restore in React Strict Mode.
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) void restoreSession();
    });
    return () => { active = false; };
  }, [restoreSession]);

  function goHome() {
    setView("intro");
    setSelected(null);
    setPendingRequestId(null);
  }

  function restartPractice() {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
    setPreviousScore(null);
    setSessionId(null);
    setSessionToken(null);
    setAnswers([]);
    goHome();
  }

  async function startAfterOnboarding(result: OnboardingResult) {
    setOnboardingResult(result);
    setView("starting");
    setRetryAction("start");
    try {
      const session = await createLearningSession(result);
      const initial = getScenarioById(session.nextScenario.id);
      if (!initial) throw new Error("scenario_not_found_in_client_catalog");
      window.sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ id: session.id, accessToken: session.accessToken }));
      setSessionId(session.id);
      setSessionToken(session.accessToken);
      setAnswers([]);
      setSelected(null);
      setPendingRequestId(null);
      setStep(1);
      setScenario(initial);
      setScenarioStartedAt(Date.now());
      setView("scenario");
    } catch {
      setView("service-error");
    }
  }

  async function submit() {
    if (!selected || !sessionId || !sessionToken || submitting) return;
    const requestId = pendingRequestId ?? window.crypto.randomUUID();
    setPendingRequestId(requestId);
    setSubmitting(true);
    setRetryAction("submit");
    try {
      const decision = await submitLearningDecision(sessionId, sessionToken, {
        requestId,
        scenarioId: scenario.id,
        choiceId: selected,
        elapsedMs: Date.now() - scenarioStartedAt,
      });
      const answer: Answer = {
        scenarioId: decision.scenarioId,
        choiceId: selected,
        correct: decision.correct,
        signal: decision.signal,
        skill: decision.skill,
        nextScenarioId: decision.nextScenario?.id ?? null,
      };
      setAnswers((current) => [...current, answer]);
      setPendingRequestId(null);
      void recordInteraction(sessionId, sessionToken, {
        requestId: window.crypto.randomUUID(),
        scenarioId: scenario.id,
        eventType: "feedback_viewed",
      });
      setView("feedback");
    } catch {
      setView("service-error");
    } finally {
      setSubmitting(false);
    }
  }

  async function continueSession() {
    const latest = answers.at(-1);
    if (!latest) return;
    if (latest.nextScenarioId) {
      const nextScenario = getScenarioById(latest.nextScenarioId);
      if (!nextScenario) {
        setRetryAction("resume");
        setView("service-error");
        return;
      }
      setScenario(nextScenario);
      setStep((current) => current + 1);
      setSelected(null);
      setScenarioStartedAt(Date.now());
      setView("scenario");
      return;
    }
    if (!sessionId || !sessionToken) return;
    setRetryAction("complete");
    try {
      const outcome = await completeLearningSession(sessionId, sessionToken);
      const result: SavedResult = {
        completedAt: new Date().toISOString(),
        diagnosticCorrect: outcome.diagnosticCorrect,
        transferCorrect: outcome.transferCorrect,
        totalCorrect: outcome.totalCorrect,
        answers,
      };
      window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
      setPreviousScore(result.totalCorrect);
      setView("result");
    } catch {
      setView("service-error");
    }
  }

  function retryServiceAction() {
    if (retryAction === "resume") void restoreSession();
    else if (retryAction === "start" && onboardingResult) void startAfterOnboarding(onboardingResult);
    else if (retryAction === "submit") void submit();
    else void continueSession();
  }

  if (view === "restoring" || view === "starting") return (
    <main className="pausa-loading-screen" role="status" aria-live="polite" aria-busy="true">
      <span className="pausa-loading-mark" aria-hidden="true" />
      <h1>{view === "starting" ? "Preparando tus escenarios" : "Recuperando tu práctica"}</h1>
      <p>{view === "starting" ? "Seleccionamos tus casos en el servidor. Solo un momento." : "Buscando tu último avance para que continúes donde quedaste."}</p>
      <span className="pausa-loading-spinner" aria-hidden="true" />
    </main>
  );
  if (view === "intro") return <IntroScreen onStart={() => setView("onboarding")} previousScore={previousScore} />;
  if (view === "onboarding") return <Onboarding onComplete={startAfterOnboarding} onHome={goHome} />;
  if (view === "result") return <ResultScreen answers={answers} onRestart={restartPractice} />;
  if (view === "service-error") return <ServiceError onRetry={retryServiceAction} onHome={goHome} />;

  return (
    <div className="app-shell">
      <Progress step={step} onHome={goHome} />
      {view === "scenario" ? (
        <ScenarioStep
          key={scenario.id}
          scenario={scenario}
          selected={selected}
          onSelect={setSelected}
          onSubmit={submit}
          submitting={submitting}
        />
      ) : (
        <FeedbackStep scenario={scenario} answer={answers.at(-1)!} onContinue={continueSession} />
      )}
    </div>
  );
}
