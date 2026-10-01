import React, { useState, useEffect, useRef } from 'react';
import { Play, Award, Zap } from 'lucide-react';
import { soundService } from '../../services/soundService';

const SHAPES = ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣'];
const SHAPE_NAMES = { '🔴': 'Kırmızı', '🔵': 'Mavi', '🟢': 'Yeşil', '🟡': 'Sarı', '🟠': 'Turuncu', '🟣': 'Mor' };
const RULES = ['RENK', 'YAZI'];
const GAME_DURATION = 60;

function genCard() {
  return { 
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)], 
    label: SHAPE_NAMES[SHAPES[Math.floor(Math.random() * SHAPES.length)]] 
  };
}

function genOptions(card, rule) {
  const correct = rule === 'RENK' ? card.shape : card.label;
  const pool = rule === 'RENK' 
    ? SHAPES.filter(s => s !== card.shape) 
    : Object.values(SHAPE_NAMES).filter(n => n !== card.label);
  const opts = [correct, ...pool.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
  return { opts, correct };
}

export default function ZihinGecis({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [card, setCard] = useState(null);
  const [rule, setRule] = useState('RENK');
  const [options, setOptions] = useState({ opts: [], correct: '' });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState(null);
  const [total, setTotal] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [ruleFlash, setRuleFlash] = useState(false);
  const timerRef = useRef(null);

  const nextRound = (currentRule) => {
    const newRule = Math.random() > 0.65 ? (currentRule === 'RENK' ? 'YAZI' : 'RENK') : currentRule;
    if (newRule !== currentRule) { setRuleFlash(true); setTimeout(() => setRuleFlash(false), 600); }
    const c = genCard();
    setCard(c); setRule(newRule); setOptions(genOptions(c, newRule));
  };

  const startGame = () => {
    const r = 'RENK'; const c = genCard();
    setCard(c); setRule(r); setOptions(genOptions(c, r));
    setScore(0); setStreak(0); setTimeLeft(GAME_DURATION);
    setFeedback(null); setTotal(0); setCorrectCount(0); setRuleFlash(false);
    setPhase('playing');
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
      onGameComplete('zihin_gecis', 'esneklik', score, Math.round((correctCount / Math.max(total, 1)) * 100));
  }, [phase]); // eslint-disable-line

  const handleAnswer = (opt) => {
    if (phase !== 'playing' || feedback) return;
    const isCorrect = opt === options.correct;
    setTotal(t => t + 1);
    if (isCorrect) {
      const bonus = streak >= 3 ? 2 : 1;
      setScore(s => s + 100 * bonus); setStreak(s => s + 1); setCorrectCount(c => c + 1);
      setFeedback('correct'); soundService.success?.();
    } else {
      setStreak(0); setFeedback('wrong'); soundService.error?.();
    }
    setTimeout(() => { setFeedback(null); nextRound(rule); }, 400);
  };

  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}><Zap size={13} /> Bilişsel Esneklik</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Zihin Geçişi (Brain Shift)</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Kurala göre RENK (Emoji) veya YAZI seç!</p>
      </div>

      {phase === 'playing' && card && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span style={{ color: '#10b981' }}>🎯 {accuracy}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear', borderRadius: '3px' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'inline-block', padding: '0.5rem 2rem', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '0.15em', background: ruleFlash ? 'rgba(249,115,22,0.3)' : rule === 'RENK' ? 'rgba(56,189,248,0.2)' : 'rgba(168,85,247,0.2)', color: ruleFlash ? '#f97316' : rule === 'RENK' ? '#38bdf8' : '#c084fc', border: `2px solid ${ruleFlash ? '#f97316' : rule === 'RENK' ? '#38bdf8' : '#c084fc'}`, transition: 'all 0.3s' }}>
              {ruleFlash ? '⚡ KURAL DEĞİŞTİ!' : `Kural: ${rule}`}
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '1.2rem', border: `2px solid ${feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.08)'}`, transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{card.shape}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-muted)' }}>{card.label}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem' }}>
            {options.opts.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)} style={{ padding: '0.85rem', fontSize: '1.3rem', fontWeight: '700', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && <div style={{ marginBottom: '1.5rem' }}><Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} /><h3>Süre Doldu!</h3><p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score}</p><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Doğruluk: {accuracy}% · {total} soru</p></div>}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Kural "RENK" ise emoji rengini,<br />"YAZI" ise yazan renk ismini seç!<br /><strong>Kural sürekli değişir, uyanık ol!</strong></p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
