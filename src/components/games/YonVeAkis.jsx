import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const ARROWS = ['⬆️','⬇️','⬅️','➡️'];
const GAME_DURATION = 60;

function randomDir() { return ARROWS[Math.floor(Math.random() * ARROWS.length)]; }

function generateRound() {
  const size = 5;
  const center = Math.floor(size / 2);
  const centerDir = randomDir();
  const grid = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if (r === center && c === center) return centerDir;
      return Math.random() > 0.3 ? centerDir : randomDir();
    })
  );
  const majority = centerDir;
  return { grid, centerDir, correct: centerDir === majority };
}

export default function YonVeAkis({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [round, setRound] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState(null);
  const [total, setTotal] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef(null);

  const nextRound = useCallback(() => setRound(generateRound()), []);

  const startGame = () => {
    setScore(0); setStreak(0); setTimeLeft(GAME_DURATION);
    setFeedback(null); setTotal(0); setCorrectCount(0);
    nextRound(); setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('gameover'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'gameover' && onGameComplete)
      onGameComplete('yon_ve_akis', 'dikkat', score, Math.round((correctCount / Math.max(total, 1)) * 100));
  }, [phase]); // eslint-disable-line

  const handleAnswer = (dir) => {
    if (phase !== 'playing' || feedback || !round) return;
    const isCorrect = dir === round.centerDir;
    setTotal(t => t + 1);
    if (isCorrect) {
      const bonus = streak >= 3 ? 2 : 1;
      setScore(s => s + 100 * bonus);
      setStreak(s => s + 1);
      setCorrectCount(c => c + 1);
      setFeedback('correct');
      soundService.success?.();
    } else {
      setStreak(0); setFeedback('wrong'); soundService.error?.();
    }
    setTimeout(() => { setFeedback(null); nextRound(); }, 300);
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKey = (e) => {
      if (phase !== 'playing' || feedback || !round) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        handleAnswer('⬆️');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        handleAnswer('⬇️');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleAnswer('⬅️');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleAnswer('➡️');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, feedback, round]);

  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>🧭 Dikkat & Yön</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Yön ve Akış</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Ortadaki okun yönünü seç!</p>
      </div>

      {phase === 'playing' && round && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span style={{ color: '#10b981' }}>🎯 {accuracy}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1.2rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear', borderRadius: '3px' }} />
          </div>
          {streak >= 3 && <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.82rem', color: '#fbbf24', fontWeight: '700' }}>🔥 {streak} Seri!</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '4px', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '1.2rem', border: `2px solid ${feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.08)'}`, transition: 'border-color 0.2s' }}>
            {round.grid.map((row, r) => row.map((cell, c) => {
              const isCenter = r === 2 && c === 2;
              return (
                <div key={`${r}-${c}`} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isCenter ? '1.8rem' : '1.1rem', background: isCenter ? 'rgba(99,102,241,0.3)' : 'transparent', borderRadius: '6px', border: isCenter ? '2px solid #6366f1' : 'none', transition: 'all 0.15s' }}>
                  {cell}
                </div>
              );
            }))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem' }}>
            {ARROWS.map(arrow => (
              <button key={arrow} onClick={() => handleAnswer(arrow)} style={{ padding: '0.9rem', fontSize: '1.8rem', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                {arrow}
              </button>
            ))}
          </div>
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} />
              <h3>Süre Doldu!</h3>
              <p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Doğruluk: {accuracy}% · {total} soru</p>
            </div>
          )}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>5x5 ok ızgarasında,<br /><strong>ortadaki okun yönünü</strong> seç!</p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
