import React, { useState, useEffect, useRef } from 'react';
import { Zap, Play, Award, RotateCcw, Swords, User, Bot, Sparkles, Sliders, Delete, CornerDownLeft } from 'lucide-react';
import { soundService } from '../../services/soundService';

const STANDARD_RULES = [
  {
    id: 'digit_sum',
    text: 'Basamakları Toplamı En Fazla Olan',
    badge: 'Rakam Toplamı',
    formatVal: (n) => `Toplam: ${n.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0)}`,
    eval: (n) => n.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  },
  {
    id: 'max_val',
    text: 'En Büyük Sayı Değeri',
    badge: 'Maksimum',
    formatVal: (n) => `Değer: ${n}`,
    eval: (n) => n
  },
  {
    id: 'min_val',
    text: 'En Küçük Sayı Değeri',
    badge: 'Minimum',
    formatVal: (n) => `Değer: ${n}`,
    eval: (n) => -n
  },
  {
    id: 'even_priority',
    text: 'Çift Sayı (Varsa En Büyük Çift, Yoksa En Büyük)',
    badge: 'Çift Sayı Odak',
    formatVal: (n) => n % 2 === 0 ? `Çift: ${n}` : `Tek: ${n}`,
    eval: (n) => (n % 2 === 0 ? 100000 + n : n)
  },
  {
    id: 'ends_with_highest',
    text: 'Son Basamağı (Birler) En Büyük Olan',
    badge: 'Son Hane',
    formatVal: (n) => `Son Hane: ${n % 10}`,
    eval: (n) => n % 10
  }
];

const ADVANCED_RULES = [
  {
    id: 'reverse_val',
    text: 'Tersten Okunuşu (Ayna Değeri) En Büyük Olan',
    badge: 'Ayna Sayı',
    formatVal: (n) => `Ayna: ${n.toString().split('').reverse().join('')}`,
    eval: (n) => parseInt(n.toString().split('').reverse().join(''), 10)
  },
  {
    id: 'digit_product',
    text: 'Basamakları Çarpımı En Fazla Olan',
    badge: 'Rakam Çarpımı',
    formatVal: (n) => `Çarpım: ${n.toString().split('').reduce((acc, d) => acc * parseInt(d, 10), 1)}`,
    eval: (n) => n.toString().split('').reduce((acc, d) => acc * parseInt(d, 10), 1)
  },
  {
    id: 'div_3_priority',
    text: "3'e Bölünen (Varsa En Büyük 3 Katı, Yoksa En Küçük)",
    badge: "3'e Bölünme",
    formatVal: (n) => n % 3 === 0 ? `3'ün Katı: ${n}` : `Kalan: ${n % 3}`,
    eval: (n) => (n % 3 === 0 ? 100000 + n : -n)
  }
];

function generateNumbers(digits = 3, count = 4) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(set);
}

function getPercentileRank(avgMs) {
  if (avgMs <= 400) return { title: '🚀 Süpersonik Nöron Hızı', rank: 'Global Üst %1', color: '#00f2fe' };
  if (avgMs <= 600) return { title: '⚡ Hiper Bilişsel Çeviklik', rank: 'Global Üst %5', color: '#10b981' };
  if (avgMs <= 850) return { title: '🎯 Keskin Nöral Refleks', rank: 'Global Üst %15', color: '#fbbf24' };
  if (avgMs <= 1200) return { title: '🧠 Dengeli Zihin İşlemcisi', rank: 'Global Üst %35', color: '#818cf8' };
  return { title: '🐢 Gelişime Açık Odak', rank: 'Antrenman Gerekli', color: '#94a3b8' };
}

const DIFFICULTY_CONFIG = {
  kolay: {
    label: '🟢 Kolay',
    desc: '2-3 Basamak · 3 Sayı · 600ms',
    color: '#10b981',
    digits: (round) => (round > 6 ? 3 : 2),
    count: 3,
    startFlash: 600,
    minFlash: 350,
    speedDelta: 20
  },
  orta: {
    label: '🟡 Orta',
    desc: '3-4 Basamak · 4 Sayı · 450ms',
    color: '#fbbf24',
    digits: (round) => (round > 5 ? 4 : 3),
    count: 4,
    startFlash: 450,
    minFlash: 200,
    speedDelta: 25
  },
  zor: {
    label: '🔴 Zor',
    desc: '4-5 Basamak · 5 Sayı · 320ms',
    color: '#ef4444',
    digits: (round) => (round > 4 ? 5 : 4),
    count: 5,
    startFlash: 320,
    minFlash: 140,
    speedDelta: 30
  }
};

export default function NeuroFlash({ onGameComplete }) {
  // Modes: 'solo' | 'pvp_local' | 'pvp_bot'
  const [gameMode, setGameMode] = useState('solo');
  const [difficulty, setDifficulty] = useState('orta');
  const [useAdvancedRules, setUseAdvancedRules] = useState(true);
  
  const [phase, setPhase] = useState('idle'); // idle | flashing | input | round_summary | gameover
  const [currentRound, setCurrentRound] = useState(1);
  const maxRounds = 10;
  const pvpTargetScore = 5;

  // Solo State
  const [mpd, setMpd] = useState(0);
  const [streak, setStreak] = useState(0);
  const [flashDuration, setFlashDuration] = useState(450);
  const [reactionTimes, setReactionTimes] = useState([]);

  // PvP State
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [pvpRoundWinner, setPvpRoundWinner] = useState(null);

  // Active Recall Typed Input State
  const [typedValue, setTypedValue] = useState('');
  const [p2TypedValue, setP2TypedValue] = useState('');

  // Common Round State
  const [currentRule, setCurrentRule] = useState(STANDARD_RULES[0]);
  const [numbersPool, setNumbersPool] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [flashNumber, setFlashNumber] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const inputRef = useRef(null);
  const startTimeRef = useRef(0);
  const flashTimerRef = useRef(null);
  const botTimerRef = useRef(null);

  const availableRules = useAdvancedRules
    ? [...STANDARD_RULES, ...ADVANCED_RULES]
    : STANDARD_RULES;

  const currentDiffCfg = DIFFICULTY_CONFIG[difficulty];

  const startGame = () => {
    setCurrentRound(1);
    setMpd(0);
    setStreak(0);
    setP1Score(0);
    setP2Score(0);
    setPvpRoundWinner(null);
    setFlashDuration(currentDiffCfg.startFlash);
    setReactionTimes([]);
    setFeedback(null);
    setTypedValue('');
    setP2TypedValue('');
    soundService.levelUp?.();
    startRound(1, currentDiffCfg.startFlash, 0, 0, 0);
  };

  const startRound = (roundNum, duration, currentStreak, curP1, curP2) => {
    if (gameMode === 'solo' && roundNum > maxRounds) {
      finishGame();
      return;
    }
    if (gameMode !== 'solo' && (curP1 >= pvpTargetScore || curP2 >= pvpTargetScore)) {
      finishGame();
      return;
    }

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    const rule = availableRules[Math.floor(Math.random() * availableRules.length)];
    setCurrentRule(rule);

    const digits = currentDiffCfg.digits(roundNum);
    const pool = generateNumbers(digits, currentDiffCfg.count);
    setNumbersPool(pool);

    let bestVal = -Infinity;
    let bestNum = pool[0];
    pool.forEach(num => {
      const val = rule.eval(num);
      if (val > bestVal) {
        bestVal = val;
        bestNum = num;
      }
    });
    setCorrectAnswer(bestNum);

    setPhase('flashing');
    setFlashNumber(null);
    setFeedback(null);
    setPvpRoundWinner(null);
    setTypedValue('');
    setP2TypedValue('');

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < pool.length) {
        setFlashNumber(pool[idx]);
        soundService.click?.();

        setTimeout(() => {
          setFlashNumber(null);
        }, Math.max(80, duration - 70));

        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setFlashNumber(null);
          setPhase('input');
          startTimeRef.current = performance.now();
          setTimeout(() => inputRef.current?.focus(), 50);

          // Bot challenge simulation in PvP Bot mode
          if (gameMode === 'pvp_bot') {
            const botReactionTime = Math.floor(Math.random() * 900) + 1100; // 1.1s - 2.0s
            botTimerRef.current = setTimeout(() => {
              handleBotAnswer(bestNum);
            }, botReactionTime);
          }
        }, 200);
      }
    }, duration + 90);

    flashTimerRef.current = interval;
  };

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearInterval(flashTimerRef.current);
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, []);

  const handleBotAnswer = (correctNum) => {
    if (phase !== 'input') return;
    soundService.error?.();
    setP2Score(s => {
      const next = s + 1;
      setPvpRoundWinner(`🤖 Nöro-Bot doğru sayıyı (${correctNum}) ilk yazdı!`);
      setPhase('round_summary');
      setTimeout(() => {
        const nextR = currentRound + 1;
        setCurrentRound(nextR);
        startRound(nextR, flashDuration, 0, p1Score, next);
      }, 1600);
      return next;
    });
  };

  const handleNumpadPress = (digit, player = 1) => {
    if (phase !== 'input') return;
    soundService.click?.();
    if (player === 1) {
      if (typedValue.length < 5) setTypedValue(v => v + digit);
    } else {
      if (p2TypedValue.length < 5) setP2TypedValue(v => v + digit);
    }
  };

  const handleNumpadDelete = (player = 1) => {
    if (phase !== 'input') return;
    soundService.click?.();
    if (player === 1) {
      setTypedValue(v => v.slice(0, -1));
    } else {
      setP2TypedValue(v => v.slice(0, -1));
    }
  };

  const handleSubmitAnswer = (player = 1) => {
    if (phase !== 'input') return;
    const answerStr = player === 1 ? typedValue.trim() : p2TypedValue.trim();
    if (!answerStr) return;

    const answerNum = parseInt(answerStr, 10);
    const responseTime = performance.now() - startTimeRef.current;
    setReactionTimes(prev => [...prev, responseTime]);

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    if (gameMode === 'solo') {
      if (answerNum === correctAnswer) {
        soundService.success?.();
        const newStreak = streak + 1;
        setStreak(newStreak);

        const speedFactor = Math.max(1, (3000 - responseTime) / 10);
        const streakBonus = newStreak * 25;
        const roundMpd = speedFactor + streakBonus;
        setMpd(m => m + roundMpd);

        const newDuration = Math.max(currentDiffCfg.minFlash, flashDuration - currentDiffCfg.speedDelta);
        setFlashDuration(newDuration);
        setFeedback('correct');

        setPhase('round_summary');
        setTimeout(() => {
          const nextR = currentRound + 1;
          setCurrentRound(nextR);
          startRound(nextR, newDuration, newStreak, 0, 0);
        }, 1400);
      } else {
        soundService.error?.();
        setStreak(0);
        const newDuration = Math.min(currentDiffCfg.startFlash, flashDuration + currentDiffCfg.speedDelta + 10);
        setFlashDuration(newDuration);
        setFeedback('wrong');

        setPhase('round_summary');
        setTimeout(() => {
          const nextR = currentRound + 1;
          setCurrentRound(nextR);
          startRound(nextR, newDuration, 0, 0, 0);
        }, 1800);
      }
    } else {
      // PvP Modes
      if (answerNum === correctAnswer) {
        soundService.success?.();
        setFeedback('correct');
        setPhase('round_summary');

        if (player === 1) {
          const nextP1 = p1Score + 1;
          setP1Score(nextP1);
          setPvpRoundWinner('🔵 1. Oyuncu (Mavi) bildi!');
          setTimeout(() => {
            const nextR = currentRound + 1;
            setCurrentRound(nextR);
            startRound(nextR, flashDuration, 0, nextP1, p2Score);
          }, 1500);
        } else {
          const nextP2 = p2Score + 1;
          setP2Score(nextP2);
          setPvpRoundWinner(gameMode === 'pvp_bot' ? '🤖 Nöro-Bot bildi!' : '🔴 2. Oyuncu (Kırmızı) bildi!');
          setTimeout(() => {
            const nextR = currentRound + 1;
            setCurrentRound(nextR);
            startRound(nextR, flashDuration, 0, p1Score, nextP2);
          }, 1500);
        }
      } else {
        soundService.error?.();
        setFeedback('wrong');
        if (player === 1) setTypedValue('');
        else setP2TypedValue('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (phase !== 'input') return;
    if (e.key >= '0' && e.key <= '9') {
      handleNumpadPress(e.key, 1);
    } else if (e.key === 'Backspace') {
      handleNumpadDelete(1);
    } else if (e.key === 'Enter') {
      handleSubmitAnswer(1);
    }
  };

  const finishGame = () => {
    setPhase('gameover');
    soundService.levelUp?.();
    if (onGameComplete && gameMode === 'solo') {
      onGameComplete('neuro_flash', 'hiz', Math.round(mpd), currentRound);
    }
  };

  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const percentile = getPercentileRank(avgReaction);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`glass-card game-container anim-pop ${feedback === 'wrong' ? 'anim-shake' : ''}`}
      style={{ maxWidth: '640px', margin: '0 auto', outline: 'none' }}
    >
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '0.3rem' }}>
            <Zap size={13} fill="#00f2fe" /> Bilişsel Hız & Flaş Hafıza
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--accent-light)', margin: 0, letterSpacing: '1px' }}>
            NEURO FLASH
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          {gameMode === 'solo' ? (
            <>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-gold)' }}>
                {Math.round(mpd)}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                MPD Skoru
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#38bdf8' }}>{p1Score}</span>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>P1 (Mavi)</div>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>:</span>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f43f5e' }}>{p2Score}</span>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{gameMode === 'pvp_bot' ? 'Bot' : 'P2 (Kırmızı)'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mode & Rule Selection Bar (Idle state) */}
      {phase === 'idle' && (
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>
              🎮 Oyun Modu Seç:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                onClick={() => setGameMode('solo')}
                style={{
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${gameMode === 'solo' ? '#00f2fe' : 'rgba(255,255,255,0.1)'}`,
                  background: gameMode === 'solo' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: gameMode === 'solo' ? '#00f2fe' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <User size={14} style={{ marginBottom: '2px' }} /><br />Tek Kişi (Yazmalı)
              </button>
              <button
                onClick={() => setGameMode('pvp_bot')}
                style={{
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${gameMode === 'pvp_bot' ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                  background: gameMode === 'pvp_bot' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: gameMode === 'pvp_bot' ? '#fbbf24' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Bot size={14} style={{ marginBottom: '2px' }} /><br />Vs Nöro-Bot
              </button>
              <button
                onClick={() => setGameMode('pvp_local')}
                style={{
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${gameMode === 'pvp_local' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}`,
                  background: gameMode === 'pvp_local' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: gameMode === 'pvp_local' ? '#f43f5e' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Swords size={14} style={{ marginBottom: '2px' }} /><br />2 Kişilik Düello
              </button>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>
              🎯 Zorluk Seviyesi Seç:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {Object.entries(DIFFICULTY_CONFIG).map(([dKey, dVal]) => {
                const isSel = difficulty === dKey;
                return (
                  <button
                    key={dKey}
                    onClick={() => setDifficulty(dKey)}
                    style={{
                      padding: '0.5rem 0.3rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSel ? dVal.color : 'rgba(255,255,255,0.1)'}`,
                      background: isSel ? `${dVal.color}25` : 'rgba(255,255,255,0.03)',
                      color: isSel ? dVal.color : 'var(--text-muted)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{dVal.label}</div>
                    <div style={{ fontSize: '0.62rem', opacity: 0.8, marginTop: '2px' }}>{dVal.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Rules Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={14} color="#a855f7" /> Kuantum Zorlu Kurallar (Ayna Sayı, Çarpım, 3'e Bölünme)
            </span>
            <button
              onClick={() => setUseAdvancedRules(v => !v)}
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '800',
                border: `1.5px solid ${useAdvancedRules ? '#a855f7' : 'rgba(255,255,255,0.2)'}`,
                background: useAdvancedRules ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                color: useAdvancedRules ? '#c084fc' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {useAdvancedRules ? 'AÇIK 🔥' : 'KAPALI'}
            </button>
          </div>
        </div>
      )}

      {/* Active Game View */}
      {(phase === 'flashing' || phase === 'input' || phase === 'round_summary') && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: '600' }}>
            <span>Tur: <strong style={{ color: '#fff' }}>{currentRound}</strong> {gameMode === 'solo' ? `/ ${maxRounds}` : `(İlk ${pvpTargetScore} kazanan)`}</span>
            {gameMode === 'solo' && <span>Seri: <strong style={{ color: '#fbbf24' }}>{streak} 🔥</strong></span>}
            <span>Flaş Hızı: <strong style={{ color: '#00f2fe' }}>{flashDuration}ms</strong></span>
          </div>

          {/* Rule Box */}
          <div style={{
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px dashed rgba(0, 242, 254, 0.4)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>
              İşlem Kuralı ({currentRule.badge})
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
              {currentRule.text}
            </div>
          </div>

          {/* Viewport */}
          <div style={{
            height: '130px',
            background: '#030712',
            borderRadius: 'var(--radius-lg)',
            border: `2px solid ${feedback === 'correct' ? 'var(--success)' : feedback === 'wrong' ? 'var(--danger)' : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: feedback === 'correct' ? '0 0 25px rgba(16, 185, 129, 0.5)' : feedback === 'wrong' ? '0 0 25px rgba(239, 68, 68, 0.5)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '1rem',
            transition: 'all 0.2s ease',
          }}>
            {phase === 'flashing' && flashNumber && (
              <div style={{
                fontSize: '3.6rem',
                fontWeight: '900',
                letterSpacing: '6px',
                color: '#fff',
                textShadow: '0 0 30px rgba(0, 242, 254, 0.7)',
              }}>
                {flashNumber}
              </div>
            )}
            {phase === 'flashing' && !flashNumber && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Flaş akışı sürüyor...
              </div>
            )}
            {phase === 'input' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#00f2fe', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                  ✍️ KURALA UYAN SAYIYI AKLINDAN YAZ:
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '4px' }}>
                  {typedValue || <span style={{ opacity: 0.3 }}>_ _ _</span>}
                </div>
              </div>
            )}
            {phase === 'round_summary' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: feedback === 'correct' ? 'var(--success)' : 'var(--danger)', fontSize: '1.1rem', fontWeight: '800' }}>
                  {pvpRoundWinner || (feedback === 'correct' ? '✅ DOĞRU!' : '❌ YANLIŞ!')}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '0.3rem' }}>
                  Doğru Cevap: <strong style={{ color: '#fbbf24', fontSize: '1.2rem' }}>{correctAnswer}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Reveal Panel after round (Shows what flashed and why) */}
          {phase === 'round_summary' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '1rem' }}>
              {numbersPool.map(num => {
                const isCorrect = num === correctAnswer;
                return (
                  <div
                    key={num}
                    style={{
                      background: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${isCorrect ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                      padding: '0.5rem 0.2rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: isCorrect ? '#10b981' : '#fff' }}>
                      {num} {isCorrect && '★'}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {currentRule.formatVal(num)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Recall Numpad Interface (No static numbers shown!) */}
          {phase === 'input' && (
            <>
              {gameMode !== 'pvp_local' ? (
                /* Solo & Vs Bot Numpad */
                <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                      <button
                        key={d}
                        onClick={() => handleNumpadPress(d, 1)}
                        style={{
                          padding: '0.9rem',
                          fontSize: '1.3rem',
                          fontWeight: '800',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid rgba(255,255,255,0.15)',
                          background: 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.1s'
                        }}
                      >
                        {d}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNumpadDelete(1)}
                      style={{
                        padding: '0.9rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid rgba(239, 68, 68, 0.4)',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Sil"
                    >
                      <Delete size={20} />
                    </button>
                    <button
                      onClick={() => handleNumpadPress('0', 1)}
                      style={{
                        padding: '0.9rem',
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      0
                    </button>
                    <button
                      onClick={() => handleSubmitAnswer(1)}
                      disabled={!typedValue}
                      style={{
                        padding: '0.9rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid rgba(16, 185, 129, 0.5)',
                        background: typedValue ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        cursor: typedValue ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        opacity: typedValue ? 1 : 0.4
                      }}
                      title="Gönder"
                    >
                      <CornerDownLeft size={20} />
                    </button>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    💡 Klavyendeki numara tuşlarını ve <strong>Enter</strong> tuşunu da kullanabilirsin!
                  </div>
                </div>
              ) : (
                /* 2-Player Local Duel Dual Numpad */
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Player 1 (Blue) */}
                  <div style={{ background: 'rgba(56,189,248,0.06)', padding: '0.7rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(56,189,248,0.25)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '800', textAlign: 'center', marginBottom: '0.3rem' }}>
                      🔵 1. OYUNCU: <span style={{ fontSize: '1.1rem', color: '#fff' }}>{typedValue || '_'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      {['1','2','3','4','5','6','7','8','9','0'].map(d => (
                        <button
                          key={d}
                          onClick={() => handleNumpadPress(d, 1)}
                          style={{ padding: '0.5rem', fontSize: '0.9rem', fontWeight: '800', borderRadius: '4px', border: '1px solid #38bdf8', background: 'rgba(56,189,248,0.15)', color: '#fff', cursor: 'pointer' }}
                        >
                          {d}
                        </button>
                      ))}
                      <button
                        onClick={() => handleNumpadDelete(1)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}
                      >
                        ⌫
                      </button>
                      <button
                        onClick={() => handleSubmitAnswer(1)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #10b981', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: '900' }}
                      >
                        ✓
                      </button>
                    </div>
                  </div>

                  {/* Player 2 (Red) */}
                  <div style={{ background: 'rgba(244,63,94,0.06)', padding: '0.7rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244,63,94,0.25)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: '800', textAlign: 'center', marginBottom: '0.3rem' }}>
                      🔴 2. OYUNCU: <span style={{ fontSize: '1.1rem', color: '#fff' }}>{p2TypedValue || '_'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      {['1','2','3','4','5','6','7','8','9','0'].map(d => (
                        <button
                          key={d}
                          onClick={() => handleNumpadPress(d, 2)}
                          style={{ padding: '0.5rem', fontSize: '0.9rem', fontWeight: '800', borderRadius: '4px', border: '1px solid #f43f5e', background: 'rgba(244,63,94,0.15)', color: '#fff', cursor: 'pointer' }}
                        >
                          {d}
                        </button>
                      ))}
                      <button
                        onClick={() => handleNumpadDelete(2)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}
                      >
                        ⌫
                      </button>
                      <button
                        onClick={() => handleSubmitAnswer(2)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #10b981', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: '900' }}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Idle / Gameover View */}
      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          {phase === 'gameover' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={52} color="var(--accent-gold)" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
                {gameMode === 'solo'
                  ? 'Flaş Testi Tamamlandı!'
                  : p1Score >= pvpTargetScore
                  ? '🏆 1. Oyuncu Düelloyu Kazandı!'
                  : gameMode === 'pvp_bot'
                  ? '🤖 Nöro-Bot Kazandı!'
                  : '🏆 2. Oyuncu Düelloyu Kazandı!'}
              </h3>

              {gameMode === 'solo' && (
                <>
                  <p style={{ color: 'var(--success)', fontWeight: '800', fontSize: '1.3rem', marginBottom: '0.6rem' }}>
                    Toplam MPD: {Math.round(mpd)}
                  </p>

                  {/* Nöro-Hız Derecelendirme Kartı */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: `2px solid ${percentile.color}`, borderRadius: 'var(--radius-lg)', padding: '1rem', maxWidth: '380px', margin: '0 auto 1rem', boxShadow: `0 0 20px ${percentile.color}30` }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: percentile.color, marginBottom: '0.2rem' }}>
                      {percentile.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '700' }}>
                      Derece: <span style={{ color: 'var(--accent-gold)' }}>{percentile.rank}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>Ort. Tepki: <strong style={{ color: '#fff' }}>{avgReaction}ms</strong></span>
                    <span>En Hızlı: <strong style={{ color: '#00f2fe' }}>{flashDuration}ms</strong></span>
                  </div>
                </>
              )}

              {gameMode !== 'solo' && (
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>
                  Skor: {p1Score} - {p2Score}
                </div>
              )}
            </div>
          )}

          {phase === 'idle' && (
            <div style={{ marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Saliselerle beliren sayıları yakala!<br />
              Şık yok, kopya yok! Kurala uyan sayıyı <strong>hafızandan doğrudan yazarak</strong> MPD hız skorunu katla!
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
              background: 'linear-gradient(135deg, #00f2fe, #0072ff)',
              boxShadow: '0 4px 20px rgba(0, 242, 254, 0.4)'
            }}
          >
            <Play size={19} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}
          </button>
        </div>
      )}

    </div>
  );
}
