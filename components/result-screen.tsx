"use client";

import { ArrowRight, CalendarClock, Check, RotateCcw, ShieldCheck, TrendingUp } from "lucide-react";
import type { Answer } from "@/lib/session";
import { Brand } from "./brand";
import { ChannelRiskChart, CompetencyRadarChart } from "./interactive-charts";

export function ResultScreen({ answers, onRestart }: { answers: Answer[]; onRestart: () => void }) {
  const score = answers.filter((answer) => answer.correct).length;
  const diagnostic = answers[0]?.correct ? 1 : 0;
  const transfer = answers[2]?.correct ? 1 : 0;
  const improved = transfer > diagnostic;

  const finalScores = {
    urgencia: Math.round(55 + (score / 3) * 40),
    verificacion: Math.round(50 + (transfer ? 45 : 20)),
    pagos: Math.round(60 + (score > 1 ? 35 : 15)),
    identidad: Math.round(65 + (diagnostic ? 30 : 10)),
  };

  return (
    <main className="result-page">
      <nav className="landing-nav">
        <Brand />
        <span className="session-label">Práctica completada · Análisis Gurwi</span>
      </nav>

      <section className="result-hero">
        <span className="completion-mark"><Check size={32} /></span>
        <span className="eyebrow">Resultado observable demostrado</span>
        <h1>{improved ? "Tomaste una decisión mejor fundamentada." : transfer ? "Sostuviste una decisión segura." : "Ya sabes dónde hacer la próxima pausa."}</h1>
        <p>Esto es aprendizaje activo demostrado durante la sesión, no una promesa teórica ni una garantía pasiva frente a fraudes.</p>
      </section>

      <div className="result-dashboard">
        <div className="result-main-col">
          <section className="score-panel">
            <div className="score-panel-header">
              <span>Evolución de tu criterio en la sesión</span>
              <small>Comparativa entre tu primer caso y el caso nuevo de transferencia</small>
            </div>
            <div className="score-comparison">
              <article>
                <span>Caso inicial</span>
                <strong>{diagnostic}/1</strong>
                <small>{diagnostic ? "Decisión acertada" : "Fricción detectada"}</small>
              </article>
              <ArrowRight className="score-arrow" size={28} />
              <article className="highlight">
                <span>Transferencia</span>
                <strong>{transfer}/1</strong>
                <small>{transfer ? "Aplicado con éxito" : "Por consolidar"}</small>
              </article>
            </div>
            <div className="score-total-bar">
              <span>Rendimiento general de la sesión:</span>
              <strong>{score} de 3 decisiones correctas</strong>
            </div>
          </section>

          {/* Gurwi Radar Chart Component */}
          <CompetencyRadarChart scores={finalScores} />
        </div>

        <div className="result-side-cards">
          <section className="skill-earned-card">
            <div className="sec-header">
              <ShieldCheck size={24} />
              <div>
                <span>Criterio entrenado</span>
                <h3>Canal de verificación independiente</h3>
              </div>
            </div>
            <p>
              Cuando recibes un mensaje alarmante o prometedor, nunca resuelvas desde el enlace o número provisto por el mensaje.
              Busca por tu cuenta la aplicación, sitio o línea oficial.
            </p>
          </section>

          <section className="next-action-card">
            <div className="nac-header">
              <CalendarClock size={24} />
              <div>
                <span>Regla de oro para tu día a día</span>
                <h3>Antes de compartir datos o pagar: Haz una pausa</h3>
              </div>
            </div>
            <p>
              La urgencia forzada es la primera señal de manipulación. Un trámite real permite verificar sin amenazas de bloqueo en minutos.
            </p>
          </section>

          {/* Channel Risk Breakdown Chart */}
          <ChannelRiskChart />
        </div>
      </div>

      <div className="result-actions">
        <button className="primary-button large teal" type="button" onClick={onRestart}>
          <RotateCcw size={18} /> Practicar otro escenario adaptativo
        </button>
      </div>
    </main>
  );
}
