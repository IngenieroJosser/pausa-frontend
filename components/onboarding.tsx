"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  CheckCheck,
  ChevronLeft,
  Clock,
  CreditCard,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Lock,
  Mail,
  MessageCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
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
  onHome?: () => void;
};

type Stage = "goal" | "friction" | "situations" | "solution" | "processing";

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

/* ─── Situation Data: Realistic simulated cases ──── */
const situations: SituationItem[] = [
  {
    id: "s1",
    label: "riesgo",
    channel: "whatsapp",
    channelName: "WhatsApp",
    title: "Oferta de empleo por chat",
    sender: "Gestión Talento Humano",
    senderMeta: "+57 314 892 0184 · En línea",
    message:
      "¡Hola! Vimos tu hoja de vida y fuiste preseleccionado para la vacante de Auxiliar Administrativo ($2.400.000 + auxilio). Para asegurar tu cupo hoy y agendar la inducción de mañana, debes cancelar $48.000 del examen médico de ingreso y enviarnos foto de tu cédula por ambos lados antes de las 12:00 m. Envía comprobante por aquí.",
    criticalSignal: "Cobro previo por examen médico + solicitud de cédula antes de entrevista.",
    explanation:
      "En Colombia el Ministerio del Trabajo prohíbe exigir dinero a los candidatos para exámenes médicos o dotación. Además, solicitar fotos de tu cédula por chat informal abre la puerta a suplantación de identidad.",
  },
  {
    id: "s2",
    label: "riesgo",
    channel: "sms",
    channelName: "Mensaje SMS",
    title: "Alerta bancaria con plazo límite",
    sender: "BANCO_ALERTA",
    senderMeta: "SMS · Hoy 14:15",
    message:
      "ALERTA BANCO: Detectamos una transacción sospechosa por $840.000 en tu cuenta. Será bloqueada preventivamente en 2 horas por seguridad. Para cancelarla o validar tu identidad ingresa ya a https://bancocentral-seguro.info/validar-cuenta",
    criticalSignal: "Presión de tiempo forzada (2 horas) + enlace a dominio sospechoso (.info).",
    explanation:
      "Los bancos reales nunca amenazan con bloquear cuentas en plazos inmediatos por SMS ni envían enlaces con dominios no oficiales (.info, .xyz). Siempre debes ingresar por la app o portal oficial que conoces.",
  },
  {
    id: "s3",
    label: "seguro",
    channel: "email",
    channelName: "Correo corporativo",
    title: "Citación a entrevista presencial",
    sender: "Selección Grupo Nutresa",
    senderMeta: "seleccion@nutresa.com.co · Canal oficial verificado",
    subject: "Convocatoria Auxiliar de Operaciones — Citación a entrevista presencial",
    message:
      "Estimado(a) postulante: Confirmamos la recepción de tu postulación a través de nuestro portal de empleo oficial. Te citamos a la primera entrevista presencial este jueves a las 9:00 a. m. en nuestra sede administrativa (Calle 72 # 10-34, Piso 3). Por favor asiste con tu cédula original y copia de tu hoja de vida. Nota de seguridad: Nuestros procesos de selección son 100% gratuitos y jamás solicitamos pagos por exámenes médicos ni ningún trámite.",
    criticalSignal: "Dominio institucional corporativo (@nutresa.com.co), sede física verificable y gratuidad garantizada.",
    explanation:
      "Esta es una citación legítima: el correo proviene del dominio oficial de la empresa, te cita a una sede física reconocible y aclara expresamente que nunca te cobrarán por participar.",
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
  visualType: "urgencia" | "marca" | "miedo" | "canal";
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
          En situaciones de <strong>{goalInfo.title.toLowerCase()}</strong>, los atacantes usan trampas psicológicas para apresurar tu decisión. Selecciona la situación que más te cuesta reconocer:
        </p>
      </div>

      <div className="friction-deck-grid">
        {frictions.map(([id, { title, body, tag, example, visualType }], i) => (
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

            {/* Visual representation of the trap */}
            <FrictionIllustration type={visualType} />

            <strong>{title}</strong>
            <p className="fdc-body">{body}</p>
            <div className="fdc-example">
              <span>Señal en el mensaje:</span> {example}
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

/* ─── Real Communication Simulators ─────────────── */

function WhatsAppSimulator({ item }: { item: SituationItem }) {
  return (
    <div className="sim-device-container whatsapp">
      <div className="sim-whatsapp-bar">
        <div className="swb-profile">
          <div className="swb-avatar">TH</div>
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
          <span>Equipo de Selección y Atracción de Talento</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 3: Situation Cards with Realistic Simulators ─ */
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
          <h1>Desglose de tu criterio inicial</h1>
          <p>
            Revisaste tres situaciones en sus canales reales sin pistas previas. Aquí tienes el análisis de lo que evaluaste y las señales críticas que entrenaremos:
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
                    {isRisk ? "Situación de riesgo" : "Canal oficial seguro"}
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
                  <strong>Señal crítica:</strong> {sit.criticalSignal}
                </div>

                <p className="scc-explanation">{sit.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="onboarding-bottom-bar">
          <div className="obb-info">
            <span className="obb-dot" />
            <span>Punto de partida calibrado · Sin sesgos · Listo para la práctica interactiva</span>
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
        <span className="eyebrow">03 · Reconocimiento en canal real</span>
        <h1>¿Te generaría sospecha esta comunicación?</h1>
        <p>
          Examina el mensaje tal como lo recibirías en tu dispositivo. Evalúa sin pistas previas para calibrar tu criterio inicial.
        </p>
      </div>

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
          <span className="ssw-progress-pill">
            Caso {index + 1} de {situations.length}
          </span>
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
              <strong>No me preocupa</strong>
              <small>Parece una comunicación legítima o habitual</small>
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
              <strong>Sí me preocupa</strong>
              <small>Detecto señales de riesgo o desconfianza</small>
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
export function Onboarding({ onComplete, onHome }: OnboardingProps) {
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
          <Brand onClick={onHome} />
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
