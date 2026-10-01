import React, { useState, useCallback } from 'react';
import { Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const FACES = [
  { id:1, emoji:'👨‍💼', name:'Ahmet Yılmaz' }, { id:2, emoji:'👩‍🔬', name:'Ayşe Demir' },
  { id:3, emoji:'👨‍🎨', name:'Mehmet Kaya' }, { id:4, emoji:'👩‍🏫', name:'Fatma Çelik' },
  { id:5, emoji:'👨‍🚀', name:'Ali Şahin' },  { id:6, emoji:'👩‍⚕️', name:'Zeynep Arslan' },
  { id:7, emoji:'👨‍🍳', name:'Hasan Doğan' },{ id:8, emoji:'👩‍💻', name:'Merve Aydın' },
  { id:9, emoji:'👨‍🔧', name:'Emre Polat' }, { id:10, emoji:'👩‍🎤', name:'Selin Koç' },
  { id:11, emoji:'👨‍🎓', name:'Burak Yıldız'},{ id:12, emoji:'👩‍🚒', name:'Cansu Güler' },
];

const SHOW_MS = 2500;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function TanidikYuzler({ onGameComplete }) {
  const [phase, setPhase] = useState('idle'); // idle|memorize|quiz|result|gameover
  const [batch, setBatch] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showFace, setShowFace] = useState(null);

  const batchSize = Math.min(2 + Math.floor(round / 2), 5);

  const startRound = useCallback((r) => {
    const pool = shuffle(FACES).slice(0, Math.min(2 + Math.floor(r / 2), 5));
    setBatch(pool); setQuizIdx(0); setPhase('memorize');

    pool.forEach((face, i) => {
      setTimeout(() => setShowFace(face), i * (SHOW_MS + 500));
      setTimeout(() => setShowFace(null), i * (SHOW_MS + 500) + SHOW_MS);
    });

    setTimeout(() => {
      const q = pool[0];
      const wrongNames = FACES.filter(f => !pool.find(p => p.id === f.id)).map(f => f.name);
      const opts = shuffle([q.name, ...shuffle(wrongNames).slice(0, 3)]);
      setOptions(opts); setPhase('quiz');
    }, pool.length * (SHOW_MS + 500) + 300);
  }, []);

  const startGame = () => { setScore(0); setLives(3); setRound(1); startRound(1); };

  const nextQuiz = (pool, idx, r) => {
    const next = idx + 1;
    if (next >= pool.length) {
      soundService.levelUp?.();
      const nr = r + 1; setRound(nr);
      setTimeout(() => startRound(nr), 600);
    } else {
      const q = pool[next];
      const wrongNames = FACES.filter(f => !pool.find(p => p.id === f.id)).map(f => f.name);
      const opts = shuffle([q.name, ...shuffle(wrongNames).slice(0, 3)]);
      setOptions(opts); setQuizIdx(next);
    }
  };

  const handleAnswer = (name) => {
    if (phase !== 'quiz' || feedback) return;
    const isCorrect = name === batch[quizIdx].name;
    if (isCorrect) {
      setScore(s => s + 150 + round * 50); setFeedback('correct'); soundService.success?.();
    } else {
      const nl = lives - 1; setLives(nl); setFeedback('wrong'); soundService.error?.();
      if (nl <= 0) { setTimeout(() => { setPhase('gameover'); if (onGameComplete) onGameComplete('tanidik_yuzler', 'hafiza', score, round); }, 800); return; }
    }
    setTimeout(() => { setFeedback(null); nextQuiz(batch, quizIdx, round); }, 700);
  };

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '460px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>👤 Hafıza & İsim</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Tanıdık Yüzler</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Yüzleri ve isimleri ezberle!</p>
      </div>

      {(phase === 'memorize' || phase === 'quiz') && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
          <span style={{ color: 'var(--accent-light)' }}>🎯 Tur {round}</span>
          <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
          <span>{Array.from({ length: 3 }, (_, i) => i < lives ? '❤️' : '🖤').join('')}</span>
        </div>
      )}

      {phase === 'memorize' && showFace && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700', marginBottom: '1rem' }}>👁️ Ezberle!</div>
          <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>{showFace.emoji}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-light)' }}>{showFace.name}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{batch.indexOf(showFace) + 1} / {batch.length}</div>
        </div>
      )}

      {phase === 'memorize' && !showFace && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <div style={{ color: 'var(--text-muted)' }}>Hazırlanıyor...</div>
        </div>
      )}

      {phase === 'quiz' && batch[quizIdx] && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', border: `2px solid ${feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.08)'}`, transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Bu kişinin adı ne?</div>
            <div style={{ fontSize: '5rem' }}>{batch[quizIdx].emoji}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{quizIdx + 1} / {batch.length}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)} style={{ padding: '0.85rem', fontSize: '0.85rem', fontWeight: '700', borderRadius: 'var(--radius-md)', border: '2px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && <div style={{ marginBottom: '1.5rem' }}><Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} /><h3>Oyun Bitti!</h3><p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score} · Tur: {round}</p></div>}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Yüzleri ve isimleri ezberle,<br /><strong>ardından soruları cevapla!</strong></p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
