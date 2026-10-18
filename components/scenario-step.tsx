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
        <span className="eyebrow">{scenario.eyebrow}</span>
        <h1>Lee el mensaje.<br />Luego, decide.</h1>
        <p>No busques la respuesta perfecta. Elige lo que harías en este momento.</p>
        <div className="tip"><span>01</span><p><strong>Sin pistas todavía.</strong><br />Primero queremos entender cómo decides.</p></div>
      </section>
      <div className="scenario-workspace">
        <ChatCard scenario={scenario} />
        <section className="decision-card">
          <h2>{scenario.prompt}</h2>
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
                <span>{String.fromCharCode(65 + index)}</span>{choice.label}
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
