import React, { useState, useEffect, useRef } from 'react';
import { Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const COLORS = [
  { name: 'KIRMIZI', color: '#ef4444' },
  { name: 'MAVİ',    color: '#3b82f6' },
  { name: 'YEŞİL',   color: '#10b981' },
  { name: 'SARI',    color: '#fbbf24' },
  { name: 'MOR',     color: '#a855f7' },
  { name: 'TURUNCU', color: '#f97316' },
];
const GAME_DURATION = 60;

function generateCard() {
  const wordIdx = Math.floor(Math.random() * COLORS.length);
  let inkIdx = Math.floor(Math.random() * COLORS.length);
  if (Math.random() > 0.4) inkIdx = wordIdx; // 60% same
  return { word: COLORS[wordIdx].name, ink: COLORS[inkIdx].color, inkName: COLORS[inkIdx].name };
}

export default function RenkMatrisi({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [card, setCard] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState(null);
  const [total, setTotal] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef(null);

  const nextCard = () => setCard(generateCard());

  const startGame = () => {
    setScore(0); setStreak(0); setTimeLeft(GAME_DURATION);
    setFeedback(null); setTotal(0); setCorrectCount(0);
    setCard(generateCard()); setPhase('playing');
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
      onGameComplete('renk_matrisi', 'esneklik', score, Math.round((correctCount / Math.max(total, 1)) * 100));
  }, [phase]); // eslint-disable-line

  const handleAnswer = (colorName) => {
    if (phase !== 'playing' || feedback) return;
    const isCorrect = colorName === card.inkName;
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
    setTimeout(() => { setFeedback(null); nextCard(); }, 350);
  };

  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>🎨 Renk & Esneklik</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Renk Matrisi</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Yazının rengini seç — yazan kelimeyi değil!</p>
      </div>

      {phase === 'playing' && card && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span style={{ color: '#10b981' }}>🎯 {accuracy}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear', borderRadius: '3px' }} />
          </div>

          {streak >= 3 && <div style={{ textAlign: 'center', marginBottom: '0.6rem', fontSize: '0.82rem', color: '#fbbf24', fontWeight: '700' }}>🔥 {streak} Seri! 2x Puan!</div>}

          <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', border: `2px solid ${feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.08)'}`, transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: card.ink, textShadow: `0 0 30px ${card.ink}`, letterSpacing: '0.1em', transition: 'all 0.1s' }}>
              {card.word}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Bu yazının MÜREKKEBİ hangi renk?</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
            {COLORS.map(c => (
              <button key={c.name} onClick={() => handleAnswer(c.name)} style={{ padding: '0.7rem', fontWeight: '800', fontSize: '0.8rem', borderRadius: 'var(--radius-md)', border: `2px solid ${c.color}40`, background: `${c.color}15`, color: c.color, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.color}35`; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${c.color}15`; e.currentTarget.style.transform = 'scale(1)'; }}>
                {c.name}
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
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Yazan kelimeye değil,<br /><strong>mürekkel rengine</strong> bakarak cevap ver!</p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
