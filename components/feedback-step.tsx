"use client";

import { AlertTriangle, ArrowRight, Check, CircleX, MessageSquare, ShieldCheck, User } from "lucide-react";
import type { Answer } from "@/lib/session";
import type { Scenario } from "@/lib/scenarios";

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

  return (
    <div className="feedback-viewport-container">
      <main className="feedback-expanded-card">
        {/* Executive Feedback Header */}
        <header className={`fbx-header-bar ${answer.correct ? "correct" : "needs-pause"}`}>
          <div className="fbx-status-group">
            <span className="fbx-icon-badge">
              {answer.correct ? <Check size={20} /> : <CircleX size={20} />}
            </span>
            <div className="fbx-title-group">
              <span className="fbx-eyebrow">Análisis de tu decisión</span>
              <h2>{answer.correct ? "Hiciste una pausa útil." : "Aquí convenía hacer una pausa."}</h2>
            </div>
          </div>

          <div className="fbx-meta-group">
            <div className="fbx-choice-tag">
              <span className="fct-label">Elegiste:</span>
              <strong className="fct-val">{selected.label}</strong>
            </div>
            <div className={`fbx-insight-badge ${answer.correct ? "correct" : "needs-pause"}`}>
              <ShieldCheck size={14} />
              <span>
                {answer.correct
                  ? "Criterio correcto: Salir del chat y verificar"
                  : "Punto ciego detectado: Urgencia artificial"}
              </span>
            </div>
          </div>
        </header>

        {/* 2-Panel Widescreen Body: Scenario Context on Left, Pedagogy on Right */}
        <div className="fbx-body-grid">
          {/* Left Panel: The Scenario you just faced */}
          <section className="fbx-panel-context">
            <div className="fbx-section-header">
              <MessageSquare size={14} />
              <span>Contexto del mensaje que analizaste</span>
            </div>

            <div className="fbx-chat-bubble-card">
              <div className="fbx-sender-row">
                <span className="fbx-sender-avatar">
                  {scenario.avatar || <User size={13} />}
                </span>
                <div className="fbx-sender-info">
                  <strong>{scenario.sender}</strong>
                  <small>{scenario.time || "Remitente no verificado"}</small>
                </div>
              </div>
              <div className="fbx-messages-preview-list">
                {scenario.messages.map((msg, idx) => (
                  <p key={idx} className="fbx-message-preview">«{msg}»</p>
                ))}
              </div>
            </div>

            <div className="fbx-golden-rule-card">
              <div className="fgr-header">
                <ShieldCheck size={15} />
                <span>REGLA DE ORO PAUSA</span>
              </div>
              <p>
                Si el mensaje mezcla <strong>urgencia, dinero o petición de documentos</strong>, sal del chat y verifica por tu cuenta en canales oficiales.
              </p>
            </div>
          </section>

          {/* Right Panel: Pedagogy & Signals */}
          <section className="fbx-panel-analysis">
            <div className="fbx-explanation-card">
              <div className="fec-top">
                <AlertTriangle size={15} className="fec-alert-icon" />
                <h3>Lo importante no era adivinar</h3>
              </div>
              <p className="fec-text">{scenario.explanation}</p>
            </div>

            <div className="fbx-signals-card">
              <span className="fsc-header-label">Señales de alerta detectadas en este caso</span>
              <div className="fsc-signals-list">
                {scenario.signals.map((signal, index) => (
                  <div key={signal.label} className="fsc-signal-item">
                    <span className="fsc-index">0{index + 1}</span>
                    <div className="fsc-item-body">
                      <strong>{signal.label}</strong>
                      <p>{signal.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="fbx-action-footer">
              <button className="primary-button large teal fbx-submit-btn" type="button" onClick={onContinue}>
                <span>Practicar siguiente caso adaptativo</span>
                <ArrowRight size={17} />
              </button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
