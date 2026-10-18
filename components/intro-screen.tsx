import { ArrowRight, Clock3, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Brand } from "./brand";

export function IntroScreen({ onStart, previousScore }: { onStart: () => void; previousScore: number | null }) {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Brand />
        <span className="session-label">Entrenamiento contra engaños digitales</span>
      </nav>

      <div className="landing-grid">
        <section className="landing-copy">
          <span className="eyebrow">Entrena antes de que sea real</span>
          <h1>Un mensaje.<br />Una decisión.<br /><em>Haz una pausa.</em></h1>
          <p className="lead">
            Practica cómo detectar ofertas falsas y estafas digitales.
            En 4 minutos comprobarás si puedes aplicar lo aprendido en un
            caso completamente nuevo.
          </p>

          {/* Vista previa del resultado — Etapa 01 Welcome */}
          <div style={{
            display: "flex",
            gap: 12,
            margin: "28px 0 -8px",
            padding: "16px 18px",
            background: "linear-gradient(135deg, var(--teal-50), rgba(255,255,255,.7))",
            border: "1px solid rgba(7,156,168,.2)",
            borderRadius: "var(--radius-sm)",
            alignItems: "center",
          }}>
            <TrendingUp size={20} style={{ color: "var(--teal-600)", flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: ".82rem", display: "block", marginBottom: 2 }}>¿Qué obtienes al terminar?</strong>
              <span style={{ color: "var(--muted)", fontSize: ".76rem", lineHeight: 1.5 }}>
                Un diagnóstico de tu decisión inicial + una prueba de transferencia en un contexto nuevo.
                Sin registro, sin cobro.
              </span>
            </div>
          </div>

          <div className="start-row">
            <button className="primary-button large" type="button" onClick={onStart}>
              Comenzar práctica <ArrowRight size={20} />
            </button>
            <span><Clock3 size={18} /> 4 minutos · sin registro</span>
          </div>

          {previousScore !== null && (
            <p className="previous-result">
              Tu última práctica: <strong>{previousScore}/3 decisiones seguras</strong>
            </p>
          )}
        </section>

        <section className="landing-visual" aria-label="Resumen de la práctica">
          <div className="shield-orbit">
            {/* Animated orbit rings */}
            <span className="orbit-ring-outer" />
            <span className="orbit-ring-inner" />
            <Brand compact />
            <span className="orbit-dot one" />
            <span className="orbit-dot two" />
          </div>
          <article className="floating-note note-one">
            <ShieldCheck size={20} />
            <div>
              <strong>No memorices consejos</strong>
              <span>Aprende a decidir</span>
            </div>
          </article>
          <article className="floating-note note-two">
            <Sparkles size={20} />
            <div>
              <strong>Práctica adaptativa</strong>
              <span>Cambia según tu error</span>
            </div>
          </article>
        </section>
      </div>

      <footer className="landing-footer">
        <span>PAUSA no detecta fraudes por ti.</span>
        <span>Te ayuda a reconocer señales y verificar mejor.</span>
      </footer>
    </main>
  );
}
