import React from 'react';
import { Play, Swords, Flame, Sparkles, Award, Shield, Zap, TrendingUp, Cpu, Activity, Crown } from 'lucide-react';
import {
  MemoryMatrixIllustration,
  TrainOfThoughtIllustration,
  PvpArenaIllustration,
  StroopColorIllustration,
  SpeedReflexIllustration,
  FlowDirectionIllustration,
  MathBlitzIllustration,
  PatternDecoderIllustration,
  QuantumChessIllustration,
  WordBubblesIllustration,
  BrainShiftIllustration,
  EagleEyeIllustration,
  FamiliarFacesIllustration,
  BlockChampIllustration,
  NeuroFlashIllustration,
  BlindfoldLabyrinthIllustration,
  ParadoxProtocolIllustration,
  WordAlchemyIllustration,
  ChronoMinesIllustration
} from './illustrations/SvgIllustrations';

export default function Dashboard({ userData, onSelectGame, onStartPvP, onOpenAnalytics, onOpenStreakShop }) {
  const games = [
    {
      id: 'kuantum_satranc',
      title: 'Kuantum Büyülü Satranç',
      category: 'Mantık & Strateji',
      desc: 'Her 3 taş yediğinde büyü gücü dolan, ışınlanmalı ve kalkanlı satranç!',
      illustration: <QuantumChessIllustration width={130} height={130} />,
      color: '#fbbf24',
      badge: '🔥 DEV YENİLİK'
    },
    {
      id: 'zihin_matrisi',
      title: 'Zihin Matrisi',
      category: 'Hafıza',
      desc: 'Işıldayan nöral karelerin dizilimini hafızana kazı.',
      illustration: <MemoryMatrixIllustration width={130} height={130} />,
      color: '#38bdf8',
      badge: 'HTML Entegre'
    },
    {
      id: 'tren_yolu',
      title: 'Tren Yolu & Makas',
      category: 'Dikkat & Yönlendirme',
      desc: 'Makas düğmelerine basarak trenleri kendi renkli garına ulaştır.',
      illustration: <TrainOfThoughtIllustration width={130} height={130} />,
      color: '#10b981',
      badge: 'Lumosity Klasiği'
    },
    {
      id: 'simsek_refleks',
      title: 'Şimşek Refleks',
      category: 'Reaksiyon Hızı',
      desc: 'Anlık çakan yıldız hedeflerini yakala, bombalardan sakın.',
      illustration: <SpeedReflexIllustration width={130} height={130} />,
      color: '#fbbf24',
      badge: 'Hız'
    },
    {
      id: 'renk_matrisi',
      title: 'Direnç ve Odak (Stroop)',
      category: 'Dikkat',
      desc: 'Optik çeldiricilere karşın zihnini doğru renge odakla.',
      illustration: <StroopColorIllustration width={130} height={130} />,
      color: '#f43f5e',
      badge: 'Odak'
    },
    {
      id: 'yon_ve_akis',
      title: 'Yön ve Akış (Ebb & Flow)',
      category: 'Bilişsel Esneklik',
      desc: 'Sürü ve merkez okun akış yönünü anında takip et.',
      illustration: <FlowDirectionIllustration width={130} height={130} />,
      color: '#818cf8',
      badge: 'Esneklik'
    },
    {
      id: 'matematik_firtinasi',
      title: 'Matematik Fırtınasi',
      category: 'Mantık & Sayısal',
      desc: 'Zihinsel denklemdeki eksik halkayı bul, 5x kombo yap.',
      illustration: <MathBlitzIllustration width={130} height={130} />,
      color: '#c084fc',
      badge: 'Sayısal'
    },
    {
      id: 'desen_rozet',
      title: 'Desen Çözücü',
      category: 'Uzamsal Problem Çözme',
      desc: 'Kutsal geometri ve uzamsal dizilerdeki gizli sembolü çöz.',
      illustration: <PatternDecoderIllustration width={130} height={130} />,
      color: '#34d399',
      badge: 'Uzamsal'
    },
    {
      id: 'kelime_balonlari',
      title: 'Kelime Balonları',
      category: 'Dil & Esneklik',
      desc: 'Verilen harf kökleriyle başlayan Türkçe kelimeleri hızla türet!',
      illustration: <WordBubblesIllustration width={130} height={130} />,
      color: '#38bdf8',
      badge: 'Kelime'
    },
    {
      id: 'zihin_gecis',
      title: 'Zihin Geçişi (Brain Shift)',
      category: 'Bilişsel Esneklik',
      desc: 'Değişen kurallara hızla adapte ol: Renk mi, şekil ismi mi?',
      illustration: <BrainShiftIllustration width={130} height={130} />,
      color: '#fbbf24',
      badge: 'Esneklik'
    },
    {
      id: 'kartal_goz',
      title: 'Kartal Göz (Eagle Eye)',
      category: 'Görsel Dikkat',
      desc: 'Yoğun 7x7 ızgarada hedef figürü çevre görüşünle tespit et.',
      illustration: <EagleEyeIllustration width={130} height={130} />,
      color: '#10b981',
      badge: 'Odak'
    },
    {
      id: 'tanidik_yuzler',
      title: 'Tanıdık Yüzler',
      category: 'Sosyal Hafıza',
      desc: 'Farklı karakterlerin yüzlerini ve isimlerini hafızana kazı.',
      illustration: <FamiliarFacesIllustration width={130} height={130} />,
      color: '#c084fc',
      badge: 'Hafıza'
    },
    {
      id: 'blok_ustasi',
      title: 'Blok Ustası (Block Champ)',
      category: 'Uzamsal Problem Çözme',
      desc: 'Blokları 8x8 alana stratejik dizerek yatay ve dikey hatları patlat!',
      illustration: <BlockChampIllustration width={130} height={130} />,
      color: '#f43f5e',
      badge: 'Bulmaca'
    },
    {
      id: 'neuro_flash',
      title: 'Neuro Flash',
      category: 'Bilişsel Hız & Flaş Hafıza',
      desc: 'Saliselik flaş sayıları yakala, kural motoruna göre en hızlı cevabı seç ve MPD skorunu katla!',
      illustration: <NeuroFlashIllustration width={130} height={130} />,
      color: '#00f2fe',
      badge: '⚡ YENİ HIZ TESTİ'
    },
    {
      id: 'kor_ucus_labirenti',
      title: 'Kör Uçuş Labirenti',
      category: 'Uzamsal Hafıza',
      desc: '3.5 saniye labirenti ezberle, ekran kararında zihnindeki haritayla çıkışa yürü!',
      illustration: <BlindfoldLabyrinthIllustration width={130} height={130} />,
      color: '#a855f7',
      badge: '🌑 KÖR NAVİGASYON'
    },
    {
      id: 'paradoks_protokolu',
      title: 'Paradoks Protokolü',
      category: 'Bilişsel Ket Vurma',
      desc: 'Emirlere hızla uy, ama alarm çaldığında ilk refleksini bastırıp TAM TERSİNİ yap!',
      illustration: <ParadoxProtocolIllustration width={130} height={130} />,
      color: '#f43f5e',
      badge: '🚨 TERS REFLEKS'
    },
    {
      id: 'sozcuk_simyasi',
      title: 'Sözcük Simyası',
      category: 'Sözel Zeka & Akıcılık',
      desc: 'Her adımda yalnızca 1 harf değiştirerek başlangıç kelimesini hedefe dönüştür!',
      illustration: <WordAlchemyIllustration width={130} height={130} />,
      color: '#38bdf8',
      badge: '🧪 KELİME SİMYASI'
    },
    {
      id: 'kuantum_mayin',
      title: 'Kuantum Mayın Tarlası',
      category: 'Mantık & Kriz Yönetimi',
      desc: 'Geri sayımlı kararsız mayınlara dikkat et! Zaman Dondurma ve Kuantum Tarayıcı ile alanı temizle.',
      illustration: <ChronoMinesIllustration width={130} height={130} />,
      color: '#fbbf24',
      badge: '⏳ ZAMAN BÜKÜCÜ'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Signature Animated Neuro-Core Banner */}
      <div className="glass-card anim-halo" style={{
        background: 'linear-gradient(135deg, rgba(2,132,199,0.3) 0%, rgba(99,102,241,0.2) 50%, rgba(168,85,247,0.2) 100%)',
        border: '1px solid rgba(56,189,248,0.4)',
        padding: '2.25rem',
        borderRadius: 'var(--radius-xl)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'center'
      }}>
        
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }} className="badge badge-cyan">
            <Cpu size={16} /> Nöro-Kuantum Zihin Çekirdeği
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            Zihinsel Potansiyelini <span className="gradient-text">Üst Seviyeye</span> Taşı
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Nöro-bilim ilkelerine dayanan 18 estetik nöro-egzersiz, Kuantum Büyülü Satranç ve canlı PvP Arena ile beynini güçlendir. Ücret duvarı yok!
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => onSelectGame('kuantum_satranc')} style={{ padding: '0.9rem 1.8rem', fontSize: '1rem', background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)' }}>
              <Crown size={20} fill="#fff" /> Kuantum Satranç Oyna
            </button>
            <button className="btn-secondary" onClick={onOpenAnalytics} style={{ padding: '0.9rem 1.5rem', fontSize: '1rem' }}>
              <Activity size={20} color="var(--accent-light)" /> Performans Analizi
            </button>
          </div>
        </div>

        {/* Hero Visual Clashing Graphic */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div className="anim-float" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}>
            <PvpArenaIllustration width={220} height={220} />
          </div>
        </div>

      </div>

      {/* PvP Arena Spotlight Card */}
      <div 
        className="glass-card glass-card-hover" 
        onClick={onStartPvP}
        style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(251,191,36,0.15) 100%)',
          border: '1px solid rgba(244,63,94,0.4)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          padding: '2rem'
        }}
      >
        <div>
          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>🔥 BENZERSİZ NÖRO-DÜELLO MODU</span>
          <h2 style={{ fontSize: '1.8rem', color: '#f43f5e', marginBottom: '0.5rem' }}>Canlı 1v1 PvP Zihin Düellosu</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Yapay zeka şampiyonlarıyla canlı kapış! Büyü kartlarını (Zaman Dondurma, Sis Bombası, Zihin Kalkanı) kullanarak rakibinin HP barını sıfırla!
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', padding: '0.9rem 2rem', fontSize: '1.1rem' }}>
            <Swords size={22} /> Arena'ya Gir
          </button>
        </div>
      </div>

      {/* Main Game Catalog with Custom Vector Cover Artworks */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.7rem' }}>Bilişsel Oyun Kataloğu ({games.length})</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Özel illüstrasyonlar ve özgün oyun dinamikleri.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {games.map((g) => (
            <div
              key={g.id}
              className="glass-card glass-card-hover"
              onClick={() => onSelectGame(g.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                padding: '1.5rem',
                borderTop: `4px solid ${g.color}`
              }}
            >
              <div>
                {/* SVG Vector Artwork Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  border: `1px stroke ${g.color}30`
                }}>
                  {g.illustration}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem' }}>{g.title}</h3>
                  <span className="badge" style={{ background: `${g.color}20`, color: g.color, border: `1px solid ${g.color}40` }}>
                    {g.badge}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{g.desc}</p>
              </div>

              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                fontSize: '0.9rem',
                fontWeight: '800',
                color: g.color
              }}>
                <span>Egzersizi Başlat</span>
                <Play size={18} fill={g.color} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Protection Shield */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(56,189,248,0.1) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#10b981', padding: '0.8rem', borderRadius: '50%', color: '#fff', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
            <Shield size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Seri Dondurucu Kalkanı Aktif</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Lumosity'deki seri sıfırlanma kaygısını bitiren koruma sistemi. Gününüzü kaçırsanız da seriniz korumada.
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={onOpenStreakShop} style={{ background: '#10b981', padding: '0.8rem 1.5rem' }}>
          <Flame size={20} fill="#fff" /> {userData.profile.streak} Günlük Seri ({userData.profile.streakFreezeCount} Dondurucu)
        </button>
      </div>

    </div>
  );
}
