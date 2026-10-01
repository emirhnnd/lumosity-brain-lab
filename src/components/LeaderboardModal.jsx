import React, { useState } from 'react';
import { X, Trophy, Users, Globe, Award, Medal, Flame } from 'lucide-react';

const GAMES_LIST = [
  { id: 'kuantum_satranc', name: 'Kuantum Satranç' },
  { id: 'zihin_matrisi', name: 'Zihin Matrisi' },
  { id: 'tren_yolu', name: 'Tren Yolu & Makas' },
  { id: 'simsek_refleks', name: 'Şimşek Refleks' },
  { id: 'renk_matrisi', name: 'Direnç & Odak' },
  { id: 'yon_ve_akis', name: 'Yön ve Akış' },
  { id: 'matematik_firtinasi', name: 'Matematik Fırtınası' },
  { id: 'desen_rozet', name: 'Desen Çözücü' }
];

export default function LeaderboardModal({ userData, onClose }) {
  const [selectedGame, setSelectedGame] = useState('kuantum_satranc');

  const userScore = userData.highScores[selectedGame] || 0;
  
  const entries = [
    { name: userData.profile.name, avatar: userData.profile.avatar, score: userScore, isUser: true, level: userData.profile.level, streak: userData.profile.streak },
    ...userData.friends.map(f => ({
      name: f.name,
      avatar: f.avatar,
      score: f.scores[selectedGame] || 0,
      isUser: false,
      level: f.level,
      streak: f.streak
    }))
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content anim-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy size={28} color="#fbbf24" />
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Sosyal Skor & Liderlik Tablosu</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Arkadaşların ve global oyuncularla rekabet et</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Game Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          {GAMES_LIST.map(g => (
            <button
              key={g.id}
              className={selectedGame === g.id ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setSelectedGame(g.id)}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', flexShrink: 0 }}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Score Board Table */}
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
            <span>SIRALAMA & OYUNCU</span>
            <span>REKOR SKOR</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.6rem' }}>
            {entries.map((item, idx) => {
              const rank = idx + 1;
              let medalIcon = `#${rank}`;
              if (rank === 1) medalIcon = '🥇';
              if (rank === 2) medalIcon = '🥈';
              if (rank === 3) medalIcon = '🥉';

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    background: item.isUser ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                    color: item.isUser ? '#ffffff' : 'inherit',
                    border: item.isUser ? '1px solid #ffffff' : '1px solid transparent',
                    boxShadow: item.isUser ? '0 8px 20px var(--accent-glow)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: '900', minWidth: '30px' }}>{medalIcon}</span>
                    <span style={{ fontSize: '1.5rem' }}>{item.avatar}</span>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                        {item.name} {item.isUser && '(Sen)'}
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', gap: '0.6rem' }}>
                        <span>Lvl {item.level}</span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <Flame size={12} color="#fbbf24" fill="#fbbf24" /> {item.streak} Gün Seri
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: '900', fontSize: '1.2rem' }}>
                    {item.score} <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Puan</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
