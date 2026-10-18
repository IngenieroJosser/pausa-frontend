"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, CreditCard, Database, Shield, X, Check, Target, AlertTriangle, Zap, Eye, Clock, ChevronLeft } from "lucide-react";
import { Brand } from "./brand";

/* ─── Types ─────────────────────────────────────── */
export type Goal = "empleo" | "dinero" | "datos";
export type Friction = "urgencia" | "marca" | "miedo" | "canal";
export type Context = "laboral" | "bancario" | "redes";

export type OnboardingResult = {
  goal: Goal;
  friction: Friction;
  context: Context;
};

type OnboardingProps = {
  onComplete: (result: OnboardingResult) => void;
};

type Stage = "goal" | "friction" | "situations" | "solution" | "processing";

/* ─── Situation Cards data ───────────────────────── */
const situations = [
  {
    id: "s1",
    label: "riesgo" as const,
    title: "Oferta de empleo por WhatsApp",
    body: "Te contactan por chat, piden foto de tu cédula antes de revelar el nombre de la empresa y piden pagar un examen médico hoy mismo.",
  },
  {
    id: "s2",
    label: "riesgo" as const,
    title: "Enlace bancario urgente",
    body: "Recibes un SMS: «Tu cuenta será bloqueada en 2 horas. Ingresa aquí para confirmar tus datos.» El dominio dice bancocentral-seguro.info.",
  },
  {
    id: "s3",
    label: "seguro" as const,
    title: "Oferta de empleo verificable",
    body: "La empresa te pide ir a una sucursal con tu hoja de vida. El correo viene del dominio oficial que encuentras en su web y no te cobran nada.",
  },
];

type GoalDetail = {
  icon: React.ReactNode;
  title: string;
  sub: string;
  badge: string;
  tags: string[];
  simulationSample: string;
  focusPoint: string;
};

const goalMap: Record<Goal, GoalDetail> = {
  empleo: {
    icon: <Briefcase size={26} />,
    title: "Buscar empleo seguro",
    sub: "Detecta ofertas laborales falsas antes de pagar exámenes, cursos o entregar documentos privados.",
    badge: "Frecuencia alta",
    tags: ["WhatsApp", "Examen médico falso", "Contratación exprés"],
    simulationSample: "Chat de reclutamiento que exige un pago para examen médico antes de la entrevista.",
    focusPoint: "Verificar la vacante en la página oficial de la empresa sin pagar nada.",
  },
  dinero: {
    icon: <CreditCard size={26} />,
    title: "Proteger mi dinero",
    sub: "Reconoce alertas bancarias falsas, supuestos cobros retenidos y enlaces que buscan vaciar tu cuenta.",
    badge: "Impacto financiero",
    tags: ["SMS bancario", "Alerta de bloqueo", "Transferencias"],
    simulationSample: "SMS de urgencia alertando de un bloqueo si no confirmas tus claves en un enlace externo.",
    focusPoint: "Entrar directamente a la app del banco, nunca mediante enlaces por mensaje.",
  },
  datos: {
    icon: <Database size={26} />,
    title: "Cuidar mi identidad y datos",
    sub: "Evita el robo de cuentas de mensajería y el envío indebido de fotos de tu cédula a terceros.",
    badge: "Seguridad y privacidad",
    tags: ["Suplantación", "Cédula / Documentos", "Robo de sesión"],
    simulationSample: "Mensaje solicitando fotos de tu documento de identidad para validar un trámite desconocido.",
    focusPoint: "Proteger tu documento de identidad para evitar suplantaciones de firma y créditos.",
  },
};

type FrictionDetail = {
  title: string;
  body: string;
  tag: string;
  example: string;
};

const frictionMap: Record<Friction, FrictionDetail> = {
  urgencia: {
    title: "La presión de tiempo",
    body: "«Si no respondes en 15 minutos, la oportunidad o el beneficio se cancela».",
    tag: "Urgencia artificial",
    example: "Te impiden consultar con alguien o revisar con calma antes de actuar.",
  },
  marca: {
    title: "Confiar en la marca o logo",
    body: "Si el mensaje incluye el logo, nombre o colores de una empresa conocida, tiendo a bajar la guardia.",
    tag: "Suplantación visual",
    example: "Imitan tipografías y pies de firma idénticos a los corporativos reales.",
  },
  miedo: {
    title: "Miedo a perder la oportunidad",
    body: "El temor a quedarme sin trabajo o a que bloqueen mi cuenta me hace actuar de inmediato.",
    tag: "Manipulación emocional",
    example: "Aprovechan la necesidad o la preocupación para que no te detengas a pensar.",
  },
  canal: {
    title: "No saber cómo verificar",
    body: "No tengo claro qué pasos dar para comprobar si un mensaje o dominio web es auténtico.",
    tag: "Falta de procedimiento",
    example: "Hacer clic en el enlace provisto parece la única opción evidente en el momento.",
  },
};

const goalToContext: Record<Goal, Context> = {
  empleo: "laboral",
  dinero: "bancario",
  datos: "redes",
};

const frictionToSignal: Record<Friction, string> = {
  urgencia: "la presión de tiempo y plazos artificiales",
  marca: "marcas y logos que imitan empresas reales",
  miedo: "la manipulación por temor a perder la oportunidad",
  canal: "el procedimiento para verificar por canales independientes",
};

/* ─── Nav dots ───────────────────────────────────── */
const STAGES: Stage[] = ["goal", "friction", "situations", "solution", "processing"];
function NavDots({ current }: { current: Stage }) {
  const idx = STAGES.indexOf(current);
  return (
    <div className="onboarding-steps">
      {STAGES.slice(0, 5).map((s, i) => (
        <span
          key={s}
          className={`onboarding-step-dot${i === idx ? " active" : i < idx ? " done" : ""}`}
        />
      ))}
    </div>
  );
}

/* ─── Stage 1: Goal ──────────────────────────────── */
function GoalStage({ onNext }: { onNext: (goal: Goal) => void }) {
  const [selected, setSelected] = useState<Goal | null>("empleo");
  const goals = Object.entries(goalMap) as [Goal, GoalDetail][];
  const activeGoal = selected ? goalMap[selected] : goalMap.empleo;

  return (
    <div className="goal-screen">
      <div className="goal-copy">
        <span className="eyebrow">01 · Objetivo de práctica</span>
        <h1>¿Qué quieres<br />proteger hoy?</h1>
        <p>
          Tu respuesta calibra el simulador: cambia el mensaje entrante, el remitente sospechoso y las decisiones críticas que evaluarás.
        </p>

        {/* Live Personalization Preview Widget */}
        <div className="goal-preview-box">
          <div className="gpb-header">
            <span className="gpb-badge">Calibración en vivo</span>
            <strong>{activeGoal.title}</strong>
          </div>
          <div className="gpb-body">
            <div className="gpb-item">
              <span className="gpb-label">Caso simulado:</span>
              <p>{activeGoal.simulationSample}</p>
            </div>
            <div className="gpb-item">
              <span className="gpb-label">Criterio que entrenarás:</span>
              <p>{activeGoal.focusPoint}</p>
            </div>
          </div>
          <div className="gpb-footer">
            <span>⏱ ~4 minutos</span>
            <span>·</span>
            <span>100% Anónimo</span>
            <span>·</span>
            <span>Sin registro</span>
          </div>
        </div>
      </div>

      <div className="goal-cards">
        {goals.map(([id, { icon, title, sub, badge, tags }], i) => (
          <button
            key={id}
            className={`goal-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            type="button"
            onClick={() => setSelected(id)}
          >
            <div className="goal-card-top-row">
              <span className="goal-card-icon">{icon}</span>
              <span className="goal-card-badge">{badge}</span>
              <span className="goal-card-check">{selected === id ? "✓" : ""}</span>
            </div>
            <div className="goal-card-text">
              <strong>{title}</strong>
              <p>{sub}</p>
            </div>
            <div className="goal-card-tags">
              {tags.map((tag) => (
                <span key={tag} className="goal-tag">{tag}</span>
              ))}
            </div>
          </button>
        ))}

        <button
          className="primary-button large teal"
          type="button"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
          style={{ marginTop: 12 }}
        >
          Continuar con {activeGoal.title} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ─── Stage 2: Friction ──────────────────────────── */
function FrictionStage({ goal, onNext }: { goal: Goal; onNext: (f: Friction) => void }) {
  const [selected, setSelected] = useState<Friction | null>("urgencia");
  const frictions = Object.entries(frictionMap) as [Friction, FrictionDetail][];
  const goalInfo = goalMap[goal];

  return (
    <div className="goal-screen">
      <div className="goal-copy">
        <span className="eyebrow">02 · Punto ciego / Fricción</span>
        <h1>¿Qué te hace<br />difícil detenerte?</h1>
        <p>
          En situaciones de <strong>{goalInfo.title.toLowerCase()}</strong>, los estafadores explotan puntos ciegos para impedir que te tomes una pausa. ¿Cuál te cuesta más identificar?
        </p>

        <div className="goal-preview-box">
          <div className="gpb-header">
            <span className="gpb-badge">Por qué importa esto</span>
            <strong>La trampa psicológica</strong>
          </div>
          <div className="gpb-body">
            <div className="gpb-item">
              <span className="gpb-label">Objetivo de la sesión:</span>
              <p>
                No basta con saber qué es un fraude. El entrenamiento te ayuda a sentir el impulso de actuar y aprender a activar la <strong>PAUSA</strong> en ese instante.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="friction-grid">
        {frictions.map(([id, { title, body, tag, example }], i) => (
          <button
            key={id}
            className={`friction-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            type="button"
            onClick={() => setSelected(id)}
          >
            <div className="fc-top-row">
              <span className="fc-tag">{tag}</span>
              <span className="fc-check">{selected === id ? "✓" : ""}</span>
            </div>
            <strong>{title}</strong>
            <p className="fc-body">{body}</p>
            <div className="fc-example">
              <span>Ejemplo:</span> {example}
            </div>
          </button>
        ))}

        <button
          className="primary-button large teal"
          type="button"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
          style={{ marginTop: 8 }}
        >
          Continuar al reconocimiento de casos <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ─── Stage 3: Situation Cards ───────────────────── */
function SituationsStage({ onNext }: { onNext: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const current = situations[index];
  const done = index >= situations.length;

  function respond(isConcerning: boolean) {
    setAnswers((a) => ({ ...a, [current.id]: isConcerning }));
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className="situation-section">
        <div className="situation-copy">
          <span className="eyebrow">03 · Reconocimiento</span>
          <h1>Ya reconoces<br />las señales.</h1>
          <p>
            Revisaste tres situaciones cotidianas. Ahora verás un plan de
            práctica construido con lo que respondiste.
          </p>
          <button className="primary-button large" type="button" onClick={onNext} style={{ marginTop: 32 }}>
            Ver mi plan <ArrowRight size={20} />
          </button>
        </div>
        <div className="situation-stack">
          <div className="situation-card">
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", textAlign: "center", padding: "16px 0" }}>
              <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--teal-100)", display: "grid", placeItems: "center", color: "var(--teal-600)" }}>
                <Shield size={28} />
              </span>
              <strong style={{ fontSize: "1.1rem" }}>¡Bien hecho!</strong>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.6, margin: 0 }}>
                Analizaste las tres situaciones. Eso ya es hacer una pausa.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="situation-section">
      <div className="situation-copy">
        <span className="eyebrow">03 · Reconocimiento</span>
        <h1>¿Te preocupa<br />esta situación?</h1>
        <p>
          Lee cada caso y dinos si lo encontrarías sospechoso. No hay
          respuestas correctas aquí, solo queremos conocer tu punto de partida.
        </p>
      </div>
      <div className="situation-stack">
        <div className="situation-card" key={current.id}>
          <span className={`sc-label ${current.label === "riesgo" ? "risk" : "safe"}`}>
            {current.label === "riesgo" ? <><AlertTriangle size={12} /> Caso de práctica</> : <><Eye size={12} /> Caso de práctica</>}
          </span>
          <h3>{current.title}</h3>
          <p>{current.body}</p>
          <div className="situation-actions">
            <button className="sit-btn no" type="button" onClick={() => respond(false)}>
              <X size={16} /> No me preocupa
            </button>
            <button className="sit-btn yes" type="button" onClick={() => respond(true)}>
              <Check size={16} /> Sí me preocupa
            </button>
          </div>
        </div>
        <p className="situation-counter">{index + 1} de {situations.length}</p>
      </div>
    </div>
  );
}

/* ─── Stage 4: Solution ──────────────────────────── */
function SolutionStage({ goal, friction, onNext }: { goal: Goal; friction: Friction; onNext: () => void }) {
  const goalInfo = goalMap[goal];
  const frictionLabel = frictionToSignal[friction];

  return (
    <div className="solution-screen">
      <div className="solution-copy">
        <span className="eyebrow">04 · Tu plan</span>
        <h1>Tu práctica<br />está lista.</h1>
        <p>
          Basándonos en lo que contaste, la sesión se enfocará en{" "}
          <strong>{frictionLabel}</strong> en un contexto de{" "}
          <strong>{goalInfo.title.toLowerCase()}</strong>. Nada inventado,
          solo lo que identificaste.
        </p>
        <button className="primary-button large" type="button" onClick={onNext} style={{ marginTop: 32 }}>
          Iniciar práctica <ArrowRight size={20} />
        </button>
      </div>
      <div>
        <div className="profile-card">
          <div className="pc-header">
            <span className="pc-avatar">
              <Shield size={24} />
            </span>
            <div className="pc-title">
              <strong>Sesión personalizada</strong>
              <span>Construida según tus respuestas</span>
            </div>
          </div>
          <div className="profile-row">
            <span className="pr-icon"><Target size={16} /></span>
            <div>
              <div className="pr-label">Objetivo</div>
              <div className="pr-value">{goalInfo.title}</div>
            </div>
          </div>
          <div className="profile-row">
            <span className="pr-icon"><Zap size={16} /></span>
            <div>
              <div className="pr-label">Señal a entrenar</div>
              <div className="pr-value" style={{ textTransform: "capitalize" }}>{frictionLabel}</div>
            </div>
          </div>
          <div className="profile-row">
            <span className="pr-icon"><Clock size={16} /></span>
            <div>
              <div className="pr-label">Duración estimada</div>
              <div className="pr-value">~4 minutos · 3 decisiones</div>
            </div>
          </div>
          <div className="profile-cta">
            <strong>Sin registro · Sin cobros</strong>
            El resultado queda guardado en tu navegador para comparar después.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 5: Processing ────────────────────────── */
function ProcessingStage({ goal, friction, onReady }: { goal: Goal; friction: Friction; onReady: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    `Identificando escenario de ${goalMap[goal].title.toLowerCase()}…`,
    `Ajustando señal de riesgo: ${frictionToSignal[friction]}…`,
    "Preparando práctica adaptada…",
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), (i + 1) * 800));
    });
    timers.push(setTimeout(onReady, steps.length * 800 + 600));
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line

  return (
    <div className="processing-screen">
      <div className="processing-icon">
        <Shield size={36} />
      </div>
      <p className="processing-title">Preparando tu práctica</p>
      <p className="processing-sub">
        Seleccionamos un escenario real según tu objetivo. Esto no es IA,
        es un caso validado de nuestro banco de situaciones.
      </p>
      <div className="dots">
        <span /><span /><span />
      </div>
      <div className="processing-steps">
        {steps.map((s, i) => (
          <div
            key={s}
            className="ps-item"
            style={{ "--i": i, opacity: step > i ? 1 : 0.35 } as React.CSSProperties}
          >
            <span className="ps-dot" />
            <span>{s}</span>
            {step > i && <Check size={14} style={{ marginLeft: "auto", color: "var(--success)" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Onboarding Component ──────────────────── */
export function Onboarding({ onComplete }: OnboardingProps) {
  const [stage, setStage] = useState<Stage>("goal");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [friction, setFriction] = useState<Friction | null>(null);

  const canGoBack = stage !== "goal" && stage !== "processing";
  const stageIndex = STAGES.indexOf(stage);

  function goBack() {
    if (stageIndex > 0) setStage(STAGES[stageIndex - 1]);
  }

  function handleGoalNext(g: Goal) {
    setGoal(g);
    setStage("friction");
  }

  function handleFrictionNext(f: Friction) {
    setFriction(f);
    setStage("situations");
  }

  function handleSituationsNext() {
    setStage("solution");
  }

  function handleSolutionNext() {
    setStage("processing");
  }

  function handleReady() {
    if (!goal || !friction) return;
    onComplete({ goal, friction, context: goalToContext[goal] });
  }

  return (
    <div className="onboarding-shell">
      <nav className="onboarding-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {canGoBack && (
            <button
              type="button"
              className="onboarding-skip"
              onClick={goBack}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ChevronLeft size={16} /> Atrás
            </button>
          )}
          <Brand />
        </div>
        <NavDots current={stage} />
        <button
          type="button"
          className="onboarding-skip"
          onClick={handleReady}
          title="Saltar onboarding"
        >
          Saltar intro
        </button>
      </nav>

      <div className="onboarding-body" key={stage}>
        {stage === "goal" && <GoalStage onNext={handleGoalNext} />}
        {stage === "friction" && goal && <FrictionStage goal={goal} onNext={handleFrictionNext} />}
        {stage === "situations" && <SituationsStage onNext={handleSituationsNext} />}
        {stage === "solution" && goal && friction && (
          <SolutionStage goal={goal} friction={friction} onNext={handleSolutionNext} />
        )}
        {stage === "processing" && goal && friction && (
          <ProcessingStage goal={goal} friction={friction} onReady={handleReady} />
        )}
      </div>
    </div>
  );
}
