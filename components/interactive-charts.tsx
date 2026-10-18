"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  HookIllustration,
  UrgencyIllustration,
  TrapIllustration,
  PauseIllustration,
} from "./illustrations/attack-cycle-illustrations";

/* ─── 1. Matriz de Criterios de Seguridad Digital (Sin estadísticas sin sustento) ─── */
export type CriterionKey = "urgencia" | "verificacion" | "pagos" | "identidad";

export function CompetencyRadarChart() {
  const [activeCriterion, setActiveCriterion] = useState<CriterionKey>("urgencia");

  const criteria: {
    key: CriterionKey;
    label: string;
    actionTag: string;
    description: string;
    rule: string;
    icon: typeof Shield;
    color: string;
    benchmark: string;
  }[] = [
    {
      key: "urgencia",
      label: "Control de Urgencia",
      actionTag: "Freno cognitivo",
      description: "Resistir plazos artificiales («hoy mismo», «en 20 minutos», «últimos cupos») sin apresurar decisiones ni clics impulsivos.",
      rule: "Los atacantes usan temporizadores psicológicos para anular tu análisis crítico.",
      icon: Clock,
      color: "#0d9488",
      benchmark: "Los plazos inmediatos son una técnica frecuente para forzar decisiones sin consulta previa.",
    },
    {
      key: "verificacion",
      label: "Canal Independiente",
      actionTag: "Validación autónoma",
      description: "Hábito invariable de salir del chat y validar en sitios o directorios oficiales que tú mismo encuentres en un navegador.",
      rule: "Nunca uses números, correos o enlaces suministrados dentro del mismo mensaje sospechoso.",
      icon: ExternalLink,
      color: "#0284c7",
      benchmark: "Romper el canal del mensaje y buscar la empresa por cuenta propia neutraliza la suplantación.",
    },
    {
      key: "pagos",
      label: "Detección de Cobros",
      actionTag: "Filtro financiero",
      description: "Reconocimiento inmediato de cobros injustificados en procesos de selección (exámenes médicos, uniformes, carnets, seguros).",
      rule: "Ninguna empresa formal cobra dinero a un candidato para asegurar una vacante o contratarlo.",
      icon: Zap,
      color: "#d97706",
      benchmark: "El cobro previo de exámenes médicos o dotación es el patrón económico recurrente en falsas ofertas.",
    },
    {
      key: "identidad",
      label: "Custodia de Identidad",
      actionTag: "Protección de datos",
      description: "Freno antes de enviar fotos de cédula por ambos lados, firmas o códigos de verificación OTP por mensajería instantánea.",
      rule: "Tus documentos personales solo deben entregarse tras validación presencial o en plataformas formales verificadas.",
      icon: Lock,
      color: "#16a34a",
      benchmark: "La foto de tu cédula por ambos lados es utilizada para solicitar microcréditos ilícitos a tu nombre.",
    },
  ];

  const current = criteria.find((c) => c.key === activeCriterion)!;

  return (
    <div className="chart-card">
      <div className="gcc-header">
        <div className="gcc-title-group">
          <span className="eyebrow">Marco de Criterio PAUSA</span>
          <h3>Habilidades clave para desarmar fraudes</h3>
        </div>
        <span className="gcc-pill">Matriz de defensa activa</span>
      </div>

      {/* Grid de 4 Criterios observables */}
      <div className="criteria-matrix-grid">
        {criteria.map((c) => {
          const isSelected = activeCriterion === c.key;
          const Icon = c.icon;

          return (
            <button
              key={c.key}
              type="button"
              className={`criterion-item-card${isSelected ? " active" : ""}`}
              onClick={() => setActiveCriterion(c.key)}
            >
              <div className="cic-top">
                <span className="cic-icon" style={{ color: c.color }}>
                  <Icon size={18} />
                </span>
                <span className="cic-tag">{c.actionTag}</span>
              </div>
              <strong className="cic-title">{c.label}</strong>
              <small className="cic-desc">{c.rule}</small>
            </button>
          );
        })}
      </div>

      {/* Panel explicativo interactivo */}
      <div className="criterion-detail-panel">
        <div className="cdp-header">
          <current.icon size={20} style={{ color: current.color }} />
          <strong>{current.label} · {current.actionTag}</strong>
        </div>
        <p>{current.description}</p>
        <div className="cdp-footer-rule">
          <span className="cdp-benchmark-tag">Principio de seguridad:</span>
          <span>{current.benchmark}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Historia Ilustrada del Ciclo del Ataque (Narrativa Visual con Personaje) ─── */
export function AttackFunnelChart() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes = [
    {
      id: "gancho",
      num: "01",
      badge: "Fase 1",
      title: "El Gancho",
      subtitle: "La oferta prometedora",
      themeColor: "#0284c7",
      bgColor: "#f0f9ff",
      illustration: <HookIllustration className="story-stage-svg" />,
      storyText:
        "El atacante contacta a la persona de forma imprevista con una oportunidad laboral atractiva (salario superior al promedio, horarios flexibles o beneficios extraordinarios).",
      baitTitle: "Lo que muestra el mensaje:",
      baitContent: "«Fuiste preseleccionado para Auxiliar Logístico · $2.400.000 + subsidio».",
      mindTitle: "Efecto psicológico:",
      mindContent:
        "Genera ilusión y optimismo inmediato, reduciendo el escepticismo inicial y haciendo que la persona baje la guardia ante preguntas básicas de procedencia.",
      defenseRule:
        "Si no te postulaste formalmente a la empresa o las condiciones son atípicas, no asumas que el remitente es quien dice ser.",
    },
    {
      id: "urgencia",
      num: "02",
      badge: "Fase 2",
      title: "La Urgencia",
      subtitle: "El temporizador artificial",
      themeColor: "#d97706",
      bgColor: "#fffbeb",
      illustration: <UrgencyIllustration className="story-stage-svg" />,
      storyText:
        "Una vez captada la atención, el atacante introduce un límite de tiempo estricto («hoy mismo», «en 20 minutos», «últimos 2 cupos») para bloquear la reflexión.",
      baitTitle: "Lo que muestra el mensaje:",
      baitContent: "«Debes confirmar y realizar el trámite hoy antes del mediodía o el cupo se reasigna».",
      mindTitle: "Efecto psicológico:",
      mindContent:
        "Activa el miedo a perder la oportunidad (FOMO). La mente entra en 'efecto túnel', enfocándose en no perder el empleo en vez de validar si la empresa existe.",
      defenseRule:
        "Toda prisa impuesta por un remitente desconocido es una alerta. Los procesos de selección reales permiten evaluar y consultar sin plazos de minutos.",
    },
    {
      id: "trampa",
      num: "03",
      badge: "Fase 3",
      title: "La Trampa",
      subtitle: "Extracción de dinero o cédula",
      themeColor: "#dc2626",
      bgColor: "#fef2f2",
      illustration: <TrapIllustration className="story-stage-svg" />,
      storyText:
        "Aprovechando la prisa inducida, se solicita una transferencia económica inmediata (exámenes médicos, carnets, dotación) o la foto de la cédula por ambos lados.",
      baitTitle: "Lo que muestra el mensaje:",
      baitContent: "«Consigna $48.000 del examen médico a esta cuenta y envíanos foto de tu cédula».",
      mindTitle: "Efecto psicológico:",
      mindContent:
        "La víctima racionaliza el costo como un paso menor frente al sueldo prometido, cediendo dinero o entregando datos que facilitan suplantaciones financieras.",
      defenseRule:
        "Por ley laboral en Colombia, los exámenes de ingreso son costeados 100% por el empleador. Jamás transfieras dinero para participar en un proceso.",
    },
    {
      id: "pausa",
      num: "PAUSA",
      badge: "La Defensa",
      title: "El Momento PAUSA",
      subtitle: "Verificación por canal autónomo",
      themeColor: "#0d9488",
      bgColor: "#f0fdfa",
      illustration: <PauseIllustration className="story-stage-svg" />,
      storyText:
        "La persona reconoce las señales, frena el impulso de responder en el chat, no envía dinero ni documentos, y abre un navegador por su cuenta para consultar a la empresa oficial.",
      baitTitle: "Acción protectora:",
      baitContent: "Salir del chat de WhatsApp, buscar la empresa en Google y llamar a su línea PBX oficial.",
      mindTitle: "Resultado pedagógico:",
      mindContent:
        "Al no usar los teléfonos ni enlaces que el atacante suministró, se rompe el canal del engaño y se confirma de inmediato que la vacante era fraudulenta.",
      defenseRule:
        "Regla de Oro PAUSA: Sal del chat. Busca tú mismo los canales oficiales y corrobora antes de cualquier acción.",
    },
  ];

  const current = scenes[activeStep];

  // Auto-advance narrative tour when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % scenes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, scenes.length]);

  return (
    <div className="attack-story-theater">
      {/* ─── Story Top Bar: Pipeline Stages Connector ─── */}
      <header className="story-header-pipeline">
        <div className="shp-timeline">
          {scenes.map((s, index) => {
            const isCurrent = activeStep === index;
            const isCompleted = index < activeStep;
            return (
              <button
                key={s.id}
                type="button"
                className={`shp-step-tab${isCurrent ? " active" : ""}${isCompleted ? " completed" : ""}`}
                onClick={() => {
                  setActiveStep(index);
                  setIsPlaying(false);
                }}
                aria-label={`Ver escena ${index + 1}: ${s.title}`}
              >
                <span className="shp-step-pill" style={{ borderColor: isCurrent ? s.themeColor : undefined }}>
                  <span
                    className="shp-step-dot"
                    style={{ backgroundColor: isCurrent || isCompleted ? s.themeColor : undefined }}
                  />
                  <strong>{s.num}</strong>
                </span>
                <span className="shp-step-meta">
                  <span className="shp-step-badge">{s.badge}</span>
                  <strong className="shp-step-name">{s.title}</strong>
                </span>
              </button>
            );
          })}
        </div>

        {/* Play / Autoplay Tour Toggle */}
        <div className="shp-controls">
          <button
            type="button"
            className={`shp-autoplay-btn${isPlaying ? " playing" : ""}`}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pausar narración automática" : "Reproducir historia escena por escena"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? "Pausar recorrido" : "Recorrido animado"}</span>
          </button>
        </div>
      </header>

      {/* ─── Main Story Stage: High-Fidelity SVG Illustration & Pedagogical Insight ─── */}
      <div className="story-stage-grid">
        {/* Left Side: The Rich Editorial SVG Illustration */}
        <div className="story-illustration-card" style={{ borderColor: current.themeColor }}>
          <div className="sic-viewport" key={current.id}>
            {current.illustration}
          </div>

          {/* Floating Navigation Controls */}
          <footer className="sic-nav-footer">
            <button
              type="button"
              className="sic-nav-btn prev"
              disabled={activeStep === 0}
              onClick={() => {
                setActiveStep((prev) => Math.max(0, prev - 1));
                setIsPlaying(false);
              }}
            >
              <ArrowLeft size={16} />
              <span>Anterior</span>
            </button>

            <div className="sic-dots-indicator">
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`sic-dot${activeStep === idx ? " active" : ""}`}
                  style={{ backgroundColor: activeStep === idx ? current.themeColor : undefined }}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  aria-label={`Ir a la escena ${idx + 1}`}
                />
              ))}
              <span className="sic-step-fraction">
                {activeStep + 1} de {scenes.length}
              </span>
            </div>

            <button
              type="button"
              className="sic-nav-btn next"
              onClick={() => {
                setActiveStep((prev) => (prev + 1) % scenes.length);
                setIsPlaying(false);
              }}
            >
              <span>{activeStep === scenes.length - 1 ? "Reiniciar historia" : "Siguiente"}</span>
              {activeStep === scenes.length - 1 ? <RotateCcw size={15} /> : <ArrowRight size={16} />}
            </button>
          </footer>
        </div>

        {/* Right Side: Pedagogical Narrative Panel */}
        <aside className="story-insight-panel" style={{ backgroundColor: current.bgColor }}>
          <div className="sip-header">
            <div className="sip-phase-row">
              <span className="sip-badge" style={{ backgroundColor: current.themeColor }}>
                {current.badge} · Paso {current.num}
              </span>
              <span className="sip-subtitle">{current.subtitle}</span>
            </div>
            <h3 style={{ color: current.themeColor }}>{current.title}</h3>
            <p className="sip-story-desc">{current.storyText}</p>
          </div>

          <div className="sip-breakdown-cards">
            {/* The Trick */}
            <div className="sip-subcard">
              <div className="sip-subcard-title">
                <Compass size={14} style={{ color: current.themeColor }} />
                <strong>{current.baitTitle}</strong>
              </div>
              <p>{current.baitContent}</p>
            </div>

            {/* Cognitive impact */}
            <div className="sip-subcard">
              <div className="sip-subcard-title">
                <Zap size={14} style={{ color: current.themeColor }} />
                <strong>{current.mindTitle}</strong>
              </div>
              <p>{current.mindContent}</p>
            </div>

            {/* PAUSA Golden Rule */}
            <div className="sip-subcard defense" style={{ borderColor: current.themeColor }}>
              <div className="sip-subcard-title">
                <CheckCircle2 size={14} style={{ color: current.themeColor }} />
                <strong>Regla de Criterio PAUSA:</strong>
              </div>
              <p className="sip-defense-copy">{current.defenseRule}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── 3. Gráfica de Distribución de Riesgo por Canal ─── */
export function ChannelRiskChart() {
  const channels = [
    { name: "WhatsApp & Mensajería directa", pct: 64, color: "#16a34a", desc: "Ofertas laborales no solicitadas, cobro de exámenes y dotación." },
    { name: "SMS & Mensajes de texto", pct: 24, color: "#0284c7", desc: "Suplantación bancaria, bloqueos ficticios y enlaces sospechosos." },
    { name: "Correo electrónico no oficial", pct: 12, color: "#d97706", desc: "Dominios que imitan marcas reales con variaciones sutiles." },
  ];

  return (
    <div className="channel-stats-card">
      <div className="csc-header">
        <TrendingUp size={20} className="csc-icon" />
        <div>
          <h4>Canales más utilizados en modalidades reportadas</h4>
          <small>Patrones documentados en denuncias ciudadanas de fraude</small>
        </div>
      </div>
      <div className="csc-bars">
        {channels.map((c) => (
          <div key={c.name} className="csc-row">
            <div className="csc-info">
              <span>{c.name}</span>
              <strong>{c.pct}%</strong>
            </div>
            <div className="csc-track">
              <div className="csc-fill" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
            </div>
            <p className="csc-sub">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
