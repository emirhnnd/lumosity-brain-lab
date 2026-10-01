import React, { useState, useCallback } from 'react';
import { Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GRID = 4;
const SHOW_MS = 2000;

const AVAILABLE_SHAPES = ['⭐','🔷','🔴','🟢','🟡','💎'];

function genPattern(count) {
  const all = Array.from({ length: GRID * GRID }, (_, i) => i);
  const idxs = [...all].sort(() => Math.random() - 0.5).slice(0, count);
  const cells = {};
  idxs.forEach(i => { cells[i] = AVAILABLE_SHAPES[Math.floor(Math.random() * AVAILABLE_SHAPES.length)]; });
  return cells;
}

export default function DesenRozet({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [pattern, setPattern] = useState({});
  const [selected, setSelected] = useState({});
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState(null);
  const [activeShape, setActiveShape] = useState(AVAILABLE_SHAPES[0]);

  const count = 2 + Math.floor(level * 0.8);

  const startRound = useCallback((lvl) => {
    const cnt = 2 + Math.floor(lvl * 0.8);
    setPattern(genPattern(cnt)); setSelected({}); setFlash(null); setActiveShape(AVAILABLE_SHAPES[0]);
    setPhase('show');
    setTimeout(() => setPhase('input'), SHOW_MS + lvl * 100);
  }, []);

  const startGame = () => { setLevel(1); setScore(0); setLives(3); startRound(1); };

  const handleCell = (idx) => {
    if (phase !== 'input') return;
    const ns = { ...selected };
    if (ns[idx]) { delete ns[idx]; } else { ns[idx] = activeShape; }
    setSelected(ns);
  };

  const handleSubmit = () => {
    const patKeys = Object.keys(pattern).map(Number);
    const selKeys = Object.keys(selected).map(Number);
    const correct = patKeys.length === selKeys.length &&
      patKeys.every(k => selected[k] === pattern[k]);
    setFlash(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (correct) {
        setScore(s => s + level * 150);
        soundService.success?.();
        const nl = level + 1; setLevel(nl);
        setTimeout(() => startRound(nl), 600);
      } else {
        soundService.error?.();
        const nl = lives - 1; setLives(nl);
        if (nl <= 0) { setPhase('gameover'); if (onGameComplete) onGameComplete('desen_rozet', 'hafiza', score, level); }
        else setTimeout(() => startRound(level), 600);
      }
    }, 900);
  };

  const playing = phase === 'show' || phase === 'input' || !!flash;

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>🎨 Hafıza & Desen</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Desen Rozet</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Deseni ezberle, doğru sembolleri yerleştir!</p>
      </div>

      {playing && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
          <span style={{ color: 'var(--accent-light)' }}>🎯 Seviye {level}</span>
          <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
          <span>{Array.from({ length: 3 }, (_, i) => i < lives ? '❤️' : '🖤').join('')}</span>
        </div>
      )}

      {playing && (
        <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
          <span style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700', background: phase === 'show' ? 'rgba(56,189,248,0.2)' : 'rgba(99,102,241,0.2)', color: phase === 'show' ? '#38bdf8' : '#a5b4fc', border: `1px solid ${phase === 'show' ? '#38bdf8' : '#6366f1'}` }}>
            {phase === 'show' ? '👁️ Deseni Ezberle!' : flash === 'correct' ? '✅ Mükemmel!' : flash === 'wrong' ? '❌ Yanlış!' : '🖱️ Deseni Yeniden Oluştur'}
          </span>
        </div>
      )}

      {playing && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID},1fr)`, gap: '6px', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', border: `2px solid ${flash === 'correct' ? '#10b981' : flash === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.08)'}`, transition: 'border-color 0.2s' }}>
          {Array.from({ length: GRID * GRID }, (_, i) => {
            const showShape = phase === 'show' ? pattern[i] : selected[i];
            const isInPattern = phase === 'show' && pattern[i];
            return (
              <div key={i} onClick={() => handleCell(i)} style={{ aspectRatio: '1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', background: isInPattern ? 'rgba(99,102,241,0.35)' : selected[i] ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${isInPattern ? '#6366f1' : selected[i] ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`, cursor: phase === 'input' ? 'pointer' : 'default', transition: 'all 0.15s', boxShadow: isInPattern ? '0 0 10px rgba(99,102,241,0.4)' : 'none' }}>
                {showShape || ''}
              </div>
            );
          })}
        </div>
      )}

      {phase === 'input' && (
        <>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>Sembol seç:</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
            {AVAILABLE_SHAPES.map(sh => (
              <button key={sh} onClick={() => setActiveShape(sh)} style={{ width: '44px', height: '44px', fontSize: '1.4rem', borderRadius: '8px', border: `2px solid ${activeShape === sh ? '#6366f1' : 'rgba(255,255,255,0.12)'}`, background: activeShape === sh ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.15s' }}>{sh}</button>
            ))}
          </div>
          <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}>✅ Gönder</button>
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && <div style={{ marginBottom: '1.5rem' }}><Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} /><h3>Oyun Bitti!</h3><p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score} · Seviye: {level}</p></div>}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Ekrandaki sembol desenini ezberle,<br />ardından aynısını oluştur!</p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
