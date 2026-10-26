"use client";

import { ArrowDown, ArrowRight, ArrowUpRight, Check, CirclePlay, Fingerprint, LockKeyhole, MessageCircle, MousePointer2, ShieldCheck, Sparkles } from "lucide-react";
import { Brand } from "./brand";

/**
 * Metal Human es un recurso decorativo: sin audio, sin captura de datos y
 * con imagen de respaldo. El movimiento se desactiva por CSS cuando el
 * sistema solicita reduced motion.
 */
function MetalHumanBackground() {
  return (
    <div className="hero-video-field" aria-hidden="true">
      {/* La imagen sirve como poster inmediato y respaldo si el vídeo falla. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-video-poster" src="/metal-human.jpg" alt="" />
      <video
        className="hero-video"
        autoPlay
        playsInline
        muted
        loop
        preload="metadata"
        poster="/metal-human.jpg"
        disablePictureInPicture
        aria-hidden="true"
      >
        <source src="/metal-human.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-fade" />
    </div>
  );
}

const principles = [
  { number: "01", icon: MessageCircle, title: "Entra en la historia.", description: "Recibe mensajes y ofertas que podrías encontrar mañana en tu teléfono. Sin preguntas obvias ni respuestas prefabricadas." },
  { number: "02", icon: MousePointer2, title: "Decide bajo presión.", description: "Cada elección activa una consecuencia. Descubre las pistas que viste, las que ignoraste y por qué importan." },
  { number: "03", icon: ShieldCheck, title: "Llévalo a la vida real.", description: "Pon a prueba tu aprendizaje en otro caso y termina con acciones concretas que puedes usar fuera de PAUSA." },
];

export function IntroScreen({ onStart, previousScore }: { onStart: () => void; previousScore: number | null }) {
  return (
    <main className="landing landing--metal" id="inicio">
      <div className="hero-stage">
        <MetalHumanBackground />

        <nav className="landing-nav" aria-label="Navegación principal">
          <Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
          <div className="landing-nav-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#experiencia">La experiencia</a>
          </div>
          <button type="button" className="nav-start" onClick={onStart}>
            Empezar gratis <ArrowUpRight size={16} strokeWidth={1.8} />
          </button>
        </nav>

        <section className="hero-content" aria-labelledby="hero-title">
          <div className="hero-kicker">
            <span className="hero-kicker-pulse" />
            <span>EL FUTURO DE TU CRITERIO COMIENZA AQUÍ</span>
            <span className="hero-kicker-line" />
          </div>
          <h1 id="hero-title">
            La estafa<br />
            no avisa<span className="hero-dot">.</span><br />
            <span className="hero-title-outline">Tu criterio,</span><br />
            <span className="hero-title-highlight">sí se entrena.</span>
          </h1>
          <p className="hero-description">
            No es otro curso de seguridad digital. Es una experiencia donde
            <strong> enfrentas el engaño, decides y aprendes a reconocerlo</strong> antes de que sea real.
          </p>
          <div className="hero-actions">
            <button className="primary-button large hero-main-cta" type="button" onClick={onStart}>
              Comenzar práctica <span className="hero-cta-icon"><ArrowUpRight size={20} strokeWidth={2} /></span>
            </button>
            <a className="hero-link-cta" href="#como-funciona">
              <CirclePlay size={20} strokeWidth={1.65} /> Descubre cómo funciona
            </a>
          </div>
          <div className="hero-assurance" aria-label="Características de la experiencia">
            <span><Check size={15} /> Sin registro</span>
            <i aria-hidden="true" />
            <span><Check size={15} /> 4 minutos</span>
            <i aria-hidden="true" />
            <span><Check size={15} /> Situaciones reales simuladas</span>
          </div>
          {previousScore !== null && (
            <div className="hero-return-note" role="status">
              <Sparkles size={17} /> Tu última práctica: {previousScore} de 3 decisiones correctas. Puedes volver a entrenar.
            </div>
          )}
        </section>

        <div className="hero-floating-card hero-floating-card--top" aria-hidden="true">
          <div className="hero-float-topline"><span className="hero-pulse-dot" /> ENTRENAMIENTO EN VIVO <ArrowUpRight size={14} /></div>
          <div className="hero-float-title"><Fingerprint size={20} strokeWidth={1.35} /> TU INSTINTO NO ES INFALIBLE.</div>
          <span>Tu capacidad de verificar sí puede mejorar.</span>
        </div>
        <div className="hero-floating-card hero-floating-card--bottom" aria-hidden="true">
          <span className="hero-float-index">/ 001 — ESCENARIO</span>
          <div className="hero-float-message"><span>“</span>Te contratamos. Solo debes hacer un pequeño pago para activar tu ingreso.<span>”</span></div>
          <div className="hero-float-action"><span className="hero-float-alert" /> ¿Qué harías tú? <ArrowUpRight size={17} /></div>
        </div>
        <div className="hero-side-label" aria-hidden="true">PIENSA ANTES DE ACTUAR — PAUSA / 2026</div>

        <div className="hero-bottom-bar">
          <a href="#como-funciona" className="hero-scroll-link"><ArrowDown size={17} /> DESLIZA PARA EXPLORAR</a>
          <span>EDUCACIÓN DIGITAL / ENTRENAMIENTO DE CRITERIO</span>
          <span className="hero-bottom-count">01 <span>/</span> 03</span>
        </div>
      </div>

      <section className="manifesto-section" id="como-funciona" aria-labelledby="manifesto-title">
        <div className="section-topline"><span>01 / POR QUÉ EXISTIMOS</span><span>EL PROBLEMA NO ES FALTA DE INFORMACIÓN</span></div>
        <div className="manifesto-grid">
          <div className="manifesto-aside"><span className="mini-spark">✳</span> LAS SEÑALES ESTÁN AHÍ.<br />LA DECISIÓN ES TUYA.</div>
          <div>
            <h2 id="manifesto-title">Saber que existen estafas <em>no basta.</em><br />Hay que saber <span>reaccionar.</span></h2>
            <p>Cuando algo parece demasiado bueno para ser verdad, el problema rara vez es reconocer una palabra sospechosa. Es qué haces cuando te presionan para actuar. PAUSA transforma ese momento en una habilidad que puedes practicar.</p>
          </div>
        </div>
      </section>

      <section className="method-section" id="experiencia" aria-labelledby="method-title">
        <div className="section-topline"><span>02 / LA EXPERIENCIA</span><span>DE LA INTUICIÓN A LA ACCIÓN</span></div>
        <div className="method-heading-row">
          <h2 id="method-title">No leas la lección.<br /><em>Vívela.</em></h2>
          <p>Una secuencia breve, intensa y diseñada para convertir tus errores en decisiones más seguras.</p>
        </div>
        <div className="method-cards">
          {principles.map(({ number, icon: Icon, title, description }) => (
            <article className="method-card" key={number}>
              <div className="method-card-head"><span>{number} / 03</span><Icon size={27} strokeWidth={1.45} /></div>
              <div className="method-card-bottom"><h3>{title}</h3><p>{description}</p><ArrowUpRight className="method-card-arrow" size={24} strokeWidth={1.4} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-section" aria-label="Ejemplo de una situación de entrenamiento">
        <div className="showcase-copy">
          <span className="showcase-eyebrow"><span /> NO ES UNA PRESENTACIÓN. ES UNA DECISIÓN.</span>
          <h2>La próxima vez,<br />tendrás <em>un plan.</em></h2>
          <p>Vas a descubrir cómo funciona la presión, dónde están las pistas y qué hacer antes de entregar tus datos o tu dinero.</p>
          <button className="showcase-button" type="button" onClick={onStart}>Quiero entrenar mi criterio <ArrowUpRight size={18} /></button>
          <div className="showcase-trust"><LockKeyhole size={16} /> No pedimos permisos ni datos personales para comenzar.</div>
        </div>
        <div className="showcase-interaction" aria-label="Vista previa ilustrativa de un mensaje sospechoso">
          <div className="showcase-chat-head"><span className="showcase-avatar">RH</span><div><strong>Reclutamiento · Soporte</strong><small>Conversación simulada</small></div><span className="showcase-chat-icon">•••</span></div>
          <div className="showcase-chat-body">
            <span className="showcase-day">HOY</span>
            <div className="showcase-bubble">Hola, vimos tu perfil. Tenemos una vacante remota disponible para ti.</div>
            <div className="showcase-bubble">El cupo vence hoy. Necesitamos un pago para confirmar tu contratación.</div>
            <div className="showcase-user-bubble">¿Puedo verificar la oferta desde la página oficial de la empresa?</div>
          </div>
          <div className="showcase-signal"><ShieldCheck size={18}/><div><strong>Momento PAUSA</strong><span>Verificar por una fuente independiente es una acción concreta.</span></div></div>
          <span className="showcase-fake-note">VISTA PREVIA · ESCENARIO FICTICIO</span>
        </div>
      </section>

      <footer className="metal-footer">
        <div className="metal-footer-brand"><Brand /><span>Entrena antes de que importe.</span></div>
        <span>PAUSA © 2026 · Una experiencia educativa. No determina si un mensaje real es legítimo.</span>
        <a href="#inicio">Volver arriba <ArrowUpRight size={15}/></a>
      </footer>
    </main>
  );
}
