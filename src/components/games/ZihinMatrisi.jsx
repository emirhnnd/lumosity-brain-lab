import React, { useState, useCallback } from 'react';
import { Brain, Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GRID = 4;
const BASE_COUNT = 3;
const SHOW_MS = 1800;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function genPattern(count) {
  return shuffle(Array.from({ length: GRID * GRID }, (_, i) => i)).slice(0, count);
}

export default function ZihinMatrisi({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [pattern, setPattern] = useState([]);
  const [selected, setSelected] = useState([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState(null);

  const count = BASE_COUNT + Math.floor(level / 2);

  const startRound = useCallback((lvl) => {
    const p = genPattern(BASE_COUNT + Math.floor(lvl / 2));
    setPattern(p); setSelected([]); setFlash(null); setPhase('show');
    setTimeout(() => setPhase('input'), SHOW_MS);
  }, []);

  const startGame = () => { setLevel(1); setScore(0); setLives(3); startRound(1); };

  const handleCell = (idx) => {
    if (phase !== 'input' || selected.includes(idx)) return;
    const ns = [...selected, idx];
    setSelected(ns);
    soundService.click?.();
    if (ns.length === count) {
      const correct = pattern.every(p => ns.includes(p));
      setFlash(correct ? 'correct' : 'wrong');
      setTimeout(() => {
        if (correct) {
          setScore(s => s + level * 100 + count * 50);
          soundService.success?.();
          const nl = level + 1; setLevel(nl);
          setTimeout(() => startRound(nl), 600);
        } else {
          soundService.error?.();
          const nl = lives - 1; setLives(nl);
          if (nl <= 0) { setPhase('gameover'); if (onGameComplete) onGameComplete('zihin_matrisi', 'hafiza', score, level); }
          else setTimeout(() => startRound(level), 600);
        }
      }, 900);
    }
  };

  const getCellStyle = (idx) => {
    const inPat = new Set(pattern).has(idx), isSel = new Set(selected).has(idx);
    if (phase === 'show' && inPat) return { background: 'linear-gradient(135deg,#38bdf8,#6366f1)', boxShadow: '0 0 18px #38bdf8', border: '2px solid #38bdf8' };
    if (flash && isSel) return flash === 'correct'
      ? { background: 'linear-gradient(135deg,#10b981,#34d399)', boxShadow: '0 0 14px #10b981', border: '2px solid #10b981' }
      : { background: 'linear-gradient(135deg,#ef4444,#f87171)', boxShadow: '0 0 14px #ef4444', border: '2px solid #ef4444' };
    if (isSel) return { background: 'rgba(99,102,241,0.55)', border: '2px solid #6366f1' };
    return { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', cursor: phase === 'input' ? 'pointer' : 'default' };
  };

  const playing = phase === 'show' || phase === 'input' || !!flash;

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}><Brain size={13} /> Hafıza</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Zihin Matrisi</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Işıklanan kareleri ezberle ve tekrarla!</p>
      </div>
      {playing && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
          <span style={{ color: 'var(--accent-light)' }}>🎯 Seviye {level}</span>
          <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
          <span>{Array.from({ length: 3 }, (_, i) => i < lives ? '❤️' : '🖤').join('')}</span>
        </div>
      )}
      {playing && (
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700', background: phase === 'show' ? 'rgba(56,189,248,0.2)' : 'rgba(99,102,241,0.2)', color: phase === 'show' ? '#38bdf8' : '#a5b4fc', border: `1px solid ${phase === 'show' ? '#38bdf8' : '#6366f1'}` }}>
            {phase === 'show' ? '👁️ Ezberle!' : flash === 'correct' ? '✅ Mükemmel!' : flash === 'wrong' ? '❌ Yanlış!' : `🖱️ ${count} kareyi seç`}
          </span>
        </div>
      )}
      {playing && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID},1fr)`, gap: '8px', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
          {Array.from({ length: GRID * GRID }, (_, i) => (
            <div key={i} onClick={() => handleCell(i)} style={{ aspectRatio: '1', borderRadius: '8px', transition: 'all 0.15s', ...getCellStyle(i) }} />
          ))}
        </div>
      )}
      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && <div style={{ marginBottom: '1.5rem' }}><Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} /><h3>Oyun Bitti!</h3><p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score} · Seviye: {level}</p></div>}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Kısa süreliğine ışıklanan kareleri ezberle,<br />sonra aynı karelere tıkla!</p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
