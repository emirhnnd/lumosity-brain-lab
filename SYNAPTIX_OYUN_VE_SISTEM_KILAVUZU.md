# 🧠 SYNAPTIX — Nöro-Bilişsel Zihin Laboratuvarı
## Kapsamlı Sistem Mimarisi, Oyun Kataloğu ve Geliştirici Kılavuzu

---

## 📌 1. Proje Genel Özeti ve Felsefesi

**Synaptix (Lumosity Brain Lab)**; bilişsel nöro-bilim ilkelerine dayanan, zihinsel işlem hızını, esnekliği, odaklanmayı, hafızayı ve mantıksal problem çözme yeteneğini geliştiren yeni nesil bir web uygulamasıdır.

### 🌟 Temel İlkeler ve Avantajlar:
- **Sıfır Paywall / %100 Ücretsiz:** Lumosity veya benzeri ticari platformlardaki abonelik ve ödeme duvarları olmadan tüm egzersizler, analizler ve özellikler sınırsız açıktır.
- **Modern Teknoloji Yığını:** React + Vite, saf CSS değişkenleri ile tema motoru (4 tema), LocalStorage veri tabanı ve Web Audio API tabanlı sentetik ses/efekt motoru.
- **Tam Çevrimdışı (Offline) Uyum:** Harici ağır ses kütüphanelerine veya resim sunucularına bağımlı değildir; tüm illüstrasyonlar saf SVG vektör olarak gömülüdür, tüm sesler tarayıcıda canlı frekans senteziyle üretilir.

---

## 🎮 2. Bilişsel Oyun Kataloğu (18 Oyun + 1 Canlı PvP Düello)

Uygulamada 5 ana bilişsel kategoride (Hafıza, Dikkat, Hız, Esneklik, Mantık) toplam 18 özgün oyun ve 1 adet Canlı PvP Zihin Arenası yer almaktadır.

---

### ♟️ 1. Kuantum Büyülü Satranç (`KuantumSatranc.jsx`)
- **Kategori:** Mantık & Strateji
- **Özet:** Klasik satranç kurallarını RPG büyü mekaniğiyle harmanlayan fütüristik satranç.
- **Öne Çıkan Kurallar:**
  - **Siyahlar Başlar:** Oyunda siyah taşlar (Yapay Zeka) ilk hamleyi yapar.
  - **Mana Sistemi:** Her yenen taş oyuncuya Mana (MP) kazandırır.
  - **3 Özel Büyü:**
    1. *Işınlanma (Teleport):* Herhangi bir taşı tahtadaki boş bir kareye anında nakleder.
    2. *Kuantum Kalkanı:* Seçilen taşı 1 tur boyunca yenilmekten korur.
    3. *Zaman Dondurma:* Rakibin sonraki hamlesini pas geçmesini sağlar.
- **Klavye / Kontrol:** Fare ile taş seçimi ve hedef kareye tıklama.

---

### 🧩 2. Zihin Matrisi (`ZihinMatrisi.jsx`)
- **Kategori:** Uzamsal Hafıza
- **Özet:** 4x4 ızgarada kısa süreliğine parlayan nöral karelerin konumlarını hafızaya kazıma.
- **Kurallar & Puanlama:**
  - Seviye arttıkça ezberlenecek kare sayısı artar (3'ten başlayarak).
  - Değerlendirme sırasında yanlış tıklama koruması aktiftir (spam tıklama önlenmiştir).
  - 3 can hakkı bulunur.

---

### 🚂 3. Tren Yolu & Makas (`TrenYolu.jsx`)
- **Kategori:** Dikkat & Planlama
- **Özet:** Raylardan hızla gelen renkli trenleri kendi renklerine uygun istasyonlara yönlendirme.
- **Kontroller & İyileştirmeler:**
  - **Klavye Kısayolları:** `1`, `2`, `3`, `4` tuşlarına basarak trenleri anında ilgili istasyona gönderebilirsiniz.
  - 4 istasyon rengi (🔴 Kırmızı, 🔵 Mavi, 🟢 Yeşil, 🟡 Sarı) ile tren renkleri tam senkronize edilmiştir.
  - Tren kaçtığında can düşer (5 can).

---

### ⚡ 4. Şimşek Refleks (`SimsekRefleks.jsx`)
- **Kategori:** Reaksiyon Hızı & Dikkat (2-Back Mantığı)
- **Özet:** Ekrana gelen yeni sembolün bir önceki sembolle aynı olup olmadığını saliseler içinde tespit etme.
- **Kontroller & İyileştirmeler:**
  - **Klavye Kısayolları:** `A` veya `Sol Ok` = AYNI, `D` veya `Sağ Ok` = FARKLI.
  - Çift tıklama ve seri puan spamı engellenmiştir.
  - Seri yaptıkça 2x kombo çarpanı devreye girer.

---

### 🎨 5. Direnç ve Odak / Stroop Testi (`RenkMatrisi.jsx`)
- **Kategori:** Bilişsel Ket Vurma & Dikkat
- **Özet:** Ekranda yazan kelimenin anlamına değil, yazıldığı mürekkep rengine odaklanma.
- **Mekanik:**
  - Beynin otomatik okuma refleksini bastırma yeteneğini ölçer.
  - 6 canlı renk paleti (Kırmızı, Mavi, Yeşil, Sarı, Mor, Turuncu).

---

### 🧭 6. Yön ve Akış / Ebb & Flow (`YonVeAkis.jsx`)
- **Kategori:** Bilişsel Esneklik
- **Özet:** 5x5 ok sürüsünün içindeki tam ortadaki merkez okun baktığı yönü bulma.
- **Kontroller & İyileştirmeler:**
  - **Klavye Kısayolları:** Doğrudan klavyedeki `Ok Tuşları (⬆️ ⬇️ ⬅️ ➡️)` veya `W, A, S, D` tuşlarıyla anında oynanabilir.
  - Çevre okların çeldirici akışına karşı odaklanmayı güçlendirir.

---

### 🌪️ 7. Matematik Fırtınası (`MatematikFirtinasi.jsx`)
- **Kategori:** Mantık & Sayısal Zeka
- **Özet:** Zihinsel denklemdeki eksik halkayı (`? + B = C` veya `A * ? = C`) süre bitmeden bulma.
- **Puanlama:**
  - Arka arkaya doğru cevaplarda 5x kombo çarpanına kadar katlanan puan sistemi.
  - 30 saniye boyunca maksimum işlem hızı.

---

### 🔷 8. Desen Rozet (`DesenRozet.jsx`)
- **Kategori:** Uzamsal Problem Çözme
- **Özet:** Izgara üzerindeki geometrik sembollerin dizilimini ezberleyip tekrar oluşturma.
- **Düzeltilen Kritik Hata:**
  - Desen üreticisi ile oyuncunun seçim butonları (`AVAILABLE_SHAPES`) tam senkronize edildi. Önceden butonlarda olmayan sembollerin desende çıkıp oyunu kitlemesi engellendi (%100 çözülebilir hale getirildi).

---

### 💬 9. Kelime Balonları (`KelimeBalonlari.jsx`)
- **Kategori:** Dil Zekası & Sözel Akıcılık
- **Özet:** Verilen 2 harfli kök ile başlayan anlamlı Türkçe kelimeler üretme.
- **Yeni Eklenenler:**
  - **Otomatik Rotasyon:** 4 kelime bulunduğunda sistem otomatik +300 bonus vererek yeni harf köküne geçer.
  - **🔄 Harfi Değiştir (Pas):** Takılma durumunda oyuncunun yeni kök alabilmesi için pas butonu eklendi.
  - En az 3 harfli kelime kuralı ile anlamsız spam engellendi.

---

### 🔄 10. Zihin Geçişi / Brain Shift (`ZihinGecis.jsx`)
- **Kategori:** Bilişsel Esneklik & Görev Değiştirme
- **Özet:** Sürekli değişen kurala göre ("RENK" ise emoji rengi, "YAZI" ise kelime adı) doğru seçeneği işaretleme.
- **İyileştirme:**
  - Karışıklık yaratan "ŞEKİL" kural adı "YAZI" olarak netleştirildi. Kural değiştiğinde ekranda turuncu şimşek uyarısı belirir.

---

### 🦅 11. Kartal Göz / Eagle Eye (`KartalGoz.jsx`)
- **Kategori:** Görsel Dikkat & Çevre Görüşü
- **Özet:** 7x7 yoğun hayvan ızgarasında hedef hayvanı en kısa sürede bulup temizleme.
- **İyileştirme:**
  - Oyun süresi adil tempo için 30 saniyeden **45 saniyeye** çıkarıldı.

---

### 👥 12. Tanıdık Yüzler (`TanidikYuzler.jsx`)
- **Kategori:** Sosyal Hafıza & İsim Eşleme
- **Özet:** Ekrana sırayla gelen karakterlerin yüzlerini ve isimlerini ezberleyip testte doğru eşleştirme.
- **İyileştirme:**
  - Asenkron zamanlayıcılar ve hızlı geçiş durumları bellek sızıntısına karşı korumaya alındı.

---

### 🧱 13. Blok Ustası / Block Champ (`BlokUstasi.jsx`)
- **Kategori:** Uzamsal Zeka & Geometri
- **Özet:** Verilen tetris benzeri blokları 8x8 alana stratejik dizerek satır ve sütunları patlatma.
- **Mekanik:**
  - Kombo temizleme (aynı anda hem satır hem sütun patlatma ekstra puan kazandırır).
  - Yer kalmadığında oyun biter.

---

### ⚡ 14. Neuro Flash (`NeuroFlash.jsx`)
- **Kategori:** Bilişsel Hız & Flaş Hafıza
- **Özet:** Saliselik hızla ekranda yanıp sönen sayıları akılda tutma ve kurala göre zihinden işleme.
- **Özellikler:**
  - **Aktif Geri Çağırma (Active Recall):** Ekranda şıklar yerine kullanıcının klavyeden veya dokunmatik numpad'den kendisinin yazdığı zorlayıcı mod.
  - **Zorluk Seçici:** Kolay, Orta, Zor kademeleri.
  - **3 Oyun Modu:** Tek Başına Hız Testi, Neuro-Bot'a Karşı Yarış, 2 Kişilik Yerel Düello.
  - MPD (Milisaniye Reaksiyon Skoru) ve yüzdelik hız dilimi hesaplayıcı.

---

### 🌑 15. Kör Uçuş Labirenti (`KorUcusLabirenti.jsx`)
- **Kategori:** Uzamsal Hafıza & Zihinsel Haritalama
- **Özet:** 3.5 saniye labirenti ezberledikten sonra ekran tamamen kararır; oyuncu zihnindeki haritayla çıkışa (🏁) yürür.
- **İyileştirme:**
  - **1.5s Radar Flaşı:** Duvara veya tuzağa çarptığınızda oyuncuya 1.5 saniyelik anlık radar görüntüsü verilir; böylece yön kaybı adil şekilde telafi edilir.
  - Klavyeden `Ok Tuşları` veya `W, A, S, D` ile tam kontrol.

---

### 🚨 16. Paradoks Protokolü (`ParadoksProtokolu.jsx`)
- **Kategori:** Bilişsel Ket Vurma & Ters Refleks
- **Özet:** Normalde emirlere hızla uyulur; ancak **🚨 PARADOKS ALARMI** çaldığında oyuncu ilk dürtüsünü bastırıp tam tersini yapmak zorundadır.
- **İyileştirme:**
  - Seçenek butonlarının yerleri (Sol/Sağ) her turda rastgele karıştırılarak kas hafızası yerine gerçek zihin refleksi zorunlu kılındı.

---

### 🧪 17. Sözcük Simyası (`SozcukSimyasi.jsx`)
- **Kategori:** Sözel Akıcılık & Problem Çözme
- **Özet:** Her adımda yalnızca 1 harf değiştirerek başlangıç kelimesini hedef kelimeye dönüştürme.
- **İyileştirme:**
  - Uydurma/kesik kelimeler elendi; 200+ popüler 4 harfli Türkçe kelime sözlüğü entegre edildi.
  - 4. bulmaca zinciri tamamen geçerli Türkçe kelimelerle (`DERE ➔ KERE ➔ KARE`) güncellendi.
  - Geri al (Undo) butonu desteği.

---

### ⏳ 18. Kuantum Mayın Tarlası (`KuantumMayin.jsx`)
- **Kategori:** Mantık, Kriz Yönetimi & Olasılık
- **Özet:** Mayın tarlasında kararsız geri sayımlı mayınları etkisiz kılma oyunu.
- **Kritik İyileştirmeler:**
  - **%100 Güvenli İlk Tıklama Garantisi (`placeMinesSafely`):** Mayınlar oyuncu ilk tıkladıktan sonra üretilir; tıklanan kare ve etrafındaki 3x3 çemberde ASLA mayın bulunmaz. İlk tıklamada patlamak imkansızdır.
  - **Kararsız Mayın Dengelemesi:** Geri sayımlar 15–20 hamleye çekildi; patlamaya 5 hamle kala ekranda acil durum uyarısı belirir.
  - **Özel Güçler:** Zaman Dondurma (40⚡) ve Kuantum Tarayıcı (60⚡).

---

### ⚔️ 19. Canlı 1v1 PvP Zihin Düellosu (`PvpArena.jsx`)
- **Kategori:** Rekabetçi Bilişsel Kapışma
- **Özet:** Yapay zeka şampiyonlarına (veya arkadaş listesine) karşı canlı zihinsel düello.
- **Özellikler:**
  - İki tarafın da 100 HP barı vardır.
  - Her doğru cevap rakibe hasar verir.
  - **Savaş Büyüleri:** Zaman Dondurucu (rakibi kilitler), Sis Bombası (soruyu gizler), Nöro Kalkan (hasarı engeller).

---

## 🛡️ 3. Seri (Streak) ve Dondurucu (Streak Freeze) Sistemi

Kullanıcıların günlük egzersiz alışkanlığını korumak amacıyla Duolingo benzeri adil ve gerçekçi bir seri sistemi kurulmuştur:

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
   - Test amaçlı *"Dünü Atla (Test)"* ve *"+1 Gün Oyna (Test)"* butonları ile dondurucu harcama ve seri artırma anında denenebilir.

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

## 👥 6. Sosyal Hub ve Arkadaşlar (`FriendsModal.jsx` & `LeaderboardModal.jsx`)

- **Arkadaş Listesi:** Selin Yılmaz, Can Demir, Zeynep Kaya, Yaşar Umut Girgin gibi arkadaşlar, seviyeleri, serileri, kupa sayıları ve durumları.
- **Arkadaş Ekleme / Çıkarma:** Yeni profil ekleme ve silme desteği.
- **Doğrudan PvP Daveti:** Arkadaş listesindeki bir profilin yanındaki "Düello Yap" butonuna tıklayarak doğrudan PvP arenasına geçiş.
- **Genel Skor Tablosu (Leaderboard):** Haftalık en yüksek puan toplayanlar sıralaması.

---

## 🎨 7. Tema ve Arayüz Seçenekleri

Uygulama 4 farklı renk teması sunar ve anlık olarak `document.documentElement` üzerinden CSS değişkenlerini günceller:
1. **🌊 Okyanus Slate (Varsayılan):** Koyu nöron mavisi ve cam moru tonları.
2. **☀️ Gün Işığı (Açık):** Aydınlık, ferah ve kontrastlı gündüz teması.
3. **🌿 Siber Nane:** Zümrüt yeşili ve siberpunk nane parıltıları.
4. **❄️ İskandinav (Açık):** Minimalist buz mavisi ve açık gri iskandinav stili.

---

## 📁 8. Dizin ve Dosya Yapısı

```
lumosity-brain-lab/
├── index.html                           # Ana HTML giriş dosyası
├── package.json                         # Bağımlılıklar (React, Lucide-React, Vite)
├── SYNAPTIX_OYUN_VE_SISTEM_KILAVUZU.md  # Bu kılavuz dosyası
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

## 🚀 9. Çalıştırma ve Derleme Komutları

- **Geliştirici Sunucusu:**
  ```bash
  npm run dev
  ```
  Varsayılan port: `http://localhost:5173`

- **Üretim Derlemesi:**
  ```bash
  npm run build
  ```
  `dist/` klasörü altına optimize edilmiş HTML, CSS ve JS paketlerini üretir (0 hata ile derlenmektedir).

---
*Belge Son Güncelleme: 30 Eylül 2026 — Synaptix Bilişsel Laboratuvarı*
