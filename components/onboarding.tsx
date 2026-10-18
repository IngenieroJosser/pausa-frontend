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
    <div className="onboarding-flow-step">
      <div className="onboarding-step-hero">
        <span className="eyebrow">01 · Objetivo de práctica</span>
        <h1>¿Qué quieres proteger hoy?</h1>
        <p>
          Selecciona el ámbito que deseas entrenar. Calibraremos la simulación con situaciones reales y señales de riesgo específicas.
        </p>
      </div>

      <div className="goal-deck-grid">
        {goals.map(([id, { icon, title, sub, badge, tags }], i) => (
          <button
            key={id}
            className={`goal-deck-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            type="button"
            onClick={() => setSelected(id)}
          >
            <div className="gdc-header">
              <span className="gdc-icon">{icon}</span>
              <span className="gdc-badge">{badge}</span>
              <span className="gdc-check">{selected === id ? "✓" : ""}</span>
            </div>
            <div className="gdc-content">
              <strong>{title}</strong>
              <p>{sub}</p>
            </div>
            <div className="gdc-tags">
              {tags.map((tag) => (
                <span key={tag} className="gdc-tag">{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="onboarding-bottom-bar">
        <div className="obb-info">
          <span className="obb-dot" />
          <span>Práctica personalizada de <strong>4 minutos</strong> · 100% Anónimo · Sin registro previo</span>
        </div>
        <button
          className="primary-button large teal"
          type="button"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
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
    <div className="onboarding-flow-step">
      <div className="onboarding-step-hero">
        <span className="eyebrow">02 · Punto ciego / Fricción</span>
        <h1>¿Qué te hace difícil detenerte?</h1>
        <p>
          En situaciones de <strong>{goalInfo.title.toLowerCase()}</strong>, los atacantes usan trampas psicológicas para apresurar tu decisión. ¿Cuál te cuesta más reconocer?
        </p>
      </div>

      <div className="friction-deck-grid">
        {frictions.map(([id, { title, body, tag, example }], i) => (
          <button
            key={id}
            className={`friction-deck-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            type="button"
            onClick={() => setSelected(id)}
          >
            <div className="fdc-header">
              <span className="fdc-tag">{tag}</span>
              <span className="fdc-check">{selected === id ? "✓" : ""}</span>
            </div>
            <strong>{title}</strong>
            <p className="fdc-body">{body}</p>
            <div className="fdc-example">
              <span>Ejemplo:</span> {example}
            </div>
          </button>
        ))}
      </div>

      <div className="onboarding-bottom-bar">
        <div className="obb-info">
          <span className="obb-dot" />
          <span>Identificar tu punto ciego entrena el reflejo de hacer la pausa en el momento clave</span>
        </div>
        <button
          className="primary-button large teal"
          type="button"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
        >
          Continuar a situaciones de práctica <ArrowRight size={20} />
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
      <div className="onboarding-flow-step">
        <div className="onboarding-step-hero">
          <span className="eyebrow">03 · Calibración completada</span>
          <h1>Ya reconoces las señales clave</h1>
          <p>
            Revisaste tres situaciones cotidianas. Aquí tienes el desglose de lo que identificaste en cada caso:
          </p>
        </div>

        <div className="situation-summary-grid">
          <div className="summary-case-card">
            <span className="scc-badge risk">Riesgo identificado</span>
            <h4>Oferta de empleo por WhatsApp</h4>
            <p>Petición de dinero para examen médico previo a la entrevista y fotos de cédula.</p>
            <div className="scc-lesson">
              <strong>Señal crítica:</strong> Cobro previo por acceder a un trabajo.
            </div>
          </div>

          <div className="summary-case-card">
            <span className="scc-badge risk">Riesgo identificado</span>
            <h4>Enlace bancario urgente</h4>
            <p>SMS alertando de bloqueo en 2 horas con enlace a dominio no oficial.</p>
            <div className="scc-lesson">
              <strong>Señal crítica:</strong> Presión de tiempo forzada y dominio suplantado.
            </div>
          </div>

          <div className="summary-case-card">
            <span className="scc-badge safe">Canal seguro</span>
            <h4>Oferta de empleo verificable</h4>
            <p>Empresa con sucursal física, correo de dominio oficial y sin ningún tipo de cobro.</p>
            <div className="scc-lesson">
              <strong>Señal crítica:</strong> Canal verificable y transparencia en el proceso.
            </div>
          </div>
        </div>

        <div className="onboarding-bottom-bar">
          <div className="obb-info">
            <span className="obb-dot" />
            <span>Calibración completada · Tu criterio inicial está registrado</span>
          </div>
          <button className="primary-button large teal" type="button" onClick={onNext}>
            Ver mi plan personalizado de práctica <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-flow-step">
      <div className="onboarding-step-hero">
        <span className="eyebrow">03 · Reconocimiento de situaciones</span>
        <h1>¿Te preocupa esta situación?</h1>
        <p>
          Lee el caso real. Dinos si te generaría sospecha para calibrar tu punto de partida.
        </p>
      </div>

      <div className="situation-widescreen-card" key={current.id}>
        <div className="swc-top-bar">
          <span className={`sc-label ${current.label === "riesgo" ? "risk" : "safe"}`}>
            {current.label === "riesgo" ? <><AlertTriangle size={14} /> Situación real para evaluar</> : <><Eye size={14} /> Situación real para evaluar</>}
          </span>
          <span className="swc-progress-pill">
            Caso {index + 1} de {situations.length}
          </span>
        </div>

        <div className="swc-content">
          <h3>{current.title}</h3>
          <div className="swc-message-bubble">
            <p>«{current.body}»</p>
          </div>
        </div>

        <div className="swc-actions">
          <button className="sit-btn no" type="button" onClick={() => respond(false)}>
            <X size={18} />
            <div>
              <strong>No me preocupa</strong>
              <small>Parece un aviso o trámite habitual</small>
            </div>
          </button>
          <button className="sit-btn yes" type="button" onClick={() => respond(true)}>
            <Check size={18} />
            <div>
              <strong>Sí me preocupa</strong>
              <small>Detecto señales sospechosas</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 4: Solution ──────────────────────────── */
function SolutionStage({ goal, friction, onNext }: { goal: Goal; friction: Friction; onNext: () => void }) {
  const goalInfo = goalMap[goal];
  const frictionLabel = frictionToSignal[friction];

  return (
    <div className="onboarding-flow-step">
      <div className="onboarding-step-hero">
        <span className="eyebrow">04 · Tu plan de entrenamiento</span>
        <h1>Tu práctica personalizada está lista</h1>
        <p>
          Configurada según tus respuestas para entrenar el reflejo de PAUSA en situaciones reales de riesgo.
        </p>
      </div>

      <div className="solution-deck-grid">
        <div className="solution-card">
          <div className="slc-icon">
            <Target size={26} />
          </div>
          <span className="slc-badge">Ámbito principal</span>
          <h3>{goalInfo.title}</h3>
          <p>{goalInfo.sub}</p>
        </div>

        <div className="solution-card">
          <div className="slc-icon highlight">
            <Zap size={26} />
          </div>
          <span className="slc-badge">Señal crítica a entrenar</span>
          <h3 style={{ textTransform: "capitalize" }}>{frictionLabel}</h3>
          <p>Aprenderás a identificar la trampa psicológica y frenar antes de enviar dinero, abrir enlaces o compartir datos.</p>
        </div>

        <div className="solution-card">
          <div className="slc-icon">
            <Clock size={26} />
          </div>
          <span className="slc-badge">Estructura de la sesión</span>
          <h3>~4 minutos · 3 decisiones</h3>
          <p>Diagnóstico inicial + Retroalimentación activa + Prueba de transferencia en un contexto nuevo. 100% anónimo.</p>
        </div>
      </div>

      <div className="onboarding-bottom-bar">
        <div className="obb-info">
          <span className="obb-dot" />
          <span>Sin registro ni cobros · Tu progreso se calcula en tiempo real</span>
        </div>
        <button className="primary-button large teal" type="button" onClick={onNext}>
          Iniciar práctica interactiva <ArrowRight size={20} />
        </button>
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
    "Preparando simulación interactiva adaptada…",
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), (i + 1) * 850));
    });
    timers.push(setTimeout(onReady, steps.length * 850 + 700));
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line

  const progressPct = Math.min(100, Math.round((step / steps.length) * 100));

  return (
    <div className="onboarding-flow-step">
      <div className="processing-dashboard-widescreen">
        <div className="processing-icon">
          <Shield size={40} />
        </div>
        <div className="processing-hero-text">
          <span className="eyebrow">Calibración en tiempo real</span>
          <h2>Preparando tu práctica interactiva</h2>
          <p>
            Seleccionamos un escenario de nuestro banco validado según tu objetivo. Sin preguntas genéricas.
          </p>
        </div>

        {/* Live Progress Bar */}
        <div className="pdw-progress-wrap">
          <div className="pdw-progress-info">
            <span>Calibración activa</span>
            <strong>{progressPct}%</strong>
          </div>
          <div className="pdw-track">
            <div className="pdw-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* 3 Live Terminal Cards */}
        <div className="pdw-cards-grid">
          <div className={`pdw-card${step >= 1 ? " done" : ""}`}>
            <span className="pdw-step-num">01</span>
            <strong>Escenario de práctica</strong>
            <p>Caso de {goalMap[goal].title.toLowerCase()}</p>
            {step >= 1 ? <span className="pdw-status-badge ok">✓ Seleccionado</span> : <span className="pdw-status-badge wait">Calibrando…</span>}
          </div>

          <div className={`pdw-card${step >= 2 ? " done" : ""}`}>
            <span className="pdw-step-num">02</span>
            <strong>Punto ciego calibrado</strong>
            <p>{frictionToSignal[friction]}</p>
            {step >= 2 ? <span className="pdw-status-badge ok">✓ Ajustado</span> : <span className="pdw-status-badge wait">En espera…</span>}
          </div>

          <div className={`pdw-card${step >= 3 ? " done" : ""}`}>
            <span className="pdw-step-num">03</span>
            <strong>Prueba de transferencia</strong>
            <p>Caso cruzado para medir aprendizaje</p>
            {step >= 3 ? <span className="pdw-status-badge ok">✓ Listo</span> : <span className="pdw-status-badge wait">En espera…</span>}
          </div>
        </div>
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
