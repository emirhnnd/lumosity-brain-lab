import React, { useState } from 'react';
import { Shield, Flame, X, ShoppingBag, CheckCircle, AlertTriangle, Calendar, Play, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

export default function StreakFreezeModal({ userData, setUserData, onClose }) {
  const [testLog, setTestLog] = useState(null);

  const handleClaimFreeze = () => {
    const res = storageService.buyStreakFreeze();
    if (res.success) {
      soundService.success();
      setUserData(storageService.getUserData());
      setTestLog({ type: 'success', text: `🛡️ 1 adet Seri Dondurucu envantere eklendi! (Toplam: ${res.count}/3)` });
    } else {
      soundService.error();
      setTestLog({ type: 'error', text: res.message });
    }
  };

  // Test Simulation 1: Miss yesterday (triggers freeze or resets streak)
  const handleSimulateMissedDay = () => {
    const result = storageService.simulateSkipDays(2);
    setUserData(result.data);
    if (result.streakNotification) {
      if (result.streakNotification.type === 'freeze_used') {
        soundService.spellCast();
        setTestLog({ type: 'freeze', text: result.streakNotification.message });
      } else {
        soundService.error();
        setTestLog({ type: 'error', text: result.streakNotification.message });
      }
    } else {
      setTestLog({ type: 'info', text: 'Seri durumu kontrol edildi, herhangi bir kayıp yok.' });
    }
  };

  // Test Simulation 2: Simulate playing on next day to increase streak
  const handleSimulateNextDayPlay = () => {
    // Set last played date to yesterday, then play a quick simulated game
    storageService.simulateSkipDays(1);
    const result = storageService.addGameResult('neuro_flash', 'hiz', 500, 1);
    setUserData(result.data);
    soundService.levelUp();
    setTestLog({ 
      type: 'success', 
      text: `🔥 Yeni bir günün antrenmanı tamamlandı! Seri ${result.currentStreak} güne yükseldi!` 
    });
  };

  // Days of week for tracker
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const todayIdx = (new Date().getDay() + 6) % 7; // 0 for Monday

  const todayStr = new Date().toISOString().split('T')[0];
  const isTodayCompleted = userData.profile.lastPlayedDate === todayStr;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content anim-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', marginBottom: '1rem', color: '#10b981' }}>
          <Shield size={44} />
        </div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>Seri Dondurucu & Seri Takibi</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Düzenli bilişsel egzersiz beynin nöroplastisitesini artırır. Yoğun bir gün geçirip antrenmanı kaçırırsanız Seri Dondurucu serinizi otomatik kurtarır!
        </p>

        {/* 7-Day Visual Progress Ring */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Calendar size={14} /> Haftalık Antrenman Takvimi
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem' }}>
            {days.map((dayName, idx) => {
              const isPastOrToday = idx <= todayIdx;
              const isToday = idx === todayIdx;
              return (
                <div key={dayName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: isToday ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: isToday ? '800' : 'normal' }}>
                    {dayName}
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isToday 
                      ? (isTodayCompleted ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(251, 191, 36, 0.2)')
                      : (isPastOrToday ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'),
                    border: isToday ? '2px solid #fbbf24' : '1px solid var(--border-color)',
                    color: isToday ? '#fbbf24' : '#10b981'
                  }}>
                    {isToday ? (
                      isTodayCompleted ? <Flame size={18} fill="#fff" color="#fff" /> : <Flame size={18} />
                    ) : isPastOrToday ? (
                      <CheckCircle size={16} color="#10b981" />
                    ) : (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: isTodayCompleted ? '#10b981' : '#fbbf24' }}>
            {isTodayCompleted ? '✓ Bugünkü antrenman tamamlandı, serin korundu!' : '⏳ Bugün henüz egzersiz yapılmadı (Seri risk altında)'}
          </div>
        </div>

        {/* Counter cards */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mevcut Seri</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
              <Flame size={22} fill="#fbbf24" /> {userData.profile.streak} Gün
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aktif Dondurucu</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
              <Shield size={22} fill="#10b981" /> {userData.profile.streakFreezeCount} / 3
            </div>
          </div>
        </div>

        {/* Buy / Claim Freeze Button */}
        <button 
          className="btn-primary" 
          onClick={handleClaimFreeze}
          disabled={userData.profile.streakFreezeCount >= 3}
          style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginBottom: '1.25rem' }}
        >
          <ShoppingBag size={18} />
          {userData.profile.streakFreezeCount >= 3 ? 'Kalkan Deposu Dolu (Maks 3)' : '+1 Ücretsiz Seri Dondurucu Al'}
        </button>

        {/* Interactive Simulation & Test Box */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            🧪 CANLI SİSTEM TESTİ & DOĞRULAMA
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
            Seri ve dondurucu mekanizmasının çalıştığını anında test etmek için aşağıdaki simülasyon butonlarına tıklayabilirsiniz:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button 
              className="btn-secondary" 
              onClick={handleSimulateMissedDay}
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.6rem', textAlign: 'center', justifyContent: 'center' }}
              title="1 gün girmemiş gibi simüle eder. Dondurucu varsa harcar, yoksa seriyi sıfırlar."
            >
              <AlertTriangle size={14} color="#f59e0b" /> Dünü Atla (Test)
            </button>
            <button 
              className="btn-secondary" 
              onClick={handleSimulateNextDayPlay}
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.6rem', textAlign: 'center', justifyContent: 'center' }}
              title="Ertesi gün antrenman yapılmış gibi simüle ederek seriyi 1 artırır."
            >
              <Play size={14} color="#10b981" /> +1 Gün Oyna (Test)
            </button>
          </div>

          {/* Test log output */}
          {testLog && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              lineHeight: 1.4,
              background: testLog.type === 'freeze' ? 'rgba(56, 189, 248, 0.15)' : testLog.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: testLog.type === 'freeze' ? '#38bdf8' : testLog.type === 'success' ? '#10b981' : '#f87171',
              border: `1px solid ${testLog.type === 'freeze' ? '#38bdf8' : testLog.type === 'success' ? '#10b981' : '#f87171'}40`
            }}>
              {testLog.text}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

