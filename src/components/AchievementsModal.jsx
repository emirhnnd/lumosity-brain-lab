import React, { useState } from 'react';
import { Trophy, Award, CheckCircle2, Lock, X, Zap, Sparkles, Filter } from 'lucide-react';
import { ACHIEVEMENTS_CONFIG } from '../services/storageService';

export default function AchievementsModal({ userData, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterState, setFilterState] = useState('all'); // all | unlocked | locked

  const userAchievements = userData.achievements || {};
  const unlockedCount = ACHIEVEMENTS_CONFIG.filter(a => userAchievements[a.id]?.unlocked).length;
  const totalCount = ACHIEVEMENTS_CONFIG.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: 'all', label: `Tümü (${totalCount})` },
    { id: 'flash', label: '⚡ Flaş & Hız' },
    { id: 'math', label: '🧮 Matematik' },
    { id: 'strategy', label: '♟️ Strateji' },
    { id: 'flexibility', label: '🔄 Esneklik' },
    { id: 'general', label: '🌟 Genel & Seri' },
  ];

  const filteredAchievements = ACHIEVEMENTS_CONFIG.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    const isUnlocked = !!userAchievements[a.id]?.unlocked;
    if (filterState === 'unlocked' && !isUnlocked) return false;
    if (filterState === 'locked' && isUnlocked) return false;
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content anim-pop" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '780px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
            }}>
              <Trophy size={26} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Bilişsel Başarımlar & Rozetler</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Zihnini zorla, özel unvanların ve bonus XP rozetlerinin kilidini aç!
              </p>
            </div>
          </div>

          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.45rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Top Progress Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(99,102,241,0.08) 100%)',
          border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#fbbf24" />
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fbbf24' }}>
                Genel İlerleme: {unlockedCount} / {totalCount} Rozet
              </span>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-light)' }}>
              %{completionPercent}
            </span>
          </div>

          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${completionPercent}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #10b981)',
              transition: 'width 0.4s ease',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
            }} />
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.2rem' }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
            <button
              onClick={() => setFilterState('all')}
              style={{
                background: filterState === 'all' ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none',
                color: filterState === 'all' ? '#fff' : 'var(--text-muted)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterState('unlocked')}
              style={{
                background: filterState === 'unlocked' ? 'rgba(16,185,129,0.25)' : 'transparent',
                border: 'none',
                color: filterState === 'unlocked' ? '#10b981' : 'var(--text-muted)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Açılanlar
            </button>
            <button
              onClick={() => setFilterState('locked')}
              style={{
                background: filterState === 'locked' ? 'rgba(239,68,68,0.2)' : 'transparent',
                border: 'none',
                color: filterState === 'locked' ? '#f87171' : 'var(--text-muted)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Kilitliler
            </button>
          </div>

        </div>

        {/* Achievement Grid Scrollable */}
        <div style={{
          overflowY: 'auto',
          paddingRight: '0.4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '0.85rem',
          flex: 1
        }}>
          {filteredAchievements.map(ach => {
            const isUnlocked = !!userAchievements[ach.id]?.unlocked;
            return (
              <div
                key={ach.id}
                style={{
                  background: isUnlocked 
                    ? 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(16,185,129,0.08) 100%)' 
                    : 'rgba(0,0,0,0.2)',
                  border: isUnlocked 
                    ? '1.5px solid rgba(251,191,36,0.4)' 
                    : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                  position: 'relative',
                  opacity: isUnlocked ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                  boxShadow: isUnlocked ? '0 4px 15px rgba(251,191,36,0.1)' : 'none'
                }}
              >
                {/* Badge Icon */}
                <div style={{
                  fontSize: '2.2rem',
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-md)',
                  background: isUnlocked 
                    ? 'rgba(251,191,36,0.18)' 
                    : 'rgba(255,255,255,0.04)',
                  border: isUnlocked 
                    ? '1px solid rgba(251,191,36,0.4)' 
                    : '1px dashed rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  filter: isUnlocked ? 'none' : 'grayscale(100%)'
                }}>
                  {ach.icon}
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      margin: 0,
                      fontWeight: '800',
                      color: isUnlocked ? '#fbbf24' : 'var(--text-secondary)'
                    }}>
                      {ach.title}
                    </h4>

                    {isUnlocked ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: '#10b981', fontWeight: '800' }}>
                        <CheckCircle2 size={13} /> Açıldı
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <Lock size={12} /> Kilitli
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                    {ach.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: isUnlocked ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                      color: isUnlocked ? '#10b981' : 'var(--text-muted)',
                      border: `1px solid ${isUnlocked ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`
                    }}>
                      +{ach.xpReward} XP
                    </span>

                    {isUnlocked && userAchievements[ach.id]?.unlockedAt && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        ✓ Kazanıldı
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
