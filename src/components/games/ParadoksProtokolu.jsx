import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Play, Award, Zap, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GAME_DURATION = 50;

const PROTOCOL_COMMANDS = [
  {
    text: 'MAVİYE BAS',
    type: 'COLOR',
    normalTarget: 'MAVİ',
    paradoxTarget: 'KIRMIZI',
    opts: [
      { label: 'MAVİ', color: '#38bdf8' },
      { label: 'KIRMIZI', color: '#f43f5e' }
    ]
  },
  {
    text: 'KIRMIZIYA BAS',
    type: 'COLOR',
    normalTarget: 'KIRMIZI',
    paradoxTarget: 'MAVİ',
    opts: [
      { label: 'MAVİ', color: '#38bdf8' },
      { label: 'KIRMIZI', color: '#f43f5e' }
    ]
  },
  {
    text: 'SAĞA TIKLA ➔',
    type: 'DIRECTION',
    normalTarget: 'SAĞ',
    paradoxTarget: 'SOL',
    opts: [
      { label: '⬅ SOL', id: 'SOL', color: '#a855f7' },
      { label: 'SAĞ ➔', id: 'SAĞ', color: '#a855f7' }
    ]
  },
  {
    text: '⬅ SOLA TIKLA',
    type: 'DIRECTION',
    normalTarget: 'SOL',
    paradoxTarget: 'SAĞ',
    opts: [
      { label: '⬅ SOL', id: 'SOL', color: '#a855f7' },
      { label: 'SAĞ ➔', id: 'SAĞ', color: '#a855f7' }
    ]
  },
  {
    text: 'BÜYÜK SAYIYI SEÇ',
    type: 'NUMERIC',
    generateOpts: () => {
      const a = Math.floor(Math.random() * 80) + 10;
      let b = Math.floor(Math.random() * 80) + 10;
      while (b === a) b = Math.floor(Math.random() * 80) + 10;
      const maxVal = Math.max(a, b);
      const minVal = Math.min(a, b);
      return {
        normalTarget: maxVal.toString(),
        paradoxTarget: minVal.toString(),
        opts: [{ label: a.toString() }, { label: b.toString() }]
      };
    }
  },
  {
    text: 'KÜÇÜK SAYIYI SEÇ',
    type: 'NUMERIC',
    generateOpts: () => {
      const a = Math.floor(Math.random() * 80) + 10;
      let b = Math.floor(Math.random() * 80) + 10;
      while (b === a) b = Math.floor(Math.random() * 80) + 10;
      const maxVal = Math.max(a, b);
      const minVal = Math.min(a, b);
      return {
        normalTarget: minVal.toString(),
        paradoxTarget: maxVal.toString(),
        opts: [{ label: a.toString() }, { label: b.toString() }]
      };
    }
  },
  {
    text: 'ÇİFT SAYIYI SEÇ',
    type: 'PARITY',
    generateOpts: () => {
      const even = (Math.floor(Math.random() * 40) + 5) * 2;
      const odd = (Math.floor(Math.random() * 40) + 5) * 2 + 1;
      const isFirstEven = Math.random() > 0.5;
      return {
        normalTarget: even.toString(),
        paradoxTarget: odd.toString(),
        opts: isFirstEven ? [{ label: even.toString() }, { label: odd.toString() }] : [{ label: odd.toString() }, { label: even.toString() }]
      };
    }
  }
];

export default function ParadoksProtokolu({ onGameComplete }) {
  const [phase, setPhase] = useState('idle'); // idle | playing | gameover
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const [currentCommand, setCurrentCommand] = useState(null);
  const [isParadoxActive, setIsParadoxActive] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);

  const timerRef = useRef(null);

  const nextCommand = () => {
    // 40% chance of Paradox Mode triggering
    const willBeParadox = Math.random() < 0.45;
    setIsParadoxActive(willBeParadox);

    const template = PROTOCOL_COMMANDS[Math.floor(Math.random() * PROTOCOL_COMMANDS.length)];
    let roundData = {};

    if (template.generateOpts) {
      const gen = template.generateOpts();
      roundData = {
        text: template.text,
        normalTarget: gen.normalTarget,
        paradoxTarget: gen.paradoxTarget,
        opts: [...gen.opts].sort(() => Math.random() - 0.5)
      };
    } else {
      roundData = {
        text: template.text,
        normalTarget: template.normalTarget,
        paradoxTarget: template.paradoxTarget,
        opts: [...template.opts].sort(() => Math.random() - 0.5)
      };
    }

    setCurrentCommand(roundData);
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setMultiplier(1);
    setTimeLeft(GAME_DURATION);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setFeedback(null);
    setPhase('playing');
    soundService.levelUp?.();
    nextCommand();
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
      onGameComplete('paradoks_protokolu', 'esneklik', score, streak);
    }
  }, [phase]); // eslint-disable-line

  const handleChoice = (opt) => {
    if (phase !== 'playing' || !currentCommand) return;

    setTotalAttempts(t => t + 1);
    const expected = isParadoxActive ? currentCommand.paradoxTarget : currentCommand.normalTarget;
    const isCorrect = (opt.id || opt.label) === expected;

    if (isCorrect) {
      soundService.success?.();
      setCorrectAttempts(c => c + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const newMult = Math.min(4, 1 + Math.floor(newStreak / 4));
      setMultiplier(newMult);

      const basePts = isParadoxActive ? 180 : 100;
      setScore(s => s + basePts * newMult);
      setFeedback('correct');
    } else {
      soundService.error?.();
      setStreak(0);
      setMultiplier(1);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      nextCommand();
    }, 280);
  };

  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#fbbf24' : '#ef4444';
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <div className={`glass-card game-container anim-pop ${isParadoxActive ? 'paradox-glow' : ''} ${feedback === 'wrong' ? 'anim-shake' : ''}`} style={{ maxWidth: '520px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '0.3rem' }}>
            <AlertTriangle size={13} /> Bilişsel Ket Vurma & Hızlı Ters Refleks
          </div>
          <h2 style={{ fontSize: '1.6rem', color: isParadoxActive ? '#f43f5e' : 'var(--accent-light)', margin: 0, transition: 'color 0.3s' }}>
            PARADOKS PROTOKOLÜ
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-gold)' }}>
            🏆 {score}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: '800' }}>
            {multiplier > 1 && `🔥 ${multiplier}x Çarpan`}
          </div>
        </div>
      </div>

      {phase === 'playing' && currentCommand && (
        <>
          {/* Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span style={{ color: '#fbbf24' }}>Seri: {streak} 🔥</span>
            <span style={{ color: '#10b981' }}>🎯 %{accuracy}</span>
          </div>

          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear', borderRadius: '3px' }} />
          </div>

          {/* Mode Indicator Banner */}
          <div style={{
            textAlign: 'center',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.2rem',
            background: isParadoxActive ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(168, 85, 247, 0.35))' : 'rgba(16, 185, 129, 0.15)',
            border: `2px solid ${isParadoxActive ? '#ef4444' : '#10b981'}`,
            boxShadow: isParadoxActive ? '0 0 25px rgba(239, 68, 68, 0.5)' : 'none',
            animation: isParadoxActive ? 'pulse 0.8s infinite' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900', color: isParadoxActive ? '#fca5a5' : '#6ee7b7' }}>
              {isParadoxActive ? '🚨 PARADOKS AKTİF: TAM TERSİNİ YAP!' : '✅ NORMAL MOD: EMRE UY!'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
              {isParadoxActive ? 'İçindeki ilk refleksi bastır ve karşıt seçeneği seç' : 'Gördüğün komutu doğrudan uygula'}
            </div>
          </div>

          {/* Prompt Display */}
          <div style={{
            padding: '2rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            marginBottom: '1.2rem',
            border: `2px solid ${feedback === 'correct' ? 'var(--success)' : feedback === 'wrong' ? 'var(--danger)' : 'rgba(255,255,255,0.1)'}`,
            transition: 'all 0.15s ease'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Nöral Talimat
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', letterSpacing: '1px' }}>
              {currentCommand.text}
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {currentCommand.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt)}
                style={{
                  padding: '1.2rem 1rem',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${opt.color ? opt.color : 'rgba(255,255,255,0.15)'}`,
                  background: opt.color ? `${opt.color}20` : 'rgba(255,255,255,0.06)',
                  color: opt.color ? opt.color : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                  boxShadow: opt.color ? `0 0 15px ${opt.color}25` : 'none'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Idle / Gameover View */}
      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          {phase === 'gameover' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={52} color="var(--accent-gold)" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Zaman Doldu!</h3>
              <p style={{ color: 'var(--success)', fontWeight: '800', fontSize: '1.3rem', marginBottom: '0.3rem' }}>
                Toplam Skor: {score}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Doğruluk: <strong style={{ color: '#10b981' }}>%{accuracy}</strong></span>
                <span>En Yüksek Seri: <strong style={{ color: '#fbbf24' }}>{streak} 🔥</strong></span>
              </div>
            </div>
          )}

          {phase === 'idle' && (
            <div style={{ marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Nöral emirleri hızla uygula!<br />
              Ancak <strong>🚨 PARADOKS ALARMI</strong> çaldığında ilk refleksini bastır ve **tam tersini yap!**
            </div>
          )}

          <button
            className="btn-primary"
            onClick={startGame}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '0.95rem',
              fontSize: '1.05rem',
              background: 'linear-gradient(135deg, #f43f5e, #7928ca)',
              boxShadow: '0 4px 20px rgba(244, 63, 94, 0.4)'
            }}
          >
            <Play size={19} /> {phase === 'gameover' ? 'Tekrar Meydan Oku' : 'Protokolü Başlat'}
          </button>
        </div>
      )}

    </div>
  );
}
