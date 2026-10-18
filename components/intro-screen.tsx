import { ArrowRight, Clock3, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Brand } from "./brand";

export function IntroScreen({ onStart, previousScore }: { onStart: () => void; previousScore: number | null }) {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
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

          <div className="landing-stats-row">
            <div className="stat-pill">
              <span className="stat-pill-num">4 min</span>
              <span className="stat-pill-label">Duración total</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-num">3 casos</span>
              <span className="stat-pill-label">Práctica adaptativa</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-num">100%</span>
              <span className="stat-pill-label">Anónimo y sin cuenta</span>
            </div>
          </div>

          <div className="start-row">
            <button className="primary-button large" type="button" onClick={onStart}>
              Comenzar práctica <ArrowRight size={20} />
            </button>
            <span className="no-reg-note"><Clock3 size={18} /> Sin registro previo</span>
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
              <span>Aprende a decidir bajo presión</span>
            </div>
          </article>
          <article className="floating-note note-two">
            <Sparkles size={20} />
            <div>
              <strong>Práctica adaptativa</strong>
              <span>El caso 2 responde a tu fallo</span>
            </div>
          </article>
          <article className="floating-note note-three">
            <TrendingUp size={20} />
            <div>
              <strong>Prueba de transferencia</strong>
              <span>Evalúa si aprendiste el principio</span>
            </div>
          </article>
        </section>
      </div>

      <div className="landing-capability-strip">
        <div className="cap-item">
          <strong>1. Diagnóstico</strong>
          <span>Enfrentas un caso de riesgo en tu canal habitual sin pistas previas</span>
        </div>
        <div className="cap-divider" />
        <div className="cap-item">
          <strong>2. Retroalimentación activa</strong>
          <span>Desarmamos el engaño: el gancho, la urgencia y el canal independiente</span>
        </div>
        <div className="cap-divider" />
        <div className="cap-item">
          <strong>3. Transferencia demostrable</strong>
          <span>Demuestras si puedes aplicar la regla en una situación totalmente distinta</span>
        </div>
      </div>

      <footer className="landing-footer">
        <span>PAUSA no es un antivirus ni un filtro pasivo.</span>
        <span>Entrena tu criterio para detectar señales de engaño y tomar una pausa a tiempo.</span>
      </footer>
    </main>
  );
}
