"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Check,
  CheckCheck,
  ChevronLeft,
  Clock,
  CreditCard,
  Fingerprint,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Lock,
  Mail,
  MessageCircle,
  CircleCheck,
  Shield,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
import { Brand } from "./brand";
import { fullScenarioBank } from "@/lib/scenarios";

/* ─── Types ─────────────────────────────────────── */
export type Goal = "empleo" | "dinero" | "datos";
export type Friction = "urgencia" | "marca" | "miedo" | "canal";
export type Context = "laboral" | "bancario" | "redes";
export type Habit = "impulso" | "verifico" | "consulto" | "evito";
export type Confidence = "baja" | "media" | "alta";

export type OnboardingResult = {
  goal: Goal;
  friction: Friction;
  habit: Habit;
  confidence: Confidence;
  context: Context;
  calibration?: { scenarioId: string; flagged: boolean }[];
};

type OnboardingProps = {
  onComplete: (result: OnboardingResult) => void;
  onHome?: () => void;
};

type Stage = "goal" | "friction" | "habit" | "confidence" | "situations" | "solution";

export type SituationChannel = "whatsapp" | "sms" | "email";

export type SituationItem = {
  id: string;
  label: "riesgo" | "seguro";
  channel: SituationChannel;
  channelName: string;
  title: string;
  sender: string;
  senderMeta: string;
  subject?: string;
  message: string;
  criticalSignal: string;
  explanation: string;
};

/* ─── Calibración variable basada en el banco de escenarios compartido ─── */
function sampleCalibration(goal: Goal): SituationItem[] {
  const pool = fullScenarioBank.filter((scenario) => scenario.goal === goal && scenario.stage === "diagnostico");
  const risky = shuffleItems(pool.filter((s) => s.risk !== false)).slice(0, 3);
  const safe = shuffleItems(pool.filter((s) => s.risk === false)).slice(0, 1);
  const fallback = shuffleItems(pool).slice(0, 4);
  const chosen = shuffleItems([...risky, ...safe].length >= 4 ? [...risky, ...safe] : fallback).slice(0, 4);
  return chosen.map((scenario) => ({
    id: scenario.id,
    label: scenario.risk === false ? "seguro" : "riesgo",
    channel: scenario.channel ?? "whatsapp",
    channelName: scenario.channel === "sms" ? "SMS" : scenario.channel === "email" ? "Correo electrónico" : "WhatsApp",
    title: scenario.topic ?? "Comunicación inesperada",
    sender: scenario.sender,
    senderMeta: "Escenario educativo ficticio",
    subject: scenario.topic ?? "Notificación",
    message: scenario.messages.join("\n\n"),
    criticalSignal: scenario.risk === false ? "No se observa una solicitud crítica; aun así verifica desde tu plataforma habitual." : "Señales de riesgo en el contenido o en la acción solicitada.",
    explanation: scenario.explanation,
  }));
}

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
  visualType: "urgencia" | "marca" | "miedo" | "canal";
};

type HabitDetail = {
  title: string;
  body: string;
  tag: string;
  hint: string;
  icon: React.ReactNode;
};

type ConfidenceDetail = {
  title: string;
  body: string;
  tone: string;
  meter: number;
};

const frictionMap: Record<Friction, FrictionDetail> = {
  urgencia: {
    title: "La presión de tiempo",
    body: "«Si no respondes en 15 minutos, la oportunidad o el beneficio se cancela».",
    tag: "Urgencia artificial",
    example: "Te impiden consultar con alguien o revisar con calma antes de actuar.",
    visualType: "urgencia",
  },
  marca: {
    title: "Confiar en la marca o logo",
    body: "Si el mensaje incluye el logo, nombre o colores de una empresa conocida, tiendo a bajar la guardia.",
    tag: "Suplantación visual",
    example: "Imitan tipografías y pies de firma idénticos a los corporativos reales.",
    visualType: "marca",
  },
  miedo: {
    title: "Miedo a perder la oportunidad",
    body: "El temor a quedarme sin trabajo o a que bloqueen mi cuenta me hace actuar de inmediato.",
    tag: "Manipulación emocional",
    example: "Aprovechan la necesidad o la preocupación para que no te detengas a pensar.",
    visualType: "miedo",
  },
  canal: {
    title: "No saber cómo verificar",
    body: "No tengo claro qué pasos dar para comprobar si un mensaje o dominio web es auténtico.",
    tag: "Falta de procedimiento",
    example: "Hacer clic en el enlace provisto parece la única opción evidente en el momento.",
    visualType: "canal",
  },
};

const habitMap: Record<Habit, HabitDetail> = {
  impulso: {
    title: "Respondo de inmediato",
    body: "Si el mensaje parece importante, suelo actuar primero y pensar después.",
    tag: "Reacción rápida",
    hint: "Entrenaremos una pausa breve antes de decidir.",
    icon: <Zap size={18} />,
  },
  verifico: {
    title: "Intento verificar por mi cuenta",
    body: "Suelo buscar señales, dominios o aplicaciones oficiales antes de actuar.",
    tag: "Base sólida",
    hint: "Afinaremos qué revisar y en qué orden.",
    icon: <Search size={18} />,
  },
  consulto: {
    title: "Le pregunto a alguien de confianza",
    body: "Prefiero contrastar el mensaje con otra persona antes de tomar una decisión.",
    tag: "Apoyo externo",
    hint: "Te ayudaremos a combinar apoyo con criterio propio.",
    icon: <MessageCircle size={18} />,
  },
  evito: {
    title: "Mejor no hago nada",
    body: "Cuando algo me genera duda, prefiero ignorarlo por completo.",
    tag: "Bloqueo",
    hint: "Practicarás cómo distinguir entre pausar y paralizarte.",
    icon: <Shield size={18} />,
  },
};

const confidenceMap: Record<Confidence, ConfidenceDetail> = {
  baja: {
    title: "Necesito mucha guía",
    body: "Prefiero un ritmo claro, directo y con explicaciones muy visibles.",
    tone: "Ruta acompañada",
    meter: 1,
  },
  media: {
    title: "Tengo cierta intuición",
    body: "Reconozco algunas señales, pero todavía me cuesta decidir con seguridad.",
    tone: "Ruta equilibrada",
    meter: 2,
  },
  alta: {
    title: "Quiero un reto interesante",
    body: "Ya detecto varios patrones y quiero comprobar si realmente aplico bien el criterio.",
    tone: "Ruta desafiante",
    meter: 3,
  },
};

function shuffleItems<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

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

/* ─── Onboarding progress: six meaningful stages, no fake loading step ─── */
const STAGES: Stage[] = ["goal", "friction", "habit", "confidence", "situations", "solution"];
const STAGE_LABELS: Record<Stage, string> = {
  goal: "Tu objetivo", friction: "Tu dificultad", habit: "Tu reacción",
  confidence: "Tu confianza", situations: "Reconocimiento", solution: "Tu plan",
};
function NavDots({ current }: { current: Stage }) {
  const idx = STAGES.indexOf(current);
  return (
    <div className="onboarding-progress" role="progressbar"
      aria-label="Progreso de personalización" aria-valuemin={1}
      aria-valuemax={STAGES.length} aria-valuenow={idx + 1}
      aria-valuetext={`Paso ${idx + 1} de ${STAGES.length}: ${STAGE_LABELS[current]}`}>
      <span className="onboarding-progress-copy">{STAGE_LABELS[current]} · {idx + 1}/{STAGES.length}</span>
      <div className="onboarding-steps" aria-hidden="true">
        {STAGES.map((stage, i) => (
          <span key={stage} className={`onboarding-step-dot${i === idx ? " active" : i < idx ? " done" : ""}`} />
        ))}
      </div>
    </div>
  );
}

/* ─── Editorial visual previews for the three pathways ─── */
function GoalArtwork({ goal }: { goal: Goal }) {
  if (goal === "empleo") {
    return (
      <div className="goal-artwork artwork-job" aria-hidden="true">
        <div className="artwork-job-window">
          <div className="artwork-window-top"><span /><span /><span /><small>MENSAJE RECIBIDO</small></div>
          <div className="artwork-job-content">
            <div className="artwork-avatar"><Briefcase size={17} /></div>
            <div className="artwork-message-lines"><i /><i /><i /></div>
          </div>
          <div className="artwork-job-alert"><AlertTriangle size={12} /> ¿Oferta real o trampa?</div>
        </div>
        <span className="artwork-side-label">SIMULACIÓN / 01</span>
      </div>
    );
  }
  if (goal === "dinero") {
    return (
      <div className="goal-artwork artwork-money" aria-hidden="true">
        <div className="artwork-bank-card">
          <div className="artwork-bank-top"><span>CUENTA PERSONAL</span><CreditCard size={17} /></div>
          <strong>$ 840.000</strong>
          <span className="artwork-bank-bottom">MOVIMIENTO POR VERIFICAR</span>
        </div>
        <span className="artwork-security-bubble"><ShieldAlert size={15} /></span>
        <span className="artwork-side-label">SIMULACIÓN / 02</span>
      </div>
    );
  }
  return (
    <div className="goal-artwork artwork-data" aria-hidden="true">
      <div className="artwork-identity-card">
        <div className="artwork-identity-icon"><Fingerprint size={43} strokeWidth={1.2} /></div>
        <div className="artwork-identity-lines"><i /><i /><i /></div>
        <span className="artwork-identity-lock"><Lock size={13} /> INFORMACIÓN PRIVADA</span>
      </div>
      <span className="artwork-side-label">SIMULACIÓN / 04</span>
    </div>
  );
}

/* ─── Stage 1: Goal — Editorial question experience ─── */
function GoalStage({ onNext, initialSelected }: { onNext: (goal: Goal) => void; initialSelected?: Goal | null }) {
  const [selected, setSelected] = useState<Goal | null>(initialSelected ?? "empleo");
  const goals = Object.entries(goalMap) as [Goal, GoalDetail][];
  const activeGoal = selected ? goalMap[selected] : goalMap.empleo;

  return (
    <div className="onboarding-flow-step questionnaire-flow questionnaire-goals">
      <div className="questionnaire-topline">
        <span><span className="questionnaire-topline-indicator" /> PAUSA / PERSONALIZA TU EXPERIENCIA</span>
        <span>ETAPA 01 <span className="questionnaire-topline-muted">/ 06</span></span>
      </div>

      <div className="onboarding-step-hero question-hero">
        <span className="question-eyebrow"><span>01</span> PRIMERO, LO QUE IMPORTA</span>
        <h1>¿Qué quieres <span className="question-highlight">proteger</span> hoy?</h1>
        <p>Vamos a entrenar tus decisiones frente a situaciones digitales reales. Elige lo que más te importa; nosotros adaptamos la experiencia.</p>
      </div>

      <div className="question-deck-heading">
        <span>01 — ELIGE TU PRIORIDAD</span>
        <span><CircleCheck size={14} /> Una elección. Un entrenamiento hecho para ti.</span>
      </div>

      <div className="goal-deck-grid" role="group" aria-label="Selecciona qué quieres proteger">
        {goals.map(([id, { icon, title, sub, badge, tags }], i) => (
          <button
            key={id}
            className={`goal-deck-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            type="button"
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            <div className="gdc-header">
              <span className="gdc-card-index">0{i + 1} / 03</span>
              <span className="gdc-check" aria-hidden="true">{selected === id ? <Check size={17} strokeWidth={2.5} /> : <ArrowUpRight size={17} />}</span>
            </div>
            <GoalArtwork goal={id} />
            <div className="gdc-content">
              <span className="gdc-topic"><span className="gdc-icon">{icon}</span><span>{badge}</span></span>
              <strong>{title}</strong>
              <p>{sub}</p>
            </div>
            <div className="gdc-tags">
              {tags.map((tag) => <span key={tag} className="gdc-tag">{tag}</span>)}
            </div>
            <div className="gdc-select-footer">
              <span>{selected === id ? "RUTA SELECCIONADA" : "ELEGIR ESTA RUTA"}</span>
              <ArrowRight size={18} />
            </div>
          </button>
        ))}
      </div>

      <div className="onboarding-bottom-bar question-bottom-bar">
        <div className="question-selection-preview" aria-live="polite">
          <span className="question-preview-icon"><ShieldCheck size={22} /></span>
          <span className="question-preview-copy">
            <small>TU ENTRENAMIENTO, EN CONSTRUCCIÓN</small>
            <strong>{activeGoal.title}</strong>
            <span>{activeGoal.focusPoint}</span>
          </span>
        </div>
        <button
          className="primary-button large teal question-next-button"
          type="button"
          aria-label={`Continuar con ${activeGoal.title}`}
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
        >
          Continuar <span className="question-next-icon"><ArrowRight size={20} /></span>
        </button>
      </div>
      <p className="question-privacy-note"><Lock size={12} /> Sin registro. Sin información personal. Solo escenarios simulados.</p>
    </div>
  );
}

/* ─── Friction Micro-Illustration Component ──────── */
function FrictionIllustration({ type }: { type: "urgencia" | "marca" | "miedo" | "canal" }) {
  if (type === "urgencia") {
    return (
      <div className="friction-visual-pill urgencia">
        <div className="fvp-countdown">
          <Clock size={16} className="fvp-spin" />
          <span className="fvp-time">00:14:59</span>
          <span className="fvp-badge-urg">¡Expira pronto!</span>
        </div>
        <div className="fvp-sub">«Solo hoy · Últimos cupos»</div>
      </div>
    );
  }

  if (type === "marca") {
    return (
      <div className="friction-visual-pill marca">
        <div className="fvp-badge-row">
          <Building2 size={16} />
          <strong>Empresa Reconocida S.A.</strong>
          <span className="fvp-fake-check">✓</span>
        </div>
        <div className="fvp-sub unverified">
          <AlertCircle size={12} />
          <span>Remitente: empleo-urgente@mail-gratis.com</span>
        </div>
      </div>
    );
  }

  if (type === "miedo") {
    return (
      <div className="friction-visual-pill miedo">
        <div className="fvp-alert-row">
          <ShieldAlert size={16} />
          <strong>Acción inmediata requerida</strong>
        </div>
        <div className="fvp-sub threat">«Tu cuenta o vacante será cancelada»</div>
      </div>
    );
  }

  return (
    <div className="friction-visual-pill canal">
      <div className="fvp-path-row">
        <span className="fvp-path bad">
          <X size={12} /> Enlace en el mensaje
        </span>
        <span className="fvp-vs">vs</span>
        <span className="fvp-path good">
          <Check size={12} /> Portal oficial
        </span>
      </div>
      <div className="fvp-sub">¿Cómo compruebo si es real?</div>
    </div>
  );
}

/* ─── Stage 2: Friction — Decision-making trigger ─── */
function FrictionStage({ goal, onNext, initialSelected }: { goal: Goal; onNext: (f: Friction) => void; initialSelected?: Friction | null }) {
  const [selected, setSelected] = useState<Friction | null>(initialSelected ?? "urgencia");
  const frictions = Object.entries(frictionMap) as [Friction, FrictionDetail][];
  const goalInfo = goalMap[goal];
  const selectedInfo = selected ? frictionMap[selected] : null;

  return (
    <div className="onboarding-flow-step questionnaire-flow questionnaire-frictions">
      <div className="questionnaire-topline">
        <span><span className="questionnaire-topline-indicator" /> PAUSA / PERSONALIZA TU EXPERIENCIA</span>
        <span>ETAPA 02 <span className="questionnaire-topline-muted">/ 06</span></span>
      </div>

      <div className="onboarding-step-hero question-hero">
        <span className="question-eyebrow"><span>02</span> AHORA, CONOCE TU PUNTO CIEGO</span>
        <h1>¿Qué te hace difícil <span className="question-highlight">detenerte</span>?</h1>
        <p>Alguien puede manipular tu decisión sin que lo notes. ¿Cuál de estas situaciones te resulta más difícil de manejar?</p>
        <span className="question-context-chip"><Shield size={14} /> Estás entrenando: <strong>{goalInfo.title}</strong></span>
      </div>

      <div className="question-deck-heading">
        <span>02 — RECONOCE TU PUNTO CIEGO</span>
        <span><CircleCheck size={14} /> No hay respuestas buenas ni malas.</span>
      </div>

      <div className="friction-deck-grid" role="group" aria-label="Selecciona tu principal dificultad">
        {frictions.map(([id, { title, body, tag, example, visualType }], i) => (
          <button
            key={id}
            className={`friction-deck-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            type="button"
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            <div className="fdc-header">
              <span className="fdc-number">0{i + 1} <span>/ 04</span></span>
              <span className="fdc-tag">{tag}</span>
              <span className="fdc-check" aria-hidden="true">{selected === id ? <Check size={16} /> : <ArrowUpRight size={17} />}</span>
            </div>
            <div className="fdc-main">
              <div className="fdc-copy">
                <strong>{title}</strong>
                <p className="fdc-body">{body}</p>
              </div>
              <FrictionIllustration type={visualType} />
            </div>
            <div className="fdc-example"><span>Lo que podría ocurrir</span><p>{example}</p></div>
            <div className="fdc-select-footer">
              <span>{selected === id ? "ESTA ES MI DIFICULTAD" : "ELEGIR DIFICULTAD"}</span>
              <ArrowRight size={16} />
            </div>
          </button>
        ))}
      </div>

      <div className="onboarding-bottom-bar question-bottom-bar">
        <div className="question-selection-preview" aria-live="polite">
          <span className="question-preview-icon"><Target size={22} /></span>
          <span className="question-preview-copy">
            <small>ESTE SERÁ TU FOCO DE PRÁCTICA</small>
            <strong>{selectedInfo?.title ?? "Selecciona una dificultad"}</strong>
            <span>{selectedInfo?.example ?? "Personalizaremos las situaciones para ti."}</span>
          </span>
        </div>
        <button
          className="primary-button large teal question-next-button"
          type="button"
          aria-label="Continuar a situaciones de práctica"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
        >
          Ver situaciones <span className="question-next-icon"><ArrowRight size={20} /></span>
        </button>
      </div>
      <p className="question-privacy-note"><Lock size={12} /> No evaluamos quién eres. Entrenamos cómo decides.</p>
    </div>
  );
}

/* ─── Stage 3: Habit / default reaction ─────────── */
function HabitStage({ goal, friction, onNext, initialSelected }: { goal: Goal; friction: Friction; onNext: (habit: Habit) => void; initialSelected?: Habit | null }) {
  const [selected, setSelected] = useState<Habit>(initialSelected ?? "verifico");
  const habits = Object.entries(habitMap) as [Habit, HabitDetail][];
  const frictionInfo = frictionMap[friction];
  const selectedInfo = habitMap[selected];

  return (
    <div className="onboarding-flow-step questionnaire-flow questionnaire-habits">
      <div className="questionnaire-topline">
        <span><span className="questionnaire-topline-indicator" /> PAUSA / AJUSTA EL RECORRIDO</span>
        <span>ETAPA 03 <span className="questionnaire-topline-muted">/ 06</span></span>
      </div>

      <div className="onboarding-step-hero question-hero">
        <span className="question-eyebrow"><span>03</span> ENTENDER TU REACCIÓN TAMBIÉN IMPORTA</span>
        <h1>Cuando algo te activa, ¿cómo <span className="question-highlight">sueles reaccionar</span>?</h1>
        <p>Con esto ajustamos el tono del entrenamiento para que se sienta útil, intuitivo y nada pesado.</p>
        <span className="question-context-chip"><Sparkles size={14} /> Entrenando: <strong>{goalMap[goal].title}</strong> · Riesgo a vigilar: <strong>{frictionInfo.title}</strong></span>
      </div>

      <div className="micro-question-grid" role="group" aria-label="Selecciona cómo sueles reaccionar">
        {habits.map(([id, item], i) => (
          <button
            key={id}
            type="button"
            className={`micro-question-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            <div className="mqc-top">
              <span className="mqc-step">0{i + 1}</span>
              <span className="mqc-tag">{item.tag}</span>
              <span className="mqc-check">{selected === id ? <Check size={16} /> : item.icon}</span>
            </div>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <small>{item.hint}</small>
          </button>
        ))}
      </div>

      <div className="onboarding-bottom-bar question-bottom-bar">
        <div className="question-selection-preview" aria-live="polite">
          <span className="question-preview-icon"><Eye size={22} /></span>
          <span className="question-preview-copy">
            <small>ASÍ SE AJUSTA TU EXPERIENCIA</small>
            <strong>{selectedInfo.title}</strong>
            <span>{selectedInfo.hint}</span>
          </span>
        </div>
        <button className="primary-button large teal question-next-button" type="button" onClick={() => onNext(selected)}>
          Seguir personalizando <span className="question-next-icon"><ArrowRight size={20} /></span>
        </button>
      </div>
    </div>
  );
}

/* ─── Stage 4: Confidence level ─────────────────── */
function ConfidenceStage({ goal, habit, onNext, initialSelected }: { goal: Goal; habit: Habit; onNext: (confidence: Confidence) => void; initialSelected?: Confidence | null }) {
  const [selected, setSelected] = useState<Confidence>(initialSelected ?? "media");
  const levels = Object.entries(confidenceMap) as [Confidence, ConfidenceDetail][];
  const habitInfo = habitMap[habit];
  const selectedInfo = confidenceMap[selected];

  return (
    <div className="onboarding-flow-step questionnaire-flow questionnaire-confidence">
      <div className="questionnaire-topline">
        <span><span className="questionnaire-topline-indicator" /> PAUSA / RITMO DE LA SESIÓN</span>
        <span>ETAPA 04 <span className="questionnaire-topline-muted">/ 06</span></span>
      </div>

      <div className="onboarding-step-hero question-hero">
        <span className="question-eyebrow"><span>04</span> UN RETO QUE SE SIENTA BIEN</span>
        <h1>¿Qué tan <span className="question-highlight">seguro</span> te sientes hoy?</h1>
        <p>Queremos que la experiencia sea agradable y divertida, pero con seriedad. Elige el nivel que más te represente.</p>
        <span className="question-context-chip"><Target size={14} /> Tu estilo actual: <strong>{habitInfo.title}</strong></span>
      </div>

      <div className="confidence-stack" role="group" aria-label="Selecciona nivel de confianza">
        {levels.map(([id, item], i) => (
          <button
            key={id}
            type="button"
            className={`confidence-card${selected === id ? " selected" : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            <div className="confidence-copy">
              <div className="confidence-label-row">
                <span className="confidence-index">0{i + 1}</span>
                <span className="confidence-tone">{item.tone}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
            <div className="confidence-meter" aria-hidden="true">
              {[1,2,3].map((n) => <span key={n} className={n <= item.meter ? "fill" : ""} />)}
            </div>
          </button>
        ))}
      </div>

      <div className="onboarding-bottom-bar question-bottom-bar">
        <div className="question-selection-preview" aria-live="polite">
          <span className="question-preview-icon"><CircleCheck size={22} /></span>
          <span className="question-preview-copy">
            <small>RITMO ESTIMADO DE LA SESIÓN</small>
            <strong>{selectedInfo.tone}</strong>
            <span>Los casos se ajustarán al nivel seleccionado.</span>
          </span>
        </div>
        <button className="primary-button large teal question-next-button" type="button" onClick={() => onNext(selected)}>
          Ver casos rápidos <span className="question-next-icon"><ArrowRight size={20} /></span>
        </button>
      </div>
    </div>
  );
}

/* ─── Real Communication Simulators ─────────────── */

function WhatsAppSimulator({ item }: { item: SituationItem }) {
  return (
    <div className="sim-device-container whatsapp">
      <div className="sim-whatsapp-bar">
        <div className="swb-profile">
          <div className="swb-avatar">{item.sender.split(" ").slice(0, 2).map((word) => word.charAt(0)).join("").toUpperCase()}</div>
          <div className="swb-info">
            <strong>{item.sender}</strong>
            <small>{item.senderMeta}</small>
          </div>
        </div>
        <div className="swb-secure-tag">
          <Lock size={12} />
          <span>Cifrado</span>
        </div>
      </div>

      <div className="sim-whatsapp-chat-stage">
        <div className="sim-encryption-pill">
          <Lock size={11} />
          <span>Los mensajes en este chat están cifrados de extremo a extremo.</span>
        </div>

        <div className="sim-whatsapp-bubble">
          <p className="sim-whatsapp-text">{item.message}</p>
          <div className="sim-whatsapp-footer">
            <span>10:42 a. m.</span>
            <CheckCheck size={14} className="sim-checks-read" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SmsSimulator({ item }: { item: SituationItem }) {
  return (
    <div className="sim-device-container sms">
      <div className="sim-sms-header">
        <div className="ssh-sender-group">
          <Smartphone size={16} />
          <strong>{item.sender}</strong>
        </div>
        <span className="ssh-time">{item.senderMeta}</span>
      </div>

      <div className="sim-sms-body-stage">
        <div className="sim-sms-bubble">
          <p className="sim-sms-text">{item.message}</p>
          <span className="sim-sms-time-stamp">Hoy 14:15 · SMS entrante</span>
        </div>
      </div>
    </div>
  );
}

function EmailSimulator({ item }: { item: SituationItem }) {
  return (
    <div className="sim-device-container email">
      <div className="sim-email-chrome">
        <div className="sec-dots">
          <span className="sec-dot red" />
          <span className="sec-dot yellow" />
          <span className="sec-dot green" />
        </div>
        <span className="sec-title">Bandeja de entrada — Correo</span>
      </div>

      <div className="sim-email-header">
        <div className="seh-subject">
          <h3>{item.subject}</h3>
        </div>
        <div className="seh-meta-row">
          <div className="seh-sender-badge">
            <Mail size={14} />
            <div className="seh-sender-details">
              <strong>{item.sender}</strong>
              <small>{item.senderMeta}</small>
            </div>
          </div>
          <span className="seh-date">Hoy 08:30 a. m.</span>
        </div>
      </div>

      <div className="sim-email-content">
        <p className="sim-email-body-text">{item.message}</p>
        <div className="sim-email-signature">
          <Building2 size={15} />
          <span>Comunicación ficticia · Ejercicio PAUSA</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 5: Situation Cards with Realistic Simulators ─ */
function SituationsStage({ goal, situations, calibration, onAnswer, onNext }: {
  goal: Goal;
  situations: SituationItem[];
  calibration: { scenarioId: string; flagged: boolean }[];
  onAnswer: (scenarioId: string, flagged: boolean) => void;
  onNext: () => void;
}) {
  const [index, setIndex] = useState(() => Math.min(calibration.length, situations.length));
  const answers = Object.fromEntries(calibration.map((item) => [item.scenarioId, item.flagged]));
  const current = situations[index];
  const done = index >= situations.length;

  function respond(isConcerning: boolean) {
    onAnswer(current.id, isConcerning);
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className="onboarding-flow-step">
        <div className="onboarding-step-hero">
          <span className="eyebrow">05 · Calibración completada</span>
          <h1>Desglose de tu criterio inicial</h1>
          <p>
            Revisaste cuatro situaciones breves. Identificaste correctamente {situations.filter((sit) => (answers[sit.id] === (sit.label === "riesgo"))).length} de 4. Estas respuestas orientan los próximos casos:
          </p>
        </div>

        <div className="situation-summary-grid">
          {situations.map((sit) => {
            const userSaidConcerning = answers[sit.id];
            const isRisk = sit.label === "riesgo";
            // Correct discernment: User flagged risk as concerning, or recognized safe as not concerning
            const isAccurate = isRisk ? userSaidConcerning === true : userSaidConcerning === false;

            return (
              <div className="summary-case-card" key={sit.id}>
                <div className="scc-header-row">
                  <span className={`scc-badge ${isRisk ? "risk" : "safe"}`}>
                    {isRisk ? "Situación de riesgo" : "Sin riesgo evidente"}
                  </span>
                  <span className="scc-channel-tag">{sit.channelName}</span>
                </div>

                <h4>{sit.title}</h4>

                {/* User response badge */}
                <div className={`scc-user-verdict ${isAccurate ? "correct" : "blindspot"}`}>
                  {isAccurate ? (
                    <>
                      <Check size={14} />
                      <span>Tu respuesta: {userSaidConcerning ? "Detectaste sospecha" : "No te preocupó"} (Criterio acertado)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={14} />
                      <span>
                        Tu respuesta: {userSaidConcerning ? "Marcaste sospecha" : "No te preocupó"} ({isRisk ? "Punto ciego registrado" : "Cautela extra"})
                      </span>
                    </>
                  )}
                </div>

                <div className="scc-lesson">
                  <strong>Observación útil:</strong> {sit.criticalSignal}
                </div>

                <p className="scc-explanation">{sit.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="onboarding-bottom-bar">
          <div className="obb-info">
            <span className="obb-dot" />
            <span>Punto de partida calibrado · Listo para tu práctica interactiva</span>
          </div>
          <button className="primary-button large teal" type="button" onClick={onNext}>
            Ver mi plan personalizado de práctica <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-flow-step calibration-stage">
      <div className="onboarding-step-hero">
        <span className="eyebrow">05 · Radar de reconocimiento · {goalMap[goal].title}</span>
        <h1>¿Confiarías en <em>este mensaje?</em></h1>
        <p>
          Cada visita trae casos diferentes de tu tema. Es un bloque corto, dinámico y con variedad real para que entrenes sin sentirlo repetitivo.
        </p>
      </div>

      <div className="calibration-overview" aria-label="Tu recorrido de reconocimiento">
        <div className="calibration-count"><span>CASO</span><strong>{String(index + 1).padStart(2, "0")}</strong><span>/ 04</span></div>
        <div className="calibration-overview-content">
          <span>Tu radar de decisiones <span aria-hidden="true">✦</span> {goalMap[goal].title}</span>
          <div className="calibration-timeline" aria-label={`${index} de 4 casos completados`}>
            {[0, 1, 2, 3].map((point) => <div key={point} className={point < index ? "complete" : point === index ? "current" : ""} />)}
          </div>
        </div>
        <span className="calibration-counter">Más de 45 combinaciones disponibles</span>
      </div>

      {index > 0 && (
        <button type="button" className="calibration-back-button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          <ChevronLeft size={17} /> Corregir la respuesta anterior
        </button>
      )}
      <div className="situation-simulator-widescreen" key={current.id}>
        {/* Neutral header without spoilers */}
        <div className="ssw-neutral-bar">
          <div className="ssw-meta-tag">
            <span className="ssw-channel-icon">
              {current.channel === "whatsapp" && <MessageCircle size={15} />}
              {current.channel === "sms" && <Smartphone size={15} />}
              {current.channel === "email" && <Mail size={15} />}
            </span>
            <span>Canal simulado: {current.channelName}</span>
          </div>
          <span className="ssw-progress-pill">{current.title}</span>
        </div>

        {/* Realistic channel simulator */}
        <div className="ssw-simulator-stage">
          {current.channel === "whatsapp" && <WhatsAppSimulator item={current} />}
          {current.channel === "sms" && <SmsSimulator item={current} />}
          {current.channel === "email" && <EmailSimulator item={current} />}
        </div>

        {/* Clear, neutral decision action */}
        <div className="ssw-actions-row">
          <button className="sit-btn no" type="button" onClick={() => respond(false)}>
            <div className="sit-btn-icon-wrap no" aria-hidden="true">
              <ShieldCheck size={22} strokeWidth={2.2} />
            </div>
            <div className="sit-btn-text">
              <strong>No encuentro señales críticas</strong>
              <small>Puedo continuar si confirmo el contexto por mi cuenta</small>
            </div>
            <div className="sit-btn-arrow" aria-hidden="true">
              <ArrowRight size={18} />
            </div>
          </button>

          <button className="sit-btn yes" type="button" onClick={() => respond(true)}>
            <div className="sit-btn-icon-wrap yes" aria-hidden="true">
              <AlertTriangle size={22} strokeWidth={2.2} />
            </div>
            <div className="sit-btn-text">
              <strong>Detecto posibles riesgos</strong>
              <small>Hay elementos que debo investigar antes de actuar</small>
            </div>
            <div className="sit-btn-arrow" aria-hidden="true">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 6: Solution ──────────────────────────── */
function SolutionStage({ goal, friction, onNext }: { goal: Goal; friction: Friction; onNext: () => void }) {
  const goalInfo = goalMap[goal];
  const frictionLabel = frictionToSignal[friction];

  return (
    <div className="onboarding-flow-step">
      <div className="onboarding-step-hero">
        <span className="eyebrow">06 · Tu plan de entrenamiento</span>
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
          <h3>~5 minutos · 10 a 12 interacciones</h3>
          <p>Incluye 4 casos rápidos de reconocimiento + 3 decisiones evaluadas + microajustes de perfil. Corto, variado y 100% anónimo.</p>
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

/* ─── Main Onboarding Component ──────────────────── */
export function Onboarding({ onComplete, onHome }: OnboardingProps) {
  const [stage, setStage] = useState<Stage>("goal");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [friction, setFriction] = useState<Friction | null>(null);
  const [habit, setHabit] = useState<Habit | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [calibration, setCalibration] = useState<{ scenarioId: string; flagged: boolean }[]>([]);
  const [situations, setSituations] = useState<SituationItem[]>([]);

  const canGoBack = stage !== "goal";
  const stageIndex = STAGES.indexOf(stage);

  function goBack() {
    if (stageIndex > 0) setStage(STAGES[stageIndex - 1]);
  }

  function handleGoalNext(g: Goal) {
    if (g !== goal || situations.length === 0) {
      setSituations(sampleCalibration(g));
      setCalibration([]);
      setFriction(null);
      setHabit(null);
      setConfidence(null);
    }
    setGoal(g);
    setStage("friction");
  }

  function handleFrictionNext(f: Friction) {
    setFriction(f);
    setStage("habit");
  }

  function handleHabitNext(value: Habit) {
    setHabit(value);
    setStage("confidence");
  }

  function handleConfidenceNext(value: Confidence) {
    setConfidence(value);
    setStage("situations");
  }

  function handleCalibrationAnswer(scenarioId: string, flagged: boolean) {
    setCalibration((previous) => [
      ...previous.filter((item) => item.scenarioId !== scenarioId),
      { scenarioId, flagged },
    ]);
  }

  function handleSituationsNext() {
    setStage("solution");
  }

  function handleReady() {
    const finalGoal: Goal = goal || "empleo";
    const finalFriction: Friction = friction || "urgencia";
    const finalHabit: Habit = habit || "verifico";
    const finalConfidence: Confidence = confidence || "media";
    onComplete({
      goal: finalGoal,
      friction: finalFriction,
      habit: finalHabit,
      confidence: finalConfidence,
      context: goalToContext[finalGoal],
      calibration,
    });
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
          <Brand onClick={onHome} />
        </div>
        <NavDots current={stage} />
        <span className="onboarding-nav-assurance"><Lock size={13} /> Sin registro</span>
      </nav>

      <div className="onboarding-body" key={stage}>
        {stage === "goal" && <GoalStage onNext={handleGoalNext} initialSelected={goal} />}
        {stage === "friction" && goal && <FrictionStage goal={goal} onNext={handleFrictionNext} initialSelected={friction} />}
        {stage === "habit" && goal && friction && <HabitStage goal={goal} friction={friction} onNext={handleHabitNext} initialSelected={habit} />}
        {stage === "confidence" && goal && habit && <ConfidenceStage goal={goal} habit={habit} onNext={handleConfidenceNext} initialSelected={confidence} />}
        {stage === "situations" && goal && situations.length > 0 && (
          <SituationsStage goal={goal} situations={situations} calibration={calibration}
            onAnswer={handleCalibrationAnswer} onNext={handleSituationsNext} />
        )}
        {stage === "solution" && goal && friction && (
          <SolutionStage goal={goal} friction={friction} onNext={handleReady} />
        )}
      </div>
    </div>
  );
}
