import React from "react";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * PAUSA EDITORIAL ILLUSTRATION SYSTEM: Attack Cycle Illustrated Story
 * 
 * Reusable character: Relatable young Colombian person learning digital defense.
 * Palette: Navy (#062b53), Teal (#079ca8, #18b8b2), Amber (#d97706), Red (#dc2626),
 * Emerald (#059669), warm skin tones (#d99b70, #c48255), and clear editorial vectors.
 * ════════════════════════════════════════════════════════════════════════════
 */

/* ─── SCENE 1: EL GANCHO (The Hook / Deceptive Offer) ─── */
export function HookIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Escena 1: El Gancho - Personaje entusiasmado al recibir una vacante atractiva en su celular"
      role="img"
    >
      <defs>
        <radialGradient id="h-bg-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#dff7f4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f4f7f8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <linearGradient id="h-phone-screen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f4f89" />
          <stop offset="100%" stopColor="#079ca8" />
        </linearGradient>
        <filter id="h-shadow" x="-8%" y="-8%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#062b53" floodOpacity="0.12" />
        </filter>
        <filter id="h-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Atmosphere */}
      <rect width="540" height="380" rx="16" fill="#f8fafb" />
      <circle cx="260" cy="200" r="170" fill="url(#h-bg-glow)" />

      {/* Decorative Sparkles & Ambient Motifs */}
      <g opacity="0.6">
        <circle cx="90" cy="80" r="3" fill="#18b8b2" />
        <circle cx="480" cy="90" r="4" fill="#35cfc9" />
        <circle cx="460" cy="280" r="3" fill="#079ca8" />
        <circle cx="70" cy="290" r="3" fill="#062b53" />
      </g>

      {/* Golden Hook Motif at Top Left */}
      <g transform="translate(60, 42)">
        <circle cx="16" cy="16" r="16" fill="#e0f2fe" />
        <path d="M16 6 v12 a5 5 0 0 1 -10 0 v-3" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M6 15 l-3 -2" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
        <text x="38" y="21" fill="#0369a1" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.04em">
          FASE 1: EL ANZUELO EMOCIONAL
        </text>
      </g>

      {/* ─── CHARACTER: Joven colombiano ilusionado ─── */}
      <g id="character-hook" transform="translate(110, 105)">
        {/* Soft shadow under character */}
        <ellipse cx="90" cy="245" rx="75" ry="12" fill="#062b53" opacity="0.09" />

        {/* Torso / Clothes */}
        {/* Navy Casual Jacket */}
        <path
          d="M45 245 C45 175, 60 150, 90 148 C120 150, 135 175, 135 245 Z"
          fill="#062b53"
        />
        {/* White Inner Tee */}
        <path
          d="M78 148 C85 165, 95 165, 102 148 L98 215 C94 216, 86 216, 82 215 Z"
          fill="#ffffff"
        />
        {/* Teal Collar accents */}
        <path d="M72 148 L84 195 L90 148" fill="#079ca8" opacity="0.9" />
        <path d="M108 148 L96 195 L90 148" fill="#057a85" opacity="0.9" />

        {/* Neck */}
        <rect x="80" y="128" width="20" height="24" rx="4" fill="#c48255" />
        <path d="M80 142 C87 148, 93 148, 100 142 L100 148 L80 148 Z" fill="#b37146" />

        {/* Head */}
        <ellipse cx="90" cy="98" rx="28" ry="32" fill="#d99b70" />

        {/* Modern Textured Dark Hair */}
        <path
          d="M62 92 C60 70, 72 58, 90 58 C108 58, 120 70, 118 92 C115 80, 108 72, 90 72 C74 72, 65 82, 62 92 Z"
          fill="#111827"
        />
        <path
          d="M62 92 C60 84, 62 76, 70 70 C78 64, 102 64, 110 70 C118 76, 120 84, 118 92 C115 86, 106 82, 90 82 C74 82, 65 86, 62 92 Z"
          fill="#1f2937"
        />

        {/* Ears */}
        <ellipse cx="62" cy="100" rx="5" ry="8" fill="#c48255" />
        <ellipse cx="118" cy="100" rx="5" ry="8" fill="#c48255" />

        {/* Expressive Face (Interested, smiling, bright eyes) */}
        {/* Eyebrows lifted with curiosity */}
        <path d="M74 85 Q82 81 88 84" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M94 84 Q100 81 108 85" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Eyes wide and bright */}
        <ellipse cx="80" cy="94" rx="3.5" ry="4.5" fill="#111827" />
        <ellipse cx="102" cy="94" rx="3.5" ry="4.5" fill="#111827" />
        {/* Eye highlights */}
        <circle cx="81.5" cy="92.5" r="1.3" fill="#ffffff" />
        <circle cx="103.5" cy="92.5" r="1.3" fill="#ffffff" />

        {/* Nose */}
        <path d="M89 94 Q92 101 88 103" stroke="#b37146" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Friendly enthusiastic smile */}
        <path d="M80 110 Q90 120 100 110" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M82 110 Q90 117 98 110" fill="#ffffff" />

        {/* Arms holding phone */}
        <path d="M48 185 Q65 210 82 205" stroke="#062b53" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M132 185 Q115 210 98 205" stroke="#062b53" strokeWidth="16" strokeLinecap="round" fill="none" />
        {/* Hands */}
        <circle cx="82" cy="205" r="9" fill="#d99b70" />
        <circle cx="98" cy="205" r="9" fill="#d99b70" />

        {/* Smartphone in hands */}
        <rect x="74" y="180" width="32" height="48" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="77" y="184" width="26" height="40" rx="3" fill="url(#h-phone-screen)" />
        {/* Glow radiating upward from screen */}
        <polygon points="76,184 104,184 140,110 60,110" fill="#38bdf8" opacity="0.15" />
      </g>

      {/* ─── FLOATING DECEPTIVE OFFER CARD (The Hook) ─── */}
      <g transform="translate(260, 85)" filter="url(#h-shadow)">
        {/* Main Card Frame */}
        <rect width="245" height="185" rx="14" fill="url(#h-card-grad)" stroke="#d9e2e6" strokeWidth="1.5" />

        {/* Top Chat Header */}
        <rect width="245" height="38" rx="14" fill="#062b53" />
        <rect y="24" width="245" height="14" fill="#062b53" />
        {/* Sender avatar */}
        <circle cx="24" cy="19" r="11" fill="#079ca8" />
        <text x="20" y="23" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif">TH</text>
        {/* Sender Name & Verification Mock */}
        <text x="44" y="17" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">Talento Humano Corp</text>
        <text x="44" y="29" fill="#7dd3fc" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Mensaje no solicitado · 10:42 AM</text>

        {/* Chat message content */}
        <g transform="translate(14, 50)">
          {/* Incoming message bubble */}
          <rect width="217" height="66" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
          <text x="10" y="18" fill="#14532d" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            ¡Hola! Vimos tu hoja de vida.
          </text>
          <text x="10" y="32" fill="#166534" fontSize="9.5" fontWeight="500" fontFamily="sans-serif">
            Fuiste preseleccionado para la vacante:
          </text>
          {/* Enticing Job Title & High Salary Pill */}
          <rect x="10" y="38" width="197" height="20" rx="4" fill="#15803d" />
          <text x="16" y="52" fill="#ffffff" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">
            Auxiliar Logístico · $2.400.000 + Auxilio
          </text>
        </g>

        {/* The Golden Carrot Badge */}
        <g transform="translate(14, 126)">
          <rect width="217" height="42" rx="8" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1" />
          <circle cx="20" cy="21" r="10" fill="#fef3c7" />
          <text x="16" y="25" fill="#b45309" fontSize="11" fontWeight="900">✨</text>
          <text x="36" y="18" fill="#92400e" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">
            Ilusión de oportunidad única
          </text>
          <text x="36" y="31" fill="#b45309" fontSize="8.5" fontWeight="500" fontFamily="sans-serif">
            Sueldo por encima del mercado para bajar tus defensas.
          </text>
        </g>
      </g>

      {/* Floating Sparkle Elements */}
      <g transform="translate(245, 60)" filter="url(#h-glow)">
        <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" fill="#f59e0b" />
      </g>
      <g transform="translate(500, 240)">
        <polygon points="8,0 10,6 16,8 10,10 8,16 6,10 0,8 6,6" fill="#18b8b2" opacity="0.8" />
      </g>

      {/* Bottom Educational Banner */}
      <rect x="30" y="318" width="480" height="46" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" />
      <g transform="translate(46, 332)">
        <circle cx="10" cy="10" r="10" fill="#0284c7" />
        <text x="6.5" y="14" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">💡</text>
        <text x="30" y="9" fill="#062b53" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
          Mecanismo del engaño:
        </text>
        <text x="162" y="9" fill="#475569" fontSize="10.5" fontWeight="500" fontFamily="sans-serif">
          El atacante usa una recompensa alta o prometedora para generar ilusión inmediata.
        </text>
        <text x="30" y="24" fill="#0284c7" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
          Reflejo PAUSA: Si no postulaste a la empresa o el salario es atípico, desconfía del origen.
        </text>
      </g>
    </svg>
  );
}

/* ─── SCENE 2: LA URGENCIA (The Pressure / False Urgency Clock) ─── */
export function UrgencyIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Escena 2: La Urgencia - Personaje presionado por un reloj y plazos artificiales inmediatos"
      role="img"
    >
      <defs>
        <radialGradient id="u-bg-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fffbeb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="u-clock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef2f2" />
        </linearGradient>
        <filter id="u-shadow" x="-8%" y="-8%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#991b1b" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background Atmosphere */}
      <rect width="540" height="380" rx="16" fill="#fffcf7" />
      <circle cx="280" cy="190" r="180" fill="url(#u-bg-glow)" />

      {/* Phase Label */}
      <g transform="translate(60, 42)">
        <circle cx="16" cy="16" r="16" fill="#fef3c7" />
        <path d="M16 9 v7 l4 3" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
        <text x="38" y="21" fill="#92400e" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.04em">
          FASE 2: PRESIÓN PSICOLÓGICA Y PLAZO FALSO
        </text>
      </g>

      {/* ─── CHARACTER: Joven tenso y apurado ─── */}
      <g id="character-urgency" transform="translate(100, 110)">
        {/* Floor Shadow */}
        <ellipse cx="85" cy="240" rx="70" ry="12" fill="#78350f" opacity="0.08" />

        {/* Torso: Shoulders hunched upward in stress */}
        <path
          d="M40 240 C40 165, 55 142, 85 142 C115 142, 130 165, 130 240 Z"
          fill="#062b53"
        />
        {/* Inner Tee */}
        <path
          d="M75 142 C82 158, 88 158, 95 142 L93 210 C89 211, 81 211, 77 210 Z"
          fill="#ffffff"
        />

        {/* Neck with tense muscle lines */}
        <rect x="75" y="122" width="20" height="24" rx="4" fill="#c48255" />
        <line x1="79" y1="126" x2="81" y2="138" stroke="#a35f35" strokeWidth="1.5" />
        <line x1="91" y1="126" x2="89" y2="138" stroke="#a35f35" strokeWidth="1.5" />

        {/* Head tilted forward nervously */}
        <ellipse cx="85" cy="94" rx="27" ry="31" fill="#d99b70" />

        {/* Hair */}
        <path
          d="M58 88 C56 66, 68 54, 85 54 C102 54, 114 66, 112 88 C109 76, 102 68, 85 68 C69 68, 61 78, 58 88 Z"
          fill="#111827"
        />

        {/* Ears */}
        <ellipse cx="58" cy="96" rx="5" ry="7.5" fill="#c48255" />
        <ellipse cx="112" cy="96" rx="5" ry="7.5" fill="#c48255" />

        {/* Sweat droplet on temple */}
        <path d="M107 86 C107 83, 110 80, 111 78 C112 80, 115 83, 115 86 C115 88, 113 90, 111 90 C109 90, 107 88, 107 86 Z" fill="#38bdf8" />

        {/* Worried Facial Expression */}
        {/* Eyebrows angled in anxiety */}
        <path d="M70 79 Q77 84 83 82" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M87 82 Q93 84 100 79" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Wide anxious eyes */}
        <ellipse cx="76" cy="91" rx="4.5" ry="5.5" fill="#ffffff" />
        <ellipse cx="94" cy="91" rx="4.5" ry="5.5" fill="#ffffff" />
        <circle cx="76" cy="91" r="2.8" fill="#111827" />
        <circle cx="94" cy="91" r="2.8" fill="#111827" />
        <circle cx="77" cy="89.5" r="1" fill="#ffffff" />
        <circle cx="95" cy="89.5" r="1" fill="#ffffff" />

        {/* Nose */}
        <path d="M84 92 Q87 99 83 100" stroke="#b37146" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Tense open mouth ("¡no hay tiempo!") */}
        <ellipse cx="85" cy="108" rx="6" ry="4" fill="#7f1d1d" />

        {/* Arms holding phone with urgency */}
        <path d="M42 178 Q60 198 76 195" stroke="#062b53" strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d="M128 178 Q110 198 94 195" stroke="#062b53" strokeWidth="15" strokeLinecap="round" fill="none" />
        <circle cx="76" cy="195" r="8" fill="#d99b70" />
        <circle cx="94" cy="195" r="8" fill="#d99b70" />

        {/* Smartphone vibrating */}
        <g transform="translate(72, 172)">
          <rect width="26" height="42" rx="5" fill="#1e293b" />
          <rect x="2" y="3" width="22" height="36" rx="2" fill="#ef4444" opacity="0.85" />
          {/* Vibration speed brackets */}
          <path d="M-4 12 Q-7 20 -4 28" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M30 12 Q33 20 30 28" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* ─── GIANT OMINOUS TICKING TIMER (The Urgency Machine) ─── */}
      <g transform="translate(265, 80)" filter="url(#u-shadow)">
        {/* Main Clock Dial Card */}
        <rect width="240" height="195" rx="14" fill="url(#u-clock-grad)" stroke="#fca5a5" strokeWidth="1.5" />

        {/* Clock top tab / stopwatch button */}
        <rect x="105" y="-8" width="30" height="10" rx="3" fill="#b91c1c" />

        {/* Clock Face Circle */}
        <circle cx="75" cy="85" r="48" fill="#ffffff" stroke="#ef4444" strokeWidth="4" />
        {/* Outer tick marks */}
        <circle cx="75" cy="85" r="42" fill="none" stroke="#fee2e2" strokeWidth="2" strokeDasharray="4 6" />

        {/* Clock Hands pointing urgently at 11:59 */}
        <circle cx="75" cy="85" r="5" fill="#991b1b" />
        <line x1="75" y1="85" x2="75" y2="48" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="75" y1="85" x2="63" y2="58" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" />

        {/* Alarm Vibration Arcs */}
        <path d="M30 45 Q20 60 25 78" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M120 45 Q130 60 125 78" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Countdown Badge alongside clock */}
        <g transform="translate(136, 45)">
          <rect width="90" height="32" rx="6" fill="#1e293b" />
          <text x="12" y="14" fill="#94a3b8" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">TIEMPO LÍMITE</text>
          <text x="12" y="27" fill="#f87171" fontSize="12" fontWeight="900" fontFamily="monospace">00:19:58</text>
        </g>

        <g transform="translate(136, 85)">
          <rect width="90" height="42" rx="6" fill="#fef2f2" stroke="#f87171" strokeWidth="1" />
          <text x="8" y="16" fill="#b91c1c" fontSize="8" fontWeight="800" fontFamily="sans-serif">⚠️ PLAZO FORZADO</text>
          <text x="8" y="28" fill="#7f1d1d" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">«Solo hoy para asegurar</text>
          <text x="8" y="38" fill="#7f1d1d" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">el último cupo»</text>
        </g>

        {/* Psychological Trap Explanation */}
        <g transform="translate(16, 144)">
          <rect width="208" height="38" rx="8" fill="#fff7ed" stroke="#fdba74" strokeWidth="1" />
          <circle cx="16" cy="19" r="8" fill="#ffedd5" />
          <text x="12" y="23" fill="#c2410c" fontSize="10" fontWeight="900">⚡</text>
          <text x="32" y="16" fill="#9a3412" fontSize="9" fontWeight="800" fontFamily="sans-serif">
            Efecto túnel cognitivo
          </text>
          <text x="32" y="29" fill="#c2410c" fontSize="8" fontWeight="500" fontFamily="sans-serif">
            El apuro te impide consultar con familiares o verificar fuentes.
          </text>
        </g>
      </g>

      {/* Bottom Educational Banner */}
      <rect x="30" y="318" width="480" height="46" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" />
      <g transform="translate(46, 332)">
        <circle cx="10" cy="10" r="10" fill="#d97706" />
        <text x="6" y="14" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">⏳</text>
        <text x="30" y="9" fill="#062b53" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
          Mecanismo del engaño:
        </text>
        <text x="162" y="9" fill="#475569" fontSize="10.5" fontWeight="500" fontFamily="sans-serif">
          La urgencia forzada activa la toma de decisiones impulsiva antes de razonar.
        </text>
        <text x="30" y="24" fill="#d97706" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
          Reflejo PAUSA: Ninguna contratación seria exige pagar o entregar documentos en 20 minutos.
        </text>
      </g>
    </svg>
  );
}

/* ─── SCENE 3: LA TRAMPA (The Trap / Money & Identity Extraction) ─── */
export function TrapIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Escena 3: La Trampa - Personaje alarmado ante cobros injustificados y solicitud de cédula"
      role="img"
    >
      <defs>
        <radialGradient id="t-bg-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff5f5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="t-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff1f2" />
        </linearGradient>
        <filter id="t-shadow" x="-8%" y="-8%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#881337" floodOpacity="0.14" />
        </filter>
      </defs>

      {/* Background Atmosphere */}
      <rect width="540" height="380" rx="16" fill="#fffcfc" />
      <circle cx="280" cy="190" r="180" fill="url(#t-bg-glow)" />

      {/* Phase Label */}
      <g transform="translate(60, 42)">
        <circle cx="16" cy="16" r="16" fill="#fee2e2" />
        <path d="M16 10 v7 M16 21 v1" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
        <text x="38" y="21" fill="#991b1b" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.04em">
          FASE 3: LA TRAMPA (EXTRACCIÓN DE DINERO O IDENTIDAD)
        </text>
      </g>

      {/* ─── CHARACTER: Joven confuso, dudando y frenando ─── */}
      <g id="character-trap" transform="translate(95, 110)">
        {/* Floor Shadow */}
        <ellipse cx="85" cy="240" rx="70" ry="12" fill="#881337" opacity="0.08" />

        {/* Torso leaning back in distrust */}
        <path
          d="M38 240 C38 168, 52 145, 80 145 C110 145, 126 168, 126 240 Z"
          fill="#062b53"
        />
        {/* Inner Tee */}
        <path
          d="M70 145 C78 160, 84 160, 92 145 L89 210 C85 211, 78 211, 74 210 Z"
          fill="#ffffff"
        />

        {/* Neck */}
        <rect x="70" y="125" width="20" height="24" rx="4" fill="#c48255" />

        {/* Head tilted with doubt */}
        <ellipse cx="80" cy="95" rx="27" ry="31" fill="#d99b70" />

        {/* Hair */}
        <path
          d="M53 89 C51 67, 63 55, 80 55 C97 55, 109 67, 107 89 C104 77, 97 69, 80 69 C64 69, 56 79, 53 89 Z"
          fill="#111827"
        />

        {/* Ears */}
        <ellipse cx="53" cy="97" rx="5" ry="7.5" fill="#c48255" />
        <ellipse cx="107" cy="97" rx="5" ry="7.5" fill="#c48255" />

        {/* Skeptical facial expression: one eyebrow raised, one lowered */}
        <path d="M66 84 Q72 87 78 86" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M83 80 Q90 75 97 80" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" fill="none" />

        {/* Eyes: suspicious squinting */}
        <ellipse cx="72" cy="92" rx="4" ry="3.5" fill="#111827" />
        <ellipse cx="90" cy="89" rx="4" ry="4.5" fill="#111827" />
        <circle cx="73" cy="91" r="1" fill="#ffffff" />
        <circle cx="91" cy="88" r="1.2" fill="#ffffff" />

        {/* Nose */}
        <path d="M79 93 Q82 100 78 101" stroke="#b37146" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Mouth drawn tight in suspicion */}
        <path d="M72 109 Q80 106 88 110" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Left hand holding phone at a distance, right hand raised in hesitation ("¿espera un momento?") */}
        <path d="M38 180 Q50 205 65 200" stroke="#062b53" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="65" cy="200" r="7.5" fill="#d99b70" />

        {/* Hesitating Right Arm pulled back */}
        <path d="M125 180 Q118 165 110 155" stroke="#062b53" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="110" cy="155" r="8" fill="#d99b70" />
        {/* Raised fingers showing pause/doubt */}
        <path d="M106 148 L108 154 M110 147 L111 154 M114 148 L113 154" stroke="#c48255" strokeWidth="2" strokeLinecap="round" />

        {/* Phone screen with warning red glow */}
        <g transform="translate(60, 180)">
          <rect width="24" height="40" rx="5" fill="#1e293b" />
          <rect x="2" y="3" width="20" height="34" rx="2" fill="#dc2626" opacity="0.9" />
          <text x="7" y="24" fill="#ffffff" fontSize="12" fontWeight="900">⚠️</text>
        </g>
      </g>

      {/* ─── THE TWO EXTRACTION TRAPS (Money & Document) ─── */}
      <g transform="translate(255, 78)" filter="url(#t-shadow)">
        {/* Main Card Frame */}
        <rect width="250" height="200" rx="14" fill="url(#t-card-grad)" stroke="#fca5a5" strokeWidth="1.5" />

        {/* Card Header */}
        <rect width="250" height="34" rx="14" fill="#991b1b" />
        <rect y="20" width="250" height="14" fill="#991b1b" />
        <text x="16" y="22" fill="#ffffff" fontSize="10.5" fontWeight="900" fontFamily="sans-serif">
          🚨 SOLICITUDES IRREGULARES
        </text>
        <rect x="180" y="8" width="56" height="18" rx="4" fill="#dc2626" />
        <text x="186" y="20" fill="#ffffff" fontSize="8" fontWeight="800" fontFamily="sans-serif">PELIGRO</text>

        {/* Trap Subcard A: Cobro previo de dinero */}
        <g transform="translate(14, 44)">
          <rect width="222" height="64" rx="8" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.2" />
          {/* Money icon badge */}
          <circle cx="22" cy="24" r="12" fill="#fee2e2" />
          <text x="18" y="28" fill="#b91c1c" fontSize="12" fontWeight="900">$</text>
          <text x="42" y="19" fill="#991b1b" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            Cobro de exámenes / dotación: $48.000
          </text>
          <text x="42" y="32" fill="#475569" fontSize="8.5" fontWeight="500" fontFamily="sans-serif">
            «Consigna a Nequi/Daviplata hoy para separar el cupo»
          </text>
          <rect x="42" y="40" width="168" height="16" rx="4" fill="#fee2e2" />
          <text x="48" y="52" fill="#991b1b" fontSize="7.5" fontWeight="800" fontFamily="sans-serif">
            ⛔ ILEGAL: Una empresa formal NUNCA cobra por entrar.
          </text>
        </g>

        {/* Trap Subcard B: Cédula y datos sensibles */}
        <g transform="translate(14, 116)">
          <rect width="222" height="68" rx="8" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.2" />
          {/* ID Card silhouette */}
          <rect x="12" y="14" width="24" height="16" rx="2" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" />
          <line x1="16" y1="18" x2="24" y2="18" stroke="#dc2626" strokeWidth="1.5" />
          <line x1="16" y1="22" x2="28" y2="22" stroke="#dc2626" strokeWidth="1.5" />

          <text x="42" y="20" fill="#991b1b" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            Foto de cédula por ambos lados
          </text>
          <text x="42" y="33" fill="#475569" fontSize="8.5" fontWeight="500" fontFamily="sans-serif">
            Pedida por chat sin contrato ni política de datos.
          </text>
          <rect x="42" y="42" width="168" height="18" rx="4" fill="#fff1f2" />
          <text x="48" y="55" fill="#be123c" fontSize="7.5" fontWeight="800" fontFamily="sans-serif">
            ⚠️ RIESGO: Apertura de créditos ilícitos a tu nombre.
          </text>
        </g>
      </g>

      {/* Bottom Educational Banner */}
      <rect x="30" y="318" width="480" height="46" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" />
      <g transform="translate(46, 332)">
        <circle cx="10" cy="10" r="10" fill="#dc2626" />
        <text x="6" y="14" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">🛑</text>
        <text x="30" y="9" fill="#062b53" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
          Mecanismo del engaño:
        </text>
        <text x="162" y="9" fill="#475569" fontSize="10.5" fontWeight="500" fontFamily="sans-serif">
          Aquí se consuma el fraude: capturar tu dinero o tu identidad personal.
        </text>
        <text x="30" y="24" fill="#dc2626" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
          Reflejo PAUSA: Si piden dinero o foto de tu documento por chat, detén la interacción de inmediato.
        </text>
      </g>
    </svg>
  );
}

/* ─── SCENE 4: EL MOMENTO PAUSA (The Autonomous Verification & Defense) ─── */
export function PauseIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Escena 4: El Momento PAUSA - Personaje tranquilo deteniendo el chat y verificando en sitio web oficial"
      role="img"
    >
      <defs>
        <radialGradient id="p-bg-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#ccfbf1" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="p-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <filter id="p-shadow" x="-8%" y="-8%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f766e" floodOpacity="0.16" />
        </filter>
        <filter id="p-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Atmosphere */}
      <rect width="540" height="380" rx="16" fill="#f6fdfc" />
      <circle cx="280" cy="190" r="180" fill="url(#p-bg-glow)" />

      {/* Phase Label */}
      <g transform="translate(60, 42)">
        <circle cx="16" cy="16" r="16" fill="#ccfbf1" />
        <path d="M11 16 l4 4 l8 -8" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="38" y="21" fill="#0f766e" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.04em">
          FASE 4: EL MOMENTO PAUSA (VERIFICACIÓN INDEPENDIENTE)
        </text>
      </g>

      {/* ─── CHARACTER: Joven empoderado, sereno y seguro ─── */}
      <g id="character-pause" transform="translate(85, 110)">
        {/* Floor Shadow */}
        <ellipse cx="85" cy="240" rx="70" ry="12" fill="#0f766e" opacity="0.08" />

        {/* Upright, confident Torso */}
        <path
          d="M40 240 C40 165, 55 145, 85 145 C115 145, 130 165, 130 240 Z"
          fill="#062b53"
        />
        {/* Inner Tee */}
        <path
          d="M75 145 C82 160, 88 160, 95 145 L93 210 C89 211, 81 211, 77 210 Z"
          fill="#ffffff"
        />
        {/* Green/Teal lapel indicator */}
        <path d="M72 145 L80 185 L85 145" fill="#0d9488" />

        {/* Neck */}
        <rect x="75" y="125" width="20" height="24" rx="4" fill="#c48255" />

        {/* Head upright and centered */}
        <ellipse cx="85" cy="95" rx="27" ry="31" fill="#d99b70" />

        {/* Hair */}
        <path
          d="M58 89 C56 67, 68 55, 85 55 C102 55, 114 67, 112 89 C109 77, 102 69, 85 69 C69 69, 61 79, 58 89 Z"
          fill="#111827"
        />

        {/* Ears */}
        <ellipse cx="58" cy="97" rx="5" ry="7.5" fill="#c48255" />
        <ellipse cx="112" cy="97" rx="5" ry="7.5" fill="#c48255" />

        {/* Serene, confident expression */}
        {/* Calm horizontal eyebrows */}
        <path d="M70 82 Q77 81 83 83" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M87 83 Q93 81 100 82" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Confident smiling eyes */}
        <ellipse cx="76" cy="92" rx="3.5" ry="4" fill="#111827" />
        <ellipse cx="94" cy="92" rx="3.5" ry="4" fill="#111827" />
        <circle cx="77.5" cy="90.5" r="1.3" fill="#ffffff" />
        <circle cx="95.5" cy="90.5" r="1.3" fill="#ffffff" />

        {/* Nose */}
        <path d="M84 93 Q87 100 83 101" stroke="#b37146" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Reassuring smile */}
        <path d="M76 108 Q85 116 94 108" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Left Hand holding phone face-down / discarded safely */}
        <path d="M42 180 Q45 210 55 215" stroke="#062b53" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="55" cy="215" r="7.5" fill="#d99b70" />
        {/* Phone screen locked / off */}
        <rect x="48" y="212" width="14" height="24" rx="3" fill="#64748b" transform="rotate(25 48 212)" />

        {/* RIGHT ARM EXTENDED FORWARD: THE ICONIC PAUSA OPEN PALM */}
        <path d="M125 180 Q145 175 165 170" stroke="#062b53" strokeWidth="16" strokeLinecap="round" fill="none" />
        {/* Open Palm facing rightward into the verification zone */}
        <circle cx="168" cy="170" r="11" fill="#d99b70" />
        {/* 4 Fingers extended vertically in stop/pause signal */}
        <rect x="172" y="152" width="5.5" height="18" rx="2.5" fill="#d99b70" />
        <rect x="178" y="154" width="5" height="17" rx="2.5" fill="#c48255" />
        <rect x="166" y="155" width="5" height="16" rx="2.5" fill="#d99b70" />
        {/* Thumb */}
        <path d="M165 175 Q160 166 166 162" stroke="#c48255" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Luminous PAUSA Forcefield Shield Ring */}
        <g transform="translate(160, 125)" filter="url(#p-glow)">
          <circle cx="28" cy="45" r="32" fill="#0d9488" opacity="0.18" />
          <circle cx="28" cy="45" r="28" stroke="#14b8a6" strokeWidth="2" strokeDasharray="6 4" fill="none" />
          {/* Pause symbol bars */}
          <rect x="23" y="37" width="3.5" height="16" rx="1.5" fill="#0f766e" />
          <rect x="30" y="37" width="3.5" height="16" rx="1.5" fill="#0f766e" />
        </g>
      </g>

      {/* ─── AUTONOMOUS VERIFICATION STAGE (Independent Channel) ─── */}
      <g transform="translate(260, 78)" filter="url(#p-shadow)">
        {/* Clean Web Browser Window */}
        <rect width="245" height="200" rx="14" fill="#ffffff" stroke="#99f6e4" strokeWidth="1.5" />

        {/* Browser Top Bar */}
        <rect width="245" height="34" rx="14" fill="#f0fdfa" />
        <rect y="20" width="245" height="14" fill="#f0fdfa" />
        {/* Window controls */}
        <circle cx="16" cy="18" r="4" fill="#cbd5e1" />
        <circle cx="28" cy="18" r="4" fill="#cbd5e1" />
        <circle cx="40" cy="18" r="4" fill="#cbd5e1" />

        {/* Address Bar with Green Padlock */}
        <rect x="54" y="8" width="176" height="20" rx="5" fill="#ffffff" stroke="#0d9488" strokeWidth="1.2" />
        <path d="M64 15 h6 v5 h-6 Z M66 15 v-2 a1 1 0 0 1 2 0 v2" stroke="#0f766e" strokeWidth="1.2" fill="none" />
        <text x="76" y="22" fill="#0f766e" fontSize="8" fontWeight="800" fontFamily="monospace">
          https://empresaoficial.com
        </text>

        {/* Verified Directory Results */}
        <g transform="translate(14, 46)">
          <rect width="217" height="66" rx="8" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="1" />
          <circle cx="22" cy="24" r="11" fill="#ccfbf1" />
          <path d="M18 24 l3 3 l6 -6" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
          <text x="40" y="20" fill="#0f766e" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
            Directorio Oficial de Empleos
          </text>
          <text x="40" y="32" fill="#334155" fontSize="8.5" fontWeight="500" fontFamily="sans-serif">
            Portal verificado sin intermediarios ni cobros.
          </text>
          <rect x="14" y="42" width="190" height="18" rx="4" fill="#0f766e" />
          <text x="20" y="54" fill="#ffffff" fontSize="8" fontWeight="800" fontFamily="sans-serif">
            PBX Oficial: (601) 745-0000 · Conmutador directo
          </text>
        </g>

        {/* The Safety Rule Banner */}
        <g transform="translate(14, 122)">
          <rect width="217" height="64" rx="8" fill="#ffffff" stroke="#99f6e4" strokeWidth="1.2" />
          <circle cx="20" cy="22" r="10" fill="#ccfbf1" />
          <text x="16" y="26" fill="#0f766e" fontSize="11" fontWeight="900">🛡️</text>
          <text x="36" y="19" fill="#0f766e" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
            Canal independiente activado
          </text>
          <text x="36" y="32" fill="#475569" fontSize="8.5" fontWeight="500" fontFamily="sans-serif">
            Validaste por tu cuenta en Google o en la web real.
          </text>
          <text x="36" y="48" fill="#047857" fontSize="8" fontWeight="800" fontFamily="sans-serif">
            ✅ La trampa queda completamente desactivada.
          </text>
        </g>
      </g>

      {/* Bottom Educational Banner */}
      <rect x="30" y="318" width="480" height="46" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" />
      <g transform="translate(46, 332)">
        <circle cx="10" cy="10" r="10" fill="#0d9488" />
        <path d="M6 10 l3 3 l5 -5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <text x="30" y="9" fill="#062b53" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
          El superpoder de la PAUSA:
        </text>
        <text x="162" y="9" fill="#475569" fontSize="10.5" fontWeight="500" fontFamily="sans-serif">
          Romper el canal del mensaje y buscar la empresa por tus propios medios.
        </text>
        <text x="30" y="24" fill="#0d9488" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
          Reflejo PAUSA: Nunca respondas con dinero o cédula desde el enlace que te enviaron. Busca tú mismo.
        </text>
      </g>
    </svg>
  );
}
