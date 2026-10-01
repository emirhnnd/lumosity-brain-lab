import React, { useState, useEffect } from 'react';
import { Swords, Shield, Zap, Flame, EyeOff, Snowflake, Trophy, Bot, User, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

const AI_BOTS = [
  { name: 'Acemi Sparky', level: 1, avatar: '🤖', reactionMs: 2500, hp: 100 },
  { name: 'Strakov Nöron', level: 5, avatar: '⚡', reactionMs: 1800, hp: 120 },
  { name: 'Kuantum Zihin', level: 10, avatar: '🛸', reactionMs: 1200, hp: 150 }
];

export default function PvpArena({ userData, setUserData }) {
  const [selectedBot, setSelectedBot] = useState(AI_BOTS[1]);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [botHp, setBotHp] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(50);
  const [botEnergy, setBotEnergy] = useState(0);

  // Active Spell Effects State
  const [isBotFrozen, setIsBotFrozen] = useState(false);
  const [isPlayerBlurred, setIsPlayerBlurred] = useState(false);
  const [playerShield, setPlayerShield] = useState(false);
  const [botShield, setBotShield] = useState(false);

  // Match Challenge State
  const [challenge, setChallenge] = useState(null);
  const [battleLog, setBattleLog] = useState(['Arena savaşı için rakibini seç ve savaşı başlat!']);
  const [winner, setWinner] = useState(null);

  // Generate continuous math/color fast questions for PvP strike
  const generatePvPChallenge = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const isMath = Math.random() > 0.5;

    if (isMath) {
      const isAdd = Math.random() > 0.5;
      const target = isAdd ? num1 + num2 : num1 + num2 + Math.floor(Math.random() * 5);
      const isCorrect = target === num1 + num2;

      setChallenge({
        type: 'MATH',
        text: `${num1} + ${num2} = ${target}?`,
        correctAnswer: isCorrect ? 'DOĞRU' : 'YANLIŞ'
      });
    } else {
      const colors = ['#ef4444', '#3b82f6', '#10b981'];
      const names = ['Kırmızı', 'Mavi', 'Yeşil'];
      const cIdx = Math.floor(Math.random() * 3);
      const nIdx = Math.floor(Math.random() * 3);

      setChallenge({
        type: 'COLOR',
        text: names[nIdx],
        color: colors[cIdx],
        correctAnswer: cIdx === nIdx ? 'EŞLEŞTİ' : 'EŞLEŞMEDİ'
      });
    }
  };

  // AI Automatic Attack Loop
  useEffect(() => {
    let aiTimer;
    if (isBattleActive && !winner && !isBotFrozen) {
      aiTimer = setInterval(() => {
        // AI makes a move
        const aiHit = Math.random() > 0.3; // 70% accuracy
        if (aiHit) {
          const dmg = Math.floor(Math.random() * 12) + 8;
          if (playerShield) {
            setPlayerShield(false);
            addLog(`🛡️ Kalkanın ${selectedBot.name}'in ${dmg} hasarlık saldırısını engelledi!`);
          } else {
            setPlayerHp(prev => {
              const next = Math.max(0, prev - dmg);
              if (next === 0) handleGameOver(selectedBot.name);
              return next;
            });
            soundService.error();
            addLog(`💥 ${selectedBot.name} sana ${dmg} hasar vurdu!`);
          }
        }

        // AI Spell Cast logic
        if (Math.random() > 0.6) {
          setIsPlayerBlurred(true);
          addLog(`🌫️ ${selectedBot.name} Sis Bombası attı! Ekranın bulandı!`);
          setTimeout(() => setIsPlayerBlurred(false), 3000);
        }
      }, selectedBot.reactionMs);
    }
    return () => clearInterval(aiTimer);
  }, [isBattleActive, winner, isBotFrozen, selectedBot, playerShield]);

  const startBattle = () => {
    soundService.click();
    setPlayerHp(100);
    setBotHp(selectedBot.hp);
    setPlayerEnergy(50);
    setBotEnergy(0);
    setWinner(null);
    setIsBotFrozen(false);
    setIsPlayerBlurred(false);
    setPlayerShield(false);
    setBotShield(false);
    setBattleLog([`⚔️ Düello başladı! Rakip: ${selectedBot.name}`]);
    setIsBattleActive(true);
    generatePvPChallenge();
  };

  const handlePlayerAnswer = (userAns) => {
    if (!isBattleActive || !challenge || winner) return;

    if (userAns === challenge.correctAnswer) {
      soundService.success();
      const dmg = 15;

      if (botShield) {
        setBotShield(false);
        addLog(`🛡️ ${selectedBot.name}'in kalkanı kırıldı!`);
      } else {
        setBotHp(prev => {
          const next = Math.max(0, prev - dmg);
          if (next === 0) handleGameOver(userData.profile.name);
          return next;
        });
        addLog(`⚡ Hızlı cevap! ${selectedBot.name}'e ${dmg} vurdun!`);
      }

      setPlayerEnergy(e => Math.min(100, e + 20));
    } else {
      soundService.error();
      addLog(`❌ Hatalı cevap! Iskaladın.`);
    }

    generatePvPChallenge();
  };

  // Player Spell Cast Handlers
  const castFreeze = () => {
    if (playerEnergy < 30 || isBotFrozen) return;
    soundService.spellCast();
    setPlayerEnergy(e => e - 30);
    setIsBotFrozen(true);
    addLog(`❄️ ZAMAN DONDURMA! ${selectedBot.name} 4 saniye boyunca donduruldu!`);
    setTimeout(() => setIsBotFrozen(false), 4000);
  };

  const castShield = () => {
    if (playerEnergy < 25 || playerShield) return;
    soundService.spellCast();
    setPlayerEnergy(e => e - 25);
    setPlayerShield(true);
    addLog(`🛡️ ZİHİN KALKANI AÇILDI! Bir sonraki saldırı engellenecek.`);
  };

  const castMindBlast = () => {
    if (playerEnergy < 50) return;
    soundService.spellCast();
    setPlayerEnergy(e => e - 50);
    const dmg = 30;
    setBotHp(prev => {
      const next = Math.max(0, prev - dmg);
      if (next === 0) handleGameOver(userData.profile.name);
      return next;
    });
    addLog(`💥 KRİTİK ZİHİN PATLAMASI! ${selectedBot.name}'e ${dmg} KRİTİK HASAR!`);
  };

  const addLog = (msg) => {
    setBattleLog(prev => [msg, ...prev.slice(0, 5)]);
  };

  const handleGameOver = (winnerName) => {
    setIsBattleActive(false);
    setWinner(winnerName);

    if (winnerName === userData.profile.name) {
      soundService.levelUp();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      const pvpWins = userData.pvp.wins + 1;
      const pvpTrophies = userData.pvp.trophies + 25;
      const updated = {
        ...userData,
        pvp: { ...userData.pvp, wins: pvpWins, trophies: pvpTrophies }
      };
      setUserData(updated);
    } else {
      soundService.error();
      const pvpLosses = userData.pvp.losses + 1;
      const updated = {
        ...userData,
        pvp: { ...userData.pvp, losses: pvpLosses }
      };
      setUserData(updated);
    }
  };

  return (
    <div className="glass-card anim-pop" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(245,158,11,0.2) 100%)',
        border: '1px solid rgba(239,68,68,0.4)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#ef4444', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: '#fff' }}>
            <Swords size={28} />
          </div>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.2rem' }}>Lumosity'de Olmayan Dev Yenilik!</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Canlı 1v1 PvP Zihin Düellosu</h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontWeight: '700', fontSize: '0.9rem' }}>
          <div>🏆 Kupalar: <span style={{ color: 'var(--warning)' }}>{userData.pvp.trophies}</span></div>
          <div>⚔️ Zaferler: <span style={{ color: 'var(--success)' }}>{userData.pvp.wins}</span></div>
          <div>💀 Yenilgiler: <span style={{ color: 'var(--danger)' }}>{userData.pvp.losses}</span></div>
        </div>
      </div>

      {!isBattleActive && !winner ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <h3 style={{ marginBottom: '1rem' }}>Savaşmak İstediğin Yapay Zeka Şampiyonunu Seç:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {AI_BOTS.map((bot) => (
              <div
                key={bot.name}
                onClick={() => setSelectedBot(bot)}
                className="glass-card glass-card-hover"
                style={{
                  cursor: 'pointer',
                  borderColor: selectedBot.name === bot.name ? 'var(--accent-light)' : 'var(--border-color)',
                  background: selectedBot.name === bot.name ? 'var(--bg-card-hover)' : 'var(--bg-card)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{bot.avatar}</div>
                <h4 style={{ fontSize: '1.1rem' }}>{bot.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hız: {bot.reactionMs}ms | HP: {bot.hp}</p>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={startBattle} style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)' }}>
            <Swords size={24} /> Düelloyu Başlat!
          </button>
        </div>
      ) : (
        <div>
          {/* Health Bars & Battle Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            
            {/* Player Side */}
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: '700' }}>
                <span>{userData.profile.avatar} {userData.profile.name} (Sen)</span>
                <span style={{ color: 'var(--success)' }}>{playerHp}/100 HP</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${playerHp}%`, height: '100%', background: '#10b981', transition: 'width 0.3s' }} />
              </div>
              
              {/* Energy Bar */}
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <Zap size={14} color="#f59e0b" /> Enerji: {playerEnergy}/100
              </div>
            </div>

            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ef4444' }}>VS</div>

            {/* Bot Side */}
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: '700' }}>
                <span>{selectedBot.avatar} {selectedBot.name}</span>
                <span style={{ color: 'var(--danger)' }}>{botHp}/{selectedBot.hp} HP</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${(botHp / selectedBot.hp) * 100}%`, height: '100%', background: '#ef4444', transition: 'width 0.3s' }} />
              </div>
              {isBotFrozen && <div className="badge badge-cyan" style={{ marginTop: '0.4rem' }}>❄️ DONDURULDU!</div>}
            </div>

          </div>

          {/* Spell Action Card Bar */}
          {isBattleActive && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={castFreeze} disabled={playerEnergy < 30 || isBotFrozen} style={{ opacity: playerEnergy >= 30 ? 1 : 0.5 }}>
                <Snowflake size={16} color="#38bdf8" /> Dondur (30 ⚡)
              </button>
              <button className="btn-secondary" onClick={castShield} disabled={playerEnergy < 25 || playerShield} style={{ opacity: playerEnergy >= 25 ? 1 : 0.5 }}>
                <Shield size={16} color="#10b981" /> Kalkan (25 ⚡)
              </button>
              <button className="btn-secondary" onClick={castMindBlast} disabled={playerEnergy < 50} style={{ opacity: playerEnergy >= 50 ? 1 : 0.5 }}>
                <Flame size={16} color="#ef4444" /> Kritik Zihin Patlaması (50 ⚡)
              </button>
            </div>
          )}

          {/* Active Question Arena */}
          {isBattleActive && challenge && (
            <div className={`glass-card ${isPlayerBlurred ? 'anim-shake' : ''}`} style={{
              textAlign: 'center',
              padding: '2rem',
              marginBottom: '1.5rem',
              filter: isPlayerBlurred ? 'blur(6px)' : 'none',
              transition: 'filter 0.3s'
            }}>
              <h3 style={{ fontSize: '2rem', color: challenge.color || 'var(--accent-light)', marginBottom: '1.5rem' }}>
                {challenge.text}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {challenge.type === 'MATH' ? (
                  <>
                    <button className="btn-primary" onClick={() => handlePlayerAnswer('DOĞRU')} style={{ width: '140px', padding: '1rem', background: '#10b981' }}>DOĞRU</button>
                    <button className="btn-primary" onClick={() => handlePlayerAnswer('YANLIŞ')} style={{ width: '140px', padding: '1rem', background: '#ef4444' }}>YANLIŞ</button>
                  </>
                ) : (
                  <>
                    <button className="btn-primary" onClick={() => handlePlayerAnswer('EŞLEŞTİ')} style={{ width: '140px', padding: '1rem', background: '#10b981' }}>EŞLEŞTİ</button>
                    <button className="btn-primary" onClick={() => handlePlayerAnswer('EŞLEŞMEDİ')} style={{ width: '140px', padding: '1rem', background: '#ef4444' }}>EŞLEŞMEDİ</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Winner Result Modal */}
          {winner && (
            <div className="glass-card anim-pop" style={{ textAlign: 'center', padding: '2.5rem', marginBottom: '1.5rem' }}>
              <Trophy size={64} color={winner === userData.profile.name ? '#f59e0b' : '#ef4444'} style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {winner === userData.profile.name ? '🎉 ZAFER SENİN!' : '💀 YENİLGİ!'}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {winner === userData.profile.name ? '+25 PvP Kupası kazandın!' : 'Daha hızlı ve dikkatli olmalısın.'}
              </p>
              <button className="btn-primary" onClick={startBattle} style={{ padding: '0.8rem 2rem' }}>
                Yeniden Savaş
              </button>
            </div>
          )}

          {/* Battle Feed Log */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Canlı Savaş Akışı:</strong>
            {battleLog.map((log, i) => (
              <div key={i} style={{ marginTop: '3px' }}>{log}</div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
