import { ArrowRight } from "lucide-react";
import type { Scenario } from "@/lib/scenarios";
import { ChatCard } from "./chat-card";

type Props = {
  scenario: Scenario;
  selected: string | null;
  onSelect: (choiceId: string) => void;
  onSubmit: () => void;
};

export function ScenarioStep({ scenario, selected, onSelect, onSubmit }: Props) {
  return (
    <main className="scenario-layout">
      <section className="scenario-intro">
        <div className="scenario-badge-wrap">
          <span className="eyebrow">{scenario.eyebrow}</span>
          <span className="channel-pill">Simulación activa</span>
        </div>
        <h1>Lee el mensaje.<br />Luego, decide.</h1>
        <p>No busques la respuesta perfecta. Elige con honestidad lo que harías en este momento.</p>

        <div className="scenario-checkpoints">
          <span className="checkpoints-title">Qué observar antes de decidir:</span>
          <ul>
            <li>
              <strong>Remitente y canal</strong>
              <span>¿Viene de un número desconocido o un dominio extraño?</span>
            </li>
            <li>
              <strong>Sensación de urgencia</strong>
              <span>¿Te presionan para responder de inmediato sin verificar?</span>
            </li>
            <li>
              <strong>Acción solicitada</strong>
              <span>¿Piden pagos, datos personales o abrir enlaces externos?</span>
            </li>
          </ul>
        </div>

        <div className="tip">
          <span>01</span>
          <p>
            <strong>Sin pistas durante la prueba.</strong><br />
            Primero evaluamos tu criterio natural. Luego verás el análisis detallado.
          </p>
        </div>
      </section>

      <div className="scenario-workspace">
        <ChatCard scenario={scenario} />
        <section className="decision-card">
          <div className="decision-header">
            <span className="decision-step-label">Toma de decisión</span>
            <h2>{scenario.prompt}</h2>
          </div>
          <div className="choices" role="radiogroup" aria-label={scenario.prompt}>
            {scenario.choices.map((choice, index) => (
              <button
                className={`choice ${selected === choice.id ? "selected" : ""}`}
                key={choice.id}
                type="button"
                role="radio"
                aria-checked={selected === choice.id}
                onClick={() => onSelect(choice.id)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <div className="choice-text">{choice.label}</div>
              </button>
            ))}
          </div>
          <button className="primary-button" type="button" disabled={!selected} onClick={onSubmit}>
            Confirmar decisión <ArrowRight size={18} />
          </button>
        </section>
      </div>
    </main>
  );
}
