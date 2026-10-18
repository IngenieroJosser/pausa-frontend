"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart2,
  Clock,
  Compass,
  CreditCard,
  FileCheck2,
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
};

type ViewTab = "simulacion" | "anatomia" | "radar";

export function ScenarioStep({ scenario, selected, onSelect, onSubmit }: Props) {
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
    <div className="lesson-container">
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

            <h1 className="scenario-headline">
              Lee el mensaje.
              <br />
              Luego, decide.
            </h1>

            <p className="scenario-lead">
              No busques la respuesta perfecta. Elige con honestidad lo que harías en este momento.
            </p>

            <div className="scenario-checkpoints">
              <div className="checkpoints-header">
                <Compass size={15} className="ch-icon" />
                <span className="checkpoints-title">Qué observar antes de decidir:</span>
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
                  <span>Caso documentado: {scenario.caseSource.caseName}</span>
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
            <ChatCard scenario={scenario} />

            {/* Columna 3: Tarjeta de Toma de Decisión */}
            <section className="decision-card">
              <header className="decision-header">
                <span className="decision-step-label">Toma de decisión</span>
                <h2>{scenario.prompt}</h2>
                <p className="decision-instruction">
                  Selecciona la opción que mejor represente tu primera acción.
                </p>
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
                    >
                      <span className="choice-badge-letter">{letter}</span>
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

              <button
                className="primary-button cta-decision-btn"
                type="button"
                disabled={!selected}
                onClick={onSubmit}
              >
                <span>Confirmar decisión</span>
                <ArrowRight size={18} />
              </button>

              <div className="decision-calm-note">
                <div className="dcn-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <div className="dcn-content">
                  <strong>¿Por qué es importante decidir con calma?</strong>
                  <p>
                    Los atacantes se aprovechan de la presión y la urgencia para que tomes decisiones impulsivas.
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
