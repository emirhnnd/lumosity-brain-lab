import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import KuantumSatranc from './components/games/KuantumSatranc';
import ZihinMatrisi from './components/games/ZihinMatrisi';
import TrenYolu from './components/games/TrenYolu';
import SimsekRefleks from './components/games/SimsekRefleks';
import RenkMatrisi from './components/games/RenkMatrisi';
import YonVeAkis from './components/games/YonVeAkis';
import MatematikFirtinasi from './components/games/MatematikFirtinasi';
import DesenRozet from './components/games/DesenRozet';
import KelimeBalonlari from './components/games/KelimeBalonlari';
import ZihinGecis from './components/games/ZihinGecis';
import KartalGoz from './components/games/KartalGoz';
import TanidikYuzler from './components/games/TanidikYuzler';
import BlokUstasi from './components/games/BlokUstasi';
import NeuroFlash from './components/games/NeuroFlash';
import KorUcusLabirenti from './components/games/KorUcusLabirenti';
import ParadoksProtokolu from './components/games/ParadoksProtokolu';
import SozcukSimyasi from './components/games/SozcukSimyasi';
import KuantumMayin from './components/games/KuantumMayin';
import PvpArena from './components/games/PvpArena';
import AnalyticsModal from './components/AnalyticsModal';
import StreakFreezeModal from './components/StreakFreezeModal';
import LeaderboardModal from './components/LeaderboardModal';
import FriendsModal from './components/FriendsModal';
import AchievementsModal from './components/AchievementsModal';
import AmbientEdgeOverlay from './components/AmbientEdgeOverlay';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [userData, setUserData] = useState(() => storageService.getUserData());
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, games, pvp, active_game
  const [selectedGameId, setSelectedGameId] = useState(null);
  
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showStreakShop, setShowStreakShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [streakToast, setStreakToast] = useState(null);
  const [achievementToast, setAchievementToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userData.profile.theme || 'oceanic');
  }, [userData.profile.theme]);

  // Check streak status on mount
  useEffect(() => {
    const { streakNotification } = storageService.checkAndUpdateDailyStreak(userData);
    if (streakNotification) {
      setStreakToast(streakNotification.message);
      setTimeout(() => setStreakToast(null), 5000);
    }
  }, []);

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
    setActiveTab('active_game');
  };

  const handleGameComplete = (gameId, category, score, level) => {
    const { data, streakIncreased, currentStreak, newAchievements } = storageService.addGameResult(gameId, category, score, level);
    setUserData(data);

    if (newAchievements && newAchievements.length > 0) {
      const first = newAchievements[0];
      setAchievementToast(`🏆 YENİ BAŞARIM AÇILDI: ${first.icon} ${first.title}! (+${first.xpReward} XP)`);
      soundService.levelUp?.();
      setTimeout(() => setAchievementToast(null), 5500);
    } else if (streakIncreased) {
      setStreakToast(`🔥 Tebrikler! Günlük antrenmanın tamamlandı, serin ${currentStreak} güne yükseldi!`);
      setTimeout(() => setStreakToast(null), 4500);
    }
  };

  const handleStartPvPWithFriend = (friend) => {
    setShowFriends(false);
    setActiveTab('pvp');
  };

  const renderActiveGame = () => {
    switch (selectedGameId) {
      case 'kuantum_satranc':
        return <KuantumSatranc onGameComplete={handleGameComplete} />;
      case 'zihin_matrisi':
        return <ZihinMatrisi onGameComplete={handleGameComplete} />;
      case 'tren_yolu':
        return <TrenYolu onGameComplete={handleGameComplete} />;
      case 'simsek_refleks':
        return <SimsekRefleks onGameComplete={handleGameComplete} />;
      case 'renk_matrisi':
        return <RenkMatrisi onGameComplete={handleGameComplete} />;
      case 'yon_ve_akis':
        return <YonVeAkis onGameComplete={handleGameComplete} />;
      case 'matematik_firtinasi':
        return <MatematikFirtinasi onGameComplete={handleGameComplete} />;
      case 'desen_rozet':
        return <DesenRozet onGameComplete={handleGameComplete} />;
      case 'kelime_balonlari':
        return <KelimeBalonlari onGameComplete={handleGameComplete} />;
      case 'zihin_gecis':
        return <ZihinGecis onGameComplete={handleGameComplete} />;
      case 'kartal_goz':
        return <KartalGoz onGameComplete={handleGameComplete} />;
      case 'tanidik_yuzler':
        return <TanidikYuzler onGameComplete={handleGameComplete} />;
      case 'blok_ustasi':
        return <BlokUstasi onGameComplete={handleGameComplete} />;
      case 'neuro_flash':
        return <NeuroFlash onGameComplete={handleGameComplete} />;
      case 'kor_ucus_labirenti':
        return <KorUcusLabirenti onGameComplete={handleGameComplete} />;
      case 'paradoks_protokolu':
        return <ParadoksProtokolu onGameComplete={handleGameComplete} />;
      case 'sozcuk_simyasi':
        return <SozcukSimyasi onGameComplete={handleGameComplete} />;
      case 'kuantum_mayin':
        return <KuantumMayin onGameComplete={handleGameComplete} />;
      default:
        return <KuantumSatranc onGameComplete={handleGameComplete} />;
    }
  };

  return (
    <div className="app-container">
      {/* Ambient Edge Waves & Stress Pulse Overlay */}
      <AmbientEdgeOverlay selectedGameId={selectedGameId} isActive={activeTab === 'active_game'} />
      
      {/* Header */}
      <Navbar
        userData={userData}
        setUserData={setUserData}
        onOpenAnalytics={() => setShowAnalytics(true)}
        onOpenStreakShop={() => setShowStreakShop(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenFriends={() => setShowFriends(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Floating Achievement Toast Notification */}
      {achievementToast && (
        <div className="anim-pop" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.96) 0%, rgba(234, 88, 12, 0.96) 100%)',
          color: '#ffffff',
          padding: '0.85rem 1.8rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(251, 191, 36, 0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '800',
          fontSize: '0.98rem',
          border: '1.5px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(10px)'
        }}>
          <span>{achievementToast}</span>
          <button 
            onClick={() => setAchievementToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 0 0 0.5rem', opacity: 0.9, fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Streak Toast Notification */}
      {streakToast && (
        <div className="anim-pop" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
          color: '#ffffff',
          padding: '0.8rem 1.6rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '700',
          fontSize: '0.95rem',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <span>{streakToast}</span>
          <button 
            onClick={() => setStreakToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 0 0 0.5rem', opacity: 0.8 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main>
        {activeTab === 'dashboard' && (
          <Dashboard
            userData={userData}
            onSelectGame={handleSelectGame}
            onStartPvP={() => setActiveTab('pvp')}
            onOpenAnalytics={() => setShowAnalytics(true)}
            onOpenStreakShop={() => setShowStreakShop(true)}
          />
        )}

        {activeTab === 'games' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Tüm Bilişsel Oyun Kataloğu</h2>
            <Dashboard
              userData={userData}
              onSelectGame={handleSelectGame}
              onStartPvP={() => setActiveTab('pvp')}
              onOpenAnalytics={() => setShowAnalytics(true)}
              onOpenStreakShop={() => setShowStreakShop(true)}
            />
          </div>
        )}

        {activeTab === 'pvp' && (
          <PvpArena userData={userData} setUserData={setUserData} />
        )}

        {activeTab === 'active_game' && (
          <div>
            <button 
              className="btn-secondary" 
              onClick={() => setActiveTab('dashboard')}
              style={{ marginBottom: '1.5rem' }}
            >
              <ArrowLeft size={18} /> Ana Panele Dön
            </button>

            {renderActiveGame()}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAnalytics && (
        <AnalyticsModal
          userData={userData}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showStreakShop && (
        <StreakFreezeModal
          userData={userData}
          setUserData={setUserData}
          onClose={() => setShowStreakShop(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          userData={userData}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showFriends && (
        <FriendsModal
          userData={userData}
          setUserData={setUserData}
          onStartPvPWithFriend={handleStartPvPWithFriend}
          onClose={() => setShowFriends(false)}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          userData={userData}
          onClose={() => setShowAchievements(false)}
        />
      )}

    </div>
  );
}
