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

/* ─── 1. Matriz de Criterios de Seguridad Digital ─── */
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

/* ─── 2. Historia Ilustrada del Ciclo del Ataque ─── */
type InsightType = "bait" | "mind" | "defense";

export function AttackFunnelChart() {
  const [activeStep, setActiveStep] = useState(0);
  const [insightStep, setInsightStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes = [
    {
      id: "gancho",
      num: "01",
      badge: "Fase 1",
      title: "El Gancho",
      subtitle: "La oferta inesperada",
      themeColor: "#0284c7",
      bgColor: "#f0f9ff",
      illustration: <HookIllustration className="story-stage-svg" />,
      insights: [
        {
          icon: Compass,
          label: "El anzuelo",
          title: "Lo que muestra el mensaje",
          body: "«Fuiste preseleccionado para Auxiliar Logístico · $2.400.000 + subsidio de transporte. Cupo limitado.» Llegó sin que te hayas postulado.",
          type: "bait" as InsightType,
        },
        {
          icon: Zap,
          label: "Efecto psicológico",
          title: "La selección inesperada baja la guardia",
          body: "Creer que 'alguien ya te eligió' genera optimismo que reduce el escepticismo. La persona se enfoca en asegurar el cupo, no en verificar el remitente.",
          type: "mind" as InsightType,
        },
        {
          icon: CheckCircle2,
          label: "Criterio PAUSA",
          title: "Primera señal de alerta",
          body: "¿No te postulaste a esta empresa? ¿El contacto llegó por WhatsApp sin aviso previo? Esas dos condiciones juntas son motivo de pausa antes de responder.",
          type: "defense" as InsightType,
        },
      ],
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
      insights: [
        {
          icon: Compass,
          label: "El anzuelo",
          title: "Lo que muestra el mensaje",
          body: "«Debes confirmar y realizar el trámite hoy antes del mediodía o el cupo se reasigna a otro candidato.»",
          type: "bait" as InsightType,
        },
        {
          icon: Zap,
          label: "Efecto psicológico",
          title: "El 'efecto túnel' bloquea el análisis",
          body: "El plazo artificial activa el miedo a perder la oportunidad (FOMO). La mente prioriza actuar rápido sobre actuar bien, anulando la verificación básica.",
          type: "mind" as InsightType,
        },
        {
          icon: CheckCircle2,
          label: "Criterio PAUSA",
          title: "La prisa impuesta siempre es sospechosa",
          body: "Los procesos de selección legítimos no imponen plazos de minutos. Cualquier urgencia extrema desde un remitente desconocido es una señal para detenerse.",
          type: "defense" as InsightType,
        },
      ],
    },
    {
      id: "trampa",
      num: "03",
      badge: "Fase 3",
      title: "La Trampa",
      subtitle: "Extracción de dinero o identidad",
      themeColor: "#dc2626",
      bgColor: "#fef2f2",
      illustration: <TrapIllustration className="story-stage-svg" />,
      insights: [
        {
          icon: Compass,
          label: "El anzuelo",
          title: "Lo que muestra el mensaje",
          body: "«Consigna $48.000 del examen médico de ingreso a esta cuenta y envíanos foto de tu cédula por ambos lados para completar el proceso.»",
          type: "bait" as InsightType,
        },
        {
          icon: Zap,
          label: "Efecto psicológico",
          title: "El costo parece menor frente al beneficio",
          body: "La víctima racionaliza: «$48.000 es poco comparado con el sueldo mensual». Ese razonamiento es exactamente el objetivo del atacante.",
          type: "mind" as InsightType,
        },
        {
          icon: CheckCircle2,
          label: "Criterio PAUSA",
          title: "En Colombia, el candidato nunca paga",
          body: "La normativa laboral colombiana prohíbe cobrar al candidato exámenes de ingreso, dotación o carnets. Un cobro previo es una señal definitiva de fraude.",
          type: "defense" as InsightType,
        },
      ],
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
      insights: [
        {
          icon: Compass,
          label: "La acción protectora",
          title: "Sal del chat y no uses sus datos",
          body: "Cierra el chat. No llames al número que te dieron ni entres al enlace que te enviaron. Abre tu navegador y busca la empresa por tu cuenta.",
          type: "bait" as InsightType,
        },
        {
          icon: Zap,
          label: "Cómo verificar correctamente",
          title: "Compara por canales independientes",
          body: "Busca el sitio oficial de la empresa en Google, revisa que el dominio sea exacto y llama al conmutador PBX que aparece en esa página, no al número del mensaje.",
          type: "mind" as InsightType,
        },
        {
          icon: CheckCircle2,
          label: "Regla de Oro PAUSA",
          title: "Verificar es siempre el paso correcto",
          body: "Si la empresa no puede confirmar la oferta por sus propios canales oficiales, tienes un motivo sólido para no continuar. La pausa te protege sin importar el resultado.",
          type: "defense" as InsightType,
        },
      ],
    },
  ];

  const current = scenes[activeStep];
  const currentInsight = current.insights[insightStep];
  const InsightIcon = currentInsight.icon;

  // Changing scenes resets their lesson synchronously in the originating action,
  // avoiding a second render caused by resetting state in an effect.
  function changeScene(index: number) {
    setActiveStep(index);
    setInsightStep(0);
    setIsPlaying(false);
  }

  // Auto-advance narrative tour when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % scenes.length);
      setInsightStep(0);
    }, 5000);
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
                  changeScene(index);
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

      {/* ─── Main Story Stage ─── */}
      <div className="story-stage-grid">
        {/* Left: Illustration */}
        <div className="story-illustration-card" style={{ borderColor: current.themeColor }}>
          <div className="sic-viewport" key={current.id}>
            {current.illustration}
          </div>

          <footer className="sic-nav-footer">
            <button
              type="button"
              className="sic-nav-btn prev"
              disabled={activeStep === 0}
              onClick={() => {
                changeScene(Math.max(0, activeStep - 1));
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
                    changeScene(idx);
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
                changeScene((activeStep + 1) % scenes.length);
              }}
            >
              <span>{activeStep === scenes.length - 1 ? "Reiniciar" : "Siguiente"}</span>
              {activeStep === scenes.length - 1 ? <RotateCcw size={15} /> : <ArrowRight size={16} />}
            </button>
          </footer>
        </div>

        {/* Right: Progressive Guided Insight Panel */}
        <aside className="story-insight-panel" style={{ backgroundColor: current.bgColor }}>
          {/* Scene header — always visible */}
          <div className="sip-header">
            <div className="sip-phase-row">
              <span className="sip-badge" style={{ backgroundColor: current.themeColor }}>
                {current.badge} · {current.num}
              </span>
              <span className="sip-subtitle">{current.subtitle}</span>
            </div>
            <h3 style={{ color: current.themeColor }}>{current.title}</h3>
          </div>

          {/* Progressive single-insight card */}
          <div className="sip-guided-card" key={`${activeStep}-${insightStep}`}>
            {/* Step dots + counter */}
            <div className="sgc-step-counter">
              {current.insights.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Ir al paso ${idx + 1}`}
                  className={`sgc-pip${insightStep === idx ? " active" : insightStep > idx ? " done" : ""}`}
                  style={{
                    backgroundColor: insightStep >= idx ? current.themeColor : undefined,
                    borderColor: insightStep >= idx ? current.themeColor : undefined,
                  }}
                  onClick={() => setInsightStep(idx)}
                />
              ))}
              <span className="sgc-fraction">{insightStep + 1} de {current.insights.length}</span>
            </div>

            {/* Insight content */}
            <div className={`sgc-body sgc-type-${currentInsight.type}`}>
              <div className="sgc-icon-row">
                <span className="sgc-icon" style={{ backgroundColor: current.themeColor + "1a", color: current.themeColor }}>
                  <InsightIcon size={16} />
                </span>
                <span className="sgc-label" style={{ color: current.themeColor }}>{currentInsight.label}</span>
              </div>
              <strong className="sgc-title">{currentInsight.title}</strong>
              <p className="sgc-body-text">{currentInsight.body}</p>
            </div>

            {/* Anterior / Continuar */}
            <div className="sgc-nav">
              <button
                type="button"
                className="sgc-nav-btn secondary"
                disabled={insightStep === 0}
                onClick={() => setInsightStep((s) => Math.max(0, s - 1))}
              >
                <ArrowLeft size={13} />
                Anterior
              </button>
              {insightStep < current.insights.length - 1 ? (
                <button
                  type="button"
                  className="sgc-nav-btn primary"
                  style={{ backgroundColor: current.themeColor }}
                  onClick={() => setInsightStep((s) => s + 1)}
                >
                  Continuar
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  className="sgc-nav-btn primary"
                  style={{ backgroundColor: current.themeColor }}
                  onClick={() => {
                    if (activeStep < scenes.length - 1) {
                      changeScene(activeStep + 1);
                    } else {
                      changeScene(0);
                    }
                  }}
                >
                  {activeStep < scenes.length - 1 ? "Siguiente escena" : "Reiniciar"}
                  {activeStep < scenes.length - 1 ? <ArrowRight size={13} /> : <RotateCcw size={13} />}
                </button>
              )}
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
