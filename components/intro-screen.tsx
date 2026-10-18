"use client";

import { ArrowRight, Clock3 } from "lucide-react";
import { Brand } from "./brand";

export function IntroScreen({ onStart, previousScore }: { onStart: () => void; previousScore: number | null }) {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <span className="session-label">Simulador de criterio ante fraudes digitales</span>
      </nav>

      <div className="landing-grid">
        <section className="landing-copy">
          <span className="eyebrow">Entrena tu reflejo de seguridad</span>
          <h1>
            Un mensaje sospechoso.
            <br />
            Una decisión rápida.
            <br />
            <em>Haz una pausa.</em>
          </h1>
          <p className="lead">
            Entrena tu capacidad para desarmar falsas ofertas de empleo y estafas digitales en tiempo real. En 4 minutos calibrarás tu criterio en situaciones simuladas basadas en casos reales.
          </p>

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
              Comenzar práctica <ArrowRight size={18} />
            </button>
            <span className="no-reg-note">
              <Clock3 size={16} /> Sin registro previo ni descargas
            </span>
          </div>
        </section>

        {/* Preview card — Simulador activo y anatomía de la trampa */}
        <section className="landing-preview-card" aria-label="Demostración interactiva del simulador de casos">
          {/* Top header bar */}
          <header className="lpc-header">
            <div className="lpc-tag-wrap">
              <span className="lpc-live-dot" />
              <span className="lpc-badge">Simulador activo</span>
            </div>
            <span className="lpc-case-id">Patrón: Falso Reclutamiento</span>
          </header>

          {/* Simulated chat with realistic styling */}
          <div className="lpc-chat-box">
            <div className="lpc-message-header">
              <div className="lpc-avatar">TH</div>
              <div className="lpc-sender-info">
                <strong>Talento Humano Express</strong>
                <small>⚠ Remitente desconocido · Cuenta no verificada</small>
              </div>
            </div>

            <div className="lpc-bubble">
              <p>
                «Vimos tu hoja de vida. Fuiste seleccionado para la vacante. Para asegurar el cupo{" "}
                <span className="lpc-mark-urgencia">hoy</span>,{" "}
                <span className="lpc-mark-trampa">transfiere $48.000 para el examen médico.</span>»
              </p>
            </div>
          </div>

          {/* Anatomía de la trampa psicológica */}
          <div className="lpc-anatomy-block">
            <div className="lpc-anatomy-header">
              <span>Anatomía de la trampa psicológica:</span>
            </div>

            <div className="lpc-anatomy-rows">
              <div className="lpc-anatomy-item">
                <span className="lpc-step-num">01</span>
                <div className="lpc-step-content">
                  <strong>El gancho:</strong>
                  <p>Oferta atractiva sin proceso de entrevista formal previo.</p>
                </div>
              </div>

              <div className="lpc-anatomy-item">
                <span className="lpc-step-num">02</span>
                <div className="lpc-step-content">
                  <strong>La presión de urgencia:</strong>
                  <p>Plazo inmediato («hoy») para inducir una respuesta impulsiva.</p>
                </div>
              </div>

              <div className="lpc-anatomy-item pausa">
                <span className="lpc-step-num pausa">PAUSA</span>
                <div className="lpc-step-content">
                  <strong>El Momento PAUSA:</strong>
                  <p>Verificar de forma autónoma en el portal oficial sin transferir.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="landing-capability-strip">
        <div className="cap-item">
          <strong>1. Diagnóstico inicial</strong>
          <span>Enfrentas un caso de riesgo en tu canal habitual sin pistas previas.</span>
        </div>
        <div className="cap-divider" />
        <div className="cap-item">
          <strong>2. Desarme formativo</strong>
          <span>Analizas las señales de alerta: el cobro anticipado, la urgencia y el canal seguro.</span>
        </div>
        <div className="cap-divider" />
        <div className="cap-item">
          <strong>3. Prueba de transferencia</strong>
          <span>Compruebas si puedes aplicar el mismo criterio en un entorno totalmente nuevo.</span>
        </div>
      </div>

      <footer className="landing-footer">
        <span>PAUSA entrena tu criterio ante ataques de ingeniería social y fraudes digitales.</span>
        <span>Casos basados en modalidades documentadas por autoridades de ciberseguridad.</span>
      </footer>
    </main>
  );
}
