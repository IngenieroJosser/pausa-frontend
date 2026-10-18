"use client";

import { useState } from "react";
import { CheckCheck, LockKeyhole, Sparkles, Eye, CreditCard, Clock, FileText, Lightbulb, ShieldAlert, X } from "lucide-react";
import type { Scenario, ScenarioSignal } from "@/lib/scenarios";

type Props = {
  scenario: Scenario;
  allowInspection?: boolean;
};

export function ChatCard({ scenario, allowInspection = true }: Props) {
  const [inspectorActive, setInspectorActive] = useState(true);
  const [selectedClueIndex, setSelectedClueIndex] = useState<number | null>(null);

  const clues: ScenarioSignal[] = scenario.signals;

  const getClueIcon = (color?: string) => {
    switch (color) {
      case "coral":
        return <CreditCard size={13} />;
      case "amber":
        return <Clock size={13} />;
      case "purple":
        return <FileText size={13} />;
      default:
        return <ShieldAlert size={13} />;
    }
  };

  const renderMessageContent = (text: string) => {
    if (!inspectorActive) {
      return text;
    }

    // Segmentación tipográfica limpia sin cajas chillonas ni puntos parpadeantes
    if (scenario.id === "oferta-auxiliar") {
      if (text.includes("vimos tu hoja de vida")) {
        return (
          <>
            Hola,{" "}
            <span
              className={`editorial-clue-target${selectedClueIndex === 0 ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === 0 ? null : 0);
              }}
              title="Indicio 1: Gancho de confianza"
            >
              vimos tu hoja de vida
              <sup className="clue-tag-num">1</sup>
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
              className={`editorial-clue-target${selectedClueIndex === 1 ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === 1 ? null : 1);
              }}
              title="Indicio 2: Urgencia y pago inmediato"
            >
              pagar hoy
              <sup className="clue-tag-num">2</sup>
            </span>{" "}
            $48.000 del examen médico. Envíanos{" "}
            <span
              className={`editorial-clue-target${selectedClueIndex === 2 ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === 2 ? null : 2);
              }}
              title="Indicio 3: Captura de datos personales"
            >
              foto de tu cédula
              <sup className="clue-tag-num">3</sup>
            </span>{" "}
            y el comprobante por aquí.
          </>
        );
      }
    }

    // Para otros escenarios adaptativos
    for (let i = 0; i < clues.length; i++) {
      const clue = clues[i];
      if (clue.targetPhrase && text.includes(clue.targetPhrase)) {
        const parts = text.split(clue.targetPhrase);
        return (
          <>
            {parts[0]}
            <span
              className={`editorial-clue-target${selectedClueIndex === i ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedClueIndex(selectedClueIndex === i ? null : i);
              }}
            >
              {clue.targetPhrase}
              <sup className="clue-tag-num">{i + 1}</sup>
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
      {/* Encabezado compacto del remitente */}
      <header className="chat-header">
        <div className="chat-header-main">
          <span className="chat-avatar">{scenario.avatar}</span>
          <div className="chat-contact">
            <strong>{scenario.sender}</strong>
            <small>cuenta de empresa · no verificada</small>
          </div>
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
            <Eye size={14} />
            <span>{inspectorActive ? "Modo Inspector" : "Explorar pistas"}</span>
          </button>
        )}
      </header>

      {/* Barra de Indicios Minimalista y Compacta */}
      {inspectorActive && (
        <div className="inspector-minimal-toolbar">
          <div className="imt-label-row">
            <Sparkles size={13} className="imt-icon" />
            <span>Toca una señal para ver qué delata este mensaje:</span>
          </div>

          <div className="imt-chips-row">
            {clues.map((clue, idx) => {
              const isSelected = selectedClueIndex === idx;

              return (
                <button
                  key={clue.label}
                  type="button"
                  className={`imt-chip-btn${isSelected ? " active" : ""}`}
                  onClick={() => setSelectedClueIndex(isSelected ? null : idx)}
                >
                  <span className="imt-chip-badge">{idx + 1}</span>
                  <span className="imt-chip-title">{clue.label}</span>
                </button>
              );
            })}
          </div>

          {selectedClueIndex !== null && (
            <div className="imt-explanation-card">
              <div className="iec-top">
                <div className="iec-title">
                  <span className="iec-badge">{selectedClueIndex + 1}</span>
                  <strong>{clues[selectedClueIndex].label}</strong>
                </div>
                <button
                  type="button"
                  className="iec-close-btn"
                  onClick={() => setSelectedClueIndex(null)}
                  title="Cerrar explicación"
                >
                  <X size={14} />
                </button>
              </div>
              <p>{clues[selectedClueIndex].detail}</p>
            </div>
          )}
        </div>
      )}

      {/* Nota sutil de simulación */}
      <div className="encryption-note">
        <LockKeyhole size={11} />
        <span>Mensajes simulados para práctica de criterio</span>
      </div>

      {/* Mensajes con resaltado tipográfico moderno */}
      <div className="chat-body">
        {scenario.messages.map((message, index) => (
          <div
            className={`message${inspectorActive ? " message-inspectable" : ""}`}
            key={message}
          >
            <p className="message-content">{renderMessageContent(message)}</p>
            <span className="message-meta">
              {index === scenario.messages.length - 1 ? scenario.time : "10:41 a. m."}{" "}
              <CheckCheck size={13} className="message-check-icon" />
            </span>
          </div>
        ))}
      </div>

      {/* Pie sutil y limpio */}
      {inspectorActive && (
        <footer className="chat-clean-footer">
          <Lightbulb size={13} />
          <span>Haz clic en las frases marcadas con [1], [2] o [3] para inspeccionar cada trampa.</span>
        </footer>
      )}
    </section>
  );
}
