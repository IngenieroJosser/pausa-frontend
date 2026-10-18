"use client";

import Image from "next/image";
import { ArrowRight, Clock3, MessageSquare, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Brand } from "./brand";
import imgPausa from "@/public/illustrations/04-pausa.jpg";

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

        {/* Preview card — Escena protagonista y anatomía del Momento PAUSA */}
        <section className="landing-preview-card" aria-label="Demostración visual del método PAUSA">
          {/* Top header bar */}
          <header className="lpc-header">
            <div className="lpc-tag-wrap">
              <span className="lpc-live-dot" />
              <span className="lpc-badge">Método PAUSA en acción</span>
            </div>
            <span className="lpc-case-id">Casos reales documentados</span>
          </header>

          {/* Visual Hero Scene with the protagonist */}
          <div className="lpc-scene-viewport">
            <Image
              src={imgPausa}
              alt="Protagonista de PAUSA verificando de manera segura en un canal oficial"
              placeholder="blur"
              priority
              className="lpc-hero-img"
            />
            <div className="lpc-scene-overlay">
              <div className="lpc-floating-toast top">
                <span className="lft-icon">💬</span>
                <div className="lft-text">
                  <strong>«Transfiere $48.000 para el examen hoy»</strong>
                  <small>Presión psicológica del atacante</small>
                </div>
              </div>

              <div className="lpc-floating-toast bottom">
                <span className="lft-icon shield">🛡</span>
                <div className="lft-text">
                  <strong>El Momento PAUSA</strong>
                  <small>Detener la acción y verificar por canal oficial</small>
                </div>
              </div>
            </div>
          </div>

          {/* Anatomía del Momento PAUSA */}
          <div className="lpc-anatomy-block">
            <div className="lpc-anatomy-header">
              <span>El recorrido formativo de 3 pasos:</span>
            </div>

            <div className="lpc-anatomy-rows">
              <div className="lpc-anatomy-item">
                <span className="lpc-step-num">01</span>
                <div className="lpc-step-content">
                  <strong>El Gancho:</strong>
                  <p>Oferta atractiva o beneficio inesperado sin proceso previo formal.</p>
                </div>
              </div>

              <div className="lpc-anatomy-item">
                <span className="lpc-step-num">02</span>
                <div className="lpc-step-content">
                  <strong>La Urgencia:</strong>
                  <p>Plazo inmediato artificial («hoy», «2 horas») para anular la duda.</p>
                </div>
              </div>

              <div className="lpc-anatomy-item pausa">
                <span className="lpc-step-num pausa">PAUSA</span>
                <div className="lpc-step-content">
                  <strong>La Defensa Activa:</strong>
                  <p>Salir del canal y comprobar por cuenta propia en el portal oficial.</p>
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
