"use client";

export function DecisionIllustration() {
  return (
    <div className="decision-hero-illustration" aria-hidden="true">
      <svg
        viewBox="0 0 340 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="dhi-svg"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eef8f8" />
            <stop offset="100%" stopColor="#dff3f2" />
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#079ca8" />
            <stop offset="100%" stopColor="#057a85" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8c39e" />
            <stop offset="100%" stopColor="#e5a87e" />
          </linearGradient>
          <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a3c6d" />
            <stop offset="100%" stopColor="#031f3d" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#062b53" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Soft Background Pod */}
        <ellipse cx="170" cy="120" rx="145" ry="85" fill="url(#bgGrad)" />

        {/* Floating Security Particles */}
        <circle cx="50" cy="65" r="4" fill="#18b8b2" opacity="0.4" />
        <circle cx="85" cy="40" r="3" fill="#079ca8" opacity="0.5" />
        <circle cx="280" cy="55" r="5" fill="#35cfc9" opacity="0.4" />
        <circle cx="305" cy="95" r="3" fill="#0a3c6d" opacity="0.3" />

        {/* Decorative Alert Badge */}
        <g transform="translate(230, 42)" className="dhi-alert-badge">
          <circle cx="16" cy="16" r="15" fill="#f87171" />
          <path
            d="M16 8v9M16 21v1.5"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Character Illustration */}
        <g id="character">
          {/* Hair back */}
          <path
            d="M152 70c-15-28 6-42 28-40 20 2 32 18 32 36 0 10-6 16-12 18z"
            fill="#062b53"
          />

          {/* Neck */}
          <path d="M178 98h14v22h-14z" fill="url(#skinGrad)" />

          {/* Head & Face */}
          <path
            d="M168 62c0-14 10-24 24-24s24 10 24 24c0 14-8 28-24 28s-24-14-24-28z"
            fill="url(#skinGrad)"
          />

          {/* Hair front / stylish cut */}
          <path
            d="M164 56c4-12 16-20 28-20 16 0 28 8 30 18-4-2-10-3-16-1-8 2-14 8-16 14-6-1-16-4-26-11z"
            fill="#031f3d"
          />

          {/* Eye & Brow in Thought */}
          <path d="M184 56c3-2 8-2 11 0" stroke="#031f3d" strokeWidth="2" strokeLinecap="round" />
          <circle cx="190" cy="62" r="2.2" fill="#031f3d" />
          
          {/* Nose & Mouth */}
          <path d="M196 64l-2 5h4" stroke="#d48c60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M188 77c3-1 7-1 9 0" stroke="#b86f45" strokeWidth="1.8" strokeLinecap="round" />

          {/* Torso / Turquoise Hoodie */}
          <path
            d="M140 148c10-24 26-30 48-30 20 0 38 6 48 30v40H140v-40z"
            fill="url(#shirtGrad)"
          />

          {/* Collar detail */}
          <path
            d="M176 118c4 6 10 10 16 10s12-4 16-10"
            stroke="#031f3d"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Left Arm & Hand on Chin (Thinking Pose) */}
          <path
            d="M152 148c-6-14-2-34 16-44l16-6"
            stroke="url(#shirtGrad)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Hand at chin */}
          <ellipse cx="184" cy="88" rx="8" ry="6" fill="url(#skinGrad)" />

          {/* Right Arm holding phone */}
          <path
            d="M228 144c10-10 18-24 16-40l-14-12"
            stroke="url(#shirtGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Smartphone */}
          <g transform="translate(222, 92) rotate(-8)" filter="url(#shadow)">
            <rect
              x="0"
              y="0"
              width="34"
              height="60"
              rx="6"
              fill="url(#phoneGrad)"
              stroke="#35cfc9"
              strokeWidth="1.5"
            />
            {/* Screen */}
            <rect x="3" y="5" width="28" height="46" rx="3" fill="#ffffff" />
            {/* Fake message bubbles on screen */}
            <rect x="6" y="9" width="16" height="6" rx="2" fill="#079ca8" opacity="0.8" />
            <rect x="6" y="18" width="22" height="10" rx="2" fill="#e2e8f0" />
            <rect x="12" y="31" width="16" height="6" rx="2" fill="#f87171" opacity="0.8" />
            {/* Home indicator */}
            <rect x="13" y="54" width="8" height="1.5" rx="1" fill="#94a3b8" />
          </g>

          {/* Hand fingers holding phone */}
          <ellipse cx="230" cy="116" rx="5" ry="7" fill="url(#skinGrad)" transform="rotate(15, 230, 116)" />
        </g>
      </svg>
    </div>
  );
}
