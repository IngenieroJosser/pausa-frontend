"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, HelpCircle, CheckCircle2, AlertTriangle } from "lucide-react";

import imgGancho from "@/public/illustrations/01-gancho.jpg";
import imgUrgencia from "@/public/illustrations/02-urgencia.jpg";
import imgTrampa from "@/public/illustrations/03-trampa.jpg";
import imgPausa from "@/public/illustrations/04-pausa.jpg";

interface Hotspot {
  id: string;
  pinClass: string;
  number: number;
  label: string;
  title: string;
  explanation: string;
  variant?: "info" | "warning" | "danger" | "success";
}

interface SceneProps {
  className?: string;
}

/* ─── SCENE 1: EL GANCHO ─── */
export function HookIllustration({ className = "" }: SceneProps) {
  const hotspots: Hotspot[] = [
    {
      id: "anzuelo",
      pinClass: "pin-hook",
      number: 1,
      label: "El Anzuelo",
      title: "Oferta inflada sin postulación",
      explanation: "El anzuelo promete un salario muy por encima del promedio para despertar euforia y anular tus filtros de duda.",
      variant: "info",
    },
    {
      id: "emocion",
      pinClass: "pin-phone",
      number: 2,
      label: "Ilusión inicial",
      title: "Optimismo que baja la guardia",
      explanation: "Al creer que 'tuviste suerte', te enfocas en asegurar el cupo en vez de preguntarte cómo consiguieron tu número.",
      variant: "warning",
    },
  ];

  const [activeId, setActiveId] = useState<string>("anzuelo");
  const activeSpot = hotspots.find((h) => h.id === activeId) || hotspots[0];

  return (
    <div className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-stage">
        <Image
          src={imgGancho}
          alt="Escena 1: El Gancho. Personaje joven colombiano ilusionado al recibir una vacante atractiva en su celular."
          placeholder="blur"
          className="sf-main-img"
          priority
        />

        {/* Hotspot Pins on the Artwork */}
        <div className="sf-hotspots-overlay">
          {hotspots.map((h) => {
            const isSelected = activeId === h.id;
            return (
              <button
                key={h.id}
                type="button"
                className={`sf-hotspot-pin ${h.pinClass}${isSelected ? " active" : ""}`}
                onClick={() => setActiveId(h.id)}
                onMouseEnter={() => setActiveId(h.id)}
                aria-label={`Pista ${h.number}: ${h.title}`}
              >
                <span className={`sf-pin-pulse ${h.variant || ""}`} />
                <span className={`sf-pin-badge ${h.variant || ""}`}>{h.number}</span>
              </button>
            );
          })}
        </div>

        {/* Phase Badge */}
        <div className="sf-scene-tag hook">
          <span className="sft-dot" />
          <span>Fase 01 · El Anzuelo Emocional</span>
        </div>
      </div>

      {/* Interactive Clue Bar: Always 100% visible, never clipped */}
      <div className="sf-clue-interactive-bar">
        <div className="scib-chips">
          <span className="scib-prompt">
            <HelpCircle size={13} />
            <span>Pistas en la escena:</span>
          </span>
          {hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`scib-chip-btn${activeId === h.id ? " active" : ""}`}
              onClick={() => setActiveId(h.id)}
            >
              <span className="scib-num">{h.number}</span>
              <span>{h.label}</span>
            </button>
          ))}
        </div>

        <div className="scib-callout-box">
          <strong className="scib-title">
            <span className="scib-idx">{activeSpot.number}.</span> {activeSpot.title}
          </strong>
          <p className="scib-desc">{activeSpot.explanation}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── SCENE 2: LA URGENCIA ─── */
export function UrgencyIllustration({ className = "" }: SceneProps) {
  const hotspots: Hotspot[] = [
    {
      id: "reloj",
      pinClass: "pin-clock",
      number: 1,
      label: "Temporizador",
      title: "Cuenta regresiva artificial (11:59)",
      explanation: "Fijan plazos inmediatos ('hoy mismo', 'en 20 minutos') para impedir que consultes con otras personas o verifiques con calma.",
      variant: "danger",
    },
    {
      id: "fomo",
      pinClass: "pin-stress",
      number: 2,
      label: "Efecto túnel",
      title: "Presión psicológica forzada",
      explanation: "El atacante induce miedo a 'perder el cupo' para que tu cerebro decida por impulso y no por razonamiento lógico.",
      variant: "warning",
    },
  ];

  const [activeId, setActiveId] = useState<string>("reloj");
  const activeSpot = hotspots.find((h) => h.id === activeId) || hotspots[0];

  return (
    <div className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-stage">
        <Image
          src={imgUrgencia}
          alt="Escena 2: La Urgencia. Personaje presionado con cronómetro en cuenta regresiva y alertas rojas inmediatas."
          placeholder="blur"
          className="sf-main-img"
          priority
        />

        <div className="sf-hotspots-overlay">
          {hotspots.map((h) => {
            const isSelected = activeId === h.id;
            return (
              <button
                key={h.id}
                type="button"
                className={`sf-hotspot-pin ${h.pinClass}${isSelected ? " active" : ""}`}
                onClick={() => setActiveId(h.id)}
                onMouseEnter={() => setActiveId(h.id)}
                aria-label={`Pista ${h.number}: ${h.title}`}
              >
                <span className={`sf-pin-pulse ${h.variant || ""}`} />
                <span className={`sf-pin-badge ${h.variant || ""}`}>{h.number}</span>
              </button>
            );
          })}
        </div>

        <div className="sf-scene-tag urgency">
          <span className="sft-dot" />
          <span>Fase 02 · Presión Psicológica (11:59)</span>
        </div>
      </div>

      <div className="sf-clue-interactive-bar">
        <div className="scib-chips">
          <span className="scib-prompt">
            <HelpCircle size={13} />
            <span>Pistas en la escena:</span>
          </span>
          {hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`scib-chip-btn${activeId === h.id ? " active" : ""}`}
              onClick={() => setActiveId(h.id)}
            >
              <span className="scib-num">{h.number}</span>
              <span>{h.label}</span>
            </button>
          ))}
        </div>

        <div className="scib-callout-box">
          <strong className="scib-title">
            <span className="scib-idx">{activeSpot.number}.</span> {activeSpot.title}
          </strong>
          <p className="scib-desc">{activeSpot.explanation}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── SCENE 3: LA TRAMPA ─── */
export function TrapIllustration({ className = "" }: SceneProps) {
  const hotspots: Hotspot[] = [
    {
      id: "cobro",
      pinClass: "pin-money",
      number: 1,
      label: "Cobro previo",
      title: "Exigencia de dinero por adelantado",
      explanation: "Te piden consignar $48.000 para exámenes médicos o dotación. En Colombia, la ley prohíbe que el candidato pague exámenes de ingreso.",
      variant: "danger",
    },
    {
      id: "cedula",
      pinClass: "pin-cedula",
      number: 2,
      label: "Foto de cédula",
      title: "Extracción de identidad personal",
      explanation: "Solicitan foto de tu documento por ambos lados por chat. Esta información es vendida o usada para aperturas ilícitas a tu nombre.",
      variant: "danger",
    },
  ];

  const [activeId, setActiveId] = useState<string>("cobro");
  const activeSpot = hotspots.find((h) => h.id === activeId) || hotspots[0];

  return (
    <div className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-stage">
        <Image
          src={imgTrampa}
          alt="Escena 3: La Trampa. Personaje en duda frenando ante solicitud de dinero por exámenes médicos y foto de cédula."
          placeholder="blur"
          className="sf-main-img"
          priority
        />

        <div className="sf-hotspots-overlay">
          {hotspots.map((h) => {
            const isSelected = activeId === h.id;
            return (
              <button
                key={h.id}
                type="button"
                className={`sf-hotspot-pin ${h.pinClass}${isSelected ? " active" : ""}`}
                onClick={() => setActiveId(h.id)}
                onMouseEnter={() => setActiveId(h.id)}
                aria-label={`Pista ${h.number}: ${h.title}`}
              >
                <span className={`sf-pin-pulse ${h.variant || ""}`} />
                <span className={`sf-pin-badge ${h.variant || ""}`}>{h.number}</span>
              </button>
            );
          })}
        </div>

        <div className="sf-scene-tag trap">
          <span className="sft-dot" />
          <span>Fase 03 · Extracción Irregular</span>
        </div>
      </div>

      <div className="sf-clue-interactive-bar">
        <div className="scib-chips">
          <span className="scib-prompt">
            <HelpCircle size={13} />
            <span>Pistas en la escena:</span>
          </span>
          {hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`scib-chip-btn${activeId === h.id ? " active" : ""}`}
              onClick={() => setActiveId(h.id)}
            >
              <span className="scib-num">{h.number}</span>
              <span>{h.label}</span>
            </button>
          ))}
        </div>

        <div className="scib-callout-box">
          <strong className="scib-title">
            <span className="scib-idx">{activeSpot.number}.</span> {activeSpot.title}
          </strong>
          <p className="scib-desc">{activeSpot.explanation}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── SCENE 4: EL MOMENTO PAUSA (Con personaje de 2 brazos) ─── */
export function PauseIllustration({ className = "" }: SceneProps) {
  const hotspots: Hotspot[] = [
    {
      id: "pausa",
      pinClass: "pin-pause-hand",
      number: 1,
      label: "Gesto PAUSA",
      title: "Freno cognitivo activo",
      explanation: "El personaje detiene el clic impulsivo: no consigna dinero, no envía su documento y sale del chat de forma deliberada.",
      variant: "success",
    },
    {
      id: "canal",
      pinClass: "pin-ssl",
      number: 2,
      label: "Canal oficial",
      title: "Verificación independiente",
      explanation: "Abre el navegador por su cuenta, busca la página web oficial con candado de seguridad SSL y llama al conmutador PBX verificado.",
      variant: "success",
    },
  ];

  const [activeId, setActiveId] = useState<string>("pausa");
  const activeSpot = hotspots.find((h) => h.id === activeId) || hotspots[0];

  return (
    <div className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-stage">
        <Image
          src={imgPausa}
          alt="Escena 4: El Momento PAUSA. Personaje sereno con escudo PAUSA en mano y verificando de forma independiente en web oficial con candado SSL."
          placeholder="blur"
          className="sf-main-img"
          priority
        />

        <div className="sf-hotspots-overlay">
          {hotspots.map((h) => {
            const isSelected = activeId === h.id;
            return (
              <button
                key={h.id}
                type="button"
                className={`sf-hotspot-pin ${h.pinClass}${isSelected ? " active" : ""}`}
                onClick={() => setActiveId(h.id)}
                onMouseEnter={() => setActiveId(h.id)}
                aria-label={`Pista ${h.number}: ${h.title}`}
              >
                <span className={`sf-pin-pulse ${h.variant || ""}`} />
                <span className={`sf-pin-badge ${h.variant || ""}`}>{h.number}</span>
              </button>
            );
          })}
        </div>

        <div className="sf-scene-tag pausa">
          <span className="sft-dot" />
          <span>Fase 04 · Verificación Autónoma Activa</span>
        </div>
      </div>

      <div className="sf-clue-interactive-bar">
        <div className="scib-chips">
          <span className="scib-prompt">
            <HelpCircle size={13} />
            <span>Pistas en la escena:</span>
          </span>
          {hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`scib-chip-btn${activeId === h.id ? " active" : ""}`}
              onClick={() => setActiveId(h.id)}
            >
              <span className="scib-num">{h.number}</span>
              <span>{h.label}</span>
            </button>
          ))}
        </div>

        <div className="scib-callout-box">
          <strong className="scib-title">
            <span className="scib-idx">{activeSpot.number}.</span> {activeSpot.title}
          </strong>
          <p className="scib-desc">{activeSpot.explanation}</p>
        </div>
      </div>
    </div>
  );
}
