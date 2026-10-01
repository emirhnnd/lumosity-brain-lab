import React, { useState, useEffect, useRef } from 'react';
import { Zap, Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const SYMBOLS = ['🔴','🔵','🟢','🟡','🟠','🟣','⭐','🔷'];
const GAME_DURATION = 60;

function randSymbol(exclude) {
  const opts = SYMBOLS.filter(s => s !== exclude);
  return opts[Math.floor(Math.random() * opts.length)];
}

export default function SimsekRefleks({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [current, setCurrent] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState(null);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correct, setCorrect] = useState(0);
  const timerRef = useRef(null);

  const nextCard = (prev) => {
    const same = Math.random() > 0.5;
    const next = same ? prev : randSymbol(prev);
    setPrevious(prev); setCurrent(next);
  };

  const startGame = () => {
    const first = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const second = Math.random() > 0.5 ? first : randSymbol(first);
    setScore(0); setStreak(0); setTimeLeft(GAME_DURATION);
    setFeedback(null); setTotalAnswers(0); setCorrect(0);
    setPrevious(first); setCurrent(second); setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('gameover');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'gameover' && onGameComplete) {
      onGameComplete('simsek_refleks', 'dikkat', score, Math.round((correct / Math.max(totalAnswers, 1)) * 100));
    }
  }, [phase]); // eslint-disable-line

  const answer = (isSame) => {
    if (phase !== 'playing' || feedback !== null) return;
    const isCorrect = (current === previous) === isSame;
    setTotalAnswers(t => t + 1);
    if (isCorrect) {
      const bonus = streak >= 4 ? 2 : 1;
      setScore(s => s + 100 * bonus);
      setStreak(s => s + 1);
      setCorrect(c => c + 1);
      setFeedback('correct');
      soundService.success?.();
    } else {
      setStreak(0);
      setFeedback('wrong');
      soundService.error?.();
    }
    setTimeout(() => { setFeedback(null); nextCard(current); }, 300);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKey = (e) => {
      if (phase !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        answer(true);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        answer(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, feedback, current, previous]);

  const accuracy = totalAnswers > 0 ? Math.round((correct / totalAnswers) * 100) : 0;
  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}><Zap size={13} /> Dikkat & Hız</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Şimşek Refleks</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Önceki sembolle aynı mı? Hızlıca karar ver!</p>
      </div>

      {phase === 'playing' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span style={{ color: '#10b981' }}>🎯 {accuracy}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear, background 0.3s', borderRadius: '3px' }} />
          </div>
          {streak >= 3 && <div style={{ textAlign: 'center', marginBottom: '0.7rem', fontSize: '0.82rem', color: '#fbbf24', fontWeight: '700' }}>🔥 {streak} Seri! 2x Puan!</div>}

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>ÖNCEKİ</div>
              <div style={{ fontSize: '4rem', opacity: 0.55 }}>{previous}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '1.5rem' }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>ŞİMDİ</div>
              <div style={{ fontSize: '4rem', transition: 'transform 0.1s', transform: feedback ? 'scale(1.2)' : 'scale(1)' }}>{current}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button onClick={() => answer(true)} style={{ padding: '1.1rem', fontSize: '1rem', fontWeight: '800', borderRadius: 'var(--radius-lg)', border: `2px solid ${feedback === 'correct' ? '#10b981' : 'rgba(16,185,129,0.4)'}`, background: feedback === 'correct' ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.1)', color: '#10b981', cursor: 'pointer', transition: 'all 0.15s' }}>✅ AYNI</button>
            <button onClick={() => answer(false)} style={{ padding: '1.1rem', fontSize: '1rem', fontWeight: '800', borderRadius: 'var(--radius-lg)', border: `2px solid ${feedback === 'wrong' ? '#ef4444' : 'rgba(239,68,68,0.4)'}`, background: feedback === 'wrong' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', transition: 'all 0.15s' }}>❌ FARKLI</button>
          </div>
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>Süre Doldu!</h3>
              <p style={{ color: 'var(--success)', fontWeight: '700', fontSize: '1rem' }}>Skor: {score}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Doğruluk: {accuracy}% · {totalAnswers} soru</p>
            </div>
          )}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Yeni sembol bir öncekiyle aynı mı?<br />Hızlıca "AYNI" veya "FARKLI" seç!</p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
