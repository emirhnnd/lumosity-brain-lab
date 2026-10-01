import React, { useState } from 'react';
import { X, Award, Brain, TrendingUp, Sparkles, AlertCircle, History, Trophy, Flame } from 'lucide-react';

const CATEGORY_TIPS = {
  hafiza: {
    tip: 'Hafıza alanını güçlendirmek için görsel şekilleri zihninde hikayeleştir. "Kör Uçuş Labirenti" ve "Zihin Matrisi" hipokampusunu en hızlı çalıştıran oyunlardır.',
    suggestedGames: 'Kör Uçuş Labirenti, Zihin Matrisi, Tanıdık Yüzler'
  },
  dikkat: {
    tip: 'Görsel dikkatin ve odaklanma süren için çeldiricilere aldırmadan hedefe kilitlen. "Kartal Göz" ve "Tren Yolu" seçici dikkatini keskinleştirir.',
    suggestedGames: 'Kartal Göz, Tren Yolu, Yön ve Akış'
  },
  hiz: {
    tip: 'Bilişsel işlemleme hızını (PSI) artırmak için karar anında tereddüdü bırak. "Neuro Flash" ve "Şimşek Refleks" milisaniyelik reflekslerini geliştirir.',
    suggestedGames: 'Neuro Flash, Şimşek Refleks'
  },
  esneklik: {
    tip: 'Bilişsel ket vurma ve görev değiştirme yeteneğini geliştirmek için beyninin ilk refleksini bastır. "Paradoks Protokolü" ve "Zihin Geçişi" zihinsel esnekliği katlar.',
    suggestedGames: 'Paradoks Protokolü, Zihin Geçişi, Renk Matrisi (Stroop)'
  },
  mantik: {
    tip: 'Stratejik ve dedüktif mantığını ileri taşımak için hamlelerin sonuçlarını 2 adım önceden hesapla. "Kuantum Satranç" ve "Kuantum Mayın" kriz yönetimini güçlendirir.',
    suggestedGames: 'Kuantum Satranç, Kuantum Mayın, Matematik Fırtınası'
  }
};

const GAME_NAMES = {
  kuantum_satranc: 'Kuantum Büyülü Satranç',
  zihin_matrisi: 'Zihin Matrisi',
  tren_yolu: 'Tren Yolu & Makas',
  simsek_refleks: 'Şimşek Refleks',
  renk_matrisi: 'Renk Matrisi (Stroop)',
  yon_ve_akis: 'Yön ve Akış',
  matematik_firtinasi: 'Matematik Fırtınası',
  desen_rozet: 'Desen Çözücü',
  kelime_balonlari: 'Kelime Balonları',
  zihin_gecis: 'Zihin Geçişi',
  kartal_goz: 'Kartal Göz',
  tanidik_yuzler: 'Tanıdık Yüzler',
  blok_ustasi: 'Blok Ustası',
  neuro_flash: 'Neuro Flash',
  kor_ucus_labirenti: 'Kör Uçuş Labirenti',
  paradoks_protokolu: 'Paradoks Protokolü',
  sozcuk_simyasi: 'Sözcük Simyası',
  kuantum_mayin: 'Kuantum Mayın Tarlası'
};

export default function AnalyticsModal({ userData, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history' | 'records'
  const { stats, profile, highScores = {}, gameHistory = [] } = userData;

  // Calculate brain age estimator
  const statKeys = ['hafiza', 'dikkat', 'hiz', 'esneklik', 'mantik'];
  const avgStat = Math.round(
    statKeys.reduce((acc, k) => acc + (stats[k] || 500), 0) / statKeys.length
  );
  const estimatedBrainAge = Math.max(18, Math.round(45 - (avgStat - 500) / 14));

  // Determine Strongest and Weakest Categories dynamically
  const sortedCategories = [...statKeys].sort((a, b) => (stats[b] || 0) - (stats[a] || 0));
  const strongestKey = sortedCategories[0];
  const weakestKey = sortedCategories[sortedCategories.length - 1];

  const categories = [
    { key: 'hafiza', label: 'Hafıza', score: stats.hafiza || 500, color: '#38bdf8' },
    { key: 'dikkat', label: 'Dikkat', score: stats.dikkat || 500, color: '#10b981' },
    { key: 'hiz', label: 'Hız', score: stats.hiz || 500, color: '#f59e0b' },
    { key: 'esneklik', label: 'Esneklik', score: stats.esneklik || 500, color: '#a855f7' },
    { key: 'mantik', label: 'Problem Çözme', score: stats.mantik || 500, color: '#ef4444' }
  ];

  const weakAdvice = CATEGORY_TIPS[weakestKey] || CATEGORY_TIPS.hiz;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content anim-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Brain size={28} color="var(--accent-light)" />
            <div>
              <h2 style={{ fontSize: '1.45rem', margin: 0 }}>Nöro-Bilişsel Performans Analizi</h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gerçek zamanlı beyin istatistikleri ve antrenman verileri</div>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', background: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'overview' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'overview' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            📊 Genel Durum
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'history' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'history' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <History size={14} style={{ display: 'inline', marginRight: '4px' }} /> Oyun Geçmişi ({gameHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('records')}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'records' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'records' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <Trophy size={14} style={{ display: 'inline', marginRight: '4px' }} /> Kişisel Rekorlar
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Brain Age Highlight Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2,132,199,0.85) 0%, rgba(121,40,202,0.85) 100%)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              color: '#ffffff',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 10px 30px rgba(2, 132, 199, 0.3)'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
                  Tahmini Bilişsel Zihin Yaşı
                </span>
                <div style={{ fontSize: '2.6rem', fontWeight: '900', lineHeight: 1.1 }}>{estimatedBrainAge} Yaş</div>
                <p style={{ fontSize: '0.85rem', margin: '0.4rem 0 0 0', opacity: 0.95 }}>
                  Ortalama Bilişsel Puanın: <strong>{avgStat}</strong> / 999
                </p>
              </div>
              <Sparkles size={48} opacity={0.85} color="#fbbf24" />
            </div>

            {/* Cognitive Breakdown Bars */}
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.8rem' }}>5 Bilişsel Alana Göre Puanlar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {categories.map((cat) => (
                <div key={cat.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                    <span>{cat.label}</span>
                    <span style={{ color: cat.color }}>{cat.score} Puan</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (cat.score / 999) * 100)}%`, height: '100%', background: cat.color, transition: 'width 0.5s ease', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Tailored Dynamic Improvement Insights */}
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: '#fbbf24', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <AlertCircle size={18} /> Kişiselleştirilmiş Gelişim Tavsiyesi
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 0.5rem 0' }}>
                Şu an en çok geliştirilmesi gereken alanın: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{weakestKey}</strong>.
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                💡 {weakAdvice.tip}
              </p>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700' }}>
                Önerilen Oyunlar: {weakAdvice.suggestedGames}
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Game History (Directly pulls real games played) */}
        {activeTab === 'history' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Son tamamlanan seanslar ve elde edilen bilişsel puanlar:
            </div>
            {gameHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                Henüz tamamlanmış bir oyun kaydı yok. Ana panelden bir oyun seç ve oyna!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {gameHistory.map((h, i) => (
                  <div
                    key={h.id || i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>
                        {GAME_NAMES[h.gameId] || h.gameId}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Kategori: <strong style={{ color: 'var(--accent-light)' }}>{h.category}</strong> · Seviye/Tur: {h.level}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#fbbf24' }}>
                        +{h.score}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {h.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Personal High Scores */}
        {activeTab === 'records' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Tüm 18 bilişsel oyundaki kişisel rekor puanların:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
              {Object.entries(highScores).map(([gId, recordScore]) => (
                <div
                  key={gId}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.3rem' }}>
                    {GAME_NAMES[gId] || gId}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981' }}>
                    🏆 {recordScore}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
