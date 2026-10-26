"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleX,
  Clock,
  Compass,
  CreditCard,
  ExternalLink,
  Lock,
  MessageSquare,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  UserX,
  XCircle,
} from "lucide-react";
import type { Answer } from "@/lib/session";
import type { Scenario } from "@/lib/scenarios";

type ConsequenceTrack = "riesgo" | "pausa";

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
  // Default to showing the risk track if the user made an unsafe choice, or PAUSA if they paused
  const [activeTrack, setActiveTrack] = useState<ConsequenceTrack>(
    answer.correct ? "pausa" : "riesgo"
  );

  const riskSequence = [
    {
      step: "01", icon: <CreditCard size={15} />,
      title: "Decidir sin comprobar",
      desc: "Actuar solamente con la información del mensaje puede dejar datos, dinero o cuentas expuestos si el remitente no es legítimo.",
      tag: "Primer riesgo",
    },
    {
      step: "02", icon: <UserX size={15} />,
      title: "Perder el control de la situación",
      desc: "Compartir información o realizar una operación antes de verificar puede ser difícil de revertir.",
      tag: "Efecto potencial",
    },
    {
      step: "03", icon: <AlertTriangle size={15} />,
      title: "Detectar a tiempo importa",
      desc: "Una pausa y una confirmación independiente ayudan a reducir la posibilidad de tomar decisiones equivocadas.",
      tag: "Aprendizaje",
    },
  ];

  const pausaSequence = [
    {
      step: "01", icon: <Clock size={15} />,
      title: "Entender antes de actuar",
      desc: "Separa los datos comprobables de las afirmaciones, emociones y plazos del mensaje.",
      tag: "Pausa",
    },
    {
      step: "02", icon: <Search size={15} />,
      title: "Comprobación independiente",
      desc: "Abre por tu cuenta el portal, aplicación o contacto habitual para contrastar lo recibido.",
      tag: "Verificación",
    },
    {
      step: "03", icon: <ShieldCheck size={15} />,
      title: "Decisión proporcional",
      desc: "Continúa si el contexto es consistente y justificado; detente si detectas solicitudes sensibles o cobros injustificados.",
      tag: "Criterio",
    },
  ];

  const currentSequence = activeTrack === "riesgo" ? riskSequence : pausaSequence;

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
              <span className="fbx-eyebrow">Diagnóstico de tu decisión</span>
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
                  ? "Criterio aplicado: evaluar y verificar"
                  : "Punto por mejorar: verificar antes de actuar"}
              </span>
            </div>
          </div>
        </header>

        {/* 2-Panel Widescreen Body: Scenario Context on Left, Consequence & Pedagogy on Right */}
        <div className="fbx-body-grid">
          {/* Left Panel: The Scenario you just faced */}
          <section className="fbx-panel-context">
            <div className="fbx-section-header">
              <MessageSquare size={13} />
              <span>Contexto del mensaje analizado</span>
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
                <strong>{scenario.explanation}</strong>
              </p>
            </div>
          </section>

          {/* Right Panel: Consequence Bifurcation & Adaptive Action */}
          <section className="fbx-panel-analysis">
            {/* Visual Consequence Sequencer */}
            <div className="fcs-consequence-card">
              <div className="fcs-header-nav">
                <span className="fcs-eyebrow">Bifurcación de consecuencias</span>
                <div className="fcs-track-switch" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTrack === "riesgo"}
                    className={`fcs-tab-btn risk${activeTrack === "riesgo" ? " active" : ""}`}
                    onClick={() => setActiveTrack("riesgo")}
                  >
                    <ShieldAlert size={13} />
                    <span>Riesgo potencial</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTrack === "pausa"}
                    className={`fcs-tab-btn safe${activeTrack === "pausa" ? " active" : ""}`}
                    onClick={() => setActiveTrack("pausa")}
                  >
                    <ShieldCheck size={13} />
                    <span>Efecto PAUSA</span>
                  </button>
                </div>
              </div>

              {/* 3-Step Illustrated Sequence */}
              <div className={`fcs-sequence-deck ${activeTrack}`}>
                {currentSequence.map((item, idx) => (
                  <div key={item.step} className="fcs-step-cell">
                    <div className="fsc-cell-top">
                      <span className="fsc-num-tag">{item.step}</span>
                      <span className="fsc-badge-tag">{item.tag}</span>
                    </div>
                    <strong className="fsc-step-title">{item.title}</strong>
                    <p className="fsc-step-desc">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="fcs-pedagogy-note">
                <span className="fcs-note-dot" />
                <span>Estas consecuencias son hipotéticas y educativas; no describen acciones ocurridas realmente.</span>
              </div>
            </div>

            {/* Signals detected */}
            <div className="fbx-signals-card">
              <span className="fsc-header-label">Qué conviene observar en este caso</span>
              <div className="fsc-signals-list compact">
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
                <span>Continuar mi entrenamiento</span>
                <ArrowRight size={17} />
              </button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
