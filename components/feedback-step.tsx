import { AlertTriangle, ArrowRight, Check, CircleX } from "lucide-react";
import type { Answer } from "@/lib/session";
import type { Scenario } from "@/lib/scenarios";

export function FeedbackStep({ scenario, answer, onContinue }: { scenario: Scenario; answer: Answer; onContinue: () => void }) {
  const selected = scenario.choices.find((choice) => choice.id === answer.choiceId)!;
  return (
    <main className="feedback-layout">
      <section className={`feedback-hero ${answer.correct ? "correct" : "needs-pause"}`}>
        <span className="feedback-icon">{answer.correct ? <Check /> : <CircleX />}</span>
        <span className="eyebrow">Tu decisión</span>
        <h1>{answer.correct ? "Hiciste una pausa útil." : "Aquí convenía hacer una pausa."}</h1>
        <p>Elegiste: <strong>{selected.label}</strong></p>
      </section>
      <section className="learning-panel">
        <div className="explanation">
          <AlertTriangle size={22} />
          <div><h2>Lo importante no era adivinar</h2><p>{scenario.explanation}</p></div>
        </div>
        <div className="signals-grid">
          {scenario.signals.map((signal, index) => (
            <article key={signal.label}><span>0{index + 1}</span><h3>{signal.label}</h3><p>{signal.detail}</p></article>
          ))}
        </div>
        <div className="rule-card"><span>REGLA PAUSA</span><p>Si el mensaje mezcla <strong>urgencia, dinero o datos personales</strong>, sal del chat y verifica por tu cuenta.</p></div>
        <button className="primary-button" type="button" onClick={onContinue}>Practicar este criterio <ArrowRight size={18} /></button>
      </section>
    </main>
  );
}
