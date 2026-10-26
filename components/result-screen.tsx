"use client";

import {
  AlertTriangle,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  XCircle,
} from "lucide-react";
import type { Answer } from "@/lib/session";
import { Brand } from "./brand";
import { getScenarioById } from "@/lib/scenarios";

export function ResultScreen({ answers, onRestart }: { answers: Answer[]; onRestart: () => void }) {
  const score = answers.filter((answer) => answer.correct).length;
  const transfer = answers[2]?.correct;

  const caseDetails = answers.map((answer, index) => {
    const scenario = getScenarioById(answer.scenarioId);
    return {
      num: String(index + 1).padStart(2, "0"),
      name: ["Diagnóstico inicial", "Práctica adaptativa", "Prueba de transferencia"][index],
      pattern: scenario?.topic ?? "Caso de entrenamiento",
      trap: scenario?.goal === "empleo" ? "Seguridad laboral" : scenario?.goal === "dinero" ? "Protección del dinero" : "Identidad y privacidad",
      passed: answer.correct,
      signal: answer.signal,
      explanation: scenario?.explanation ?? "Verifica siempre por un canal independiente.",
    };
  });
  const bySignal: Record<string, string> = {
    pago: "Evita realizar cobros o anticipos sin verificar a quien recibe el dinero.",
    datos: "Antes de entregar documentos o códigos, confirma la identidad y finalidad de quien los solicita.",
    canal: "Busca una fuente independiente del remitente; no confíes únicamente en el mensaje.",
    urgencia: "El plazo del mensaje no te obliga a decidir antes de comprobar el contexto.",
  };
  const missed = caseDetails.filter((item) => !item.passed);
  const evaluation = {
    level: score === 3 ? "perfect" : score === 2 ? "good" : score === 1 ? "warning" : "critical",
    icon: score === 3 ? <ShieldCheck size={26} /> : score === 2 ? <CheckCircle2 size={26} /> : score === 1 ? <ShieldAlert size={26} /> : <XCircle size={26} />,
    eyebrow: `${score} de 3 decisiones evaluadas como seguras`,
    title: score === 3 ? "Aplicaste un criterio sólido en los tres escenarios." : score === 2 ? "Hay una habilidad por fortalecer." : score === 1 ? "Tu próxima pausa puede marcar la diferencia." : "Este es un espacio seguro para practicar y mejorar.",
    summary: `Realizaste ${score} de 3 decisiones seguras en casos simulados. ${transfer ? "Aplicaste el criterio en la prueba de transferencia." : "Conviene reforzar la prueba de transferencia."}`,
    diagnosis: missed.length ? missed.map((item) => bySignal[item.signal] ?? item.explanation).filter((text, index, arr) => arr.indexOf(text) === index).join(" ") : "En esta sesión contrastaste la información antes de actuar. Repite con casos distintos para entrenar otros patrones.",
  };
  const cases = caseDetails;
  const competencies = caseDetails.map((item) => ({
    name: item.pattern,
    desc: item.explanation,
    passed: item.passed,
    icon: item.signal === "pago" ? <CreditCard size={15} /> : item.signal === "urgencia" ? <Clock size={15} /> : <Search size={15} />,
  }));

  return (
    <div className="result-viewport-container">
      <nav className="landing-nav">
        <Brand onClick={onRestart} />
        <span className="session-label">Práctica completada · Informe de desempeño</span>
      </nav>

      <div className="result-main-area">
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
                <h3>Decisiones evaluadas en tu recorrido</h3>
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

              {/* Matriz de Habilidades Demostradas */}
              <div className="rex-competency-card">
                <span className="rcc-title">Matriz de criterio demostrada</span>
                <div className="rcc-grid">
                  {competencies.map((comp) => (
                    <div key={comp.name} className={`rcc-item ${comp.passed ? "mastered" : "needs-work"}`}>
                      <div className="rcc-icon-slot">{comp.icon}</div>
                      <div className="rcc-item-body">
                        <div className="rcc-item-top">
                          <strong>{comp.name}</strong>
                          <span className={`rcc-status-tag ${comp.passed ? "ok" : "warn"}`}>
                            {comp.passed ? "Demostrado" : "Por entrenar"}
                          </span>
                        </div>
                        <p>{comp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  Antes de actuar ante un mensaje digital, evalúa <strong>el contexto y la acción solicitada</strong>. Usa canales independientes para comprobarlo y no compartas información sensible sin una justificación verificable.
                </p>
              </div>

              <div className="rex-learning-notice">
                <span className="rln-dot" />
                <span>
                  El criterio se fortalece con la práctica periódica. Esta sesión entrena tu reflejo de alerta, pero la verificación independiente es tu defensa permanente.
                </span>
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
    </div>
  );
}
