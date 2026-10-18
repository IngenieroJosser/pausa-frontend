"use client";

import { useState } from "react";
import { ArrowRight, BarChart2, MessageSquare, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import type { Scenario } from "@/lib/scenarios";
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

  return (
    <div className="gurwi-lesson-container">
      {/* Gurwi-style Top Lesson Navigation Tabs */}
      <nav className="gurwi-tabs-nav" aria-label="Navegación de la lección interactiva">
        <button
          type="button"
          className={`gurwi-tab-btn${activeTab === "simulacion" ? " active" : ""}`}
          onClick={() => setActiveTab("simulacion")}
        >
          <MessageSquare size={16} />
          <span>1. Simulación & Decisión</span>
        </button>
        <button
          type="button"
          className={`gurwi-tab-btn${activeTab === "anatomia" ? " active" : ""}`}
          onClick={() => setActiveTab("anatomia")}
        >
          <TrendingUp size={16} />
          <span>2. Gráfica: Ciclo del Ataque</span>
        </button>
        <button
          type="button"
          className={`gurwi-tab-btn${activeTab === "radar" ? " active" : ""}`}
          onClick={() => setActiveTab("radar")}
        >
          <BarChart2 size={16} />
          <span>3. Gráfica: Radar de Criterio</span>
        </button>
      </nav>

      {/* View 1: Main 3-Column Scenario Workspace */}
      {activeTab === "simulacion" && (
        <main className="scenario-layout">
          <section className="scenario-intro">
            <div className="scenario-badge-wrap">
              <span className="eyebrow">{scenario.eyebrow}</span>
              <span className="channel-pill">Simulación activa</span>
            </div>
            <h1>Lee el mensaje.<br />Luego, decide.</h1>
            <p>No busques la respuesta perfecta. Elige con honestidad lo que harías en este momento.</p>

            <div className="scenario-checkpoints">
              <span className="checkpoints-title">Qué observar antes de decidir:</span>
              <ul>
                <li>
                  <strong>Remitente y canal</strong>
                  <span>¿Viene de un número desconocido o un dominio extraño?</span>
                </li>
                <li>
                  <strong>Sensación de urgencia</strong>
                  <span>¿Te presionan para responder de inmediato sin verificar?</span>
                </li>
                <li>
                  <strong>Acción solicitada</strong>
                  <span>¿Piden pagos, datos personales o abrir enlaces externos?</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="quick-chart-trigger"
              onClick={() => setActiveTab("anatomia")}
            >
              <Sparkles size={16} />
              <span>Ver gráfica del ciclo del engaño →</span>
            </button>
          </section>

          <div className="scenario-workspace">
            <ChatCard scenario={scenario} />

            <section className="decision-card">
              <div className="decision-header">
                <span className="decision-step-label">Toma de decisión</span>
                <h2>{scenario.prompt}</h2>
              </div>
              <div className="choices" role="radiogroup" aria-label={scenario.prompt}>
                {scenario.choices.map((choice, index) => (
                  <button
                    className={`choice ${selected === choice.id ? "selected" : ""}`}
                    key={choice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected === choice.id}
                    onClick={() => onSelect(choice.id)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <div className="choice-text">{choice.label}</div>
                  </button>
                ))}
              </div>
              <button
                className="primary-button"
                type="button"
                disabled={!selected}
                onClick={onSubmit}
              >
                Confirmar decisión <ArrowRight size={18} />
              </button>
            </section>
          </div>
        </main>
      )}

      {/* View 2: Attack Anatomy Graph (Gurwi model) */}
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

      {/* View 3: Radar Chart View */}
      {activeTab === "radar" && (
        <div className="chart-tab-view">
          <div className="chart-tab-intro">
            <span className="eyebrow">Métricas de ciberseguridad</span>
            <h2>Habilidades que estás entrenando en esta sesión</h2>
            <p>
              Este radar mide tus 4 reflejos de defensa digital. Tu respuesta en este escenario recalculará tu nivel de efectividad.
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
