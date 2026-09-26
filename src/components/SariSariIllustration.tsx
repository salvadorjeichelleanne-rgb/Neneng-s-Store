import React from 'react';

export const SariSariIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full relative overflow-hidden rounded-xl bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50/40 p-2 ${className}`}>
      <svg
        viewBox="0 0 480 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="60%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#f0fdf4" />
          </linearGradient>

          {/* Roof Shadow */}
          <linearGradient id="awningShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="480" height="320" rx="12" fill="url(#skyGrad)" />

        {/* Clouds */}
        <g fill="#ffffff" opacity="0.8">
          <ellipse cx="90" cy="55" rx="35" ry="16" />
          <ellipse cx="120" cy="45" rx="28" ry="18" />
          <ellipse cx="140" cy="55" rx="24" ry="14" />

          <ellipse cx="360" cy="65" rx="30" ry="14" />
          <ellipse cx="385" cy="55" rx="26" ry="16" />
          <ellipse cx="405" cy="65" rx="22" ry="12" />
        </g>

        {/* Tropical Palm Trees in Background */}
        {/* Left Palm Tree */}
        <g id="left-palm-tree">
          {/* Trunk */}
          <path
            d="M 45 320 Q 55 210 70 140 Q 75 110 82 90"
            stroke="#854d0e"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {/* Trunk Rings */}
          <path d="M 50 260 L 58 258" stroke="#713f12" strokeWidth="3" />
          <path d="M 57 210 L 65 208" stroke="#713f12" strokeWidth="3" />
          <path d="M 64 160 L 72 158" stroke="#713f12" strokeWidth="3" />
          <path d="M 72 120 L 79 118" stroke="#713f12" strokeWidth="3" />

          {/* Palm Fronds */}
          <path d="M 82 90 Q 50 65 20 85 Q 50 82 82 90" fill="#15803d" />
          <path d="M 82 90 Q 60 45 35 30 Q 65 52 82 90" fill="#16a34a" />
          <path d="M 82 90 Q 95 40 120 45 Q 100 65 82 90" fill="#15803d" />
          <path d="M 82 90 Q 115 70 145 95 Q 110 95 82 90" fill="#16a34a" />
          <path d="M 82 90 Q 80 120 70 145 Q 85 115 82 90" fill="#15803d" />
          <circle cx="82" cy="90" r="4" fill="#a16207" />
        </g>

        {/* Right Palm Tree */}
        <g id="right-palm-tree">
          {/* Trunk */}
          <path
            d="M 435 320 Q 425 210 405 140 Q 395 110 388 90"
            stroke="#854d0e"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          {/* Fronds */}
          <path d="M 388 90 Q 360 65 330 85 Q 360 80 388 90" fill="#15803d" />
          <path d="M 388 90 Q 370 45 350 30 Q 375 52 388 90" fill="#16a34a" />
          <path d="M 388 90 Q 410 40 440 50 Q 415 65 388 90" fill="#15803d" />
          <path d="M 388 90 Q 425 70 455 100 Q 420 95 388 90" fill="#16a34a" />
          <circle cx="388" cy="90" r="4" fill="#a16207" />
        </g>

        {/* Store Structure Base / Walls */}
        <rect x="110" y="145" width="260" height="175" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />

        {/* Store Window / Opening */}
        <rect x="135" y="170" width="210" height="110" rx="3" fill="#1e293b" />
        {/* Wire mesh pattern inside sari sari window */}
        <g stroke="#334155" strokeWidth="1" strokeDasharray="3,3">
          <line x1="135" y1="195" x2="345" y2="195" />
          <line x1="135" y1="220" x2="345" y2="220" />
          <line x1="135" y1="245" x2="345" y2="245" />
          <line x1="175" y1="170" x2="175" y2="280" />
          <line x1="215" y1="170" x2="215" y2="280" />
          <line x1="255" y1="170" x2="255" y2="280" />
          <line x1="295" y1="170" x2="295" y2="280" />
        </g>

        {/* Shelf Goods Inside Store (Sari-Sari Items) */}
        {/* Hanging snack bags (Chichirya sachets on strings) */}
        <g id="hanging-sachets">
          <line x1="145" y1="170" x2="145" y2="215" stroke="#94a3b8" strokeWidth="1" />
          <rect x="140" y="175" width="10" height="13" rx="1.5" fill="#ef4444" />
          <rect x="140" y="191" width="10" height="13" rx="1.5" fill="#f59e0b" />
          <rect x="140" y="207" width="10" height="13" rx="1.5" fill="#10b981" />

          <line x1="165" y1="170" x2="165" y2="215" stroke="#94a3b8" strokeWidth="1" />
          <rect x="160" y="175" width="10" height="13" rx="1.5" fill="#3b82f6" />
          <rect x="160" y="191" width="10" height="13" rx="1.5" fill="#ec4899" />
          <rect x="160" y="207" width="10" height="13" rx="1.5" fill="#8b5cf6" />
        </g>

        {/* Counter items: Jars, canned goods */}
        {/* Candy Jars */}
        <rect x="235" y="250" width="16" height="25" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="243" cy="260" r="3" fill="#f97316" />
        <circle cx="243" cy="268" r="3" fill="#ef4444" />
        <rect x="237" y="247" width="12" height="4" rx="1" fill="#dc2626" />

        <rect x="255" y="252" width="15" height="23" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="262" cy="262" r="3" fill="#10b981" />
        <circle cx="262" cy="269" r="3" fill="#3b82f6" />
        <rect x="257" y="249" width="11" height="4" rx="1" fill="#047857" />

        {/* Softdrink crates on side */}
        <rect x="280" y="254" width="22" height="22" rx="2" fill="#dc2626" />
        <circle cx="286" cy="260" r="2.5" fill="#fee2e2" />
        <circle cx="296" cy="260" r="2.5" fill="#fee2e2" />
        <circle cx="286" cy="270" r="2.5" fill="#fee2e2" />
        <circle cx="296" cy="270" r="2.5" fill="#fee2e2" />

        {/* Wooden Counter Shelf */}
        <rect x="125" y="275" width="230" height="14" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <rect x="128" y="280" width="224" height="2" fill="#d97706" opacity="0.6" />

        {/* Lower Counter Planks */}
        <line x1="110" y1="300" x2="370" y2="300" stroke="#d97706" strokeWidth="1" />

        {/* Striped Awning (Orange and Green stripes alternating) */}
        {/* Awning shadow onto wall */}
        <path d="M 90 148 L 390 148 L 380 162 L 100 162 Z" fill="url(#awningShadow)" />

        <g id="striped-awning">
          {/* Eaves base */}
          {/* Stripe 1: Orange */}
          <path d="M 95 105 L 125 105 L 120 152 L 85 152 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          {/* Stripe 2: Green */}
          <path d="M 125 105 L 155 105 L 155 152 L 120 152 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
          {/* Stripe 3: Orange */}
          <path d="M 155 105 L 185 105 L 190 152 L 155 152 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          {/* Stripe 4: Green */}
          <path d="M 185 105 L 215 105 L 225 152 L 190 152 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
          {/* Stripe 5: Orange */}
          <path d="M 215 105 L 245 105 L 260 152 L 225 152 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          {/* Stripe 6: Green */}
          <path d="M 245 105 L 275 105 L 295 152 L 260 152 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
          {/* Stripe 7: Orange */}
          <path d="M 275 105 L 305 105 L 330 152 L 295 152 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          {/* Stripe 8: Green */}
          <path d="M 305 105 L 335 105 L 365 152 L 330 152 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
          {/* Stripe 9: Orange */}
          <path d="M 335 105 L 365 105 L 395 152 L 365 152 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />

          {/* Scalloped Awning Fringe */}
          <path d="M 85 152 Q 102 164 120 152 Q 137 164 155 152 Q 172 164 190 152 Q 207 164 225 152 Q 242 164 260 152 Q 277 164 295 152 Q 312 164 330 152 Q 347 164 365 152 Q 380 164 395 152" fill="#ea580c" stroke="#9a3412" strokeWidth="1" />
        </g>

        {/* Store Signboard: SARI-SARI STORE */}
        <g id="store-signboard">
          {/* Signboard background with wooden border */}
          <rect
            x="140"
            y="62"
            width="200"
            height="36"
            rx="5"
            fill="#ffffff"
            stroke="#c2410c"
            strokeWidth="3"
            filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.15))"
          />
          {/* Inner border line */}
          <rect x="144" y="66" width="192" height="28" rx="3" fill="#fef2f2" stroke="#ea580c" strokeWidth="1" />

          {/* Sign Text: SARI-SARI STORE */}
          <text
            x="240"
            y="85"
            textAnchor="middle"
            fontFamily="Impact, Arial Black, sans-serif"
            fontSize="18"
            fontWeight="900"
            letterSpacing="2.5"
            fill="#c2410c"
          >
            SARI-SARI STORE
          </text>
        </g>

        {/* Ground Surface */}
        <rect x="0" y="306" width="480" height="14" fill="#166534" />
        <rect x="0" y="312" width="480" height="8" fill="#14532d" />
      </svg>
    </div>
  );
};
