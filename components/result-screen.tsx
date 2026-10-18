import { ArrowRight, CalendarClock, Check, RotateCcw, ShieldCheck } from "lucide-react";
import type { Answer } from "@/lib/session";
import { Brand } from "./brand";

export function ResultScreen({ answers, onRestart }: { answers: Answer[]; onRestart: () => void }) {
  const score = answers.filter((answer) => answer.correct).length;
  const diagnostic = answers[0]?.correct ? 1 : 0;
  const transfer = answers[2]?.correct ? 1 : 0;
  const improved = transfer > diagnostic;
  return (
    <main className="result-page">
      <nav className="landing-nav"><Brand /><span className="session-label">Práctica completada</span></nav>
      <section className="result-hero">
        <span className="completion-mark"><Check /></span>
        <span className="eyebrow">Resultado observable</span>
        <h1>{improved ? "Tomaste una decisión mejor fundamentada." : transfer ? "Sostuviste una decisión segura." : "Ya sabes dónde hacer la próxima pausa."}</h1>
        <p>Esto es aprendizaje demostrado durante la sesión, no una garantía de protección frente a fraudes reales.</p>
      </section>
      <section className="score-panel">
        <div className="score-comparison">
          <article><span>Diagnóstico</span><strong>{diagnostic}/1</strong><small>decisión segura</small></article>
          <ArrowRight className="score-arrow" />
          <article className="highlight"><span>Prueba final</span><strong>{transfer}/1</strong><small>caso nuevo</small></article>
        </div>
        <div className="skill-earned"><ShieldCheck /><div><span>Nueva habilidad demostrada</span><p>Verificaste el mensaje desde un canal independiente en lugar de confiar en el enlace recibido.</p></div></div>
      </section>
      <section className="next-action">
        <div><CalendarClock /><div><span>Siguiente acción</span><h2>Antes de compartir o pagar, busca el canal oficial.</h2></div></div>
        <p>Marcador de la sesión: <strong>{score}/3</strong></p>
      </section>
      <div className="result-actions"><button className="primary-button" type="button" onClick={onRestart}><RotateCcw size={18} /> Practicar de nuevo</button></div>
    </main>
  );
}
