"use client";

import { useEffect, useState } from "react";
import { diagnosticScenario, getAdaptiveScenario, transferScenario, type Scenario } from "@/lib/scenarios";
import { evaluateAnswer, primaryPracticeSignal, RESULT_STORAGE_KEY, type Answer, type SavedResult } from "@/lib/session";
import { FeedbackStep } from "./feedback-step";
import { IntroScreen } from "./intro-screen";
import { Onboarding, type OnboardingResult } from "./onboarding";
import { Progress } from "./progress";
import { ResultScreen } from "./result-screen";
import { ScenarioStep } from "./scenario-step";

type View = "intro" | "onboarding" | "scenario" | "feedback" | "result";

export function PausaExperience() {
  const [view, setView] = useState<View>("intro");
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState<Scenario>(diagnosticScenario);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [onboardingResult, setOnboardingResult] = useState<OnboardingResult | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(RESULT_STORAGE_KEY);
    if (saved) setPreviousScore((JSON.parse(saved) as SavedResult).totalCorrect);
  }, []);

  /* Landing → Onboarding */
  function goToOnboarding() {
    setView("onboarding");
  }

  /* Onboarding complete → first scenario */
  function startAfterOnboarding(result: OnboardingResult) {
    setOnboardingResult(result);
    setAnswers([]);
    setSelected(null);
    setStep(1);
    setScenario(diagnosticScenario);
    setView("scenario");
  }

  /* Skip onboarding — direct start */
  function startDirect() {
    setOnboardingResult(null);
    setAnswers([]);
    setSelected(null);
    setStep(1);
    setScenario(diagnosticScenario);
    setView("scenario");
  }

  function submit() {
    if (!selected) return;
    const answer = evaluateAnswer(scenario, selected);
    setAnswers((current) => [...current, answer]);
    setView("feedback");
  }

  function continueSession() {
    const latest = answers.at(-1)!;
    if (step === 1) {
      setScenario(getAdaptiveScenario(primaryPracticeSignal(latest)));
      setStep(2);
      setSelected(null);
      setView("scenario");
      return;
    }
    if (step === 2) {
      setScenario(transferScenario);
      setStep(3);
      setSelected(null);
      setView("scenario");
      return;
    }

    const result: SavedResult = {
      completedAt: new Date().toISOString(),
      diagnosticCorrect: answers[0].correct,
      transferCorrect: answers[2].correct,
      totalCorrect: answers.filter((answer) => answer.correct).length,
    };
    window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
    setPreviousScore(result.totalCorrect);
    setView("result");
  }

  if (view === "intro") {
    return <IntroScreen onStart={goToOnboarding} previousScore={previousScore} />;
  }

  if (view === "onboarding") {
    return (
      <Onboarding
        onComplete={startAfterOnboarding}
        onHome={() => setView("intro")}
      />
    );
  }

  if (view === "result") {
    return <ResultScreen answers={answers} onRestart={() => setView("intro")} />;
  }

  return (
    <div className="app-shell">
      <Progress step={step} onHome={() => setView("intro")} />
      {view === "scenario" ? (
        <ScenarioStep scenario={scenario} selected={selected} onSelect={setSelected} onSubmit={submit} />
      ) : (
        <FeedbackStep scenario={scenario} answer={answers.at(-1)!} onContinue={continueSession} />
      )}
    </div>
  );
}
