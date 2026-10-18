"use client";

import { AlertTriangle, ArrowRight, Check, CircleX, TrendingUp } from "lucide-react";
import type { Answer } from "@/lib/session";
import type { Scenario } from "@/lib/scenarios";
import { CompetencyRadarChart } from "./interactive-charts";

export function FeedbackStep({
  scenario,
  answer,
  onContinue,
}: {
  scenario: Scenario;
  answer: Answer;
  onContinue: () => void;
}) {
  const selected = scenario.choices.find((choice) => choice.id === answer.choiceId)!;

  // Real-time competency scores based on answer
  const dynamicScores = answer.correct
    ? { urgencia: 92, verificacion: 95, pagos: 88, identidad: 96 }
    : { urgencia: 54, verificacion: 48, pagos: 60, identidad: 70 };

  return (
    <main className="feedback-layout">
      <section className={`feedback-hero ${answer.correct ? "correct" : "needs-pause"}`}>
        <span className="feedback-icon">{answer.correct ? <Check size={32} /> : <CircleX size={32} />}</span>
        <span className="eyebrow">Análisis de tu decisión</span>
        <h1>{answer.correct ? "Hiciste una pausa útil." : "Aquí convenía hacer una pausa."}</h1>
        <p>Elegiste: <strong>{selected.label}</strong></p>

        <div className="feedback-stat-badge">
          <TrendingUp size={16} />
          <span>{answer.correct ? "+25 pts en Verificación Independiente" : "Punto ciego detectado: Urgencia artificial"}</span>
        </div>
      </section>

      <section className="learning-panel">
        <div className="explanation">
          <AlertTriangle size={22} />
          <div>
            <h2>Lo importante no era adivinar</h2>
            <p>{scenario.explanation}</p>
          </div>
        </div>

        {/* Gráfica de competencias integrada */}
        <div className="feedback-chart-wrapper">
          <CompetencyRadarChart scores={dynamicScores} />
        </div>

        <div className="signals-grid">
          {scenario.signals.map((signal, index) => (
            <article key={signal.label}>
              <span>0{index + 1}</span>
              <h3>{signal.label}</h3>
              <p>{signal.detail}</p>
            </article>
          ))}
        </div>

        <div className="rule-card">
          <span>REGLA DE ORO PAUSA</span>
          <p>
            Si el mensaje mezcla <strong>urgencia, dinero o petición de documentos</strong>, sal del chat y verifica por tu cuenta en canales oficiales.
          </p>
        </div>

        <button className="primary-button large teal" type="button" onClick={onContinue}>
          Practicar siguiente caso adaptativo <ArrowRight size={18} />
        </button>
      </section>
    </main>
  );
}
