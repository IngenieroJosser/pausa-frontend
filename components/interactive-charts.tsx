"use client";

import { useState } from "react";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Flame,
  KeyRound,
  Lock,
  Radio,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

/* ─── 1. Matriz de Criterios de Seguridad Digital (Sin porcentajes simulados) ─── */
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
      benchmark: "85% de ataques de ingeniería social utilizan plazos falsos para inducir pánico.",
    },
    {
      key: "verificacion",
      label: "Canal Independiente",
      actionTag: "Validación autónoma",
      description: "Hábito invariable de salir del chat y validar en sitios o directorios oficiales que tú mismo encuentres en un navegador.",
      rule: "Nunca uses números, correos o enlaces suministrados dentro del mismo mensaje sospechoso.",
      icon: ExternalLink,
      color: "#0284c7",
      benchmark: "Romper el canal del atacante desactiva el 99% de las trampas de phishing.",
    },
    {
      key: "pagos",
      label: "Detección de Cobros",
      actionTag: "Filtro financiero",
      description: "Reconocimiento inmediato de cobros injustificados en procesos de selección (exámenes médicos, uniformes, carnets, seguros).",
      rule: "Ninguna empresa formal cobra dinero a un candidato para asegurar una vacante o contratarlo.",
      icon: Zap,
      color: "#d97706",
      benchmark: "La modalidad más común en falsas vacantes es el cobro previo de exámenes o dotación.",
    },
    {
      key: "identidad",
      label: "Custodia de Identidad",
      actionTag: "Protección de datos",
      description: "Freno antes de enviar fotos de cédula por ambos lados, firmas o códigos de verificación OTP por mensajería instantánea.",
      rule: "Tus documentos personales solo deben entregarse tras validación presencial o en plataformas formales verificadas.",
      icon: Lock,
      color: "#16a34a",
      benchmark: "La captura de fotos de cédula es el paso inicial para suplantaciones crediticias y aperturas ilícitas.",
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
          <span className="cdp-benchmark-tag">Dato de ciberseguridad:</span>
          <span>{current.benchmark}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Diagrama del Ciclo del Engaño (Anatomía Interactiva del Ataque) ─── */
export function AttackFunnelChart() {
  const [activeStep, setActiveStep] = useState(3);

  const steps = [
    {
      num: "01",
      badge: "Iniciación",
      title: "El Gancho",
      subtitle: "Salario alto o alerta de bloqueo",
      icon: Radio,
      detail: "El atacante captura tu atención prometiendo algo muy deseable (vacante con sueldo alto) o generando alarma artificial (bloqueo inminente).",
      observationSignal: "Apertura emocional y anzuelo llamativo.",
      color: "#0284c7",
    },
    {
      num: "02",
      badge: "Presión",
      title: "La Urgencia",
      subtitle: "«Decide ya o se cancela»",
      icon: Clock,
      detail: "Establecen un plazo inmediato («hoy», «en 20 minutos») para bloquear tu pensamiento crítico e inducirte a actuar bajo impulso.",
      observationSignal: "Temporizador psicológico forzado sin tiempo de consulta.",
      color: "#d97706",
    },
    {
      num: "03",
      badge: "Extracción",
      title: "La Trampa",
      subtitle: "Pago, clic o documento",
      icon: ShieldAlert,
      detail: "Te inducen a transferir dinero para exámenes ficticios, hacer clic en enlaces no verificados o enviar fotos de tu documento de identidad.",
      observationSignal: "Petición precipitada de dinero o datos sensibles.",
      color: "#dc2626",
    },
    {
      num: "PAUSA",
      badge: "Tu defensa",
      title: "El Momento Clave",
      subtitle: "Detenerte y verificar por canal oficial",
      icon: ShieldCheck,
      detail: "Salir del chat, respirar 10 segundos y verificar en la web o línea oficial que tú mismo busques desactiva el 100% de la ingeniería social.",
      observationSignal: "Punto de corte seguro: Romper el canal del atacante.",
      color: "#0d9488",
    },
  ];

  const current = steps[activeStep];

  return (
    <div className="chart-card">
      <div className="gcc-header">
        <div className="gcc-title-group">
          <span className="eyebrow">Anatomía interactiva</span>
          <h3>¿Cómo opera el engaño paso a paso?</h3>
        </div>
        <span className="gcc-pill">Diagrama de flujo del ataque</span>
      </div>

      {/* Visual Pipeline with directional flow */}
      <div className="attack-pipeline-strip">
        {steps.map((st, i) => {
          const isSelected = activeStep === i;
          const isPausa = st.num === "PAUSA";
          const StepIcon = st.icon;

          return (
            <div key={st.num} className="pipeline-item-wrapper">
              <button
                type="button"
                className={`pipeline-node-card${isSelected ? " active" : ""}${isPausa ? " pausa-node" : ""}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="pnc-header">
                  <span className="pnc-phase-badge">{st.badge}</span>
                  <span className="pnc-num">{st.num}</span>
                </div>
                <div className="pnc-icon-wrap" style={{ color: st.color }}>
                  <StepIcon size={18} />
                </div>
                <strong className="pnc-title">{st.title}</strong>
                <small className="pnc-subtitle">{st.subtitle}</small>
              </button>
              {i < steps.length - 1 && (
                <div className="pipeline-connector-arrow">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Box */}
      <div className="funnel-detail-panel">
        <div className="fdp-header">
          <span className="fdp-tag" style={{ background: current.color }}>{current.badge}</span>
          <h4>Paso {current.num}: {current.title}</h4>
        </div>
        <p className="fdp-body">{current.detail}</p>
        <div className="fdp-warning">
          <strong>Señal de observación:</strong> {current.observationSignal}
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Gráfica de Distribución de Riesgo por Canal ─── */
export function ChannelRiskChart() {
  const channels = [
    { name: "WhatsApp & Mensajería directa", pct: 64, color: "#16a34a", desc: "Ofertas laborales falsas, cobro de exámenes y dotación." },
    { name: "SMS & Mensajes de texto", pct: 24, color: "#0284c7", desc: "Suplantación bancaria, bloqueos falsos y enlaces de phishing." },
    { name: "Correo electrónico no oficial", pct: 12, color: "#d97706", desc: "Dominios que imitan marcas reales con variaciones sutiles." },
  ];

  return (
    <div className="channel-stats-card">
      <div className="csc-header">
        <TrendingUp size={20} className="csc-icon" />
        <div>
          <h4>Canales más utilizados en fraudes digitales</h4>
          <small>Datos del observatorio de ciberseguridad</small>
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
