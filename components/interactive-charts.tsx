"use client";

import { useState } from "react";
import { Clock, ExternalLink, Shield, TrendingUp, Zap } from "lucide-react";

/* ─── 1. Gráfica de Radar / Barras de Competencias ─── */
export type CompetencyScores = {
  urgencia: number;      // 0 a 100
  verificacion: number;  // 0 a 100
  pagos: number;         // 0 a 100
  identidad: number;     // 0 a 100
};

export function CompetencyRadarChart({
  scores = { urgencia: 85, verificacion: 90, pagos: 80, identidad: 95 },
  interactive = true,
}: {
  scores?: CompetencyScores;
  interactive?: boolean;
}) {
  const [activeMetric, setActiveMetric] = useState<keyof CompetencyScores>("urgencia");

  const metrics: {
    key: keyof CompetencyScores;
    label: string;
    description: string;
    icon: typeof Shield;
    color: string;
    benchmark: string;
  }[] = [
    {
      key: "urgencia",
      label: "Control de Urgencia",
      description: "Capacidad de resistir plazos artificiales («hoy mismo», «en 20 minutos») sin apresurar clics.",
      icon: Clock,
      color: "#0d9488",
      benchmark: "85% de ataques usan plazos falsos",
    },
    {
      key: "verificacion",
      label: "Canal Independiente",
      description: "Hábito de salir del chat y validar en sitios o directorios oficiales en lugar de usar enlaces provistos.",
      icon: ExternalLink,
      color: "#0284c7",
      benchmark: "Regla #1 contra phishing",
    },
    {
      key: "pagos",
      label: "Detección de Cobros",
      description: "Reconocimiento inmediato de cobros injustificados (uniformes, exámenes, seguros) en ofertas.",
      icon: Zap,
      color: "#d97706",
      benchmark: "Vacantes reales nunca cobran",
    },
    {
      key: "identidad",
      label: "Custodia de Identidad",
      description: "Freno antes de enviar fotos de cédula o códigos OTP por mensajería a terceros.",
      icon: Shield,
      color: "#16a34a",
      benchmark: "Previene suplantación de créditos",
    },
  ];

  const current = metrics.find((m) => m.key === activeMetric)!;

  return (
    <div className="chart-card">
      <div className="gcc-header">
        <div className="gcc-title-group">
          <span className="eyebrow">Diagnóstico de habilidades</span>
          <h3>Radar de Criterio de Seguridad</h3>
        </div>
        <span className="gcc-pill">Micro-métricas en vivo</span>
      </div>

      {/* Visual Bar Graph Grid */}
      <div className="gcc-bars-grid">
        {metrics.map((m) => {
          const val = scores[m.key];
          const isSelected = activeMetric === m.key;
          const Icon = m.icon;

          return (
            <button
              key={m.key}
              type="button"
              className={`gcc-bar-item${isSelected ? " active" : ""}`}
              onClick={() => interactive && setActiveMetric(m.key)}
            >
              <div className="gcc-bar-top">
                <span className="gcc-bar-icon" style={{ color: m.color }}>
                  <Icon size={16} />
                </span>
                <span className="gcc-bar-label">{m.label}</span>
                <span className="gcc-bar-val">{val}%</span>
              </div>
              <div className="gcc-bar-track">
                <div
                  className="gcc-bar-fill"
                  style={{
                    width: `${val}%`,
                    backgroundColor: m.color,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Detail Box */}
      <div className="gcc-detail-box">
        <div className="gdb-top">
          <current.icon size={20} style={{ color: current.color }} />
          <strong>{current.label} · {scores[activeMetric]}% de efectividad</strong>
        </div>
        <p>{current.description}</p>
        <span className="gdb-benchmark">💡 Dato clave: {current.benchmark}</span>
      </div>
    </div>
  );
}

/* ─── 2. Diagrama del Ciclo del Engaño (Anatomía del Ataque) ─── */
export function AttackFunnelChart() {
  const [activeStep, setActiveStep] = useState(3);

  const steps = [
    {
      num: "01",
      title: "El Gancho",
      subtitle: "Salario alto o alerta de bloqueo",
      detail: "Captura tu atención prometiendo algo muy deseable o generando alarma instantánea.",
      danger: "Apertura emocional",
      badge: "Iniciación",
    },
    {
      num: "02",
      title: "La Urgencia",
      subtitle: "«Decide ya o se cancela»",
      detail: "Establecen un temporizador psicológico forzado para impedir que consultes o revises con calma.",
      danger: "Bloqueo de pensamiento crítico",
      badge: "Presión",
    },
    {
      num: "03",
      title: "La Trampa",
      subtitle: "Pago, clic o documento",
      detail: "Te inducen a transferir dinero, abrir enlaces desconocidos o compartir fotos de tu documento.",
      danger: "Acción de riesgo",
      badge: "Extracción",
    },
    {
      num: "PAUSA",
      title: "El Momento Clave",
      subtitle: "Detenerte y verificar por canal oficial",
      detail: "Salir del chat, respirar 10 segundos y verificar en la web o app oficial desactiva el 99% de las estafas.",
      danger: "Punto de corte seguro",
      badge: "Tu defensa",
    },
  ];

  return (
    <div className="chart-card">
      <div className="gcc-header">
        <div className="gcc-title-group">
          <span className="eyebrow">Anatomía interactiva</span>
          <h3>¿Cómo opera el engaño paso a paso?</h3>
        </div>
        <span className="gcc-pill">Modelo explicativo visual</span>
      </div>

      <div className="funnel-steps-grid">
        {steps.map((st, i) => {
          const isSelected = activeStep === i;
          const isPausa = st.num === "PAUSA";

          return (
            <button
              key={st.num}
              type="button"
              className={`funnel-step-card${isSelected ? " active" : ""}${isPausa ? " pausa-step" : ""}`}
              onClick={() => setActiveStep(i)}
            >
              <div className="fsc-header">
                <span className="fsc-badge">{st.badge}</span>
                <span className="fsc-num">{st.num}</span>
              </div>
              <strong>{st.title}</strong>
              <small>{st.subtitle}</small>
            </button>
          );
        })}
      </div>

      <div className="funnel-detail-panel">
        <div className="fdp-header">
          <span className="fdp-tag">{steps[activeStep].badge}</span>
          <h4>Paso {steps[activeStep].num}: {steps[activeStep].title}</h4>
        </div>
        <p className="fdp-body">{steps[activeStep].detail}</p>
        <div className="fdp-warning">
          <strong>Señal de observación:</strong> {steps[activeStep].danger}
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
