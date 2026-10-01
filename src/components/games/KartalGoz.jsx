import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GAME_DURATION = 45;
const GRID_SIZE = 7;
const EMOJIS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🦆','🦅','🦉','🦇','🐺'];

function generateGrid(target) {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, () =>
    EMOJIS.filter(e => e !== target)[Math.floor(Math.random() * (EMOJIS.length - 1))]
  );
  const targetCount = 3 + Math.floor(Math.random() * 4);
  const targetIdxs = new Set();
  while (targetIdxs.size < targetCount) targetIdxs.add(Math.floor(Math.random() * cells.length));
  targetIdxs.forEach(i => { cells[i] = target; });
  return { cells, targetIdxs: [...targetIdxs] };
}

export default function KartalGoz({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [target, setTarget] = useState('');
  const [grid, setGrid] = useState({ cells: [], targetIdxs: [] });
  const [found, setFound] = useState(new Set());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [round, setRound] = useState(1);
  const [wrongClicks, setWrongClicks] = useState(0);
  const timerRef = useRef(null);

  const nextRound = useCallback((r) => {
    const t = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setTarget(t); setGrid(generateGrid(t)); setFound(new Set()); setRound(r);
  }, []);

  const startGame = () => {
    setScore(0); setTimeLeft(GAME_DURATION); setWrongClicks(0); setPhase('playing'); nextRound(1);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); setPhase('gameover'); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'gameover' && onGameComplete)
      onGameComplete('kartal_goz', 'dikkat', score, round);
  }, [phase]); // eslint-disable-line

  const handleClick = (idx) => {
    if (phase !== 'playing' || found.has(idx)) return;
    if (grid.targetIdxs.includes(idx)) {
      const nf = new Set(found); nf.add(idx); setFound(nf);
      setScore(s => s + 100); soundService.click?.();
      if (nf.size === grid.targetIdxs.length) {
        setScore(s => s + 200); soundService.success?.();
        setTimeout(() => nextRound(round + 1), 400);
      }
    } else {
      setWrongClicks(w => w + 1); soundService.error?.();
    }
  };

  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>🦅 Görsel Dikkat</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Kartal Göz</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Hedef hayvanı ızgarada bul ve tıkla!</p>
      </div>

      {phase === 'playing' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span style={{ color: '#ef4444' }}>❌ {wrongClicks}</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear', borderRadius: '3px' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(251,191,36,0.4)' }}>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: '700', marginBottom: '0.3rem' }}>HEDEF — Bul ve Tıkla!</div>
            <div style={{ fontSize: '3rem' }}>{target}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{found.size}/{grid.targetIdxs.length} bulundu</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE},1fr)`, gap: '3px', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)' }}>
            {grid.cells.map((cell, i) => (
              <div key={i} onClick={() => handleClick(i)} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.1s', background: found.has(i) ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.03)', border: found.has(i) ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.05)', opacity: found.has(i) ? 0.5 : 1, transform: found.has(i) ? 'scale(0.9)' : 'scale(1)' }}
                onMouseEnter={e => { if (!found.has(i)) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { if (!found.has(i)) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                {cell}
              </div>
            ))}
          </div>
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && <div style={{ marginBottom: '1.5rem' }}><Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} /><h3>Süre Doldu!</h3><p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score} · {round} tur</p></div>}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>7x7 ızgarada hedef hayvanı<br /><strong>hızlıca bul ve tıkla!</strong></p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
