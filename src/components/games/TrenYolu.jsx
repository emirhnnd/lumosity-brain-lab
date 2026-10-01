import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GAME_DURATION = 90;
const TRAIN_INTERVAL = 3500;
const COLORS = ['🔴','🔵','🟢','🟡'];
const COLOR_NAMES = { '🔴': 'Kırmızı', '🔵': 'Mavi', '🟢': 'Yeşil', '🟡': 'Sarı' };

let trainId = 0;

export default function TrenYolu({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [trains, setTrains] = useState([]);
  const [stations] = useState(() => COLORS.map((c, i) => ({ id: i, color: c, x: i * 22 + 8 })));
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const timerRef = useRef(null);
  const trainRef = useRef(null);
  const livesRef = useRef(5);

  const spawnTrain = useCallback(() => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const id = ++trainId;
    setTrains(prev => [...prev, { id, color, progress: 0, speed: 0.4 + Math.random() * 0.3 }]);
  }, []);

  const startGame = () => {
    setPhase('playing'); setScore(0); setLives(5); setTimeLeft(GAME_DURATION);
    setTrains([]); livesRef.current = 5; trainId = 0;
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); clearInterval(trainRef.current); setPhase('gameover'); return 0; }
        return t - 1;
      });
    }, 1000);
    trainRef.current = setInterval(spawnTrain, TRAIN_INTERVAL);
    spawnTrain();
    return () => { clearInterval(timerRef.current); clearInterval(trainRef.current); };
  }, [phase, spawnTrain]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const anim = setInterval(() => {
      setTrains(prev => {
        const updated = prev.map(t => ({ ...t, progress: t.progress + t.speed }));
        const escaped = updated.filter(t => t.progress >= 100);
        if (escaped.length > 0) {
          const nl = livesRef.current - escaped.length;
          livesRef.current = nl;
          setLives(nl);
          soundService.error?.();
          if (nl <= 0) { clearInterval(timerRef.current); clearInterval(trainRef.current); setPhase('gameover'); }
        }
        return updated.filter(t => t.progress < 100);
      });
    }, 50);
    return () => clearInterval(anim);
  }, [phase]);

  useEffect(() => {
    if (phase === 'gameover' && onGameComplete)
      onGameComplete('tren_yolu', 'dikkat', score, lives);
  }, [phase]); // eslint-disable-line

  const routeTrain = (targetTrainId, stationColor) => {
    setTrains(prev => {
      const train = prev.find(t => t.id === targetTrainId);
      if (!train) return prev;
      if (train.color === stationColor) {
        setScore(s => s + 150);
        soundService.success?.();
        return prev.filter(t => t.id !== targetTrainId);
      } else {
        soundService.error?.();
        const nl = livesRef.current - 1;
        livesRef.current = nl;
        setLives(nl);
        if (nl <= 0) { clearInterval(timerRef.current); clearInterval(trainRef.current); setPhase('gameover'); }
        return prev.filter(t => t.id !== targetTrainId);
      }
    });
  };

  // Keyboard 1-4 shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (phase !== 'playing') return;
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (keyMap[e.key] !== undefined && trains[0]) {
        routeTrain(trains[0].id, stations[keyMap[e.key]].color);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, trains, stations]);

  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>🚂 Dikkat & Planlama</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Tren Yolu</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Treni doğru istasyona yönlendir!</p>
      </div>

      {phase === 'playing' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span>{Array.from({ length: 5 }, (_, i) => i < lives ? '❤️' : '🖤').join('')}</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear', borderRadius: '3px' }} />
          </div>

          <div style={{ position: 'relative', height: '120px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.15)' }} />
            {trains.map(train => (
              <div key={train.id} style={{ position: 'absolute', bottom: '18px', left: `${train.progress}%`, fontSize: '2rem', transition: 'left 0.05s linear', cursor: 'pointer', userSelect: 'none' }}
                title={`${COLOR_NAMES[train.color]} treni`}>
                🚂{train.color}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Sıradaki treni doğru istasyon butonuna (veya 1-4 tuşlarına) basarak yönlendir:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {stations.map((st, idx) => (
              <button key={st.id} onClick={() => { const t = trains[0]; if (t) routeTrain(t.id, st.color); }} style={{ padding: '0.85rem 0.5rem', fontSize: '1.5rem', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-light)', fontWeight: '800' }}>[ {idx + 1} ]</span>
                🏢{st.color}
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{COLOR_NAMES[st.color]}</span>
              </button>
            ))}
          </div>

          {trains.length > 0 && (
            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#a5b4fc', textAlign: 'center' }}>
              ⚡ Sıradaki tren: {trains[0].color} {COLOR_NAMES[trains[0].color]} — İstasyona gönder!
            </div>
          )}
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} />
              <h3>Oyun Bitti!</h3>
              <p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score}</p>
            </div>
          )}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Gelen trenleri renklerine göre<br /><strong>doğru istasyona yönlendir!</strong></p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
