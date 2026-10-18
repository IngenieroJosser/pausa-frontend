"use client";

import { useState } from "react";
import { CheckCheck, Info, LockKeyhole, Sparkles, AlertTriangle, Eye, ShieldCheck } from "lucide-react";
import type { Scenario } from "@/lib/scenarios";

type Props = {
  scenario: Scenario;
  allowInspection?: boolean;
};

export function ChatCard({ scenario, allowInspection = true }: Props) {
  const [inspectorActive, setInspectorActive] = useState(false);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);

  // Pistas mapeadas de las señales del escenario para la inspección interactiva
  const clues = scenario.signals;

  return (
    <section className="chat-card" aria-label={`Conversación con ${scenario.sender}`}>
      <header className="chat-header">
        <span className="chat-avatar">{scenario.avatar}</span>
        <span className="chat-contact">
          <strong>{scenario.sender}</strong>
          <small>cuenta de empresa · no verificada</small>
        </span>

        {allowInspection && (
          <button
            type="button"
            className={`inspector-toggle-btn${inspectorActive ? " active" : ""}`}
            onClick={() => {
              setInspectorActive(!inspectorActive);
              setSelectedClue(null);
            }}
            title="Activar/desactivar inspector de pistas"
          >
            <Eye size={15} />
            <span>{inspectorActive ? "Inspector activo" : "Explorar pistas"}</span>
          </button>
        )}
      </header>

      {/* Inspector Mode Banner */}
      {inspectorActive && (
        <div className="inspector-banner">
          <div className="ib-top">
            <Sparkles size={16} />
            <span>Modo Inspector de Pistas: Toca una pista para desarmar el mensaje</span>
          </div>
          <div className="clue-chips-row">
            {clues.map((clue, idx) => (
              <button
                key={clue.label}
                type="button"
                className={`clue-chip-btn${selectedClue === idx ? " active" : ""}`}
                onClick={() => setSelectedClue(selectedClue === idx ? null : idx)}
              >
                <AlertTriangle size={12} />
                <span>Pista {idx + 1}: {clue.label}</span>
              </button>
            ))}
          </div>

          {selectedClue !== null && (
            <div className="clue-popover">
              <div className="cp-header">
                <AlertTriangle size={16} />
                <strong>{clues[selectedClue].label}</strong>
              </div>
              <p>{clues[selectedClue].detail}</p>
            </div>
          )}
        </div>
      )}

      <div className="encryption-note">
        <LockKeyhole size={12} /> Mensajes simulados para esta práctica interactiva
      </div>

      <div className="chat-body">
        {scenario.messages.map((message, index) => (
          <div
            className={`message${inspectorActive ? " message-inspectable" : ""}`}
            key={message}
          >
            <p>{message}</p>
            <span>
              {index === scenario.messages.length - 1 ? scenario.time : "10:41 a. m."}{" "}
              <CheckCheck size={14} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
