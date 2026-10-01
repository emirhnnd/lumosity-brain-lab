import React, { useState, useEffect } from 'react';
import { Play, Award, RotateCcw, Sparkles } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GRID_SIZE = 8;

const PIECE_TEMPLATES = [
  { shape: [[1]], color: '#38bdf8' },
  { shape: [[1, 1]], color: '#818cf8' },
  { shape: [[1], [1]], color: '#818cf8' },
  { shape: [[1, 1, 1]], color: '#c084fc' },
  { shape: [[1], [1], [1]], color: '#c084fc' },
  { shape: [[1, 1], [1, 1]], color: '#fbbf24' },
  { shape: [[1, 1, 1], [1, 1, 1]], color: '#f97316' },
  { shape: [[1, 0], [1, 1]], color: '#10b981' },
  { shape: [[0, 1], [1, 1]], color: '#10b981' },
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#f43f5e' },
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#34d399' },
];

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function getRandomPieces() {
  return [0, 1, 2].map(() => {
    const template = PIECE_TEMPLATES[Math.floor(Math.random() * PIECE_TEMPLATES.length)];
    return { ...template, id: Math.random() };
  });
}

export default function BlokUstasi({ onGameComplete }) {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | playing | gameover

  const startGame = () => {
    setGrid(createEmptyGrid());
    setPieces(getRandomPieces());
    setSelectedPiece(null);
    setScore(0);
    setLinesCleared(0);
    setPhase('playing');
    soundService.levelUp?.();
  };

  const canPlace = (r, c, shape) => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const targetR = r + i;
          const targetC = c + j;
          if (targetR >= GRID_SIZE || targetC >= GRID_SIZE) return false;
          if (grid[targetR][targetC] !== null) return false;
        }
      }
    }
    return true;
  };

  const checkGameOver = (currentGrid, remainingPieces) => {
    if (remainingPieces.length === 0) return false;
    for (const p of remainingPieces) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          let fits = true;
          for (let i = 0; i < p.shape.length; i++) {
            for (let j = 0; j < p.shape[i].length; j++) {
              if (p.shape[i][j]) {
                const tr = r + i;
                const tc = c + j;
                if (tr >= GRID_SIZE || tc >= GRID_SIZE || currentGrid[tr][tc] !== null) {
                  fits = false;
                  break;
                }
              }
            }
            if (!fits) break;
          }
          if (fits) return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (r, c) => {
    if (phase !== 'playing' || !selectedPiece) return;

    if (canPlace(r, c, selectedPiece.shape)) {
      const newGrid = grid.map(row => [...row]);
      for (let i = 0; i < selectedPiece.shape.length; i++) {
        for (let j = 0; j < selectedPiece.shape[i].length; j++) {
          if (selectedPiece.shape[i][j]) {
            newGrid[r + i][c + j] = selectedPiece.color;
          }
        }
      }

      // Check for full rows and columns
      const fullRows = [];
      const fullCols = [];
      for (let i = 0; i < GRID_SIZE; i++) {
        if (newGrid[i].every(cell => cell !== null)) fullRows.push(i);
      }
      for (let j = 0; j < GRID_SIZE; j++) {
        let full = true;
        for (let i = 0; i < GRID_SIZE; i++) {
          if (newGrid[i][j] === null) { full = false; break; }
        }
        if (full) fullCols.push(j);
      }

      fullRows.forEach(rowIdx => {
        for (let j = 0; j < GRID_SIZE; j++) newGrid[rowIdx][j] = null;
      });
      fullCols.forEach(colIdx => {
        for (let i = 0; i < GRID_SIZE; i++) newGrid[i][colIdx] = null;
      });

      const totalLines = fullRows.length + fullCols.length;
      let points = 20;
      if (totalLines > 0) {
        points += totalLines * 100 * totalLines;
        setLinesCleared(l => l + totalLines);
        soundService.success?.();
      } else {
        soundService.click?.();
      }

      setScore(s => s + points);
      setGrid(newGrid);

      const nextPieces = pieces.filter(p => p.id !== selectedPiece.id);
      let finalPieces = nextPieces;
      if (nextPieces.length === 0) {
        finalPieces = getRandomPieces();
      }
      setPieces(finalPieces);
      setSelectedPiece(null);

      if (checkGameOver(newGrid, finalPieces)) {
        soundService.error?.();
        setPhase('gameover');
        if (onGameComplete) onGameComplete('blok_ustasi', 'mantik', score + points, linesCleared + totalLines);
      }
    } else {
      soundService.error?.();
    }
  };

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '540px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
          <Sparkles size={13} /> Problem Çözme & Uzamsal
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Blok Ustası (Block Champ)</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>
          Blokları 8x8 alana yerleştir, satır ve sütunları patlat!
        </p>
      </div>

      {phase === 'playing' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 Skor: {score}</span>
            <span style={{ color: 'var(--accent-light)' }}>💥 Patlayan: {linesCleared} Hat</span>
            <button onClick={startGame} className="btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
              <RotateCcw size={12} /> Yeniden
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '4px',
            background: 'rgba(10, 15, 30, 0.95)',
            padding: '8px',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid rgba(255,255,255,0.08)',
            marginBottom: '1.2rem',
            aspectRatio: '1',
          }}>
            {grid.map((row, r) => row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  borderRadius: '4px',
                  background: cell ? cell : 'rgba(255,255,255,0.04)',
                  boxShadow: cell ? `0 0 10px ${cell}` : 'none',
                  border: cell ? `1px solid ${cell}` : '1px solid rgba(255,255,255,0.03)',
                  cursor: selectedPiece ? 'pointer' : 'default',
                  transition: 'background 0.15s, transform 0.1s',
                }}
              />
            )))}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
            {selectedPiece ? 'Tahtada yerleştirmek istediğin kareye tıkla' : 'Aşağıdan bir blok seç:'}
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', alignItems: 'center', minHeight: '80px', background: 'rgba(0,0,0,0.2)', padding: '0.7rem', borderRadius: 'var(--radius-lg)' }}>
            {pieces.map(piece => {
              const isSelected = selectedPiece?.id === piece.id;
              return (
                <div
                  key={piece.id}
                  onClick={() => { setSelectedPiece(isSelected ? null : piece); soundService.click?.(); }}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isSelected ? 'var(--accent-light)' : 'rgba(255,255,255,0.1)'}`,
                    background: isSelected ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {piece.shape.map((row, ri) => (
                      <div key={ri} style={{ display: 'flex', gap: '3px' }}>
                        {row.map((val, ci) => (
                          <div
                            key={ci}
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '2px',
                              background: val ? piece.color : 'transparent',
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} />
              <h3>Hamle Kalmadı!</h3>
              <p style={{ color: 'var(--success)', fontWeight: '700', fontSize: '1.1rem' }}>Toplam Skor: {score}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Temizlenen Hat: {linesCleared}</p>
            </div>
          )}
          {phase === 'idle' && (
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Blokları 8x8 tahtaya yerleştir.<br />
              <strong>Yatay veya dikey çizgileri doldurarak yok et ve alan aç!</strong>
            </p>
          )}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}>
            <Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}
          </button>
        </div>
      )}
    </div>
  );
}
