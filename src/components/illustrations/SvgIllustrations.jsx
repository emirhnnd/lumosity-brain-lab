import React from 'react';

// 1. Memory Matrix Illustration
export function MemoryMatrixIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="memGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="memGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#4facfe" />
        </linearGradient>
        <filter id="glowMem" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <circle cx="100" cy="100" r="80" fill="url(#memGrad1)" opacity="0.15" filter="url(#glowMem)" />
      
      <g transform="translate(100, 60) rotate(45) scale(0.9)">
        <rect x="-45" y="-45" width="26" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <rect x="-12" y="-45" width="26" height="26" rx="6" fill="url(#memGradActive)" filter="url(#glowMem)" />
        <rect x="21" y="-45" width="26" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        
        <rect x="-45" y="-12" width="26" height="26" rx="6" fill="url(#memGradActive)" filter="url(#glowMem)" />
        <rect x="-12" y="-12" width="26" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <rect x="21" y="-12" width="26" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

        <rect x="-45" y="21" width="26" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <rect x="-12" y="21" width="26" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <rect x="21" y="21" width="26" height="26" rx="6" fill="url(#memGradActive)" filter="url(#glowMem)" />
      </g>
    </svg>
  );
}

// 2. Train of Thought Illustration
export function TrainOfThoughtIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trainRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="trainGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="glowTrack" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <path d="M 100 20 L 100 80 Q 100 120 50 160" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
      <path d="M 100 80 Q 100 120 150 160" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
      
      <path d="M 100 20 L 100 80 Q 100 120 50 160" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" />
      <path d="M 100 80 Q 100 120 150 160" stroke="#10b981" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" />

      <circle cx="100" cy="80" r="16" fill="#0f172a" stroke="#fbbf24" strokeWidth="4" filter="url(#glowTrack)" />
      <path d="M 94 80 L 106 80 M 100 74 L 100 86" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />

      <g transform="translate(40, 150)">
        <rect x="-18" y="-14" width="36" height="28" rx="8" fill="url(#trainRed)" filter="url(#glowTrack)" />
        <circle cx="-6" cy="0" r="4" fill="#fff" />
        <circle cx="6" cy="0" r="4" fill="#fff" />
      </g>

      <g transform="translate(160, 150)">
        <rect x="-18" y="-14" width="36" height="28" rx="8" fill="url(#trainGreen)" filter="url(#glowTrack)" />
        <circle cx="-6" cy="0" r="4" fill="#fff" />
        <circle cx="6" cy="0" r="4" fill="#fff" />
      </g>
    </svg>
  );
}

// 3. PvP Duel Arena Illustration
export function PvpArenaIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pvpRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4b1f" />
          <stop offset="100%" stopColor="#ff9068" />
        </linearGradient>
        <linearGradient id="pvpBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="100%" stopColor="#0072ff" />
        </linearGradient>
        <filter id="glowPvp" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r="75" fill="url(#pvpRed)" opacity="0.2" filter="url(#glowPvp)" />

      <g transform="translate(100,100) rotate(-45)">
        <rect x="-6" y="-70" width="12" height="100" rx="6" fill="url(#pvpRed)" filter="url(#glowPvp)" />
        <rect x="-16" y="20" width="32" height="8" rx="4" fill="#fff" />
        <circle cx="0" cy="36" r="6" fill="#fff" />
      </g>

      <g transform="translate(100,100) rotate(45)">
        <rect x="-6" y="-70" width="12" height="100" rx="6" fill="url(#pvpBlue)" filter="url(#glowPvp)" />
        <rect x="-16" y="20" width="32" height="8" rx="4" fill="#fff" />
        <circle cx="0" cy="36" r="6" fill="#fff" />
      </g>

      <circle cx="100" cy="100" r="18" fill="#ffffff" filter="url(#glowPvp)" />
      <polygon points="100,75 106,94 125,100 106,106 100,125 94,106 75,100 94,94" fill="#fbbf24" />
    </svg>
  );
}

// 4. Stroop Color Rush Illustration
export function StroopColorIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glowStroop" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="80" cy="80" r="45" fill="#ef4444" opacity="0.7" filter="url(#glowStroop)" />
      <circle cx="120" cy="80" r="45" fill="#3b82f6" opacity="0.7" filter="url(#glowStroop)" />
      <circle cx="100" cy="120" r="45" fill="#10b981" opacity="0.7" filter="url(#glowStroop)" />

      <circle cx="100" cy="95" r="24" fill="#0f172a" stroke="#fff" strokeWidth="3" />
      <text x="100" y="103" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900" fontFamily="sans-serif">A</text>
    </svg>
  );
}

// 5. Speed Reflex Illustration
export function SpeedReflexIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="glowSpeed" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r="70" stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 8" opacity="0.5" />
      <circle cx="100" cy="100" r="48" stroke="#38bdf8" strokeWidth="4" />
      <circle cx="100" cy="100" r="24" fill="url(#speedGrad)" filter="url(#glowSpeed)" />

      <polygon points="105,40 85,100 102,100 95,160 120,90 102,90" fill="#ffffff" filter="url(#glowSpeed)" />
    </svg>
  );
}

// 6. Flow Direction Illustration
export function FlowDirectionIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glowFlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r="72" stroke="#38bdf8" strokeWidth="4" strokeDasharray="12 6" opacity="0.6" />
      
      <g transform="translate(100,100) rotate(-45)">
        <polygon points="0,-45 25,35 0,20 -25,35" fill="#38bdf8" filter="url(#glowFlow)" />
        <polygon points="0,-45 0,20 -25,35" fill="#0284c7" />
      </g>

      <path d="M 40 50 L 55 60 L 40 56 L 35 60 Z" fill="#94a3b8" opacity="0.5" />
      <path d="M 150 140 L 165 150 L 150 146 L 145 150 Z" fill="#94a3b8" opacity="0.5" />
      <path d="M 160 40 L 175 50 L 160 46 L 155 50 Z" fill="#94a3b8" opacity="0.5" />
    </svg>
  );
}

// 7. Math Blitz Illustration
export function MathBlitzIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <filter id="glowMath" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r="70" fill="url(#mathGrad)" opacity="0.2" filter="url(#glowMath)" />
      
      <g fill="url(#mathGrad)" filter="url(#glowMath)">
        <text x="50" y="80" fontSize="38" fontWeight="900">+</text>
        <text x="120" y="75" fontSize="38" fontWeight="900">×</text>
        <text x="60" y="145" fontSize="38" fontWeight="900">=</text>
        <text x="130" y="140" fontSize="38" fontWeight="900">%</text>
      </g>
      
      <circle cx="100" cy="100" r="28" fill="#0f172a" stroke="#a855f7" strokeWidth="4" />
      <text x="100" y="109" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900">?</text>
    </svg>
  );
}

// 8. Pattern Decoder Illustration
export function PatternDecoderIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="patGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="glowPat" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <polygon points="100,30 160,65 160,135 100,170 40,135 40,65" fill="none" stroke="#10b981" strokeWidth="4" opacity="0.6" filter="url(#glowPat)" />
      
      <g transform="translate(100,100)">
        <polygon points="0,-35 30,20 -30,20" fill="url(#patGrad)" filter="url(#glowPat)" />
        <circle cx="0" cy="0" r="8" fill="#fff" />
      </g>
    </svg>
  );
}

// 9. Quantum Spell Chess Illustration
export function QuantumChessIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="glowChess" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r="75" fill="url(#chessGrad)" opacity="0.2" filter="url(#glowChess)" />
      
      <g transform="translate(100, 100)">
        {/* Crown / Queen Piece Icon */}
        <path d="M -30 20 L -30 -20 L -15 -5 L 0 -30 L 15 -5 L 30 -20 L 30 20 Z" fill="url(#chessGrad)" filter="url(#glowChess)" />
        <rect x="-35" y="22" width="70" height="12" rx="4" fill="#fff" />
        
        {/* Energy Aura Stars */}
        <circle cx="-30" cy="-24" r="5" fill="#fff" />
        <circle cx="0" cy="-35" r="6" fill="#fff" />
        <circle cx="30" cy="-24" r="5" fill="#fff" />
      </g>
    </svg>
  );
}

// 10. Word Bubbles Illustration
export function WordBubblesIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="110" r="45" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeWidth="3" />
      <circle cx="130" cy="80" r="32" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="2.5" />
      <circle cx="65" cy="65" r="22" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2" />
      <text x="90" y="117" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900" fontFamily="sans-serif">KEL</text>
      <text x="130" y="86" textAnchor="middle" fill="#38bdf8" fontSize="16" fontWeight="800" fontFamily="sans-serif">İM</text>
      <text x="65" y="70" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="800" fontFamily="sans-serif">E</text>
    </svg>
  );
}

// 11. Brain Shift Illustration
export function BrainShiftIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="55" width="55" height="55" rx="12" fill="rgba(244,63,94,0.25)" stroke="#f43f5e" strokeWidth="3" />
      <circle cx="135" cy="82" r="28" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeWidth="3" />
      <path d="M 80 140 C 100 120, 100 120, 120 140" stroke="#fbbf24" strokeWidth="3" strokeDasharray="4 4" />
      <path d="M 68 142 L 78 132 L 88 142" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <path d="M 112 138 L 122 148 L 132 138" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <text x="100" y="175" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="900" fontFamily="sans-serif">ŞEKİL ⇄ RENK</text>
    </svg>
  );
}

// 12. Eagle Eye Illustration
export function EagleEyeIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="100" cy="100" r="45" fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="18" fill="#10b981" />
      <line x1="100" y1="15" x2="100" y2="45" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="155" x2="100" y2="185" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
      <line x1="15" y1="100" x2="45" y2="100" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="100" x2="185" y2="100" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// 13. Familiar Faces Illustration
export function FamiliarFacesIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="85" r="42" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="3" />
      <circle cx="86" cy="80" r="5" fill="#fff" />
      <circle cx="114" cy="80" r="5" fill="#fff" />
      <path d="M 88 102 Q 100 114 112 102" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="55" y="142" width="90" height="24" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="100" y="158" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="800" fontFamily="sans-serif">Ahmet Yılmaz</text>
    </svg>
  );
}

// 14. Block Champ Illustration
export function BlockChampIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(60, 60)">
        <rect x="0" y="0" width="24" height="24" rx="4" fill="#818cf8" stroke="#6366f1" strokeWidth="1.5" />
        <rect x="28" y="0" width="24" height="24" rx="4" fill="#818cf8" stroke="#6366f1" strokeWidth="1.5" />
        <rect x="56" y="0" width="24" height="24" rx="4" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1.5" />
        <rect x="0" y="28" width="24" height="24" rx="4" fill="#c084fc" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="28" y="28" width="24" height="24" rx="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="56" y="28" width="24" height="24" rx="4" fill="#f43f5e" stroke="#e11d48" strokeWidth="1.5" />
        <rect x="0" y="56" width="24" height="24" rx="4" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
        <rect x="28" y="56" width="24" height="24" rx="4" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
        <rect x="56" y="56" width="24" height="24" rx="4" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// 15. Neuro Flash Illustration
export function NeuroFlashIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neuroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#7928ca" />
        </linearGradient>
        <filter id="glowNeuro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="100" cy="100" r="75" fill="rgba(0,242,254,0.15)" stroke="url(#neuroGrad)" strokeWidth="3" filter="url(#glowNeuro)" />
      <polygon points="105,25 70,105 105,105 95,175 140,85 105,85" fill="url(#neuroGrad)" filter="url(#glowNeuro)" />
      <text x="100" y="192" textAnchor="middle" fill="#00f2fe" fontSize="13" fontWeight="900" fontFamily="sans-serif">⚡ 180ms FLAŞ</text>
    </svg>
  );
}

// 16. Blindfold Labyrinth Illustration
export function BlindfoldLabyrinthIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="150" height="150" rx="16" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5" />
      <path d="M 45 65 L 115 65 L 115 115 L 75 115 L 75 155" stroke="#7928ca" strokeWidth="4" strokeLinecap="round" />
      <path d="M 135 45 L 135 135 L 105 135" stroke="#7928ca" strokeWidth="4" strokeLinecap="round" />
      <circle cx="45" cy="45" r="10" fill="#00f2fe" />
      <circle cx="155" cy="155" r="10" fill="#fbbf24" />
      <text x="100" y="188" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="800" fontFamily="sans-serif">KÖR UÇUŞ</text>
    </svg>
  );
}

// 17. Paradox Protocol Illustration
export function ParadoxProtocolIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" strokeWidth="2.5" />
      <path d="M 65 80 L 135 120" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
      <path d="M 135 80 L 65 120" stroke="#00f2fe" strokeWidth="4" strokeLinecap="round" />
      <circle cx="65" cy="80" r="12" fill="#38bdf8" />
      <circle cx="135" cy="120" r="12" fill="#f43f5e" />
      <text x="100" y="155" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="900" fontFamily="sans-serif">PARADOKS</text>
    </svg>
  );
}

// 18. Word Alchemy Illustration
export function WordAlchemyIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 80 40 L 120 40 L 145 130 C 155 160, 45 160, 55 130 Z" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="3" />
      <circle cx="100" cy="125" r="16" fill="#10b981" opacity="0.8" />
      <circle cx="85" cy="105" r="9" fill="#00f2fe" opacity="0.6" />
      <circle cx="115" cy="110" r="7" fill="#fbbf24" opacity="0.7" />
      <text x="100" y="85" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900" fontFamily="sans-serif">A➔Z</text>
    </svg>
  );
}

// 19. Chrono Mines Illustration
export function ChronoMinesIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="65" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="38" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
      <line x1="100" y1="50" x2="100" y2="40" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="150" x2="100" y2="160" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="100" x2="40" y2="100" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <line x1="150" y1="100" x2="160" y2="100" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <text x="100" y="108" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="900" fontFamily="sans-serif">⏳5</text>
    </svg>
  );
}


