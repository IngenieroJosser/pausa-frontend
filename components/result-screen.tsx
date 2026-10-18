"use client";

import { AlertTriangle, CheckCircle2, RotateCcw, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import type { Answer } from "@/lib/session";
import { Brand } from "./brand";

export function ResultScreen({ answers, onRestart }: { answers: Answer[]; onRestart: () => void }) {
  const score = answers.filter((answer) => answer.correct).length;
  const diagnostic = answers[0]?.correct;
  const adaptive = answers[1]?.correct;
  const transfer = answers[2]?.correct;

  // Real, honest evaluation tiers based strictly on the user's performance
  const evaluation = (() => {
    if (score === 3) {
      return {
        level: "perfect",
        icon: <ShieldCheck size={26} />,
        eyebrow: "Criterio preventivo sólido · 3 de 3 decisiones seguras",
        title: "Demostraste un criterio de defensa impecable.",
        summary: "No cediste ante la urgencia artificial ni realizaste transferencias en ninguno de los escenarios simulados.",
        diagnosis: "Identificaste correctamente que ningún proceso laboral legítimo exige pagos anticipados ni fotos de cédula por mensajería. Supiste salir del canal y verificar por tu cuenta.",
      };
    }
    if (score === 2) {
      return {
        level: "good",
        icon: <CheckCircle2 size={26} />,
        eyebrow: "Criterio en consolidación · 2 de 3 decisiones seguras",
        title: "Buen nivel de prevención con un punto ciego por ajustar.",
        summary: "Hiciste pausas oportunas en la mayoría de los casos, pero en una situación la presión o el cobro generó fricción.",
        diagnosis: "El atacante logró generar duda mediante urgencia o aparentando formalidad. Recuerda: cualquier presión de 'hoy mismo' o pago previo es señal automática de alerta.",
      };
    }
    if (score === 1) {
      return {
        level: "warning",
        icon: <ShieldAlert size={26} />,
        eyebrow: "Criterio vulnerable · 1 de 3 decisiones seguras",
        title: "La urgencia artificial vulneró tu criterio en 2 casos.",
        summary: "Identificaste 1 punto crítico, pero en 2 escenarios la presión del mensaje te indujo a actuar sin verificación independiente.",
        diagnosis: "En una situación real habrías entregado dinero o datos personales. Los estafadores explotan la esperanza de empleo para nublar el criterio.",
      };
    }
    return {
      level: "critical",
      icon: <XCircle size={26} />,
      eyebrow: "Diagnóstico inicial · 0 de 3 decisiones seguras",
      title: "Cediste ante la trampa en los 3 escenarios simulados.",
      summary: "En la práctica real habrías transferido dinero o entregado tu cédula. El valor de este simulador es equivocarse aquí y no con tu patrimonio.",
      diagnosis: "Caíste en los 3 patrones clásicos: cobro de exámenes médicos, plazos inmediatos forzados ('hoy') y enlaces fraudulentos de validación. La urgencia siempre es una bandera roja.",
    };
  })();

  const cases = [
    {
      num: "01",
      name: "Diagnóstico inicial",
      pattern: "Falso Reclutamiento",
      trap: "Cobro previo de examen médico",
      passed: diagnostic,
    },
    {
      num: "02",
      name: "Práctica adaptativa",
      pattern: "Presión de Urgencia",
      trap: "Plazo inmediato para asegurar cupo",
      passed: adaptive,
    },
    {
      num: "03",
      name: "Prueba de transferencia",
      pattern: "Validación de Canal",
      trap: "Enlace o número recibido en el chat",
      passed: transfer,
    },
  ];

  return (
    <div className="result-viewport-container">
      <nav className="landing-nav">
        <Brand onClick={onRestart} />
        <span className="session-label">Práctica completada · Informe de desempeño</span>
      </nav>

      <main className="result-expanded-card">
        {/* Executive Header Banner — Dynamically styled by score level */}
        <header className={`rex-header-banner ${evaluation.level}`}>
          <div className="rex-icon-mark">{evaluation.icon}</div>
          <div className="rex-header-info">
            <span className="rex-eyebrow">{evaluation.eyebrow}</span>
            <h1>{evaluation.title}</h1>
            <p>{evaluation.summary}</p>
          </div>
          <div className="rex-score-badge">
            <strong>{score} / 3</strong>
            <span>Decisiones seguras</span>
          </div>
        </header>

        {/* 2-Panel Widescreen Body: Real Decisions Breakdown on Left, Diagnostic Pedagogy on Right */}
        <div className="rex-body-grid">
          {/* Left Panel: Real Cases Breakdown */}
          <section className="rex-panel-cases">
            <div className="rex-section-title-row">
              <h3>Desglose de tus decisiones en la sesión</h3>
              <span className="rex-score-pill">{score} de 3 casos superados</span>
            </div>

            <div className="rex-cases-stack">
              {cases.map((c) => (
                <div key={c.num} className={`rex-case-row ${c.passed ? "passed" : "missed"}`}>
                  <div className="rcr-status-icon">
                    {c.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div className="rcr-content">
                    <div className="rcr-heading">
                      <span className="rcr-num">Caso {c.num}</span>
                      <strong className="rcr-name">{c.name}</strong>
                    </div>
                    <div className="rcr-meta">
                      <span className="rcr-pattern">{c.pattern}</span>
                      <span className="rcr-dot">·</span>
                      <span className="rcr-trap">{c.trap}</span>
                    </div>
                  </div>
                  <div className={`rcr-verdict-pill ${c.passed ? "passed" : "missed"}`}>
                    {c.passed ? "Pausa segura" : "Fricción detectada"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Panel: Honest Diagnostic & Golden Rule */}
          <section className="rex-panel-learnings">
            <div className="rex-diagnosis-card">
              <div className="rdc-title-row">
                <ShieldAlert size={16} />
                <strong>Diagnóstico pedagógico de tu sesión</strong>
              </div>
              <p>{evaluation.diagnosis}</p>
            </div>

            <div className="rex-golden-rule-card">
              <div className="rgr-title-row">
                <ShieldCheck size={16} />
                <strong>Principio para tu día a día: Regla de Oro PAUSA</strong>
              </div>
              <p>
                Ante cualquier mensaje que mezcle <strong>urgencia, dinero o petición de documentos</strong>:
                nunca resuelvas desde el enlace o número recibido. Sal del chat y verifica por tu cuenta en la web o app oficial.
              </p>
            </div>

            <footer className="rex-action-footer">
              <button className="primary-button large teal rex-restart-btn" type="button" onClick={onRestart}>
                <RotateCcw size={17} />
                <span>Comenzar nueva práctica adaptativa</span>
              </button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
