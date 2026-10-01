# 🧠 LUMOCITY / SYNAPTIX — BİLİŞSEL ZİHİN LABORATUVARI PROJE ÖDEVİ
## Kapsamlı Sistem Mimarisi, 18 Bilişsel Egzersiz Kataloğu, PvP Arenası ve Teknik Kılavuz

---

## 📌 1. Proje Özeti ve Vizyonu

**Synaptix (Lumosity Zihin Laboratuvarı)**; nöro-bilim ilkelerine dayanan, zihinsel işlem hızını, bilişsel esnekliği, görsel dikkati, uzamsal hafızayı ve mantıksal problem çözme yeteneğini geliştiren yeni nesil, tam teşekküllü bir web uygulamasıdır.

### 🌟 Temel Avantajlar:
- **Sıfır Paywall / %100 Ücretsiz:** Klasik ticari zihin uygulamalarındaki (Lumosity vb.) abonelik engelleri olmaksızın tüm oyunlar, analizler ve kişiselleştirilmiş antrenmanlar sınırsız erişilebilirdir.
- **Modern Teknoloji Mimarisi:** React + Vite, CSS değişkenleri ile 4 farklı tema desteği, LocalStorage kalıcı durum yönetimi ve Web Audio API tabanlı sentetik ses/efekt motoru.
- **Tam Bağımsız ve Çevrimdışı (Offline) Uyum:** Harici ağır ses kütüphanelerine veya görsel sunucularına bağımlı değildir; tüm oyun kapakları saf SVG vektör olarak kodlanmış, tüm sesler tarayıcıda canlı frekans senteziyle üretilmektedir.

---

## 🎮 2. Bilişsel Egzersiz Kataloğu (18 Oyun + 1 Canlı PvP Düello Arenası)

Uygulamada 5 temel nöro-bilişsel kategoride (Hafıza, Dikkat, Hız, Esneklik, Mantık) toplam 18 özgün oyun ve 1 adet Canlı PvP Zihin Arenası yer almaktadır:

---

### ♟️ 1. Kuantum Büyülü Satranç (`KuantumSatranc.jsx`)
- **Bilişsel Alan:** Mantık & Stratejik Planlama
- **Özet:** Klasik satranç kurallarını fantezi RPG büyü mekaniği ve gelişmiş konumsal yapay zeka ile harmanlayan fütüristik satranç.
- **Özel Kurallar, Kura & Tahta Dinamikleri:**
  - **Rastgele Renk Seçimi (Kura Sistemi):** Oyun her başladığında oyuncunun rengi adil bir kura ile belirlenir (%50 Beyaz ♔, %50 Siyah ♚).
  - **Siyahlar Her Zaman İlk Başlar:** Satrancımızın özel kuantum kuralı gereği oyuna **her zaman Siyah taşlar başlar**. Eğer kura ile oyuncuya Siyah gelirse ilk hamleyi oyuncu yapar; oyuncuya Beyaz gelirse açılışı Siyah taşlarla Yapay Zeka (AI) yapar.
  - **Dinamik Tahta Bakış Açısı (Perspective Auto-Flip):** Oyuncu Siyah ile oynarken tahta otomatik olarak oyuncunun bakış açısına göre çevrilir (Siyah taşlar alt kısımda, rakip üst kısımda yer alır).
  - **Yüksek Kontrastlı Tahta Teması:** Kareler arasındaki renk farkının gözü yormadan belirgin olması için açık arduvaz (`#cbd5e1`) ve derin arduvaz (`#334155`) yüksek kontrastlı kare paleti uygulandı. Beyaz taşlara koyu kontur, siyah taşlara beyaz ışıma gölgesi verilerek her kare üzerinde kusursuz görsel netlik sağlandı.
  - **Şah Dokunulmazlığı / Kural:** Işınlanma, Dondurma ve Kalkan büyüleri **ŞAH taşlarına uygulanamaz**! Şah her zaman kalkan takılamaz, dondurulamaz ve doğrudan ışınlanamaz. Yalnızca normal taşlar büyülenebilir.
  - **Dengeli Şah Bildirimi:** Şah çekildiğinde dikkati dağıtan abartılı sarsıntılar yerine zarif, temiz durum bildirimleri (`⚠️ Şah Durumu`) kullanılır.
  - **Çift Taraflı Enerji & Orb Sistemi:** Yalnızca oyuncu değil, **Yapay Zeka da enerji toplar** (`AI Enerjisi: [X/3] ⚡ Y Orb`) ve sırası geldiğinde akıllıca Kalkan, Dondurma ve Terfi büyüleri kullanabilir!
  - **Gelişmiş Konumsal Yapay Zeka (Chess Heuristics Engine):**
    - Satranç motorlarında kullanılan PST (Piece-Square Tables) konumsal puanlama matrisleri (Siyah ve Beyaz duruma göre dinamik hesaplanır).
    - Açmaz ve taş asma (blunder) engelleme: Karşılıksız taş kayıplarını hesaplayıp taşlarını koruma.
    - Merkez karelerin kontrolü (d4, e4, d5, e5), erken rok tercihi ve geçerken alma (en passant) taktikleri.
- **Büyü ve Kural Değiştirici Kataloğu:**
  1. *Işınlanma (Teleport - 2⚡):* Şah hariç herhangi bir dost taşı tahtadaki dilediğiniz boş bir kareye anında nakleder.
  2. *Kuantum Kalkanı (1⚡):* Şah hariç seçilen dost taşı 1 vuruşa karşı dokunulmaz kılar.
  3. *Dondurma (Freeze - 1⚡):* Şah hariç seçilen rakip taşı 2 tur boyunca hareket edemez hale getirir.
  4. *Vezir'e Terfi (Ascend - 2⚡):* Seçilen piyonu anında Vezir'e dönüştürür.
  5. *Zaman Ekle (1⚡):* Süre bütçesine +10 saniye ekler.
  6. *Kural Değiştir (Rule Change - 2⚡):* Geri Piyon, Kale Atlama, Çift Hamle, Vezir Yasağı gibi kuantum kurallarını aktif eder.
- **Kontroller:** Fare ile taş seçimi ve hedef kareye tıklama.

---

### 🧩 2. Zihin Matrisi (`ZihinMatrisi.jsx`)
- **Bilişsel Alan:** Uzamsal Çalışma Hafızası
- **Özet:** 4x4 ızgarada kısa süreliğine parıldayan nöral karelerin konumlarını hafızaya kazıma.
- **Mekanik:**
  - Seviye arttıkça ezberlenecek kare sayısı artar (3'ten başlayarak).
  - Değerlendirme animasyonu sırasında istenmeyen çift/spam tıklamalar engellenmiştir.
  - 3 can hakkı ile maksimum seviyeye ulaşma hedeflenir.

---

### 🚂 3. Tren Yolu & Makas (`TrenYolu.jsx`)
- **Bilişsel Alan:** Seçici Dikkat & Hızlı Planlama
- **Özet:** Raylardan gelen renkli trenleri kendi renklerine uygun istasyonlara yönlendirme.
- **Gelişmiş Kontroller & İyileştirmeler:**
  - **Klavye Kısayolları:** Klavyedeki `1`, `2`, `3`, `4` tuşlarına basarak trenleri anında ilgili istasyona gönderebilirsiniz.
  - 4 istasyon rengi (🔴 Kırmızı, 🔵 Mavi, 🟢 Yeşil, 🟡 Sarı) tren havuzuyla tam eşitlenmiştir.
  - Tren kaçtığında can düşer (5 can hakkı).

---

### ⚡ 4. Şimşek Refleks (`SimsekRefleks.jsx`)
- **Bilişsel Alan:** Reaksiyon Hızı & Çalışma Belleği (2-Back Prensibi)
- **Özet:** Ekrana gelen yeni sembolün bir önceki sembolle aynı olup olmadığını saliseler içinde tespit etme.
- **Gelişmiş Kontroller:**
  - **Klavye Kısayolları:** `A` veya `Sol Ok` = AYNI, `D` veya `Sağ Ok` = FARKLI.
  - Çift tıklama ve seri puan spamı engellenmiştir.
  - 4+ seri yapıldığında 2x puan çarpanı devreye girer.

---

### 🎨 5. Direnç ve Odak / Stroop Testi (`RenkMatrisi.jsx`)
- **Bilişsel Alan:** Bilişsel Ket Vurma & Çeldirici Bastırma
- **Özet:** Ekranda yazan kelimenin anlamına değil, yazıldığı mürekkep rengine odaklanma.
- **Nörolojik Temel:**
  - Beynin otomatik okuma refleksini baskılayıp renk tanıma merkezini öne çıkarma yeteneğini ölçer.
  - 6 renk seçeneği (Kırmızı, Mavi, Yeşil, Sarı, Mor, Turuncu).

---

### 🧭 6. Yön ve Akış / Ebb & Flow (`YonVeAkis.jsx`)
- **Bilişsel Alan:** Bilişsel Esneklik & Yön Algısı
- **Özet:** 5x5 ok sürüsünün tam ortasındaki merkez okun baktığı yönü bulma.
- **Gelişmiş Kontroller:**
  - **Klavye Kısayolları:** Doğrudan klavyedeki `Ok Tuşları (⬆️ ⬇️ ⬅️ ➡️)` veya `W, A, S, D` tuşlarıyla ultra akıcı oynanabilir.
  - Çevre okların çeldirici akışına karşı odaklanmayı güçlendirir.

---

### 🌪️ 7. Matematik Fırtınası (`MatematikFirtinasi.jsx`)
- **Bilişsel Alan:** Mantık & Sayısal İşlem Hızı
- **Özet:** Zihinsel denklemdeki eksik halkayı (`? + B = C` veya `A * ? = C`) süre bitmeden bulma.
- **Puanlama:**
  - Arka arkaya doğru cevaplarda 5x kombo çarpanına kadar katlanan puan sistemi.
  - 30 saniye içinde maksimum işlem hedefi.

---

### 🔷 8. Desen Rozet (`DesenRozet.jsx`)
- **Bilişsel Alan:** Uzamsal Problem Çözme
- **Özet:** Izgara üzerindeki geometrik sembollerin dizilimini ezberleyip tekrar oluşturma.
- **Düzeltilen Kritik Hata:**
  - Desen üreticisi ile oyuncunun seçim butonları (`AVAILABLE_SHAPES`) tam senkronize edildi. Önceden butonlarda olmayan sembollerin desende çıkıp oyunu kitlemesi engellendi (%100 çözülebilir hale getirildi).

---

### 💬 9. Kelime Balonları (`KelimeBalonlari.jsx`)
- **Bilişsel Alan:** Dil Zekası & Sözel Akıcılık
- **Özet:** Verilen 2 harfli kök ile başlayan anlamlı Türkçe kelimeler üretme.
- **Yeni Eklenenler:**
  - **Otomatik Rotasyon:** 4 kelime bulunduğunda sistem otomatik +300 bonus vererek yeni harf köküne geçer.
  - **🔄 Harfi Değiştir (Pas):** Takılma durumunda oyuncunun yeni kök alabilmesi için pas butonu eklendi.
  - En az 3 harfli kelime kuralı ile anlamsız harf spamı engellendi.

---

### 🔄 10. Zihin Geçişi / Brain Shift (`ZihinGecis.jsx`)
- **Bilişsel Alan:** Bilişsel Esneklik & Görev Değiştirme
- **Özet:** Sürekli değişen kurala göre ("RENK" ise emoji rengi, "YAZI" ise kelime adı) doğru seçeneği işaretleme.
- **İyileştirme:**
  - Karışıklık yaratan "ŞEKİL" kural adı "YAZI" olarak netleştirildi. Kural değiştiğinde ekranda turuncu şimşek uyarısı belirir.

---

### 🦅 11. Kartal Göz / Eagle Eye (`KartalGoz.jsx`)
- **Bilişsel Alan:** Görsel Dikkat & Çevre Görüşü
- **Özet:** 7x7 yoğun hayvan ızgarasında hedef hayvanı en kısa sürede bulup temizleme.
- **İyileştirme:**
  - Oyun süresi adil tempo için 30 saniyeden **45 saniyeye** çıkarıldı.

---

### 👥 12. Tanıdık Yüzler (`TanidikYuzler.jsx`)
- **Bilişsel Alan:** Sosyal Hafıza & İsim Eşleme
- **Özet:** Ekrana sırayla gelen karakterlerin yüzlerini ve isimlerini ezberleyip testte doğru eşleştirme.
- **İyileştirme:**
  - Asenkron zamanlayıcılar ve hızlı geçiş durumları bellek sızıntısına karşı korumaya alındı.

---

### 🧱 13. Blok Ustası / Block Champ (`BlokUstasi.jsx`)
- **Bilişsel Alan:** Uzamsal Zeka & Geometri
- **Özet:** Verilen tetris benzeri blokları 8x8 alana stratejik dizerek satır ve sütunları patlatma.
- **Mekanik:**
  - Kombo temizleme (aynı anda hem satır hem sütun patlatma katlanan puan kazandırır).
  - Yer kalmadığında oyun biter.

---

### ⚡ 14. Neuro Flash (`NeuroFlash.jsx`)
- **Bilişsel Alan:** Bilişsel Hız & Flaş Hafıza
- **Özet:** Saliselik hızla ekranda yanıp sönen sayıları akılda tutma ve kurala göre zihinden işleme.
- **Özellikler:**
  - **Aktif Geri Çağırma (Active Recall):** Ekranda hazır şıklar yerine kullanıcının klavyeden veya dokunmatik numpad'den kendisinin yazdığı mod.
  - **Zorluk Seçici:** Kolay, Orta, Zor kademeleri.
  - **3 Oyun Modu:** Tek Başına Hız Testi, Neuro-Bot'a Karşı Yarış, 2 Kişilik Yerel Düello.
  - MPD (Milisaniye Reaksiyon Skoru) ve yüzdelik hız dilimi hesaplayıcı.

---

### 🌑 15. Kör Uçuş Labirenti (`KorUcusLabirenti.jsx`)
- **Bilişsel Alan:** Uzamsal Hafıza & Zihinsel Haritalama
- **Özet:** 3.5 saniye labirenti ezberledikten sonra ekran tamamen kararır; oyuncu zihnindeki haritayla çıkışa (🏁) yürür.
- **İyileştirme:**
  - **1.5s Radar Flaşı:** Duvara veya tuzağa çarptığınızda oyuncuya 1.5 saniyelik anlık radar görüntüsü verilir; böylece yön kaybı adil şekilde telafi edilir.
  - Klavyeden `Ok Tuşları` veya `W, A, S, D` ile tam kontrol.

---

### 🚨 16. Paradoks Protokolü (`ParadoksProtokolu.jsx`)
- **Bilişsel Alan:** Bilişsel Ket Vurma & Ters Refleks
- **Özet:** Normalde emirlere hızla uyulur; ancak **🚨 PARADOKS ALARMI** çaldığında oyuncu ilk dürtüsünü bastırıp tam tersini yapmak zorundadır.
- **İyileştirme:**
  - Seçenek butonlarının yerleri (Sol/Sağ) her turda rastgele karıştırılarak kas hafızası yerine gerçek zihin refleksi zorunlu kılındı.

---

### 🧪 17. Sözcük Kimyası & Simyası (`SozcukSimyasi.jsx`)
- **Bilişsel Alan:** Sözel Akıcılık, Bilişsel Esneklik & Problem Çözme
- **Özet:** Her adımda yalnızca 1 harf değiştirerek başlangıç kelimesini hedef kelimeye dönüştürme (Word Ladder).
- **Yeni Özellikler & Kapsamlı Zorluk Sistemi:**
  - **4 Farklı Zorluk Kademesi:**
    1. **🟢 Çırak (Kolay - 3 Harfli - 15 Bölüm):** Hızlı ve akıcı 3 harfli kelimelerle 2–3 hamlelik zincirler (`KAZ ➔ YOL`, `BAL ➔ GÖL`, `KUM ➔ ÇAM`, `BAŞ ➔ KIŞ`, `TAY ➔ VAY` vb.).
    2. **🟡 Kalfa (Orta - 4 Harfli - 15 Bölüm):** Klasik 4 harfli kelimelerle 3–4 hamlelik simya dönüşümleri (`MASA ➔ KITA`, `YOLU ➔ BORU`, `KENT ➔ RANT`, `TANE ➔ DERE`, `DOST ➔ MEST` vb.).
    3. **🔴 Üstat (Zor - 4 Harfli Derin Zincirler - 15 Bölüm):** Stratejik, 4–6 hamlelik derin kelime zincirleri (`KALE ➔ SÜRÜ`, `KURT ➔ DERT`, `TARZ ➔ PARK`, `MODA ➔ KALE`, `DERE ➔ SÜRÜ` vb.).
    4. **🟣 Efsane (Uzman - 5 Harfli İleri Seviye - 15 Bölüm):** En üst seviye 5 harfli simya zincirleri (`DENİZ ➔ TEMİZ`, `ÇİÇEK ➔ DİLEK`, `BEYİN ➔ RESİM`, `KAVUN ➔ BOYUN`, `GÜNEŞ ➔ GÜREŞ` vb.).
  - **Toplam 60 Özgün Bölüm:** Her zorluk kademesinde 15'er adet olmak üzere toplam **60 zengin bulmaca etabı**.
  - **İnteraktif 15'li Bölüm Gezgini:** 1'den 15'e kadar numaralandırılmış butonlarla istenilen bölüme doğrudan geçiş ve çözülen bölümlerde yeşil onay (`✓`) rozeti.
  - **💡 Akıllı İpucu Sistemi & 🔄 Baştan Al Butonu:** Tıkandığınızda hedefe giden bir sonraki kelimeyi veya değiştirilmesi gereken harf pozisyonunu fısıldayan simya asistanı ve tek tıkla bölümü sıfırlama.
  - **Genişletilmiş Zengin Türkçe Sözlük:** 3, 4 ve 5 harfli yüzlerce onaylı Türkçe kelime ve Türkçe karakter (`İ/I`, `Ş`, `Ğ`, `Ü`, `Ö`, `Ç`) tam uyumu.
  - **Geri Al (Undo) & Konfeti Efektleri:** Hatalı hamleleri geri alma ve bölüm bitişinde konfeti kutlaması.

---

### ⏳ 18. Kuantum Mayın Tarlası (`KuantumMayin.jsx`)
- **Bilişsel Alan:** Mantık, Kriz Yönetimi & Olasılık
- **Özet:** Mayın tarlasında kararsız geri sayımlı mayınları etkisiz kılma oyunu.
- **Kritik İyileştirmeler:**
  - **%100 Güvenli İlk Tıklama Garantisi (`placeMinesSafely`):** Mayınlar oyuncu ilk tıkladıktan sonra üretilir; ilk tıklamada bayrak modu kapalı olsa bile asla bayrak konulamaz, daima güvenli 3x3 temiz alan açılır. İlk tıklamada patlamak veya bayrakla kilitlenmek imkansızdır.
  - **Oyun Bitiş Patlama Sorununun Çözümü:** Son güvenli kare açıldığında zafer (`won`) koşulu geri sayımlardan önce denetlenir. Zafer anında tüm mayınlar otomatik olarak yeşil kalkanla (`🛡️`) etkisiz hale getirilir (disarmed) ve konfeti patlar; kararsız mayınların son hamlede yanlışlıkla patlayıp oyunu kaybettirmesi tamamen engellenmiştir.
  - **Tahtanın Kaybolmaması & Doğrudan Yeni Oyun:** Oyun bittiğinde tahta ekrandan kaybolmaz; temizlenen tüm kareler ve nötralize edilen mayınlar tahtada görünür kalır. Hemen üzerinde beliren zafer/yenilgi panosundaki `🎮 Yeni Oyunu Başlat` butonuyla tek tıkla yeni oyuna geçilir.
  - **Canlı Dijital Süre Sayacı (`⏱️ SÜRE: 00:00`):** İlk hamle yapıldığı andan itibaren saniye sayan, oyun bittiğinde donan ve zafer/yenilgi panosunda toplam süreyi gösteren klasik mayın tarlası kronometresi eklendi.
  - **Büyük ve Belirgin Kalan Bayrak Sayacı:** Arayüzün merkezinde dijital HUD göstergesiyle `🚩 Kalan Bayrak: X / 9` anlık olarak takip edilir. Maksimum 9 mayın sınırı aşılmaması için bayrak kısıtlaması getirildi.
  - **Çift Butonlu Net Mod Seçici:** `⛏️ Kare Aç (Normal Mod)` ve `🚩 Bayrak Modu (X/9)` birbirinden bağımsız iki net sekmeyle ayrıldı; mod karmaşası sonlandırıldı.
  - **Oyun İçi Yenileme:** Oyun devam ederken dilediğiniz an tek tıkla tahtayı sıfırlayan `🔄 Yenile` butonu eklendi.
  - **Kararsız Mayın Dengelemesi:** Geri sayımlar 15–20 hamleye çekildi; patlamaya 5 hamle kala ekranda acil durum uyarısı belirir.
  - **Özel Güçler:** Zaman Dondurma (40⚡) ve Kuantum Tarayıcı (60⚡).

---

### ⚔️ 19. Canlı 1v1 PvP Zihin Düellosu (`PvpArena.jsx`)
- **Bilişsel Alan:** Rekabetçi Bilişsel Hız & Strateji
- **Özet:** Yapay zeka şampiyonlarına (veya arkadaş listesine) karşı canlı zihinsel düello.
- **Özellikler:**
  - İki tarafın da 100 HP can barı vardır.
  - Her doğru cevap rakibe hasar verir.
  - **Savaş Büyüleri:** Zaman Dondurucu (rakibi kilitler), Sis Bombası (soruyu gizler), Nöro Kalkan (hasarı engeller).

---

## 🏆 3. Bilişsel Başarımlar ve Rozet Sistemi (Achievements & Badges)

Kullanıcının motivasyonunu ve oyun içi gelişimini ödüllendirmek amacıyla 5 kategoride **20 özel başarım rozeti** ve anlık altın bildirim sistemi entegre edilmiştir. Her başarım açıldığında oyuncuya özel XP ödülü verilir:

### ⚡ A. Neuro Flash & Bilişsel Hız Başarımları:
1. ⚡ **Flaş Kıvılcımı (+150 XP):** Neuro Flash oyununda ilk hız testini başarıyla tamamla.
2. 🏎️ **Işık Hızında Refleks (+300 XP):** Neuro Flash oyununda 850 veya daha yüksek rekor skora ulaş.
3. ⏱️ **Salise Avcısı (+400 XP):** Neuro Flash testinde 1000+ skor yaparak insanüstü hız dilimine gir.
4. 🤖 **Yapay Zeka Fatihi (+350 XP):** Neuro Flash Bot Düellosu modunda yapay zekayı mağlup et.

### 🧮 B. Matematik Fırtınası & Sayısal Başarımlar:
5. 🧮 **Aritmetik Çırağı (+150 XP):** Matematik Fırtınası oyununda ilk testini tamamla.
6. 🌪️ **Aritmetik Kasırgası (+300 XP):** Matematik Fırtınası'nda 1000 veya üzeri skora ulaş.
7. 🔥 **5x Kombo Ustası (+400 XP):** Matematik Fırtınası'nda kesintisiz 5x maksimum kombo çarpanına ulaş.
8. ⚡ **Zihinsel İşlemci (+500 XP):** Matematik Fırtınası'nda tek oyunda 1500+ rekor skor kır.

### ♟️ C. Strateji & Mantık Başarımları:
9. ♟️ **Kuantum Büyükustası (+350 XP):** Kuantum Satranç'ta şah mat yaparak zafer kazan.
10. 💣 **Bomba İmha Uzmanı (+350 XP):** Kuantum Mayın Tarlası'nı hiç patlamadan tamamen temizle.
11. 🦇 **Yarasa Sonarı (+300 XP):** Kör Uçuş Labirenti'nde karanlıkta duvara çarpmadan çıkışa ulaş.

### 🔄 D. Bilişsel Esneklik & Refleks Başarımları:
12. 🚨 **Paradoks Kontrolü (+300 XP):** Paradoks Protokolü'nde 900 veya üzeri skora ulaş.
13. 🧪 **Kelime Simyacısı (+300 XP):** Sözcük Simyası'nda bir bulmaca zincirini eksiksiz tamamla.
14. 💬 **Sözlük Dehası (+250 XP):** Kelime Balonları'nda tek oyunda 600+ skor topla.
15. ⚡ **Şimşek Refleks (+300 XP):** Şimşek Refleks oyununda 1000+ skora ulaş.

### 🌟 E. Genel Zihin, Seri & Sosyal Başarımlar:
16. 📅 **Haftalık Demir İrade (+400 XP):** Günlük antrenman serisinde 7 güne ulaş.
17. 🛡️ **Kalkan Güvencesi (+150 XP):** Envanterine en az 1 Seri Dondurucu (Streak Freeze) ekle.
18. 👶 **Süper Genç Zihin (+450 XP):** Bilişsel analizde beyin yaşını 22 veya altına indir.
19. ⚔️ **Arena Gladyatörü (+300 XP):** Canlı 1v1 PvP Düellosunda en az 5 zafer elde et.
20. 🌟 **Bilişsel Kaşif (+500 XP):** Katalogdaki en az 10 farklı bilişsel oyunu dene.

---

## 🛡️ 4. Seri (Streak) ve Dondurucu (Streak Freeze) Mekanizması

Kullanıcıların günlük egzersiz motivasyonunu korumak amacıyla Duolingo standartlarında adil bir takip sistemi kurulmuştur:

### ⚙️ Çalışma Mantığı (`storageService.js`):
1. **Tarih Farkı Hesabı (`getDaysDiff`):**
   - Son oynanan tarih (`lastPlayedDate`) ile bugünün takvim tarihi (`YYYY-MM-DD`) kıyaslanır.
2. **Yeni Gün İlk Oyun:**
   - Dün oynanmışsa ve bugün ilk kez bir oyun tamamlandıysa seri **+1 gün** artar.
   - Ekranda kutlama bildirimi çıkar (`🔥 Tebrikler! Günlük antrenmanın tamamlandı, serin X güne yükseldi!`).
3. **Kaçırılan Günlerde Otomatik Kalkan:**
   - Kullanıcı 1 gün antrenman yapmadığında depodaki **Seri Dondurucu** (`streakFreezeCount`) otomatik olarak **1 adet harcanır** ve serinin sıfırlanması önlenir.
   - Depoda dondurucu kalmamışsa seri adil olarak 0'a çekilir.
4. **Haftalık Görsel Takvim (`StreakFreezeModal.jsx`):**
   - 7 günlük çember takvimi üzerinde tamamlanan günler, bugünkü durum ve aktif dondurucu sayısı canlı gösterilir.
5. **🧪 Canlı Sistem Simülatörü:**
   - 24 saat beklemeye gerek kalmadan test amaçlı *"Dünü Atla (Test)"* ve *"+1 Gün Oyna (Test)"* butonları ile dondurucu harcama ve seri artırma anında denenebilir.

---

## ⚡ 4. Adrenalin, Stres Darbesi ve Görsel Efekt Motoru

Oyun deneyimini atmosferik kılmak için görsel ve işitsel bir reaksiyon motoru geliştirilmiştir:

- **Çevre Kenar Parıltısı (`AmbientEdgeOverlay.jsx`):**
  - Seçilen oyunun tema rengine göre ekran çerçevesinin kenarlarından merkeze doğru yumuşak ışık dalgaları yayılır.
- **Stres ve Adrenalin Şok Dalgası:**
  - `soundService.js` içerisindeki `triggerVisualPulse()` metodu, `window.dispatchEvent(new CustomEvent('neuro-fx'))` olayını fırlatır.
  - **Hatalı hamlede:** Ekranın kenarlarından ani ve şiddetli bir **kırmızı stres şok dalgası** parlar (stres seviyesini ve uyanıklığı artırır).
  - **Başarılı hamlede:** Ekran çevresinde yumuşak **yeşil zafer parıltısı** oluşur.
  - **Büyü / Seviye atlamada:** Büyülü camgöbeği/altın dalga efekti verilir.
- **Sentetik Web Audio API Motoru:**
  - Hiçbir mp3 dosyasına ihtiyaç duymadan, osilatör dalgaları (sine, triangle, sawtooth) ile gerçek zamanlı 8-bit ve fütüristik ses efektleri üretir.

---

## 📊 5. Performans Analiz Paneli ve Beyin Yaşı Algoritması (`AnalyticsModal.jsx`)

Kullanıcının gelişimini takip eden 3 sekmeli analitik kontrol paneli:

1. **Genel Durum (Bilişsel Röntgen):**
   - **Beyin Yaşı Hesaplama:** 5 temel alandaki (Hafıza, Dikkat, Hız, Esneklik, Mantık) puanların ağırlıklı ortalamasıyla dinamik beyin yaşı hesaplanır.
   - **Bilişsel Güç Grafiği:** 5 alanın yüzde çubukları ve durum rozetleri.
   - **Dinamik Zayıflık Danışmanı:** Kullanıcının en düşük puanlı alanını otomatik tespit eder ve o alanı geliştirecek spesifik oyun önerisinde bulunur.
2. **Oyun Geçmişi:**
   - Son 30 egzersizin saat, skor, kategori ve seviye kayıtlarını tutan liste.
3. **Kişisel Rekorlar:**
   - 18 oyunun her biri için tüm zamanların en yüksek skorlarını gösteren grid kartları.

---

## 👥 6. Sosyal Hub ve Arkadaş Sistemi (`FriendsModal.jsx` & `LeaderboardModal.jsx`)

- **Arkadaş Listesi:** Selin Yılmaz, Can Demir, Zeynep Kaya, Yaşar Umut Girgin gibi arkadaşlar, seviyeleri, serileri, kupa sayıları ve durumları.
- **Arkadaş Ekleme / Çıkarma:** Yeni profil ekleme ve silme desteği.
- **Doğrudan PvP Daveti:** Arkadaş listesindeki bir profilin yanındaki "Düello Yap" butonuna tıklayarak doğrudan PvP arenasına geçiş.
- **Genel Skor Tablosu (Leaderboard):** Haftalık en yüksek puan toplayanlar sıralaması.

---

## 🎨 7. Tema Seçenekleri

Uygulama 4 farklı renk teması sunar ve anlık olarak `document.documentElement` üzerinden CSS değişkenlerini günceller:
1. **🌊 Okyanus Slate (Varsayılan):** Koyu nöron mavisi ve cam moru tonları.
2. **☀️ Gün Işığı (Açık):** Aydınlık, ferah ve kontrastlı gündüz teması.
3. **🌿 Siber Nane:** Zümrüt yeşili ve siberpunk nane parıltıları.
4. **❄️ İskandinav (Açık):** Minimalist buz mavisi ve açık gri iskandinav stili.

---

## 📁 8. Dizin ve Dosya Mimarisi

```
lumosity-brain-lab/
├── index.html                           # Ana HTML giriş dosyası
├── package.json                         # Bağımlılıklar (React, Lucide-React, Vite)
├── Lumocity Ödev.md                     # Bu ödev ve sistem kılavuz dosyası
└── src/
    ├── App.jsx                          # Ana Router, bildirim ve modal yöneticisi
    ├── main.jsx                         # React DOM bağlayıcı
    ├── index.css                        # Temalar, cam efektleri ve animasyonlar
    ├── components/
    │   ├── Navbar.jsx                   # Üst menü, seri badge'i, tema ve ses düğmeleri
    │   ├── Dashboard.jsx                # 18 oyunluk ana vitrin ve PvP afişi
    │   ├── AmbientEdgeOverlay.jsx       # Ekran kenarı stres/zafer şok dalgaları
    │   ├── AnalyticsModal.jsx           # Beyin yaşı ve 3 sekmeli performans paneli
    │   ├── StreakFreezeModal.jsx        # Haftalık seri takvimi ve test simülatörü
    │   ├── LeaderboardModal.jsx         # Sosyal skor tablosu
    │   ├── FriendsModal.jsx             # Arkadaş hub'ı ve PvP davetleri
    │   ├── games/
    │   │   ├── KuantumSatranc.jsx       # 1. Kuantum Satranç (Siyahlar başlar)
    │   │   ├── ZihinMatrisi.jsx         # 2. Zihin Matrisi (Hafıza)
    │   │   ├── TrenYolu.jsx             # 3. Tren Yolu (1-4 klavye kısayolları)
    │   │   ├── SimsekRefleks.jsx        # 4. Şimşek Refleks (A/D kısayolları)
    │   │   ├── RenkMatrisi.jsx          # 5. Renk Matrisi (Stroop)
    │   │   ├── YonVeAkis.jsx            # 6. Yön ve Akış (Ok tuşları desteği)
    │   │   ├── MatematikFirtinasi.jsx   # 7. Matematik Fırtınası
    │   │   ├── DesenRozet.jsx           # 8. Desen Rozet (%100 senkronize)
    │   │   ├── KelimeBalonlari.jsx      # 9. Kelime Balonları (Rotasyonlu)
    │   │   ├── ZihinGecis.jsx           # 10. Zihin Geçişi (Renk vs Yazı)
    │   │   ├── KartalGoz.jsx            # 11. Kartal Göz (45s dengeli)
    │   │   ├── TanidikYuzler.jsx        # 12. Tanıdık Yüzler
    │   │   ├── BlokUstasi.jsx           # 13. Blok Ustası
    │   │   ├── NeuroFlash.jsx           # 14. Neuro Flash (Aktif hatırlama & numpad)
    │   │   ├── KorUcusLabirenti.jsx     # 15. Kör Uçuş Labirenti (1.5s sonar flaşı)
    │   │   ├── ParadoksProtokolu.jsx    # 16. Paradoks Protokolü (Rastgele butonlar)
    │   │   ├── SozcukSimyasi.jsx        # 17. Sözcük Simyası (Geniş Türkçe sözlük)
    │   │   ├── KuantumMayin.jsx         # 18. Kuantum Mayın (100% güvenli ilk tık)
    │   │   └── PvpArena.jsx             # 19. Canlı 1v1 PvP Düello
    │   └── illustrations/
    │       └── SvgIllustrations.jsx     # Tüm oyunların saf SVG kapak vektörleri
    └── services/
        ├── storageService.js            # Seri algoritması, dondurucu ve LocalStorage
        └── soundService.js              # Web Audio API sesleri ve neuro-fx olayları
```

---

## 🚀 9. Çalıştırma ve Derleme

- **Geliştirici Sunucusu:**
  ```bash
  npm run dev
  ```
  Varsayılan adres: `http://localhost:5173`

- **Üretim Derlemesi:**
  ```bash
  npm run build
  ```
  `dist/` klasörü altına optimize edilmiş HTML, CSS ve JS paketlerini üretir (0 hata ile derlenmektedir).

---
*Hazırlanma Tarihi: 30 Eylül 2026 — Synaptix Bilişsel Zihin Laboratuvarı*
