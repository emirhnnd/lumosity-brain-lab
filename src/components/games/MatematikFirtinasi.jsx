import React, { useState, useEffect } from 'react';
import { Calculator, Play, Clock, Zap, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

export default function MatematikFirtinasi({ onGameComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [currentMath, setCurrentMath] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isPlaying && timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const generateProblem = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1, num2, target;

    if (op === '+') {
      num1 = Math.floor(Math.random() * 30) + 5;
      num2 = Math.floor(Math.random() * 30) + 5;
      target = num1 + num2;
    } else if (op === '-') {
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * num1) + 1;
      target = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * 10) + 2;
      num2 = Math.floor(Math.random() * 10) + 2;
      target = num1 * num2;
    }

    // Hide one component randomly: num1, num2 or target
    const hideType = Math.floor(Math.random() * 3); // 0: num1, 1: num2, 2: target
    let questionStr = '';
    let correctAnswer = 0;

    if (hideType === 0) {
      questionStr = `? ${op} ${num2} = ${target}`;
      correctAnswer = num1;
    } else if (hideType === 1) {
      questionStr = `${num1} ${op} ? = ${target}`;
      correctAnswer = num2;
    } else {
      questionStr = `${num1} ${op} ${num2} = ?`;
      correctAnswer = target;
    }

    // Generate 4 options
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const offset = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = Math.max(1, correctAnswer + offset);
      options.add(fake);
    }

    setCurrentMath({
      questionStr,
      correctAnswer,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    });
  };

  const startGame = () => {
    soundService.click();
    setScore(0);
    setCombo(1);
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
    generateProblem();
  };

  const handleAnswer = (ans) => {
    if (!isPlaying || !currentMath) return;

    if (ans === currentMath.correctAnswer) {
      soundService.success();
      const points = 100 * combo;
      setScore(s => s + points);
      setCombo(c => Math.min(5, c + 1));
    } else {
      soundService.error();
      setCombo(1);
    }
    generateProblem();
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    soundService.levelUp();
    if (onGameComplete) {
      onGameComplete('matematik_firtinasi', 'mantik', score, Math.floor(score / 500) + 1);
    }
  };

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '480px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '1rem' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
          <Calculator size={14} /> Mantık & Sayısal Zeka
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Matematik Fırtınası</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Eksik olan sayıyı süren bitmeden en hızlı şekilde bul!
        </p>
      </div>

      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.25rem',
        fontWeight: '700'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--warning)' }}>
          <Clock size={18} /> {timeLeft}s
        </div>
        <div>Kombo: <span style={{ color: 'var(--accent-light)' }}>x{combo}</span></div>
        <div>Skor: <span style={{ color: 'var(--success)' }}>{score}</span></div>
      </div>

      {isPlaying && currentMath ? (
        <div>
          {/* Question Card */}
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: 'var(--accent-light)',
            padding: '1.5rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-accent)',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 25px var(--accent-glow)'
          }}>
            {currentMath.questionStr}
          </div>

          {/* Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {currentMath.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="btn-secondary"
                style={{
                  padding: '1.2rem',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  justifyContent: 'center'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '2rem 0' }}>
          {gameOver ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={48} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.5rem' }}>Oyun Bitti!</h3>
              <p style={{ fontSize: '1.2rem', color: 'var(--success)', fontWeight: '700' }}>Skorun: {score}</p>
            </div>
          ) : (
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Zihinsel işlem hızını maksimuma çıkar, arda arda doğru cevaplar vererek 5x kombo çarpanına ulaş!
            </p>
          )}

          <button className="btn-primary" onClick={startGame} style={{ width: '100%', padding: '0.9rem' }}>
            <Play size={20} /> {gameOver ? 'Yeniden Başla' : 'Oyunu Başlat'}
          </button>
        </div>
      )}

    </div>
  );
}
