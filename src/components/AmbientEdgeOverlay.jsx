import React, { useState, useEffect } from 'react';

const GAME_THEMES = {
  kuantum_satranc: { color1: '#fbbf24', color2: '#f59e0b', name: 'Kozmik Altın' },
  neuro_flash: { color1: '#00f2fe', color2: '#7928ca', name: 'Siber Flaş' },
  kor_ucus_labirenti: { color1: '#a855f7', color2: '#00f2fe', name: 'Kozmik Boşluk' },
  paradoks_protokolu: { color1: '#f43f5e', color2: '#a855f7', name: 'Paradoks Alarmı' },
  sozcuk_simyasi: { color1: '#00f2fe', color2: '#10b981', name: 'Simyasal Akış' },
  kuantum_mayin: { color1: '#f59e0b', color2: '#ef4444', name: 'Kuantum Radyasyon' },
  zihin_matrisi: { color1: '#38bdf8', color2: '#6366f1', name: 'Nöral Matris' },
  tren_yolu: { color1: '#10b981', color2: '#0ea5e9', name: 'Ray Hattı' },
  simsek_refleks: { color1: '#fbbf24', color2: '#f97316', name: 'Yıldırım Reaksiyon' },
  renk_matrisi: { color1: '#f43f5e', color2: '#10b981', name: 'Stroop Spektrumu' },
  yon_ve_akis: { color1: '#818cf8', color2: '#38bdf8', name: 'Akış Vektörü' },
  matematik_firtinasi: { color1: '#c084fc', color2: '#38bdf8', name: 'Sayısal Girdap' },
  desen_rozet: { color1: '#34d399', color2: '#818cf8', name: 'Geometrik Desen' },
  kelime_balonlari: { color1: '#38bdf8', color2: '#c084fc', name: 'Balon Basıncı' },
  zihin_gecis: { color1: '#fbbf24', color2: '#a855f7', name: 'Zihin Makası' },
  kartal_goz: { color1: '#10b981', color2: '#fbbf24', name: 'Avcı Görüşü' },
  tanidik_yuzler: { color1: '#c084fc', color2: '#fbbf24', name: 'Yüz Aurası' },
  blok_ustasi: { color1: '#f43f5e', color2: '#818cf8', name: 'Tetris Uzamı' }
};

export default function AmbientEdgeOverlay({ selectedGameId, isActive }) {
  const [impactEffect, setImpactEffect] = useState(null); // 'error' | 'success' | 'spell'

  useEffect(() => {
    const handleFx = (e) => {
      const type = e.detail?.type;
      if (type === 'error') {
        setImpactEffect('error');
        setTimeout(() => setImpactEffect(null), 650);
      } else if (type === 'success') {
        setImpactEffect('success');
        setTimeout(() => setImpactEffect(null), 450);
      } else if (type === 'levelUp' || type === 'spellCast') {
        setImpactEffect('spell');
        setTimeout(() => setImpactEffect(null), 700);
      }
    };

    window.addEventListener('neuro-fx', handleFx);
    return () => window.removeEventListener('neuro-fx', handleFx);
  }, []);

  const currentTheme = (selectedGameId && GAME_THEMES[selectedGameId]) || {
    color1: '#38bdf8',
    color2: '#818cf8',
    name: 'Nöral Zihin'
  };

  // Determine dynamic edge glow based on ambient theme + stress impact
  let dynamicBoxShadow = 'none';
  let dynamicBorder = 'none';
  let backdropVignette = 'transparent';

  if (impactEffect === 'error') {
    // High-adrenaline crimson danger pulse shockwave
    dynamicBoxShadow = 'inset 0 0 120px rgba(239, 68, 68, 0.95), inset 0 0 45px #ef4444';
    dynamicBorder = '4px solid #ef4444';
    backdropVignette = 'radial-gradient(ellipse at center, transparent 40%, rgba(239, 68, 68, 0.28) 100%)';
  } else if (impactEffect === 'success') {
    // Rewarding emerald/cyan pulse wave
    dynamicBoxShadow = 'inset 0 0 90px rgba(16, 185, 129, 0.7), inset 0 0 30px #10b981';
    dynamicBorder = '3px solid #10b981';
    backdropVignette = 'radial-gradient(ellipse at center, transparent 50%, rgba(16, 185, 129, 0.15) 100%)';
  } else if (impactEffect === 'spell') {
    // Cosmic gold/cyan expansion wave
    dynamicBoxShadow = 'inset 0 0 110px rgba(0, 242, 254, 0.8), inset 0 0 50px rgba(251, 191, 36, 0.8)';
    dynamicBorder = '3px solid #00f2fe';
    backdropVignette = 'radial-gradient(ellipse at center, transparent 45%, rgba(0, 242, 254, 0.2) 100%)';
  } else if (isActive) {
    // Ambient breathing edge waves specific to current game theme
    dynamicBoxShadow = `inset 0 0 65px ${currentTheme.color1}35, inset 0 0 20px ${currentTheme.color2}25`;
    dynamicBorder = `1.5px solid ${currentTheme.color1}40`;
    backdropVignette = `radial-gradient(ellipse at center, transparent 55%, ${currentTheme.color1}12 100%)`;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: impactEffect ? 'all 0.08s ease-in' : 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: dynamicBoxShadow,
        border: dynamicBorder,
        background: backdropVignette,
        animation: impactEffect === 'error' ? 'shake 0.35s ease-in-out' : 'none'
      }}
    >
      {/* Rhythmic Ambient Edge Wave Lines */}
      {isActive && !impactEffect && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, ${currentTheme.color1}08, transparent 20%, transparent 80%, ${currentTheme.color2}08)`,
            opacity: 0.8
          }}
        />
      )}
    </div>
  );
}
