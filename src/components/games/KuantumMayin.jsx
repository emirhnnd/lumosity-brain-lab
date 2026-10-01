import React, { useState, useEffect, useRef } from 'react';
import { Play, Award, RotateCcw, Zap, Sparkles, Flag, Clock, Shield, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

const ROWS = 8;
const COLS = 8;
const MINE_COUNT = 9;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
      countdown: null,
      isChrono: false
    }))
  );
}

function placeMinesSafely(grid, firstR, firstC) {
  // Safe zone: first clicked cell and all 8 adjacent neighbors
  const safeCoords = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = firstR + dr;
      const nc = firstC + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        safeCoords.add(`${nr},${nc}`);
      }
    }
  }

  // Place mines outside the safe zone
  let placed = 0;
  let chronoCount = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    const key = `${r},${c}`;

    if (!safeCoords.has(key) && !grid[r][c].isMine) {
      grid[r][c].isMine = true;
      // Max 2-3 unstable Chrono-mines with generous countdown (15-20 moves)
      if (chronoCount < 2 && Math.random() < 0.4) {
        grid[r][c].isChrono = true;
        grid[r][c].countdown = Math.floor(Math.random() * 6) + 15; // 15 to 20 moves
        chronoCount++;
      }
      placed++;
    }
  }

  // Calculate adjacent mines
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].isMine) {
            count++;
          }
        }
      }
      grid[r][c].adjacentMines = count;
    }
  }
}

export default function KuantumMayin({ onGameComplete }) {
  const [board, setBoard] = useState(createEmptyBoard);
  const [phase, setPhase] = useState('idle'); // idle | playing | won | lost
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [freezeTurns, setFreezeTurns] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [movesCount, setMovesCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('İlk hamleni yap: İlk tıklama daima %100 güvenlidir!');

  // Timer: İlk hamle yapıldığı andan oyun bitene kadar saniye sayar
  useEffect(() => {
    let interval = null;
    if (phase === 'playing' && !isFirstClick) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, isFirstClick]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startGame = () => {
    setBoard(createEmptyBoard());
    setIsFirstClick(true);
    setScore(0);
    setSeconds(0);
    setEnergy(100);
    setFreezeTurns(0);
    setFlagMode(false);
    setMovesCount(0);
    setMessage('İlk karenizi açın (İlk tıklama daima %100 güvenlidir!)');
    setPhase('playing');
    soundService.levelUp?.();
  };

  const revealCell = (r, c) => {
    if (phase !== 'playing') return;
    const currentCell = board[r][c];
    if (currentCell.isRevealed || currentCell.isFlagged) return;

    let currentBoard = board;

    // FIRST CLICK GUARANTEE: Never hits a mine, always opens a safe clearing!
    if (isFirstClick) {
      const generatedBoard = board.map(row => row.map(cell => ({ ...cell })));
      placeMinesSafely(generatedBoard, r, c);
      currentBoard = generatedBoard;
      setIsFirstClick(false);
    }

    const cell = currentBoard[r][c];

    if (cell.isMine) {
      // Hit mine!
      soundService.error?.();
      revealAllMines(currentBoard, r, c);
      setPhase('lost');
      setMessage('💥 Kuantum Mayını Patladı!');
      return;
    }

    soundService.click?.();
    const newBoard = currentBoard.map(row => row.map(cell => ({ ...cell })));
    floodReveal(newBoard, r, c);

    // CRITICAL FIX: Check victory IMMEDIATELY after revealing cells!
    let unrevealedSafe = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!newBoard[i][j].isMine && !newBoard[i][j].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      // ALL SAFE SQUARES CLEARED: Complete victory!
      // Disarm all mines so they are safely neutralized and displayed with shields
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (newBoard[i][j].isMine) {
            newBoard[i][j].isDisarmed = true;
            newBoard[i][j].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);
      const finalScore = score + 1200;
      setScore(finalScore);
      setPhase('won');
      setMessage('🌟 Tebrikler! Tüm kuantum mayınları başarıyla etkisiz hale getirildi!');
      soundService.levelUp?.();
      try {
        confetti({ particleCount: 100, spread: 75, origin: { y: 0.6 } });
      } catch (e) {
        // ignore if not supported
      }
      if (onGameComplete) onGameComplete('kuantum_mayin', 'mantik', finalScore, 5);
      return;
    }

    // Charge energy & decrement unstable mine countdowns if not frozen
    const nextMoves = movesCount + 1;
    setMovesCount(nextMoves);
    setScore(s => s + 25);
    setEnergy(e => Math.min(100, e + 12));

    if (freezeTurns > 0) {
      setFreezeTurns(f => f - 1);
    } else {
      // Decrement countdowns for chrono mines
      let countdownExploded = false;
      let minCountdownRemaining = 999;

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (newBoard[i][j].isMine && newBoard[i][j].countdown !== null) {
            newBoard[i][j].countdown -= 1;
            if (newBoard[i][j].countdown <= 0) {
              countdownExploded = true;
            } else if (newBoard[i][j].countdown < minCountdownRemaining) {
              minCountdownRemaining = newBoard[i][j].countdown;
            }
          }
        }
      }

      if (countdownExploded) {
        soundService.error?.();
        revealAllMines(newBoard);
        setPhase('lost');
        setMessage('⏳ Kararsız Mayının Süresi Doldu ve Patladı!');
        return;
      }

      if (minCountdownRemaining <= 5) {
        setMessage(`⚠️ DİKKAT: Kararsız bir mayının patlamasına sadece ${minCountdownRemaining} hamle kaldı! Zaman Dondurucu kullanın.`);
      }
    }

    setBoard(newBoard);
  };

  const floodReveal = (grid, r, c) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged || cell.isMine) return;

    cell.isRevealed = true;
    if (cell.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          floodReveal(grid, r + dr, c + dc);
        }
      }
    }
  };

  const toggleFlag = (r, c) => {
    if (phase !== 'playing') return;
    if (isFirstClick) {
      setMessage('💡 Önce ilk karenizi açarak mayın tarlasını başlatın!');
      return;
    }
    const cell = board[r][c];
    if (cell.isRevealed) return;

    const currentFlagged = board.flat().filter(cell => cell.isFlagged).length;
    if (!cell.isFlagged && currentFlagged >= MINE_COUNT) {
      soundService.error?.();
      setMessage(`⚠️ En fazla ${MINE_COUNT} adet bayrak yerleştirebilirsiniz!`);
      return;
    }

    soundService.click?.();
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  const handleCellClick = (r, c) => {
    if (phase !== 'playing') return;
    // CRITICAL: First click ALWAYS safely opens the field, NEVER places a flag!
    if (isFirstClick) {
      setFlagMode(false);
      revealCell(r, c);
      return;
    }
    if (flagMode) toggleFlag(r, c);
    else revealCell(r, c);
  };

  const handleCellRightClick = (e, r, c) => {
    e.preventDefault();
    if (isFirstClick) {
      setMessage('💡 Önce ilk karenizi açarak mayın tarlasını başlatın!');
      return;
    }
    toggleFlag(r, c);
  };

  // Quantum Powers
  const activateTimeFreeze = () => {
    if (isFirstClick) {
      setMessage('⏳ Önce ilk karenizi güvenle açınız!');
      return;
    }
    if (energy < 40) return;
    soundService.spellCast?.();
    setEnergy(e => e - 40);
    setFreezeTurns(3);
    setMessage('⏳ Zaman 3 hamle boyunca donduruldu!');
  };

  const activateQuantumScanner = () => {
    if (isFirstClick) {
      setMessage('🔮 Önce ilk karenizi güvenle açınız!');
      return;
    }
    if (energy < 60) return;
    soundService.spellCast?.();
    setEnergy(e => e - 60);

    // Reveal 1 unflagged mine safely
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c].isMine && !board[r][c].isFlagged) {
          const newBoard = board.map(row => row.map(cell => ({ ...cell })));
          newBoard[r][c].isFlagged = true;
          setBoard(newBoard);
          setMessage(`🔮 Kuantum Tarayıcı [${r + 1}, ${c + 1}] mayınını ifşa etti!`);
          return;
        }
      }
    }
  };

  const revealAllMines = (gridToReveal, hitR = -1, hitC = -1) => {
    setBoard(prev => {
      const target = gridToReveal || prev;
      return target.map((row, r) => row.map((cell, c) => ({
        ...cell,
        isRevealed: cell.isMine ? true : cell.isRevealed,
        isHit: r === hitR && c === hitC,
        isExploded: (r === hitR && c === hitC) || (cell.isMine && cell.countdown !== null && cell.countdown <= 0)
      })));
    });
  };

  const flaggedCount = board.flat().filter(c => c.isFlagged).length;
  const remainingFlags = Math.max(0, MINE_COUNT - flaggedCount);

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '560px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '0.3rem' }}>
            <Zap size={13} fill="#fbbf24" /> Kuantum Mayın & Zaman Bükücü
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--accent-light)', margin: 0 }}>
            Kuantum Mayın Tarlası
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={startGame}
            title="Yeniden Başlat"
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <RotateCcw size={14} /> Yenile
          </button>
        </div>
      </div>

      {/* Idle Screen */}
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Klasik mayın tarlasının kuantum hali!<br />
            İlk tıklama daima <strong>%100 güvenlidir</strong>. Kararsız mayınların geri sayımına dikkat edin, <strong>Zaman Dondurucu</strong> ve <strong>Kuantum Tarayıcı</strong> güçlerini kullanarak tarlayı temizleyin!
          </div>
          <button
            className="btn-primary"
            onClick={startGame}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '0.95rem',
              fontSize: '1.05rem',
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Play size={19} /> Kuantum Mayınını Başlat
          </button>
        </div>
      )}

      {phase !== 'idle' && (
        <>
          {/* Top HUD: Süre, Kalan Bayrak, Skor, Hamle */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            marginBottom: '0.85rem'
          }}>
            {/* Süre */}
            <div style={{
              background: 'rgba(0,0,0,0.35)',
              padding: '0.55rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                <Clock size={11} /> SÜRE
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#38bdf8', fontFamily: 'monospace' }}>
                {formatTime(seconds)}
              </div>
            </div>

            {/* BÜYÜK VE NET KALAN BAYRAK GÖSTERGESİ */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1.5px solid rgba(239, 68, 68, 0.45)',
              padding: '0.55rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#f87171', fontWeight: '800' }}>🚩 BAYRAK</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f87171' }}>
                {remainingFlags} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>/{MINE_COUNT}</span>
              </div>
            </div>

            {/* Skor */}
            <div style={{
              background: 'rgba(0,0,0,0.35)',
              padding: '0.55rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '800' }}>🏆 SKOR</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-gold)' }}>{score}</div>
            </div>

            {/* Hamle Sayacı */}
            <div style={{
              background: 'rgba(0,0,0,0.35)',
              padding: '0.55rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '800' }}>HAMLE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#c084fc' }}>{movesCount}</div>
            </div>
          </div>

          {/* Victory Banner with Direct New Game Button */}
          {phase === 'won' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(6, 95, 70, 0.38))',
              border: '1.5px solid rgba(16, 185, 129, 0.65)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.1rem',
              marginBottom: '1rem',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontSize: '1.25rem', fontWeight: 800 }}>
                <Award size={26} color="#10b981" /> Tebrikler! Tüm Mayınlar Temizlendi!
              </div>
              <p style={{ margin: '0.4rem 0 0.85rem 0', color: '#e2e8f0', fontSize: '0.95rem' }}>
                Toplam Skor: <strong style={{ color: '#fbbf24', fontSize: '1.2rem' }}>{score}</strong> • Süre: <strong style={{ color: '#38bdf8' }}>{formatTime(seconds)}</strong> • Hamle: <strong style={{ color: '#c084fc' }}>{movesCount}</strong>
              </p>
              <button
                onClick={startGame}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.8rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.45)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Play size={18} /> 🎮 Yeni Oyunu Başlat
              </button>
            </div>
          )}

          {/* Defeat Banner with Direct New Game Button */}
          {phase === 'lost' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(153, 27, 27, 0.38))',
              border: '1.5px solid rgba(239, 68, 68, 0.65)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.1rem',
              marginBottom: '1rem',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#f87171', fontSize: '1.2rem', fontWeight: 800 }}>
                💥 {message || 'Kuantum Mayını Patladı!'}
              </div>
              <p style={{ margin: '0.4rem 0 0.85rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                Mayın tarlası sıfırlandı. Süre: <strong style={{ color: '#38bdf8' }}>{formatTime(seconds)}</strong> • Hamle: <strong style={{ color: '#c084fc' }}>{movesCount}</strong>
              </p>
              <button
                onClick={startGame}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.8rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.45)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RotateCcw size={18} /> 🔄 Yeni Oyunu Başlat
              </button>
            </div>
          )}

          {/* Controls: only visible while playing */}
          {phase === 'playing' && (
            <>
              {/* Status & Energy Bar */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
              <span style={{ color: '#00f2fe', fontWeight: '800' }}>⚡ Kuantum Enerjisi: {energy}%</span>
              <span style={{ color: freezeTurns > 0 ? '#38bdf8' : 'var(--text-muted)', fontWeight: '700' }}>
                {freezeTurns > 0 ? `⏳ Zaman Donuk (${freezeTurns} Hamle)` : 'Zaman Akıyor'}
              </span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${energy}%`, background: 'linear-gradient(90deg, #00f2fe, #a855f7)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Crystal-Clear Dual Action Bar: Kazı Modu vs Bayrak Modu */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.35)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.08)',
            gap: '6px',
            marginBottom: '0.85rem'
          }}>
            <button
              onClick={() => setFlagMode(false)}
              style={{
                flex: 1,
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                border: !flagMode ? '1.5px solid #00f2fe' : '1px solid transparent',
                background: !flagMode ? 'rgba(0, 242, 254, 0.22)' : 'transparent',
                color: !flagMode ? '#00f2fe' : 'var(--text-muted)',
                fontWeight: '800',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: !flagMode ? '0 0 12px rgba(0, 242, 254, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              ⛏️ Kare Aç (Normal Mod)
            </button>

            <button
              onClick={() => setFlagMode(true)}
              style={{
                flex: 1,
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                border: flagMode ? '1.5px solid #ef4444' : '1px solid transparent',
                background: flagMode ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                color: flagMode ? '#f87171' : 'var(--text-muted)',
                fontWeight: '800',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: flagMode ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Flag size={14} /> Bayrak Modu ({flaggedCount}/{MINE_COUNT})
            </button>
          </div>

          {/* Quantum Powers Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '0.85rem', justifyContent: 'center' }}>
            <button
              disabled={energy < 40}
              onClick={activateTimeFreeze}
              style={{
                flex: 1,
                padding: '0.5rem 0.7rem',
                borderRadius: '8px',
                border: '1.5px solid #00f2fe',
                background: energy >= 40 ? 'rgba(0, 242, 254, 0.18)' : 'rgba(255,255,255,0.02)',
                color: energy >= 40 ? '#00f2fe' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: energy >= 40 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <Clock size={14} /> Zaman Dondur (40⚡)
            </button>

            <button
              disabled={energy < 60}
              onClick={activateQuantumScanner}
              style={{
                flex: 1,
                padding: '0.5rem 0.7rem',
                borderRadius: '8px',
                border: '1.5px solid #c084fc',
                background: energy >= 60 ? 'rgba(192, 132, 252, 0.18)' : 'rgba(255,255,255,0.02)',
                color: energy >= 60 ? '#c084fc' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: energy >= 60 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <Compass size={14} /> Kuantum Tarayıcı (60⚡)
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '0.65rem' }}>
            {message}
          </div>
        </>
      )}

      {/* Minesweeper Grid: Always visible during playing, won, and lost! */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: '3px',
        background: 'rgba(0,0,0,0.4)',
        padding: '8px',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid rgba(255,255,255,0.1)',
        marginBottom: '1rem',
        aspectRatio: '1'
      }}>
        {board.map((row, r) => row.map((cell, c) => {
          let cellBg = 'rgba(255, 255, 255, 0.08)';
          let content = null;
          let textColor = '#fff';

          if (cell.isRevealed) {
            if (cell.isDisarmed) {
              cellBg = 'rgba(16, 185, 129, 0.35)';
              content = '🛡️';
              textColor = '#10b981';
            } else if (cell.isHit || cell.isExploded) {
              cellBg = 'rgba(239, 68, 68, 0.9)';
              content = '💥';
            } else if (cell.isMine) {
              cellBg = 'rgba(239, 68, 68, 0.5)';
              content = '💣';
            } else {
              cellBg = 'rgba(0, 0, 0, 0.5)';
              if (cell.adjacentMines > 0) {
                content = cell.adjacentMines;
                const colors = ['', '#38bdf8', '#10b981', '#f43f5e', '#a855f7', '#fbbf24'];
                textColor = colors[cell.adjacentMines] || '#fff';
              }
            }
          } else if (cell.isFlagged) {
            cellBg = 'rgba(239, 68, 68, 0.25)';
            content = '🚩';
          } else if (cell.countdown !== null && cell.isMine && cell.isRevealed) {
            content = `⏳${cell.countdown}`;
          }

          const isClickable = phase === 'playing' && !cell.isRevealed;

          return (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              onContextMenu={(e) => handleCellRightClick(e, r, c)}
              style={{
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: cellBg,
                color: textColor,
                fontSize: '1.05rem',
                fontWeight: '900',
                cursor: isClickable ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.1s'
              }}
            >
              {content}
            </button>
          );
        }))}
      </div>
    </>
  )}

    </div>
  );
}
