"use client";

import { useEffect, useState } from "react";
import { completeLearningSession, createLearningSession, recordInteraction, submitLearningDecision } from "@/lib/learning-api";
import { diagnosticScenario, getScenarioById, type Scenario } from "@/lib/scenarios";
import { RESULT_STORAGE_KEY, type Answer, type SavedResult } from "@/lib/session";
import { FeedbackStep } from "./feedback-step";
import { IntroScreen } from "./intro-screen";
import { Onboarding, type OnboardingResult } from "./onboarding";
import { Progress } from "./progress";
import { ResultScreen } from "./result-screen";
import { ScenarioStep } from "./scenario-step";
import { ServiceError } from "./service-error";

type View = "intro" | "onboarding" | "scenario" | "feedback" | "result" | "service-error";
type RetryAction = "start" | "submit" | "complete";

export function PausaExperience() {
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
  const [retryAction, setRetryAction] = useState<RetryAction>("start");
  const [scenarioStartedAt, setScenarioStartedAt] = useState(() => Date.now());

  useEffect(() => {
    // Los datos locales pueden haber sido borrados, editados o quedar incompletos.
    // Nunca permitimos que un informe corrupto bloquee el recorrido inicial.
    try {
      const saved = window.localStorage.getItem(RESULT_STORAGE_KEY);
      if (!saved) return;
      const result = JSON.parse(saved) as SavedResult;
      if (!Number.isInteger(result.totalCorrect) || !Array.isArray(result.answers)) return;
      setPreviousScore(result.totalCorrect);
      if (result.answers.length === 3) {
        setAnswers(result.answers);
        setView("result");
      }
    } catch {
      window.localStorage.removeItem(RESULT_STORAGE_KEY);
    }
  }, []);

  function goHome() {
    setView("intro");
    setSelected(null);
    setPendingRequestId(null);
  }

  function restartPractice() {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    setPreviousScore(null);
    setAnswers([]);
    goHome();
  }

  async function startAfterOnboarding(result: OnboardingResult) {
    setOnboardingResult(result);
    setRetryAction("start");
    try {
      const session = await createLearningSession(result);
      setSessionId(session.id);
      setSessionToken(session.accessToken);
      setAnswers([]);
      setSelected(null);
      setPendingRequestId(null);
      setStep(1);
      setScenario(getScenarioById(session.nextScenario.id) ?? diagnosticScenario);
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
      if (!nextScenario) return;
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
      setPreviousScore(result.totalCorrect);
      setView("result");
    } catch {
      setView("service-error");
    }
  }

  function retryServiceAction() {
    if (retryAction === "start" && onboardingResult) void startAfterOnboarding(onboardingResult);
    else if (retryAction === "submit") void submit();
    else void continueSession();
  }

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
