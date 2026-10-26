"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart2,
  Clock,
  Compass,
  CreditCard,
  FileCheck2,
  CircleCheck,
  Layers3,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import type { Choice, Scenario } from "@/lib/scenarios";
import { ChatCard } from "./chat-card";
import { AttackFunnelChart, CompetencyRadarChart } from "./interactive-charts";

type Props = {
  scenario: Scenario;
  selected: string | null;
  onSelect: (choiceId: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

type ViewTab = "simulacion" | "anatomia" | "radar";

export function ScenarioStep({ scenario, selected, onSelect, onSubmit, submitting = false }: Props) {
  const [activeTab, setActiveTab] = useState<ViewTab>("simulacion");

  const getChoiceIcon = (choice: Choice) => {
    if (choice.icon === "card" || choice.signal === "pago") {
      return <CreditCard size={18} className="choice-trail-icon" />;
    }
    if (choice.icon === "message") {
      return <MessageSquare size={18} className="choice-trail-icon" />;
    }
    if (choice.icon === "search" || choice.signal === "canal") {
      return <Search size={18} className="choice-trail-icon" />;
    }
    if (choice.icon === "alert" || choice.signal === "urgencia") {
      return <ShieldAlert size={18} className="choice-trail-icon" />;
    }
    return <ShieldCheck size={18} className="choice-trail-icon" />;
  };

  return (
    <div className="lesson-container fresh-questionnaire">
      <header className="live-experience-header">
        <div className="live-experience-label"><span className="live-experience-sparkle"><Sparkles size={18} /></span><span>PAUSA <b>/</b> LAB DE DECISIONES</span></div>
        <div className="live-experience-meta"><span>{scenario.goal === "empleo" ? "EMPLEO" : scenario.goal === "dinero" ? "DINERO" : "IDENTIDAD"}</span><i /><span>45 CASOS EN EL BANCO</span></div>
      </header>
      {/* Navegación de pestañas de la lección interactiva */}
      <nav className="lesson-tabs-nav" aria-label="Navegación de la lección interactiva">
        <button
          type="button"
          className={`lesson-tab-btn${activeTab === "simulacion" ? " active" : ""}`}
          onClick={() => setActiveTab("simulacion")}
        >
          <MessageSquare size={16} />
          <span>1. Simulación & Decisión</span>
        </button>
        <button
          type="button"
          className={`lesson-tab-btn${activeTab === "anatomia" ? " active" : ""}`}
          onClick={() => setActiveTab("anatomia")}
        >
          <TrendingUp size={16} />
          <span>2. Gráfica: Ciclo del Ataque</span>
        </button>
        <button
          type="button"
          className={`lesson-tab-btn${activeTab === "radar" ? " active" : ""}`}
          onClick={() => setActiveTab("radar")}
        >
          <BarChart2 size={16} />
          <span>3. Matriz de Criterio PAUSA</span>
        </button>
      </nav>

      {/* Vista 1: Espacio de Trabajo Principal en 3 Columnas (Ajuste a pantalla completa sin scroll) */}
      {activeTab === "simulacion" && (
        <main className="scenario-layout">
          {/* Columna 1: Diagnóstico y Guía Rápida de Observación */}
          <section className="scenario-intro">
            <div className="scenario-badge-wrap">
              <span className="eyebrow">{scenario.eyebrow}</span>
              <span className="channel-pill">
                <span className="live-pulse-dot" />
                Simulación activa
              </span>
            </div>

            <div className="live-stage-counter">{scenario.stage === "diagnostico" ? "01" : scenario.stage === "practica" ? "02" : "03"}<span> / 03</span></div>
            <h1 className="scenario-headline">Tu criterio,<br /><em>a prueba.</em></h1>
            <div className="scenario-topic-kicker"><Layers3 size={14} /> {scenario.topic ?? "Situación interactiva"}</div>

            <p className="scenario-lead">
              Una situación distinta en cada visita. Observa el contexto, interpreta las señales y decide qué harías.
            </p>

            <div className="scenario-checkpoints">
              <div className="checkpoints-header">
                <Compass size={15} className="ch-icon" />
                <span className="checkpoints-title">Tu brújula para decidir</span>
              </div>
              <ul className="checkpoints-list">
                <li>
                  <div className="cp-icon-wrap">
                    <UserCheck size={13} />
                  </div>
                  <div className="cp-copy">
                    <strong>Remitente y canal</strong>
                    <span>¿Número desconocido o dominio extraño?</span>
                  </div>
                </li>
                <li>
                  <div className="cp-icon-wrap">
                    <Clock size={13} />
                  </div>
                  <div className="cp-copy">
                    <strong>Sensación de urgencia</strong>
                    <span>¿Presión para actuar de inmediato?</span>
                  </div>
                </li>
                <li>
                  <div className="cp-icon-wrap">
                    <FileCheck2 size={13} />
                  </div>
                  <div className="cp-copy">
                    <strong>Acción solicitada</strong>
                    <span>¿Pagos previos o documentos sensibles?</span>
                  </div>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="quick-chart-trigger"
              onClick={() => setActiveTab("anatomia")}
            >
              <TrendingUp size={15} />
              <span>Ver gráfica del ciclo del engaño →</span>
            </button>

            {scenario.caseSource && (
              <aside className="case-academic-citation" aria-label="Referencia del caso">
                <div className="cac-top">
                  <Shield size={12} />
                  <span>Contexto educativo: {scenario.caseSource.caseName}</span>
                </div>
                <small>
                  {scenario.caseSource.organization}
                </small>
              </aside>
            )}
          </section>

          {/* Columna 2 y 3: Workspace con Simulador de Chat y Tarjeta de Decisión */}
          <div className="scenario-workspace">
            {/* Columna 2: Simulador de Chat con Modo Inspector */}
            <ChatCard scenario={scenario} allowInspection={false} />

            {/* Columna 3: Tarjeta de Toma de Decisión */}
            <section className="decision-card">
              <header className="decision-header">
                <div className="decision-question-overline"><span className="decision-q-icon"><Compass size={17} /></span><span>EL MOMENTO DE ELEGIR</span><span className="decision-question-id">{scenario.stage === "diagnostico" ? "01" : scenario.stage === "practica" ? "02" : "03"} / 03</span></div>
                <h2>{scenario.prompt}</h2>
                <p className="decision-instruction">No hay penalizaciones por equivocarte. Lo importante es entrenar una respuesta consciente.</p>
              </header>

              <div className="choices" role="radiogroup" aria-label={scenario.prompt}>
                {scenario.choices.map((choice, index) => {
                  const isSelected = selected === choice.id;
                  const letter = String.fromCharCode(65 + index);

                  return (
                    <button
                      className={`choice-card-rich${isSelected ? " selected" : ""}`}
                      key={choice.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelect(choice.id)}
                      onKeyDown={(event) => {
                        if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
                        event.preventDefault();
                        const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
                        const nextIndex = (index + direction + scenario.choices.length) % scenario.choices.length;
                        onSelect(scenario.choices[nextIndex].id);
                        const options = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>("[role=radio]");
                        options?.[nextIndex]?.focus();
                      }}
                    >
                      <span className="choice-badge-letter">{isSelected ? <CircleCheck size={21} /> : letter}</span>
                      <div className="choice-body-content">
                        <strong className="choice-primary-label">{choice.label}</strong>
                        {choice.description && (
                          <span className="choice-sub-description">{choice.description}</span>
                        )}
                      </div>
                      <div className="choice-icon-slot">{getChoiceIcon(choice)}</div>
                    </button>
                  );
                })}
              </div>

              <div className="decision-selected-summary" aria-live="polite">
                {selected ? <><CircleCheck size={16} /> Respuesta seleccionada. Puedes cambiarla antes de confirmar.</> : <><span className="decision-empty-dot" /> Elige una de las tres rutas para continuar</>}
              </div>
              <button
                className="primary-button cta-decision-btn"
                type="button"
                disabled={!selected || submitting}
                onClick={onSubmit}
              >
                <span>{submitting ? "Evaluando decisión…" : "Confirmar y descubrir el resultado"}</span>
                {!submitting && <ArrowRight size={18} />}
              </button>

              <div className="decision-calm-note">
                <div className="dcn-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <div className="dcn-content">
                  <strong>Aprender también significa equivocarse</strong>
                  <p>
                    Al confirmar conocerás el razonamiento detrás de la alternativa más segura. Cada práctica es diferente.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      )}

      {/* Vista 2: Gráfica de anatomía del ataque */}
      {activeTab === "anatomia" && (
        <div className="chart-tab-view">
          <div className="chart-tab-intro">
            <span className="eyebrow">Micro-lección visual</span>
            <h2>Cómo desarmar este tipo de fraude</h2>
            <p>
              Toca cada etapa de la gráfica para entender cómo los atacantes construyen la trampa psicológica y en qué punto la <strong>PAUSA</strong> te salva.
            </p>
          </div>
          <AttackFunnelChart />
          <div className="chart-tab-action">
            <button
              type="button"
              className="primary-button large teal"
              onClick={() => setActiveTab("simulacion")}
            >
              Volver a la decisión del caso <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Vista 3: Matriz de Criterio PAUSA */}
      {activeTab === "radar" && (
        <div className="chart-tab-view">
          <div className="chart-tab-intro">
            <span className="eyebrow">Marco pedagógico</span>
            <h2>Habilidades clave para desarmar fraudes</h2>
            <p>
              Conoce los 4 reflejos de criterio que desactivan la ingeniería social y te permiten validar cualquier situación antes de actuar.
            </p>
          </div>
          <CompetencyRadarChart />
          <div className="chart-tab-action">
            <button
              type="button"
              className="primary-button large teal"
              onClick={() => setActiveTab("simulacion")}
            >
              Volver al caso para decidir <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
