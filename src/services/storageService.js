// LocalStorage Service with Social Friends & Leaderboard Integration

const STORAGE_KEY = 'lumosity_zihin_lab_user_data_v6';

const defaultFriends = [
  { id: 'f1', name: 'Selin Yılmaz', avatar: '👩‍🔬', level: 12, streak: 14, trophies: 580, brainAge: 21, scores: { zihin_matrisi: 1200, tren_yolu: 1500, simsek_refleks: 1800, renk_matrisi: 1400, yon_ve_akis: 1300, matematik_firtinasi: 1600, desen_rozet: 1500 }, status: 'online' },
  { id: 'f2', name: 'Can Demir', avatar: '⚡', level: 9, streak: 7, trophies: 420, brainAge: 24, scores: { zihin_matrisi: 980, tren_yolu: 1100, simsek_refleks: 1300, renk_matrisi: 1200, yon_ve_akis: 1050, matematik_firtinasi: 1250, desen_rozet: 1100 }, status: 'online' },
  { id: 'f3', name: 'Zeynep Kaya', avatar: '🦋', level: 15, streak: 21, trophies: 890, brainAge: 19, scores: { zihin_matrisi: 1650, tren_yolu: 1850, simsek_refleks: 2100, renk_matrisi: 1750, yon_ve_akis: 1600, matematik_firtinasi: 1900, desen_rozet: 1750 }, status: 'offline' },
  { id: 'f4', name: 'Yaşar Umut Girgin', avatar: '🦅', level: 11, streak: 9, trophies: 510, brainAge: 22, scores: { zihin_matrisi: 1100, tren_yolu: 1350, simsek_refleks: 1550, renk_matrisi: 1250, yon_ve_akis: 1150, matematik_firtinasi: 1400, desen_rozet: 1200 }, status: 'online' }
];

export const ACHIEVEMENTS_CONFIG = [
  // Neuro Flash & Hız
  {
    id: 'flash_starter',
    title: 'Flaş Kıvılcımı',
    desc: 'Neuro Flash oyununda ilk hız testini başarıyla tamamla.',
    icon: '⚡',
    category: 'flash',
    xpReward: 150
  },
  {
    id: 'flash_speed_demon',
    title: 'Işık Hızında Refleks',
    desc: 'Neuro Flash oyununda 850 veya daha yüksek skor elde et.',
    icon: '🏎️',
    category: 'flash',
    xpReward: 300
  },
  {
    id: 'flash_sub_400',
    title: 'Salise Avcısı',
    desc: 'Neuro Flash testinde 1000+ skor yaparak insanüstü hız dilimine gir.',
    icon: '⏱️',
    category: 'flash',
    xpReward: 400
  },
  {
    id: 'flash_bot_slayer',
    title: 'Yapay Zeka Fatihi',
    desc: 'Neuro Flash Bot Düellosu modunda yapay zekayı mağlup et.',
    icon: '🤖',
    category: 'flash',
    xpReward: 350
  },
  
  // Matematik Fırtınası
  {
    id: 'math_starter',
    title: 'Aritmetik Çırağı',
    desc: 'Matematik Fırtınası oyununda ilk testini tamamla.',
    icon: '🧮',
    category: 'math',
    xpReward: 150
  },
  {
    id: 'math_storm',
    title: 'Aritmetik Kasırgası',
    desc: 'Matematik Fırtınası\'nda 1000 veya üzeri skora ulaş.',
    icon: '🌪️',
    category: 'math',
    xpReward: 300
  },
  {
    id: 'math_combo_king',
    title: '5x Kombo Canavarı',
    desc: 'Matematik Fırtınası\'nda kesintisiz 5x maksimum kombo çarpanına ulaş.',
    icon: '🔥',
    category: 'math',
    xpReward: 400
  },
  {
    id: 'math_blitz',
    title: 'Zihinsel İşlemci',
    desc: 'Matematik Fırtınası\'nda tek oyunda 1500+ rekor skor kır.',
    icon: '⚡',
    category: 'math',
    xpReward: 500
  },

  // Mantık & Strateji
  {
    id: 'chess_mate',
    title: 'Kuantum Büyükustası',
    desc: 'Kuantum Satranç\'ta şah mat yaparak zafer kazan.',
    icon: '♟️',
    category: 'strategy',
    xpReward: 350
  },
  {
    id: 'mine_cleaner',
    title: 'Bomba İmha Uzmanı',
    desc: 'Kuantum Mayın Tarlası\'nı hiç patlamadan tamamen temizle.',
    icon: '💣',
    category: 'strategy',
    xpReward: 350
  },
  {
    id: 'blind_navigator',
    title: 'Yarasa Sonarı',
    desc: 'Kör Uçuş Labirenti\'nde karanlıkta duvara çarpmadan çıkışa ulaş.',
    icon: '🦇',
    category: 'strategy',
    xpReward: 300
  },

  // Esneklik & Refleks
  {
    id: 'paradox_master',
    title: 'Paradoks Kontrolü',
    desc: 'Paradoks Protokolü\'nde 900 veya üzeri skora ulaş.',
    icon: '🚨',
    category: 'flexibility',
    xpReward: 300
  },
  {
    id: 'word_alchemist',
    title: 'Kelime Simyacısı',
    desc: 'Sözcük Simyası\'nda bir bulmaca zincirini eksiksiz tamamla.',
    icon: '🧪',
    category: 'flexibility',
    xpReward: 300
  },
  {
    id: 'bubble_poet',
    title: 'Sözlük Dehası',
    desc: 'Kelime Balonları\'nda tek oyunda 600+ skor topla.',
    icon: '💬',
    category: 'flexibility',
    xpReward: 250
  },
  {
    id: 'lightning_speed',
    title: 'Şimşek Refleks',
    desc: 'Şimşek Refleks oyununda 1000+ skora ulaş.',
    icon: '⚡',
    category: 'flexibility',
    xpReward: 300
  },

  // Genel Zihin & Seri
  {
    id: 'streak_7',
    title: 'Haftalık Demir İrade',
    desc: 'Günlük antrenman serisinde 7 güne ulaş.',
    icon: '📅',
    category: 'general',
    xpReward: 400
  },
  {
    id: 'freeze_saver',
    title: 'Kalkan Güvencesi',
    desc: 'Envanterine en az 1 Seri Dondurucu (Streak Freeze) ekle.',
    icon: '🛡️',
    category: 'general',
    xpReward: 150
  },
  {
    id: 'brain_young',
    title: 'Süper Genç Zihin',
    desc: 'Bilişsel analizde beyin yaşını 22 veya altına indir.',
    icon: '👶',
    category: 'general',
    xpReward: 450
  },
  {
    id: 'pvp_champion',
    title: 'Arena Gladyatörü',
    desc: 'Canlı 1v1 PvP Düellosunda en az 5 zafer elde et.',
    icon: '⚔️',
    category: 'general',
    xpReward: 300
  },
  {
    id: 'explorer_all',
    title: 'Bilişsel Kaşif',
    desc: 'Katalogdaki en az 10 farklı bilişsel oyunu dene.',
    icon: '🌟',
    category: 'general',
    xpReward: 500
  }
];

const defaultUserData = {
  profile: {
    name: 'Zihin Kaşifi (Sen)',
    avatar: '⚡',
    level: 1,
    xp: 0,
    brainAge: 25,
    streak: 3,
    streakFreezeCount: 1,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    soundEnabled: true,
    theme: 'oceanic'
  },
  highScores: {
    kuantum_satranc: 850,
    zihin_matrisi: 450,
    tren_yolu: 600,
    simsek_refleks: 800,
    renk_matrisi: 550,
    yon_ve_akis: 620,
    matematik_firtinasi: 700,
    desen_rozet: 600,
    kelime_balonlari: 520,
    zihin_gecis: 640,
    kartal_goz: 780,
    tanidik_yuzler: 490,
    blok_ustasi: 650,
    neuro_flash: 750,
    kor_ucus_labirenti: 600,
    paradoks_protokolu: 820,
    sozcuk_simyasi: 550,
    kuantum_mayin: 700
  },
  stats: {
    hafiza: 680,
    dikkat: 720,
    hiz: 650,
    esneklik: 700,
    mantik: 690
  },
  pvp: {
    wins: 5,
    losses: 2,
    rating: 1240,
    trophies: 42
  },
  achievements: {
    freeze_saver: { unlocked: true, unlockedAt: new Date().toISOString() },
    flash_starter: { unlocked: true, unlockedAt: new Date().toISOString() },
    math_starter: { unlocked: true, unlockedAt: new Date().toISOString() },
    chess_mate: { unlocked: true, unlockedAt: new Date().toISOString() },
    pvp_champion: { unlocked: true, unlockedAt: new Date().toISOString() }
  },
  friends: defaultFriends,
  gameHistory: []
};

// Helper to get calendar days difference between two YYYY-MM-DD strings
function getDaysDiff(fromDateStr, toDateStr) {
  if (!fromDateStr || !toDateStr) return 0;
  const d1 = new Date(fromDateStr + 'T00:00:00');
  const d2 = new Date(toDateStr + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayStr(daysAgo = 1) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const storageService = {
  // Check and update streak when app opens or state loads
  checkAndUpdateDailyStreak(data) {
    if (!data || !data.profile) return { data, message: null };

    const today = getTodayStr();
    const lastPlayed = data.profile.lastPlayedDate || today;
    const diffDays = getDaysDiff(lastPlayed, today);

    let streakNotification = null;

    if (diffDays === 0) {
      // Already played or checked today
    } else if (diffDays === 1) {
      // Last played yesterday. Streak is active and waiting for today's workout!
    } else if (diffDays > 1) {
      // Missed at least 1 full day! (e.g. diffDays = 2 means missed yesterday)
      const missedDays = diffDays - 1;

      if (data.profile.streakFreezeCount >= missedDays) {
        // Protected by Streak Freezes!
        data.profile.streakFreezeCount -= missedDays;
        data.profile.lastPlayedDate = getYesterdayStr(1);
        streakNotification = {
          type: 'freeze_used',
          message: `❄️ ${missedDays} gün kaçırıldı! Seri Dondurucun otomatik devreye girdi ve ${data.profile.streak} günlük serin korundu!`
        };
      } else {
        // Freezes were not enough - streak broken!
        const savedByPartial = data.profile.streakFreezeCount;
        data.profile.streakFreezeCount = 0;
        data.profile.streak = 0;
        streakNotification = {
          type: 'streak_lost',
          message: savedByPartial > 0 
            ? `⚠️ ${savedByPartial} dondurucu harcandı ancak yetmedi. Serin sıfırlandı.`
            : `⚠️ Dün antrenman yapılmadı ve dondurucun yoktu. Serin sıfırlandı!`
        };
      }
      this.saveUserData(data);
    }

    return { data, streakNotification };
  },

  getUserData() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      let data = dataStr ? JSON.parse(dataStr) : null;
      if (!data) {
        data = JSON.parse(JSON.stringify(defaultUserData));
        this.saveUserData(data);
        return data;
      }
      
      // Ensure all top-level and nested structures exist (backward compatibility)
      data = {
        ...defaultUserData,
        ...data,
        profile: { ...defaultUserData.profile, ...(data.profile || {}) },
        highScores: { ...defaultUserData.highScores, ...(data.highScores || {}) },
        stats: { ...defaultUserData.stats, ...(data.stats || {}) },
        pvp: { ...defaultUserData.pvp, ...(data.pvp || {}) },
        friends: Array.isArray(data.friends) && data.friends.length > 0 ? data.friends : defaultFriends,
        achievements: { ...defaultUserData.achievements, ...(data.achievements || {}) },
        gameHistory: Array.isArray(data.gameHistory) ? data.gameHistory : []
      };

      if (!data.profile.streakFreezeCount && data.profile.streakFreezeCount !== 0) {
        data.profile.streakFreezeCount = 1;
      }
      if (!data.profile.lastPlayedDate) {
        data.profile.lastPlayedDate = getTodayStr();
      }

      // Check daily streak rules
      const { data: updatedData } = this.checkAndUpdateDailyStreak(data);
      this.saveUserData(updatedData);
      return updatedData;
    } catch (e) {
      console.warn('Error reading from localStorage', e);
      const fallback = JSON.parse(JSON.stringify(defaultUserData));
      try { this.saveUserData(fallback); } catch (_) {}
      return fallback;
    }
  },

  saveUserData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  },

  addFriend(name, avatar = '👤') {
    const data = this.getUserData();
    const newFriend = {
      id: 'f_' + Date.now(),
      name,
      avatar,
      level: Math.floor(Math.random() * 8) + 3,
      streak: Math.floor(Math.random() * 10) + 1,
      trophies: Math.floor(Math.random() * 300) + 50,
      brainAge: Math.floor(Math.random() * 10) + 20,
      scores: {
        zihin_matrisi: Math.floor(Math.random() * 800) + 400,
        tren_yolu: Math.floor(Math.random() * 1000) + 500,
        simsek_refleks: Math.floor(Math.random() * 1200) + 600,
        renk_matrisi: Math.floor(Math.random() * 900) + 450,
        yon_ve_akis: Math.floor(Math.random() * 850) + 400,
        matematik_firtinasi: Math.floor(Math.random() * 1000) + 500,
        desen_rozet: Math.floor(Math.random() * 900) + 450
      },
      status: 'online'
    };
    data.friends.push(newFriend);
    this.saveUserData(data);
    return data;
  },

  removeFriend(id) {
    const data = this.getUserData();
    data.friends = data.friends.filter(f => f.id !== id);
    this.saveUserData(data);
    return data;
  },

  addGameResult(gameId, category, score, level) {
    const data = this.getUserData();
    const today = getTodayStr();
    
    // Update Personal High Score
    if (!data.highScores[gameId] || score > data.highScores[gameId]) {
      data.highScores[gameId] = score;
    }

    const xpGained = Math.round(score / 5) + (level * 20);
    let newXp = data.profile.xp + xpGained;
    let newLevel = data.profile.level;
    const xpNextLevel = newLevel * 200;

    if (newXp >= xpNextLevel) {
      newLevel += 1;
      newXp = newXp - xpNextLevel;
    }

    if (data.stats[category] !== undefined) {
      data.stats[category] = Math.min(999, data.stats[category] + Math.round(score / 40));
    }

    data.profile.xp = newXp;
    data.profile.level = newLevel;

    // === STREAK UPDATE ON GAME COMPLETION ===
    let streakIncreased = false;
    const lastPlayed = data.profile.lastPlayedDate;

    if (lastPlayed !== today) {
      // First game completed today!
      const diff = getDaysDiff(lastPlayed, today);
      if (diff === 1) {
        // Consecutive day
        data.profile.streak = (data.profile.streak || 0) + 1;
      } else {
        // Fresh start
        data.profile.streak = 1;
      }
      data.profile.lastPlayedDate = today;
      streakIncreased = true;
    } else {
      // Already played today, ensure streak is at least 1
      if (!data.profile.streak || data.profile.streak < 1) {
        data.profile.streak = 1;
      }
    }

    data.gameHistory.unshift({
      id: Date.now(),
      gameId,
      category,
      score,
      level,
      date: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });

    if (data.gameHistory.length > 30) data.gameHistory.pop();

    // Check newly unlocked achievements
    const { newlyUnlocked } = this.checkAchievements(data, {
      gameId,
      score,
      level,
      mathCombo5: gameId === 'matematik_firtinasi' && score >= 1000,
      flashBotWon: gameId === 'neuro_flash' && score >= 800
    });

    this.saveUserData(data);
    return { 
      data, 
      xpGained, 
      leveledUp: newLevel > data.profile.level, 
      streakIncreased, 
      currentStreak: data.profile.streak,
      newAchievements: newlyUnlocked
    };
  },

  checkAchievements(data, context = {}) {
    if (!data.achievements) data.achievements = {};
    const newlyUnlocked = [];

    const unlock = (achId) => {
      if (!data.achievements[achId]?.unlocked) {
        const config = ACHIEVEMENTS_CONFIG.find(a => a.id === achId);
        if (config) {
          data.achievements[achId] = {
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          data.profile.xp += config.xpReward || 200;
          newlyUnlocked.push(config);
        }
      }
    };

    // Flash & Hız
    if (data.highScores?.neuro_flash > 0) unlock('flash_starter');
    if (data.highScores?.neuro_flash >= 850) unlock('flash_speed_demon');
    if (data.highScores?.neuro_flash >= 1000) unlock('flash_sub_400');
    if (context.flashBotWon) unlock('flash_bot_slayer');

    // Matematik
    if (data.highScores?.matematik_firtinasi > 0) unlock('math_starter');
    if (data.highScores?.matematik_firtinasi >= 1000) unlock('math_storm');
    if (data.highScores?.matematik_firtinasi >= 1500) unlock('math_blitz');
    if (context.mathCombo5) unlock('math_combo_king');

    // Strateji & Mantık
    if (data.highScores?.kuantum_satranc >= 850) unlock('chess_mate');
    if (data.highScores?.kuantum_mayin >= 700) unlock('mine_cleaner');
    if (data.highScores?.kor_ucus_labirenti >= 600) unlock('blind_navigator');

    // Esneklik
    if (data.highScores?.paradoks_protokolu >= 850) unlock('paradox_master');
    if (data.highScores?.sozcuk_simyasi >= 550) unlock('word_alchemist');
    if (data.highScores?.kelime_balonlari >= 600) unlock('bubble_poet');
    if (data.highScores?.simsek_refleks >= 900) unlock('lightning_speed');

    // Genel
    if (data.profile?.streak >= 7) unlock('streak_7');
    if (data.profile?.streakFreezeCount >= 1) unlock('freeze_saver');
    if (data.profile?.brainAge <= 22) unlock('brain_young');
    if (data.pvp && data.pvp.wins >= 5) unlock('pvp_champion');
    
    const playedCount = Object.keys(data.highScores || {}).filter(k => (data.highScores[k] || 0) > 0).length;
    if (playedCount >= 10) unlock('explorer_all');

    return { data, newlyUnlocked };
  },

  buyStreakFreeze() {
    const data = this.getUserData();
    if (data.profile.streakFreezeCount < 3) {
      data.profile.streakFreezeCount += 1;
      this.checkAchievements(data);
      this.saveUserData(data);
      return { success: true, count: data.profile.streakFreezeCount };
    }
    return { success: false, message: 'Maksimum 3 Seri Dondurucu stoklayabilirsiniz.' };
  },

  // === SIMULATION / TESTING HELPERS FOR USER VERIFICATION ===
  simulateSkipDays(daysToSkip = 1) {
    const data = this.getUserData();
    // Move lastPlayedDate back in time to simulate missed days
    const pastDate = getYesterdayStr(daysToSkip);
    data.profile.lastPlayedDate = pastDate;
    this.saveUserData(data);
    return this.checkAndUpdateDailyStreak(data);
  },

  simulateResetStreak() {
    const data = this.getUserData();
    data.profile.streak = 0;
    data.profile.streakFreezeCount = 1;
    data.profile.lastPlayedDate = getYesterdayStr(1);
    this.saveUserData(data);
    return data;
  }
};
