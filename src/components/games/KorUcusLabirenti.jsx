import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, Play, Award, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GRID_SIZE = 7;
const MEMORIZE_SECONDS = 3.5;

// Sample maze layouts with walls and hazards
const MAZE_LEVELS = [
  {
    walls: ['1-1', '1-2', '1-4', '2-4', '3-1', '3-2', '4-4', '5-1', '5-2', '5-4'],
    hazards: ['2-2', '4-2', '3-5'],
    coins: ['0-4', '3-3', '5-5']
  },
  {
    walls: ['0-2', '1-2', '2-2', '3-2', '4-2', '2-4', '3-4', '4-4', '5-4', '1-5'],
    hazards: ['1-3', '3-1', '5-2'],
    coins: ['0-5', '2-3', '6-2']
  },
  {
    walls: ['1-0', '1-1', '1-3', '1-5', '3-1', '3-3', '3-5', '5-1', '5-3', '5-5'],
    hazards: ['2-3', '4-1', '4-5'],
    coins: ['0-3', '2-5', '6-1']
  },
  {
    walls: ['0-3', '1-1', '1-3', '1-5', '2-1', '3-1', '3-3', '3-5', '4-5', '5-3', '5-4'],
    hazards: ['2-4', '4-2', '5-1'],
    coins: ['2-2', '4-4', '6-3']
  }
];

export default function KorUcusLabirenti({ onGameComplete }) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [phase, setPhase] = useState('idle'); // idle | memorize | blindfold | hit | level_clear | gameover

  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [trail, setTrail] = useState(['0-0']);
  const [collectedCoins, setCollectedCoins] = useState(new Set());
  const [countdown, setCountdown] = useState(MEMORIZE_SECONDS);

  const goalPos = [GRID_SIZE - 1, GRID_SIZE - 1];
  const currentMaze = MAZE_LEVELS[(level - 1) % MAZE_LEVELS.length];
  const wallsSet = new Set(currentMaze.walls);
  const hazardsSet = new Set(currentMaze.hazards);

  const startLevel = useCallback((lvl) => {
    setPlayerPos([0, 0]);
    setTrail(['0-0']);
    setCollectedCoins(new Set());
    setCountdown(MEMORIZE_SECONDS);
    setPhase('memorize');
    soundService.levelUp?.();
  }, []);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    startLevel(1);
  };

  // Memorization Countdown Timer
  useEffect(() => {
    if (phase !== 'memorize') return;
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          setPhase('blindfold');
          soundService.spellCast?.();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Move Player Logic
  const move = useCallback((dr, dc) => {
    if (phase !== 'blindfold') return;

    const [r, c] = playerPos;
    const nr = r + dr;
    const nc = c + dc;
    const key = `${nr}-${nc}`;

    // Boundary check
    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) {
      soundService.error?.();
      return;
    }

    // Wall collision
    if (wallsSet.has(key)) {
      soundService.error?.();
      triggerHit('Duvara çarptın!');
      return;
    }

    // Hazard collision
    if (hazardsSet.has(key)) {
      soundService.error?.();
      triggerHit('Tuzak tetiklendi!');
      return;
    }

    // Valid move
    soundService.click?.();
    setPlayerPos([nr, nc]);
    setTrail(prev => [...prev.slice(-8), key]); // Keep glowing recent trail

    // Collect coin
    if (currentMaze.coins.includes(key) && !collectedCoins.has(key)) {
      soundService.success?.();
      setCollectedCoins(prev => new Set(prev).add(key));
      setScore(s => s + 200);
    }

    // Check goal reached!
    if (nr === goalPos[0] && nc === goalPos[1]) {
      soundService.levelUp?.();
      const levelBonus = 500 + level * 200;
      setScore(s => s + levelBonus);
      setPhase('level_clear');

      setTimeout(() => {
        const nextLvl = level + 1;
        setLevel(nextLvl);
        startLevel(nextLvl);
      }, 1500);
    }
  }, [phase, playerPos, wallsSet, hazardsSet, currentMaze, collectedCoins, goalPos, level, startLevel]);

  const triggerHit = (reason) => {
    const nextLives = lives - 1;
    setLives(nextLives);
    setPhase('hit');

    if (nextLives <= 0) {
      setTimeout(() => {
        setPhase('gameover');
        if (onGameComplete) {
          onGameComplete('kor_ucus_labirenti', 'hafiza', score, level);
        }
      }, 1200);
    } else {
      setTimeout(() => {
        // Reset player to start and give a brief 1.5s radar flash to re-orient
        setPlayerPos([0, 0]);
        setTrail(['0-0']);
        setCountdown(1.5);
        setPhase('memorize');
      }, 1000);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase !== 'blindfold') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') move(-1, 0);
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') move(1, 0);
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') move(0, -1);
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') move(0, 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, phase]);

  const isBlind = phase === 'blindfold';

  return (
    <div className={`glass-card game-container anim-pop ${phase === 'hit' ? 'anim-shake' : ''}`} style={{ maxWidth: '540px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '0.3rem' }}>
            {isBlind ? <EyeOff size={13} /> : <Eye size={13} />} Uzamsal Hafıza & Kör Navigasyon
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--accent-light)', margin: 0 }}>
            Kör Uçuş Labirenti
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-gold)' }}>
            🏆 {score}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {Array.from({ length: 3 }, (_, i) => i < lives ? '❤️' : '🖤').join('')}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {(phase === 'memorize' || phase === 'blindfold' || phase === 'hit' || phase === 'level_clear') && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
          <span style={{ color: 'var(--accent-light)' }}>🎯 Seviye {level}</span>
          {phase === 'memorize' && (
            <span style={{ color: '#00f2fe', animation: 'pulse 1s infinite' }}>
              👁️ Ezberle! ({countdown}s)
            </span>
          )}
          {phase === 'blindfold' && (
            <span style={{ color: '#a855f7' }}>
              🌑 Kör Uçuş: Çıkışa Yürü!
            </span>
          )}
          {phase === 'hit' && (
            <span style={{ color: 'var(--danger)' }}>
              💥 Duvara Çarptın! Başa Döndün
            </span>
          )}
          {phase === 'level_clear' && (
            <span style={{ color: 'var(--success)' }}>
              🌟 Çıkışa Ulaştın! Harika!
            </span>
          )}
          <span style={{ color: '#fbbf24' }}>
            🪙 {collectedCoins.size} / {currentMaze.coins.length}
          </span>
        </div>
      )}

      {/* Maze Grid */}
      {(phase === 'memorize' || phase === 'blindfold' || phase === 'hit' || phase === 'level_clear') && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '4px',
          background: isBlind ? '#030712' : 'rgba(10, 15, 30, 0.95)',
          padding: '8px',
          borderRadius: 'var(--radius-lg)',
          border: `2px solid ${isBlind ? '#7928ca' : 'rgba(0, 242, 254, 0.4)'}`,
          boxShadow: isBlind ? '0 0 30px rgba(121, 40, 202, 0.3)' : '0 0 25px rgba(0, 242, 254, 0.2)',
          marginBottom: '1.2rem',
          aspectRatio: '1',
          transition: 'all 0.5s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
            const r = Math.floor(idx / GRID_SIZE);
            const c = idx % GRID_SIZE;
            const key = `${r}-${c}`;

            const isPlayer = playerPos[0] === r && playerPos[1] === c;
            const isGoal = goalPos[0] === r && goalPos[1] === c;
            const isWall = wallsSet.has(key);
            const isHazard = hazardsSet.has(key);
            const isCoin = currentMaze.coins.includes(key) && !collectedCoins.has(key);
            const isInTrail = trail.includes(key);

            // Visibility in Blindfold mode
            let showContent = !isBlind || phase === 'hit' || phase === 'level_clear';
            let bg = 'rgba(255, 255, 255, 0.03)'; // Default uniform background
            let content = null;

            if (isPlayer) {
              bg = 'linear-gradient(135deg, #00f2fe, #0072ff)';
              content = '🚀';
            } else if (!showContent) {
              // BLIND MODE: Hide everything uniformly except player, trail, and a faint goal
              if (isGoal) {
                bg = 'rgba(245, 158, 11, 0.08)'; // Goal remains faintly visible
              } else if (isInTrail) {
                bg = 'rgba(0, 242, 254, 0.12)';
                content = '•';
              } else {
                // Critical Fix: Walls, hazards, coins, and empty spaces MUST all have the exact same background so you can't cheat!
                bg = 'rgba(255, 255, 255, 0.03)';
              }
            } else {
              // VISIBLE MODE
              if (isGoal) {
                bg = 'rgba(245, 158, 11, 0.25)';
                content = '🏁';
              } else if (isWall) {
                bg = 'rgba(255, 255, 255, 0.2)';
                content = '🧱';
              } else if (isHazard) {
                bg = 'rgba(239, 68, 68, 0.25)';
                content = '💀';
              } else if (isCoin) {
                bg = 'rgba(251, 191, 36, 0.2)';
                content = '🪙';
              }
            }

            return (
              <div
                key={key}
                style={{
                  borderRadius: '6px',
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  transition: 'background 0.2s',
                  boxShadow: isPlayer ? '0 0 16px #00f2fe' : isGoal ? '0 0 12px #f59e0b' : 'none'
                }}
              >
                {content}
              </div>
            );
          })}
        </div>
      )}

      {/* D-Pad Controls for Touch & Mouse */}
      {(phase === 'blindfold' || phase === 'hit') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
          <button
            onClick={() => move(-1, 0)}
            style={{ width: '56px', height: '50px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowUp size={22} />
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => move(0, -1)}
              style={{ width: '56px', height: '50px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowLeft size={22} />
            </button>
            <button
              onClick={() => move(1, 0)}
              style={{ width: '56px', height: '50px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowDown size={22} />
            </button>
            <button
              onClick={() => move(0, 1)}
              style={{ width: '56px', height: '50px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowRight size={22} />
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            💡 İster tuşlara tıkla, ister klavyendeki ok tuşlarını (veya W, A, S, D) kullan!
          </div>
        </div>
      )}

      {/* Idle / Gameover View */}
      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          {phase === 'gameover' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={52} color="var(--accent-gold)" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Labirentte Kayboldun!</h3>
              <p style={{ color: 'var(--success)', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.3rem' }}>
                Toplam Skor: {score}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Ulaşılan Seviye: {level}
              </p>
            </div>
          )}

          {phase === 'idle' && (
            <div style={{ marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Labirent, duvarlar ve tuzaklar **sadece 3.5 saniye** gösterilir.<br />
              Ardından ekran **tamamen kararır!**<br />
              Zihnindeki haritaya güvenerek çıkış kapısına (🏁) adım adım ilerle!
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
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)'
            }}
          >
            <Play size={19} /> {phase === 'gameover' ? 'Tekrar Dene' : 'Kör Uçuşu Başlat'}
          </button>
        </div>
      )}

    </div>
  );
}
