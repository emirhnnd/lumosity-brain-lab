import React, { useState, useEffect, useRef } from 'react';
import { Play, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

const GAME_DURATION = 60;

const PREFIXES = ['AR','BE','DE','GE','KA','SE','YA','AL','BO','CE','DA','EV','FA','GÜ','HA','İL','KE','LA','ME','NA','OL','PA','RE','SA','TE','UN','VE','YE','ZA','AK'];

const WORD_BANK = {
  'AR': ['araba','arı','armut','arzu','artık','arsa','arzu','arkadaş'],
  'BE': ['beni','bela','belki','beyaz','beden','beyin','bekle'],
  'DE': ['deniz','dere','demir','devir','dergi','dedik','derin'],
  'GE': ['gece','gemi','gelin','gerek','geliş','geçit','gençlik'],
  'KA': ['kara','kale','kalem','kaplı','karşı','kasap','kavga'],
  'SE': ['sene','seçim','sefer','selam','sevgi','sesin','seyir'],
  'YA': ['yani','yağ','yakın','yapı','yarım','yavaş','yazı'],
  'AL': ['alma','alev','alın','alıcı','aldık','alışık','alın'],
  'BO': ['boya','boş','borç','bolca','bonus','boru','boyut'],
  'CE': ['cevap','cesur','cenk','ceket','cevre','cehalet'],
  'DA': ['dağ','dal','dava','dans','daire','dahil','damla'],
  'EV': ['evde','evli','evcil','evrak','evsiz','evren','evre'],
  'FA': ['fare','fakir','fark','falan','fabul','fazla','fayda'],
  'GÜ': ['gün','güç','güzel','gülüş','güven','gümüş','güney'],
  'HA': ['haber','hak','hata','hayır','hazır','hacim','halı'],
  'İL': ['ilk','ilgi','ileri','ilaç','ilan','ilahi','ilişki'],
  'KE': ['kesin','kedi','kemer','kesik','kervan','kelime','kemik'],
  'LA': ['lale','lazım','lafı','laçka','lavabo','lamba','lastik'],
  'ME': ['merak','mesaj','meta','mevki','meyve','mezun','medya'],
  'NA': ['nasıl','nadir','nakil','namaz','naylon','navlun'],
  'OL': ['olur','oldu','olası','olağan','olumlu','oluşum'],
  'PA': ['para','paha','pamuk','panel','paket','parça','pasta'],
  'RE': ['renk','resim','rekor','reçel','reklam','refah'],
  'SA': ['saat','sabah','sadece','sahip','sakin','sanat','sarı'],
  'TE': ['teklif','teknik','telefon','tempo','terazi','terlik'],
  'UN': ['unutma','ufak','uçuş','uğraş','umut','unsur','usul'],
  'VE': ['verim','veri','vergi','vesika','vefat','vezir'],
  'YE': ['yemek','yer','yeterli','yetki','yeni','yeşil','yedek'],
  'ZA': ['zaman','zafer','zarif','zaten','zarar','zanaat'],
  'AK': ['akıl','akım','akıllı','akış','akraba','aksam','aktif'],
};

export default function KelimeBalonlari({ onGameComplete }) {
  const [phase, setPhase] = useState('idle');
  const [prefix, setPrefix] = useState('');
  const [input, setInput] = useState('');
  const [found, setFound] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const pickPrefix = () => {
    const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    setPrefix(p); setFound([]); setInput('');
    return p;
  };

  const startGame = () => {
    pickPrefix();
    setScore(0); setTimeLeft(GAME_DURATION); setStreak(0); setPhase('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('gameover'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'gameover' && onGameComplete)
      onGameComplete('kelime_balonlari', 'esneklik', score, found.length);
  }, [phase]); // eslint-disable-line

  const handleSubmit = (e) => {
    e.preventDefault();
    const word = input.trim().toLowerCase();
    if (!word || word.length < 3) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const words = (WORD_BANK[prefix] || []).map(w => w.toLowerCase());
    if (found.includes(word)) { setShake(true); setTimeout(() => setShake(false), 400); return; }

    const startsWithPrefix = word.startsWith(prefix.toLowerCase());
    if (words.includes(word) || (startsWithPrefix && word.length >= 3)) {
      const pts = word.length * 50 + (streak >= 3 ? 100 : 0);
      setScore(s => s + pts);
      const nextFound = [...found, word];
      setFound(nextFound);
      setStreak(s => s + 1);
      soundService.success?.();

      // Rotate prefix automatically every 4 words with bonus
      if (nextFound.length >= 4) {
        soundService.levelUp?.();
        setScore(s => s + 300); // 300 bonus points for clearing prefix!
        setTimeout(() => {
          pickPrefix();
        }, 400);
      }
    } else {
      setStreak(0); setShake(true); setTimeout(() => setShake(false), 400); soundService.error?.();
    }
    setInput('');
  };

  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>💬 Dil & Esneklik</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', margin: 0 }}>Kelime Balonları</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>Verilen harflerle başlayan kelimeler yaz! (4 kelimede bir yeni harf gelir)</p>
      </div>

      {phase === 'playing' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--warning)' }}>🏆 {score}</span>
            <span style={{ color: timerColor, fontSize: '1.1rem' }}>⏱ {timeLeft}sn</span>
            <span style={{ color: '#10b981' }}>✅ {found.length}/4 bu harften</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timePct * 100}%`, background: timerColor, transition: 'width 1s linear', borderRadius: '3px' }} />
          </div>
          {streak >= 3 && <div style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#fbbf24', fontWeight: '700', fontSize: '0.82rem' }}>🔥 {streak} Seri!</div>}

          <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.2))', border: '2px solid #6366f1' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>BAŞLAYAN HARFLER</div>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#a5b4fc', letterSpacing: '0.2em' }}>{prefix}</div>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={pickPrefix} 
                className="btn-secondary" 
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', margin: '0 auto' }}
              >
                🔄 Harfi Değiştir (Pas)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                placeholder={`${prefix.toLowerCase()}... ile başlayan kelime`}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: `2px solid ${shake ? '#ef4444' : 'rgba(99,102,241,0.4)'}`, background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', animation: shake ? 'shake 0.3s' : 'none' }} />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.2rem', whiteSpace: 'nowrap' }}>Gönder</button>
            </div>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '60px' }}>
            {found.map((w, i) => (
              <span key={i} style={{ padding: '0.25rem 0.7rem', borderRadius: '20px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.82rem', fontWeight: '700' }}>✓ {w}</span>
            ))}
          </div>
        </>
      )}

      {(phase === 'idle' || phase === 'gameover') && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          {phase === 'gameover' && <div style={{ marginBottom: '1.5rem' }}><Award size={50} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} /><h3>Süre Doldu!</h3><p style={{ color: 'var(--success)', fontWeight: '700' }}>Skor: {score} · {found.length} kelime bulundu</p></div>}
          {phase === 'idle' && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Ekranda çıkan harflerle başlayan<br /><strong>Türkçe kelimeler</strong> yaz!</p>}
          <button className="btn-primary" onClick={startGame} style={{ width: '100%', maxWidth: '280px', padding: '0.85rem', fontSize: '1rem' }}><Play size={18} /> {phase === 'gameover' ? 'Tekrar Oyna' : 'Başlat'}</button>
        </div>
      )}
    </div>
  );
}
