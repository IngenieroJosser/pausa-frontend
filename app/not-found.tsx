import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, Compass, CornerDownLeft, Link2Off, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";

export const metadata: Metadata = {
  title: "Página no encontrada | PAUSA",
  description: "Esta dirección no existe. Detente, verifica y vuelve al inicio de PAUSA.",
  robots: { index: false, follow: false },
};

const steps = [
  { number: "01", title: "Detente", copy: "No todas las rutas llevan a donde esperas." },
  { number: "02", title: "Verifica", copy: "Comprueba que escribiste bien la dirección." },
  { number: "03", title: "Continúa", copy: "Vuelve a un punto seguro y sigue aprendiendo." },
];

export default function NotFound() {
  return (
    <main className="nf-page">
      <div className="nf-ambient" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="none" poster="/metal-human.jpg">
          <source src="/metal-human.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="nf-grain" aria-hidden="true" />

      <div className="nf-container">
        <header className="nf-header">
          <Link href="/" className="nf-home-brand" aria-label="PAUSA · Ir al inicio">
            <Brand />
          </Link>
          <span className="nf-top-status"><span className="nf-status-dot" /> ESTADO DEL SISTEMA: PÁGINA AUSENTE</span>
        </header>

        <div className="nf-main-grid">
          <section className="nf-copy" aria-labelledby="nf-title">
            <span className="nf-eyebrow"><span className="nf-eyebrow-icon"><Compass size={15} strokeWidth={2} /></span> TE SALISTE DE LA RUTA</span>
            <div className="nf-title-wrap">
              <span className="nf-error-code" aria-label="Error 404">404<span className="nf-code-dot">.</span></span>
              <span className="nf-code-detail">ERROR / NOT FOUND <ArrowDownRight size={15} /></span>
            </div>
            <h1 id="nf-title">Hasta las mejores decisiones <em>necesitan una pausa.</em></h1>
            <p className="nf-description">
              Esta página no existe o cambió de dirección. No pasa nada: detente, verifica el enlace y vuelve a un lugar seguro.
            </p>
            <div className="nf-actions">
              <Link href="/" className="nf-main-button">
                <span>Regresar al inicio</span>
                <span className="nf-button-icon"><ArrowRight size={20} strokeWidth={2.2} /></span>
              </Link>
              <span className="nf-key-hint"><CornerDownLeft size={16} /> Retoma tu entrenamiento</span>
            </div>
            <p className="nf-bottom-note"><ShieldCheck size={16} /> Sigue siendo una simulación segura. Ningún dato se ha enviado desde esta página.</p>
          </section>

          <aside className="nf-illustration" aria-label="La ruta no fue encontrada">
            <div className="nf-illustration-halo" aria-hidden="true" />
            <div className="nf-orbit nf-orbit-one" aria-hidden="true" />
            <div className="nf-orbit nf-orbit-two" aria-hidden="true" />
            <div className="nf-scenario-card">
              <div className="nf-card-top">
                <div className="nf-card-window-dots"><i /><i /><i /></div>
                <span>RUTA / DESCONOCIDA</span>
                <span className="nf-card-scan-dot" />
              </div>
              <div className="nf-scenario-content">
                <div className="nf-scenario-icon"><Link2Off size={27} strokeWidth={1.9} /></div>
                <span className="nf-scenario-label">ANÁLISIS COMPLETADO</span>
                <strong>No encontramos<br />esta dirección<span>.</span></strong>
                <p>No tomes caminos desconocidos. Mejor, vuelve al inicio.</p>
                <div className="nf-card-route">
                  <span className="nf-route-badge"><Check size={13} strokeWidth={2.7} /></span>
                  <div>
                    <strong>Ruta recomendada</strong>
                    <small>Inicio · Experiencia PAUSA</small>
                  </div>
                  <ArrowRight size={17} />
                </div>
              </div>
              <div className="nf-card-footer"><span>PROTOCOLO PAUSA</span><span>SEGURIDAD PRIMERO</span></div>
            </div>
            <span className="nf-float-note nf-note-left">¿ENLACE CORRECTO?</span>
            <span className="nf-float-note nf-note-right">RECALCULANDO RUTA...</span>
          </aside>
        </div>

        <footer className="nf-footer">
          <div className="nf-footer-steps" aria-label="Pasos para retomar tu navegación">
            {steps.map((step) => (
              <div key={step.number} className="nf-footer-step">
                <span>{step.number}</span>
                <div><strong>{step.title}</strong><p>{step.copy}</p></div>
              </div>
            ))}
          </div>
          <div className="nf-footer-brand">PAUSA <span>—</span> PIENSA. VERIFICA. DECIDE.</div>
        </footer>
      </div>
    </main>
  );
}
