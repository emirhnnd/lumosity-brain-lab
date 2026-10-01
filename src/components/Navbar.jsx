import React, { useState } from 'react';
import { Sparkles, Flame, Shield, Volume2, VolumeX, BarChart2, Palette, Trophy, Users, Check, Award } from 'lucide-react';
import { soundService } from '../services/soundService';

export default function Navbar({ userData, setUserData, onOpenAnalytics, onOpenStreakShop, onOpenLeaderboard, onOpenFriends, onOpenAchievements, activeTab, setActiveTab }) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [soundOn, setSoundOn] = useState(soundService.enabled);

  const toggleSound = () => {
    soundService.enabled = !soundService.enabled;
    setSoundOn(soundService.enabled);
  };

  const changeTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    const updated = { ...userData, profile: { ...userData.profile, theme: themeName } };
    setUserData(updated);
    setShowThemeMenu(false);
  };

  const currentLevelXpMax = (userData?.profile?.level || 1) * 200;
  const xpPercent = Math.min(100, Math.round(((userData?.profile?.xp || 0) / currentLevelXpMax) * 100));

  const currentTheme = userData?.profile?.theme || 'oceanic';
  const userAchievements = userData?.achievements || {};
  const unlockedAchCount = Object.keys(userAchievements).filter(k => userAchievements[k]?.unlocked).length;

  return (
    <header className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-xl)', position: 'relative', zIndex: 50, overflow: 'visible' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand: Synaptix */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '0.7rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 4px 20px var(--accent-glow)'
          }}>
            <Sparkles size={28} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', margin: 0, letterSpacing: '-0.03em', fontWeight: '900' }} className="gradient-text">
              SYNAPTIX
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Nöro-Bilişsel Zihin Laboratuvarı</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          <button
            className={activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            Ana Panel
          </button>
          <button
            className={activeTab === 'games' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('games')}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            Oyunlar (18)
          </button>
          <button
            className={activeTab === 'pvp' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('pvp')}
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              background: activeTab === 'pvp' ? 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)' : 'rgba(239, 68, 68, 0.15)',
              color: activeTab === 'pvp' ? '#fff' : '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}
          >
            ⚔️ PvP Düello
          </button>
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Social Friends Hub */}
          <button
            className="btn-secondary"
            onClick={onOpenFriends}
            title="Arkadaş Listesi ve Sosyal Hub"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Users size={16} color="var(--accent-light)" />
            <span>Arkadaşlar ({userData?.friends?.length || 0})</span>
          </button>

          {/* Social Scoreboard Button */}
          <button
            className="btn-secondary"
            onClick={onOpenLeaderboard}
            title="Sosyal Liderlik Tablosu"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Trophy size={16} color="#fbbf24" />
            <span>Skor Tablosu</span>
          </button>

          {/* Achievements / Rozetler Button */}
          <button
            className="btn-secondary"
            onClick={onOpenAchievements}
            title="Bilişsel Başarımlar ve Rozetler"
            style={{
              padding: '0.5rem 0.8rem',
              fontSize: '0.85rem',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              background: 'rgba(251, 191, 36, 0.08)'
            }}
          >
            <Award size={16} color="#fbbf24" />
            <span>Rozetler ({unlockedAchCount}/20)</span>
          </button>

          {/* Streak & Freeze Badge */}
          <div 
            onClick={onOpenStreakShop}
            title="Seri Dondurucu ve Seri Durumu"
            className="badge badge-gold"
            style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Flame size={16} fill="#fbbf24" color="#fbbf24" />
            <span>{userData?.profile?.streak || 0} Gün</span>
            {(userData?.profile?.streakFreezeCount || 0) > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '0.3rem', color: '#10b981' }}>
                <Shield size={14} fill="#10b981" color="#10b981" />
                <span style={{ fontSize: '0.75rem', marginLeft: '2px' }}>x{userData.profile.streakFreezeCount}</span>
              </span>
            )}
          </div>

          {/* Sound Toggle */}
          <button 
            className="btn-secondary" 
            onClick={toggleSound} 
            title={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            style={{ padding: '0.5rem' }}
          >
            {soundOn ? <Volume2 size={18} color="var(--accent-light)" /> : <VolumeX size={18} color="var(--text-muted)" />}
          </button>

          {/* Theme Palette Dropdown Button */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn-secondary" 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Tema Değiştir"
              style={{
                padding: '0.55rem',
                borderColor: showThemeMenu ? 'var(--accent-light)' : 'var(--border-color)',
                boxShadow: showThemeMenu ? '0 0 15px var(--accent-glow)' : 'none'
              }}
            >
              <Palette size={20} color="var(--accent-light)" />
            </button>

            {showThemeMenu && (
              <>
                <div 
                  onClick={() => setShowThemeMenu(false)} 
                  style={{ position: 'fixed', inset: 0, zIndex: 998 }} 
                />

                <div 
                  className="glass-card anim-pop" 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    zIndex: 999,
                    width: '210px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-accent)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.2rem', paddingLeft: '0.4rem' }}>
                    TEMA SEÇİNİZ
                  </div>

                  <button 
                    className="btn-secondary" 
                    onClick={() => changeTheme('oceanic')}
                    style={{
                      width: '100%',
                      justify: 'space-between',
                      background: currentTheme === 'oceanic' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)',
                      color: currentTheme === 'oceanic' ? '#fff' : 'inherit'
                    }}
                  >
                    <span>🌊 Okyanus Slate</span>
                    {currentTheme === 'oceanic' && <Check size={16} />}
                  </button>

                  <button 
                    className="btn-secondary" 
                    onClick={() => changeTheme('solar')}
                    style={{
                      width: '100%',
                      justify: 'space-between',
                      background: currentTheme === 'solar' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)',
                      color: currentTheme === 'solar' ? '#fff' : 'inherit'
                    }}
                  >
                    <span>☀️ Gün Işığı (Açık)</span>
                    {currentTheme === 'solar' && <Check size={16} />}
                  </button>

                  <button 
                    className="btn-secondary" 
                    onClick={() => changeTheme('mint')}
                    style={{
                      width: '100%',
                      justify: 'space-between',
                      background: currentTheme === 'mint' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)',
                      color: currentTheme === 'mint' ? '#fff' : 'inherit'
                    }}
                  >
                    <span>🌿 Siber Nane</span>
                    {currentTheme === 'mint' && <Check size={16} />}
                  </button>

                  <button 
                    className="btn-secondary" 
                    onClick={() => changeTheme('nordic')}
                    style={{
                      width: '100%',
                      justify: 'space-between',
                      background: currentTheme === 'nordic' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)',
                      color: currentTheme === 'nordic' ? '#fff' : 'inherit'
                    }}
                  >
                    <span>❄️ İskandinav (Açık)</span>
                    {currentTheme === 'nordic' && <Check size={16} />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Analytics Modal Launcher */}
          <button 
            className="btn-secondary" 
            onClick={onOpenAnalytics}
            title="Detaylı Performans ve Beyin Yaşı Analizi"
            style={{ padding: '0.5rem' }}
          >
            <BarChart2 size={18} color="var(--accent-light)" />
          </button>

        </div>

      </div>
    </header>
  );
}
