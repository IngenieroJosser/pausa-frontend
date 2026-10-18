"use client";

import { useState } from "react";
import { CheckCheck, LockKeyhole, Sparkles, AlertTriangle, Eye, CreditCard, Clock, FileText, Lightbulb, ShieldCheck } from "lucide-react";
import type { Scenario, ScenarioSignal } from "@/lib/scenarios";

type Props = {
  scenario: Scenario;
  allowInspection?: boolean;
};

export function ChatCard({ scenario, allowInspection = true }: Props) {
  // El inspector inicia activo tal como en el mockup de referencia del usuario
  const [inspectorActive, setInspectorActive] = useState(true);
  const [selectedClueIndex, setSelectedClueIndex] = useState<number | null>(null);

  const clues: ScenarioSignal[] = scenario.signals;

  const getClueIcon = (color?: string) => {
    switch (color) {
      case "coral":
        return <CreditCard size={15} />;
      case "amber":
        return <Clock size={15} />;
      case "purple":
        return <FileText size={15} />;
      default:
        return <AlertTriangle size={15} />;
    }
  };

  const renderMessageContent = (text: string) => {
    // Si el inspector no está activo, renderizar texto plano
    if (!inspectorActive) {
      return text;
    }

    // Para el escenario diagnóstico principal, segmentar las frases clave del diseño
    if (scenario.id === "oferta-auxiliar") {
      if (text.includes("vimos tu hoja de vida")) {
        return (
          <>
            Hola,{" "}
            <span
              className={`chat-clue-highlight coral${selectedClueIndex === 0 ? " focused" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === 0 ? null : 0);
              }}
            >
              vimos tu hoja de vida
              <span className="clue-pin coral" title="Pista: Gancho de confianza" />
            </span>
            . Fuiste preseleccionado para Auxiliar Logístico. Salario: $2.400.000 + beneficios.
          </>
        );
      }

      if (text.includes("pagar hoy")) {
        return (
          <>
            Para separar el cupo debes{" "}
            <span
              className={`chat-clue-highlight amber${selectedClueIndex === 1 ? " focused" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === 1 ? null : 1);
              }}
            >
              pagar hoy
              <span className="clue-pin amber" title="Pista: Urgencia y pago inmediato" />
            </span>{" "}
            $48.000 del examen médico. Envíanos{" "}
            <span
              className={`chat-clue-highlight purple${selectedClueIndex === 2 ? " focused" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === 2 ? null : 2);
              }}
            >
              foto de tu cédula
              <span className="clue-pin purple" title="Pista: Captura de datos personales" />
            </span>{" "}
            y el comprobante por aquí.
          </>
        );
      }
    }

    // Para otros escenarios adaptativos, destacar si coincide con la frase objetivo
    for (let i = 0; i < clues.length; i++) {
      const clue = clues[i];
      if (clue.targetPhrase && text.includes(clue.targetPhrase)) {
        const parts = text.split(clue.targetPhrase);
        const colorClass = clue.color || "coral";
        return (
          <>
            {parts[0]}
            <span
              className={`chat-clue-highlight ${colorClass}${selectedClueIndex === i ? " focused" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === i ? null : i);
              }}
            >
              {clue.targetPhrase}
              <span className={`clue-pin ${colorClass}`} />
            </span>
            {parts.slice(1).join(clue.targetPhrase)}
          </>
        );
      }
    }

    return text;
  };

  return (
    <section className="chat-card" aria-label={`Conversación interactiva con ${scenario.sender}`}>
      {/* Encabezado del Chat estilo aplicación de mensajería con modo inspector */}
      <header className="chat-header">
        <span className="chat-avatar">{scenario.avatar}</span>
        <div className="chat-contact">
          <strong>{scenario.sender}</strong>
          <small>cuenta de empresa · no verificada</small>
        </div>

        {allowInspection && (
          <button
            type="button"
            className={`inspector-toggle-btn${inspectorActive ? " active" : ""}`}
            onClick={() => {
              setInspectorActive(!inspectorActive);
              setSelectedClueIndex(null);
            }}
            title="Activar/desactivar inspector de pistas"
            aria-pressed={inspectorActive}
          >
            <Eye size={15} />
            <span>{inspectorActive ? "Inspector activo" : "Explorar pistas"}</span>
          </button>
        )}
      </header>

      {/* Modo Inspector de Pistas — Bandeja Superior con 3 Tarjetas de Indicios */}
      {inspectorActive && (
        <div className="inspector-mode-panel">
          <div className="imp-heading">
            <div className="imp-title-row">
              <Sparkles size={16} className="imp-sparkle-icon" />
              <h4>Modo Inspector de Pistas: Toca una pista para desarmar el mensaje</h4>
            </div>
            <p>Estos son los indicios más comunes en este tipo de fraudes. Explóralos en el mensaje.</p>
          </div>

          <div className="clue-cards-grid">
            {clues.map((clue, idx) => {
              const color = clue.color || (idx === 0 ? "coral" : idx === 1 ? "amber" : "purple");
              const isSelected = selectedClueIndex === idx;

              return (
                <button
                  key={clue.label}
                  type="button"
                  className={`clue-card-item ${color}${isSelected ? " active" : ""}`}
                  onClick={() => setSelectedClueIndex(isSelected ? null : idx)}
                >
                  <div className="cci-top">
                    <span className={`cci-badge-pill ${color}`}>
                      {getClueIcon(color)}
                      <strong>Pista {idx + 1}:</strong>
                    </span>
                  </div>
                  <strong className="cci-label">{clue.label}</strong>
                  <p className="cci-detail">{clue.detail}</p>
                </button>
              );
            })}
          </div>

          {selectedClueIndex !== null && (
            <div className="clue-active-callout">
              <div className="cac-header">
                <span className={`cac-indicator ${clues[selectedClueIndex].color || "coral"}`} />
                <strong>Pista {selectedClueIndex + 1}: {clues[selectedClueIndex].label}</strong>
              </div>
              <p>{clues[selectedClueIndex].detail}</p>
            </div>
          )}
        </div>
      )}

      {/* Aviso de Simulación Didáctica */}
      <div className="encryption-note">
        <LockKeyhole size={13} />
        <span>Mensajes simulados para esta práctica interactiva</span>
      </div>

      {/* Cuerpo de la Conversación con Burbujas y Pines de Señales */}
      <div className="chat-body">
        {scenario.messages.map((message, index) => (
          <div
            className={`message${inspectorActive ? " message-inspectable" : ""}`}
            key={message}
          >
            <p className="message-content">{renderMessageContent(message)}</p>
            <span className="message-meta">
              {index === scenario.messages.length - 1 ? scenario.time : "10:41 a. m."}{" "}
              <CheckCheck size={14} className="message-check-icon" />
            </span>
          </div>
        ))}
      </div>

      {/* Pie Exploratorio con Guía de Interacción */}
      {inspectorActive && (
        <footer className="chat-footer-guide">
          <div className="cfg-pill">
            <Lightbulb size={18} className="cfg-icon" />
            <div className="cfg-text">
              <strong>Explora el mensaje</strong>
              <small>Toca los puntos de colores para ver por qué son señales de alerta.</small>
            </div>
          </div>
          <div className="cfg-dots-cluster" aria-hidden="true">
            <span className="cfg-dot coral" />
            <span className="cfg-dot amber" />
            <span className="cfg-dot purple" />
          </div>
        </footer>
      )}
    </section>
  );
}
