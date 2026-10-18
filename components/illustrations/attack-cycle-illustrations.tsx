"use client";

import React, { useState } from "react";
import Image from "next/image";

interface IllustrationProps {
  className?: string;
  onExploreHotspot?: (tag: string) => void;
}

/* ─── SCENE 1: EL GANCHO (The Hook / Deceptive Offer) ─── */
export function HookIllustration({ className = "" }: IllustrationProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <figure className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-container">
        <Image
          src="/illustrations/01-gancho.jpg"
          alt="Escena 1: El Gancho. Personaje joven colombiano ilusionado al recibir una vacante atractiva con un anzuelo oculto en su celular."
          width={720}
          height={540}
          className="sf-main-img"
          priority
        />
        
        {/* Interactive Pedagogical Hotspots */}
        <div className="sf-hotspots-layer">
          {/* Pin 1: El Anzuelo */}
          <div 
            className={`sf-hotspot-pin pin-hook ${activePin === "hook" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("hook")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse" />
            <span className="sf-pin-badge">1</span>
            <div className="sf-pin-popover">
              <strong>El Anzuelo</strong>
              <p>Promesa de salario muy alto sin haber enviado hoja de vida previamente.</p>
            </div>
          </div>

          {/* Pin 2: El Celular y la Emoción */}
          <div 
            className={`sf-hotspot-pin pin-phone ${activePin === "phone" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("phone")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse" />
            <span className="sf-pin-badge">2</span>
            <div className="sf-pin-popover">
              <strong>Optimismo prematuro</strong>
              <p>La ilusión nubla el juicio crítico y evita verificar el número remitente.</p>
            </div>
          </div>
        </div>

        {/* Scene Watermark Tag */}
        <div className="sf-scene-tag hook">
          <span className="sft-dot" />
          <span>Fase 01 · El Anzuelo Emocional</span>
        </div>
      </div>
      <figcaption className="sr-only">
        Escena del Ciclo del Ataque: El atacante utiliza una oferta de empleo tentadora para atraer a la persona.
      </figcaption>
    </figure>
  );
}

/* ─── SCENE 2: LA URGENCIA (The Pressure / False Urgency Clock) ─── */
export function UrgencyIllustration({ className = "" }: IllustrationProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <figure className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-container">
        <Image
          src="/illustrations/02-urgencia.jpg"
          alt="Escena 2: La Urgencia. Personaje presionado con cronómetro en cuenta regresiva y alertas rojas inmediatas."
          width={720}
          height={540}
          className="sf-main-img"
          priority
        />

        {/* Interactive Pedagogical Hotspots */}
        <div className="sf-hotspots-layer">
          {/* Pin 1: El Reloj */}
          <div 
            className={`sf-hotspot-pin pin-clock ${activePin === "clock" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("clock")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse danger" />
            <span className="sf-pin-badge danger">1</span>
            <div className="sf-pin-popover">
              <strong>Temporizador artificial</strong>
              <p>Límite arbitrario de minutos para forzar a actuar sin tiempo de pensar.</p>
            </div>
          </div>

          {/* Pin 2: El Estrés */}
          <div 
            className={`sf-hotspot-pin pin-stress ${activePin === "stress" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("stress")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse warning" />
            <span className="sf-pin-badge warning">2</span>
            <div className="sf-pin-popover">
              <strong>Efecto túnel</strong>
              <p>El pánico a perder la oportunidad impide llamar a consultar con otros.</p>
            </div>
          </div>
        </div>

        {/* Scene Watermark Tag */}
        <div className="sf-scene-tag urgency">
          <span className="sft-dot" />
          <span>Fase 02 · Presión Psicológica (11:59)</span>
        </div>
      </div>
      <figcaption className="sr-only">
        Escena del Ciclo del Ataque: El atacante usa plazos inmediatos para forzar decisiones precipitadas.
      </figcaption>
    </figure>
  );
}

/* ─── SCENE 3: LA TRAMPA (The Trap / Money & Identity Extraction) ─── */
export function TrapIllustration({ className = "" }: IllustrationProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <figure className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-container">
        <Image
          src="/illustrations/03-trampa.jpg"
          alt="Escena 3: La Trampa. Personaje en duda frenando ante solicitud de dinero por exámenes médicos y foto de cédula."
          width={720}
          height={540}
          className="sf-main-img"
          priority
        />

        {/* Interactive Pedagogical Hotspots */}
        <div className="sf-hotspots-layer">
          {/* Pin 1: Cobro de Dinero */}
          <div 
            className={`sf-hotspot-pin pin-money ${activePin === "money" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("money")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse danger" />
            <span className="sf-pin-badge danger">1</span>
            <div className="sf-pin-popover">
              <strong>Cobro anticipado</strong>
              <p>Petición de dinero para exámenes médicos o uniformes antes del contrato.</p>
            </div>
          </div>

          {/* Pin 2: Cédula */}
          <div 
            className={`sf-hotspot-pin pin-cedula ${activePin === "cedula" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("cedula")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse danger" />
            <span className="sf-pin-badge danger">2</span>
            <div className="sf-pin-popover">
              <strong>Captura de cédula</strong>
              <p>Piden fotos de tu documento por WhatsApp para abrir créditos a tu nombre.</p>
            </div>
          </div>
        </div>

        {/* Scene Watermark Tag */}
        <div className="sf-scene-tag trap">
          <span className="sft-dot" />
          <span>Fase 03 · Extracción Irregular</span>
        </div>
      </div>
      <figcaption className="sr-only">
        Escena del Ciclo del Ataque: El fraude se materializa al exigir transferencias y fotos del documento de identidad.
      </figcaption>
    </figure>
  );
}

/* ─── SCENE 4: EL MOMENTO PAUSA (The Autonomous Verification & Defense) ─── */
export function PauseIllustration({ className = "" }: IllustrationProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <figure className={`story-figure-wrapper ${className}`}>
      <div className="sf-image-container">
        <Image
          src="/illustrations/04-pausa.jpg"
          alt="Escena 4: El Momento PAUSA. Personaje tranquilo con escudo PAUSA en la mano y verificando en sitio web oficial con candado SSL."
          width={720}
          height={540}
          className="sf-main-img"
          priority
        />

        {/* Interactive Pedagogical Hotspots */}
        <div className="sf-hotspots-layer">
          {/* Pin 1: Gesto PAUSA */}
          <div 
            className={`sf-hotspot-pin pin-pause-hand ${activePin === "pause" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("pause")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse success" />
            <span className="sf-pin-badge success">1</span>
            <div className="sf-pin-popover">
              <strong>El Gesto PAUSA</strong>
              <p>Freno cognitivo: Salir del chat de inmediato sin pagar ni enviar cédula.</p>
            </div>
          </div>

          {/* Pin 2: Canal Oficial SSL */}
          <div 
            className={`sf-hotspot-pin pin-ssl ${activePin === "ssl" ? "open" : ""}`}
            onMouseEnter={() => setActivePin("ssl")}
            onMouseLeave={() => setActivePin(null)}
          >
            <span className="sf-pin-pulse success" />
            <span className="sf-pin-badge success">2</span>
            <div className="sf-pin-popover">
              <strong>Canal Independiente</strong>
              <p>Búsqueda autónoma en Google y consulta al conmutador o web real de la empresa.</p>
            </div>
          </div>
        </div>

        {/* Scene Watermark Tag */}
        <div className="sf-scene-tag pausa">
          <span className="sft-dot" />
          <span>Fase 04 · Verificación Autónoma Activa</span>
        </div>
      </div>
      <figcaption className="sr-only">
        Escena del Ciclo del Ataque: La persona detiene la acción y verifica de manera independiente mediante un canal oficial seguro.
      </figcaption>
    </figure>
  );
}
