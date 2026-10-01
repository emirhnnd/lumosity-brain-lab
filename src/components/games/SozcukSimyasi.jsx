import React, { useState } from 'react';
import { Play, Award, RotateCcw, Sparkles, ArrowRight, CheckCircle2, Lightbulb, ChevronLeft, ChevronRight, Zap, Crown, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

// 4 Farklı Zorluk Kademesinde Toplam 60 Özgün Simya Bulmacası
const PUZZLES_BY_DIFFICULTY = {
  kolay: [
    {
      id: 1,
      title: 'KAZ ➔ YOL',
      start: 'KAZ',
      target: 'YOL',
      hintChain: ['KAZ', 'KOL', 'YOL'],
      validChainWords: ['KAZ', 'KOL', 'YOL', 'KAL', 'YAL', 'KOR', 'YAZ', 'KOZ', 'BAZ', 'TOZ', 'KUL', 'KÖZ']
    },
    {
      id: 2,
      title: 'SES ➔ KÜS',
      start: 'SES',
      target: 'KÜS',
      hintChain: ['SES', 'SÜS', 'KÜS'],
      validChainWords: ['SES', 'SÜS', 'KÜS', 'KAS', 'KÖS', 'SOS', 'SÖZ', 'KÜP', 'KÜR', 'SÜT', 'SET']
    },
    {
      id: 3,
      title: 'BAL ➔ GÖL',
      start: 'BAL',
      target: 'GÖL',
      hintChain: ['BAL', 'BEL', 'BÖL', 'GÖL'],
      validChainWords: ['BAL', 'BEL', 'BÖL', 'GÖL', 'BOL', 'ÇÖL', 'DÖL', 'GEL', 'KAL', 'KOL', 'MAL', 'YAL']
    },
    {
      id: 4,
      title: 'KUM ➔ ÇAM',
      start: 'KUM',
      target: 'ÇAM',
      hintChain: ['KUM', 'KAM', 'ÇAM'],
      validChainWords: ['KUM', 'KAM', 'ÇAM', 'KUR', 'KUL', 'KAP', 'TAM', 'CAM', 'DAM', 'KIM']
    },
    {
      id: 5,
      title: 'TOZ ➔ GÜZ',
      start: 'TOZ',
      target: 'GÜZ',
      hintChain: ['TOZ', 'BOZ', 'BÜZ', 'GÜZ'],
      validChainWords: ['TOZ', 'BOZ', 'BÜZ', 'GÜZ', 'DÜZ', 'YÜZ', 'TUZ', 'GÖZ', 'KÖZ', 'SÖZ', 'BÖZ']
    },
    {
      id: 6,
      title: 'KOR ➔ YAL',
      start: 'KOR',
      target: 'YAL',
      hintChain: ['KOR', 'KOL', 'KAL', 'YAL'],
      validChainWords: ['KOR', 'KOL', 'KAL', 'YAL', 'BAL', 'MAL', 'YOL', 'ZOR', 'MOR', 'TOR', 'KÖY', 'BOY']
    },
    {
      id: 7,
      title: 'SÜT ➔ HAT',
      start: 'SÜT',
      target: 'HAT',
      hintChain: ['SÜT', 'SET', 'HAT'],
      validChainWords: ['SÜT', 'SET', 'HAT', 'KAT', 'MAT', 'SIT', 'ŞUT', 'SÜR', 'BAT', 'YAT', 'TAY']
    },
    {
      id: 8,
      title: 'GÖZ ➔ DÜZ',
      start: 'GÖZ',
      target: 'DÜZ',
      hintChain: ['GÖZ', 'GÜZ', 'DÜZ'],
      validChainWords: ['GÖZ', 'GÜZ', 'DÜZ', 'YÜZ', 'KÖZ', 'SÖZ', 'BÜZ', 'DİZ', 'GÖK', 'DÖL']
    },
    {
      id: 9,
      title: 'BAŞ ➔ KIŞ',
      start: 'BAŞ',
      target: 'KIŞ',
      hintChain: ['BAŞ', 'KAŞ', 'KIŞ'],
      validChainWords: ['BAŞ', 'KAŞ', 'KIŞ', 'BOŞ', 'BEŞ', 'TAŞ', 'YAŞ', 'KUŞ']
    },
    {
      id: 10,
      title: 'TAY ➔ VAY',
      start: 'TAY',
      target: 'VAY',
      hintChain: ['TAY', 'PAY', 'VAY'],
      validChainWords: ['TAY', 'PAY', 'VAY', 'YAY', 'FAY', 'BAY', 'ÇAY', 'KAY']
    },
    {
      id: 11,
      title: 'KÖY ➔ BOY',
      start: 'KÖY',
      target: 'BOY',
      hintChain: ['KÖY', 'SOY', 'BOY'],
      validChainWords: ['KÖY', 'SOY', 'BOY', 'TOY', 'KOY', 'BEY']
    },
    {
      id: 12,
      title: 'ÇAY ➔ BAL',
      start: 'ÇAY',
      target: 'BAL',
      hintChain: ['ÇAY', 'BAY', 'BAL'],
      validChainWords: ['ÇAY', 'BAY', 'BAL', 'MAL', 'YAL', 'KAL', 'TAY', 'PAY']
    },
    {
      id: 13,
      title: 'GÜL ➔ KÜL',
      start: 'GÜL',
      target: 'KÜL',
      hintChain: ['GÜL', 'TÜL', 'KÜL'],
      validChainWords: ['GÜL', 'TÜL', 'KÜL', 'DÜL', 'KÜP', 'KÜR', 'GÖL']
    },
    {
      id: 14,
      title: 'DAĞ ➔ SAĞ',
      start: 'DAĞ',
      target: 'SAĞ',
      hintChain: ['DAĞ', 'BAĞ', 'SAĞ'],
      validChainWords: ['DAĞ', 'BAĞ', 'SAĞ', 'YAĞ', 'ÇAĞ']
    },
    {
      id: 15,
      title: 'YAR ➔ NAR',
      start: 'YAR',
      target: 'NAR',
      hintChain: ['YAR', 'KAR', 'NAR'],
      validChainWords: ['YAR', 'KAR', 'NAR', 'VAR', 'DAR', 'BAR', 'GAR', 'YAL', 'YAZ']
    }
  ],
  orta: [
    {
      id: 1,
      title: 'MASA ➔ KITA',
      start: 'MASA',
      target: 'KITA',
      hintChain: ['MASA', 'KASA', 'KISA', 'KITA'],
      validChainWords: ['MASA', 'KASA', 'KISA', 'KITA', 'MAŞA', 'KARA', 'KURA', 'MOLA', 'KOLA', 'KOTA', 'YASA']
    },
    {
      id: 2,
      title: 'DERE ➔ KARE',
      start: 'DERE',
      target: 'KARE',
      hintChain: ['DERE', 'KERE', 'KARE'],
      validChainWords: ['DERE', 'KERE', 'KARE', 'DEDE', 'DEVE', 'KALE', 'KÖLE', 'KÜRE', 'TANE', 'TEKE', 'PARE']
    },
    {
      id: 3,
      title: 'YOLU ➔ BORU',
      start: 'YOLU',
      target: 'BORU',
      hintChain: ['YOLU', 'DOLU', 'BOLU', 'BORU'],
      validChainWords: ['YOLU', 'DOLU', 'BOLU', 'BORU', 'KORU', 'SORU', 'KOLU', 'MOLA', 'KOLA', 'SOLA']
    },
    {
      id: 4,
      title: 'PARA ➔ KURA',
      start: 'PARA',
      target: 'KURA',
      hintChain: ['PARA', 'KARA', 'KURA'],
      validChainWords: ['PARA', 'KARA', 'KURA', 'PARE', 'KARE', 'KÜRE', 'KASA', 'MASA', 'YARA', 'DARA']
    },
    {
      id: 5,
      title: 'KENT ➔ RANT',
      start: 'KENT',
      target: 'RANT',
      hintChain: ['KENT', 'KANT', 'BANT', 'RANT'],
      validChainWords: ['KENT', 'KANT', 'BANT', 'RANT', 'KART', 'BENT', 'DERT', 'MERT', 'SERT', 'BART']
    },
    {
      id: 6,
      title: 'ÇATI ➔ BATI',
      start: 'ÇATI',
      target: 'BATI',
      hintChain: ['ÇATI', 'KATI', 'BATI'],
      validChainWords: ['ÇATI', 'KATI', 'BATI', 'ÇALI', 'HALI', 'DARI', 'SARI', 'YATI', 'TATI', 'BACI']
    },
    {
      id: 7,
      title: 'BOYA ➔ ROTA',
      start: 'BOYA',
      target: 'ROTA',
      hintChain: ['BOYA', 'BOTA', 'ROTA'],
      validChainWords: ['BOYA', 'BOTA', 'ROTA', 'KOTA', 'KOLA', 'MOLA', 'SOYA', 'BORA', 'ROMA']
    },
    {
      id: 8,
      title: 'KALE ➔ KÖLE',
      start: 'KALE',
      target: 'KÖLE',
      hintChain: ['KALE', 'KARE', 'KÜRE', 'KÖRE', 'KÖLE'],
      validChainWords: ['KALE', 'KARE', 'KÜRE', 'KÖLE', 'KULE', 'KULA', 'KASA', 'KÖRE', 'SÜRE', 'ŞUBE']
    },
    {
      id: 9,
      title: 'ÇALI ➔ DARI',
      start: 'ÇALI',
      target: 'DARI',
      hintChain: ['ÇALI', 'DALI', 'DARI'],
      validChainWords: ['ÇALI', 'DALI', 'DARI', 'HALI', 'SARI', 'KATI', 'ÇATI', 'YALI']
    },
    {
      id: 10,
      title: 'TANE ➔ DERE',
      start: 'TANE',
      target: 'DERE',
      hintChain: ['TANE', 'TERE', 'DERE'],
      validChainWords: ['TANE', 'TERE', 'DERE', 'DEDE', 'DEVE', 'TEKE', 'KERE', 'KALE']
    },
    {
      id: 11,
      title: 'KUTU ➔ KOKU',
      start: 'KUTU',
      target: 'KOKU',
      hintChain: ['KUTU', 'KULU', 'KOLU', 'KOKU'],
      validChainWords: ['KUTU', 'KULU', 'KOLU', 'KOKU', 'KORU', 'SORU', 'BORU', 'DOLU', 'KUZU']
    },
    {
      id: 12,
      title: 'SARI ➔ HALI',
      start: 'SARI',
      target: 'HALI',
      hintChain: ['SARI', 'DARI', 'DALI', 'HALI'],
      validChainWords: ['SARI', 'DARI', 'DALI', 'HALI', 'ÇALI', 'YALI', 'KATI', 'ÇATI']
    },
    {
      id: 13,
      title: 'KEDİ ➔ DERİ',
      start: 'KEDİ',
      target: 'DERİ',
      hintChain: ['KEDİ', 'YEDİ', 'YERİ', 'DERİ'],
      validChainWords: ['KEDİ', 'YEDİ', 'YERİ', 'DERİ', 'GERİ', 'DELİ', 'DİŞİ']
    },
    {
      id: 14,
      title: 'DOST ➔ MEST',
      start: 'DOST',
      target: 'MEST',
      hintChain: ['DOST', 'POST', 'PEST', 'MEST'],
      validChainWords: ['DOST', 'POST', 'PEST', 'MEST', 'REST', 'DERT', 'MERT', 'SERT']
    },
    {
      id: 15,
      title: 'BOYU ➔ SORU',
      start: 'BOYU',
      target: 'SORU',
      hintChain: ['BOYU', 'SOYU', 'SORU'],
      validChainWords: ['BOYU', 'SOYU', 'SORU', 'KORU', 'BORU', 'DOLU', 'KOLU']
    }
  ],
  zor: [
    {
      id: 1,
      title: 'KALE ➔ SÜRÜ',
      start: 'KALE',
      target: 'SÜRÜ',
      hintChain: ['KALE', 'KARE', 'KÜRE', 'SÜRE', 'SÜRÜ'],
      validChainWords: ['KALE', 'KARE', 'KÜRE', 'SÜRE', 'SÜRÜ', 'KASA', 'KALA', 'KULA', 'KULE', 'ŞUBE', 'KÖLE']
    },
    {
      id: 2,
      title: 'KURT ➔ DERT',
      start: 'KURT',
      target: 'DERT',
      hintChain: ['KURT', 'KART', 'KANT', 'BANT', 'BENT', 'DERT'],
      validChainWords: ['KURT', 'KART', 'KANT', 'BANT', 'BENT', 'DERT', 'MERT', 'SERT', 'YURT', 'KENT', 'RANT']
    },
    {
      id: 3,
      title: 'GECE ➔ DEDE',
      start: 'GECE',
      target: 'DEDE',
      hintChain: ['GECE', 'GELE', 'GEBE', 'DEBE', 'DEDE'],
      validChainWords: ['GECE', 'GELE', 'GEBE', 'DEBE', 'DEDE', 'DERE', 'DEVE', 'TEKE', 'KERE', 'LEKE']
    },
    {
      id: 4,
      title: 'KOŞU ➔ DOLU',
      start: 'KOŞU',
      target: 'DOLU',
      hintChain: ['KOŞU', 'KOKU', 'KOLU', 'DOLU'],
      validChainWords: ['KOŞU', 'KOKU', 'KOLU', 'DOLU', 'BOLU', 'BORU', 'KORU', 'SORU', 'YOLU', 'KONU', 'KUZU']
    },
    {
      id: 5,
      title: 'TARZ ➔ PARK',
      start: 'TARZ',
      target: 'PARK',
      hintChain: ['TARZ', 'FARZ', 'FARS', 'PARS', 'PARA', 'PARK'],
      validChainWords: ['TARZ', 'FARZ', 'FARS', 'PARS', 'PARA', 'PARK', 'KART', 'KARA', 'TART', 'PARE']
    },
    {
      id: 6,
      title: 'ŞANS ➔ BANT',
      start: 'ŞANS',
      target: 'BANT',
      hintChain: ['ŞANS', 'KANS', 'KANT', 'BANT'],
      validChainWords: ['ŞANS', 'KANS', 'KANT', 'RANT', 'BANT', 'BENT', 'KENT', 'DERT', 'MERT', 'BART']
    },
    {
      id: 7,
      title: 'ASLA ➔ AVLU',
      start: 'ASLA',
      target: 'AVLU',
      hintChain: ['ASLA', 'AVLA', 'AVLU'],
      validChainWords: ['ASLA', 'AVLA', 'AVLU', 'ASMA', 'ASIK', 'USLU', 'AVCI', 'AYLA']
    },
    {
      id: 8,
      title: 'MODA ➔ KALE',
      start: 'MODA',
      target: 'KALE',
      hintChain: ['MODA', 'MOLA', 'KOLA', 'KALA', 'KALE'],
      validChainWords: ['MODA', 'MOLA', 'KOLA', 'KALA', 'KALE', 'KARE', 'KASA', 'KULA', 'KULE']
    },
    {
      id: 9,
      title: 'BANK ➔ RANT',
      start: 'BANK',
      target: 'RANT',
      hintChain: ['BANK', 'BANT', 'RANT'],
      validChainWords: ['BANK', 'BANT', 'RANT', 'KANT', 'KENT', 'BENT', 'DERT']
    },
    {
      id: 10,
      title: 'KUTU ➔ SORU',
      start: 'KUTU',
      target: 'SORU',
      hintChain: ['KUTU', 'KULU', 'KOLU', 'KORU', 'SORU'],
      validChainWords: ['KUTU', 'KULU', 'KOLU', 'KORU', 'SORU', 'BORU', 'DOLU', 'YOLU']
    },
    {
      id: 11,
      title: 'AYNA ➔ BACA',
      start: 'AYNA',
      target: 'BACA',
      hintChain: ['AYNA', 'AYLA', 'BALA', 'BACA'],
      validChainWords: ['AYNA', 'AYLA', 'BALA', 'BACA', 'BATI', 'KATI', 'ÇATI', 'HALI']
    },
    {
      id: 12,
      title: 'ROTA ➔ KULE',
      start: 'ROTA',
      target: 'KULE',
      hintChain: ['ROTA', 'KOTA', 'KOLA', 'KULA', 'KULE'],
      validChainWords: ['ROTA', 'KOTA', 'KOLA', 'KULA', 'KULE', 'KALE', 'KARE', 'KÜRE', 'ŞUBE']
    },
    {
      id: 13,
      title: 'YAZI ➔ KAZA',
      start: 'YAZI',
      target: 'KAZA',
      hintChain: ['YAZI', 'KAZI', 'KAZA'],
      validChainWords: ['YAZI', 'KAZI', 'KAZA', 'KARA', 'PARA', 'YARA', 'DARA']
    },
    {
      id: 14,
      title: 'DERE ➔ SÜRÜ',
      start: 'DERE',
      target: 'SÜRÜ',
      hintChain: ['DERE', 'KERE', 'KÜRE', 'SÜRE', 'SÜRÜ'],
      validChainWords: ['DERE', 'KERE', 'KÜRE', 'SÜRE', 'SÜRÜ', 'KARE', 'KALE', 'KÖLE']
    },
    {
      id: 15,
      title: 'TREN ➔ ÖREN',
      start: 'TREN',
      target: 'ÖREN',
      hintChain: ['TREN', 'ÖREN'],
      validChainWords: ['TREN', 'ÖREN', 'KENT', 'BENT']
    }
  ],
  efsane: [
    {
      id: 1,
      title: 'DENİZ ➔ TEMİZ',
      start: 'DENİZ',
      target: 'TEMİZ',
      hintChain: ['DENİZ', 'BENİZ', 'TEMİZ'],
      validChainWords: ['DENİZ', 'BENİZ', 'TEMİZ', 'HENÜZ', 'CEVİZ', 'GENİZ', 'ÇEKİÇ']
    },
    {
      id: 2,
      title: 'ÇİÇEK ➔ DİLEK',
      start: 'ÇİÇEK',
      target: 'DİLEK',
      hintChain: ['ÇİÇEK', 'ÇİLEK', 'DİLEK'],
      validChainWords: ['ÇİÇEK', 'ÇİLEK', 'DİLEK', 'BİLEK', 'BİÇEK', 'YÜREK']
    },
    {
      id: 3,
      title: 'SEVGİ ➔ VERGİ',
      start: 'SEVGİ',
      target: 'VERGİ',
      hintChain: ['SEVGİ', 'SERGİ', 'VERGİ'],
      validChainWords: ['SEVGİ', 'SERGİ', 'VERGİ', 'DERGİ']
    },
    {
      id: 4,
      title: 'ÇANTA ➔ CONTA',
      start: 'ÇANTA',
      target: 'CONTA',
      hintChain: ['ÇANTA', 'CANTA', 'CONTA'],
      validChainWords: ['ÇANTA', 'CANTA', 'CONTA', 'ÇANAK', 'KONAK']
    },
    {
      id: 5,
      title: 'KAŞIK ➔ LAYIK',
      start: 'KAŞIK',
      target: 'LAYIK',
      hintChain: ['KAŞIK', 'KAYIK', 'LAYIK'],
      validChainWords: ['KAŞIK', 'KAYIK', 'LAYIK', 'YANIK', 'TANIK']
    },
    {
      id: 6,
      title: 'KAVUN ➔ BOYUN',
      start: 'KAVUN',
      target: 'BOYUN',
      hintChain: ['KAVUN', 'KOVUN', 'KOYUN', 'BOYUN'],
      validChainWords: ['KAVUN', 'KOVUN', 'KOYUN', 'BOYUN', 'SOYUN', 'TORUN']
    },
    {
      id: 7,
      title: 'ÇORBA ➔ TORBA',
      start: 'ÇORBA',
      target: 'TORBA',
      hintChain: ['ÇORBA', 'ZORBA', 'TORBA'],
      validChainWords: ['ÇORBA', 'ZORBA', 'TORBA', 'BORSA']
    },
    {
      id: 8,
      title: 'KAVUK ➔ TANIK',
      start: 'KAVUK',
      target: 'TANIK',
      hintChain: ['KAVUK', 'TAVUK', 'TARUK', 'TARIK', 'TANIK'],
      validChainWords: ['KAVUK', 'TAVUK', 'TARUK', 'TARIK', 'TANIK', 'YANIK', 'KAYIK']
    },
    {
      id: 9,
      title: 'BEYİN ➔ RESİM',
      start: 'BEYİN',
      target: 'RESİM',
      hintChain: ['BEYİN', 'BESİN', 'KESİN', 'KESİM', 'RESİM'],
      validChainWords: ['BEYİN', 'BESİN', 'KESİN', 'KESİM', 'RESİM', 'VERİM', 'SERİM']
    },
    {
      id: 10,
      title: 'GÜNEŞ ➔ GÜREŞ',
      start: 'GÜNEŞ',
      target: 'GÜREŞ',
      hintChain: ['GÜNEŞ', 'GÜLEŞ', 'GÜREŞ'],
      validChainWords: ['GÜNEŞ', 'GÜLEŞ', 'GÜREŞ', 'GÜLEÇ']
    },
    {
      id: 11,
      title: 'KAHVE ➔ SAHNE',
      start: 'KAHVE',
      target: 'SAHNE',
      hintChain: ['KAHVE', 'SAHVE', 'SAHNE'],
      validChainWords: ['KAHVE', 'SAHVE', 'SAHNE', 'KAHPE']
    },
    {
      id: 12,
      title: 'KALEM ➔ BADEM',
      start: 'KALEM',
      target: 'BADEM',
      hintChain: ['KALEM', 'KADEM', 'BADEM'],
      validChainWords: ['KALEM', 'KADEM', 'BADEM', 'KİLEM']
    },
    {
      id: 13,
      title: 'KAĞIT ➔ YANIT',
      start: 'KAĞIT',
      target: 'YANIT',
      hintChain: ['KAĞIT', 'YAĞIT', 'YANIT'],
      validChainWords: ['KAĞIT', 'YAĞIT', 'YANIT', 'KANIT']
    },
    {
      id: 14,
      title: 'DENİZ ➔ GENİŞ',
      start: 'DENİZ',
      target: 'GENİŞ',
      hintChain: ['DENİZ', 'GENİZ', 'GENİŞ'],
      validChainWords: ['DENİZ', 'GENİZ', 'GENİŞ', 'BENİZ', 'TEMİZ']
    },
    {
      id: 15,
      title: 'KÖPEK ➔ KÜTEK',
      start: 'KÖPEK',
      target: 'KÜTEK',
      hintChain: ['KÖPEK', 'KÖTEK', 'KÜTEK'],
      validChainWords: ['KÖPEK', 'KÖTEK', 'KÜTEK', 'KÜPEŞ']
    }
  ]
};

// Genişletilmiş Zengin Türkçe Sözlük Seti (3, 4 ve 5 Harfli)
const COMMON_TURKISH_WORDS = new Set([
  // 3 Harfli
  'KAZ','YAZ','BAZ','KOL','YOL','KAL','YAL','KOR','KOZ','TOZ','SES','SÜS','KÜS','KAS','KÖS','SOS','SÖZ','KÜP','KÜR','SÜT','SET','HAT','KAT','MAT','SIT','ŞUT','SÜR','BAT','YAT','TAY','BAL','BEL','BÖL','GÖL','BOL','ÇÖL','DÖL','GEL','MAL','KUM','KAM','ÇAM','KUR','KUL','KAP','TAM','CAM','DAM','BOZ','BÜZ','GÜZ','DÜZ','YÜZ','TUZ','GÖZ','KÖZ','ZOR','MOR','TOR','KÖY','BOY','DİZ','GÖK','BEY','SOY','PAY','VAY','TOY','KOY','ÇAY','KAY','YAY','FAY','HAS','TAS','BAS','YAS','MAS','NAL','FAL','ŞAL','DAL','SAL','GÜL','KÜL','TÜL','ARI','AYI','ACI','AŞI','ANI','ÇAN','KAN','HAN','YAN','SAN','TAN','VAR','DAR','NAR','YAR','KAR','BAR','GAR','BAĞ','DAĞ','SAĞ','YAĞ','ÇAĞ','BAŞ','KAŞ','KIŞ','BOŞ','BEŞ','TAŞ','YAŞ','KUŞ','DÜL','KIM',
  // 4 Harfli
  'KALE','KARE','KÜRE','SÜRE','SÜRÜ','KASA','KALA','KULA','KULE','ŞUBE','KÖLE',
  'MASA','KISA','KITA','MAŞA','KARA','KURA','YASA','YAZI','PARA','PARE',
  'YOLU','DOLU','BOLU','BORU','KORU','SORU','KOLU','DOLI','MOLA','KOLA','SOLA',
  'DERE','DEVE','DEDE','TEKE','KERE','TANE','TAPA','TEPE','TİPİ','DERİ','GERİ','TERE',
  'KENT','KANT','BANT','RANT','KART','BART','BENT','DERT','MERT','SERT','KURT','YURT',
  'BABA','ANNE','KUZU','DANA','KEDİ','AYIK','AÇIK','AĞAÇ','AKIL','ALEM','ALTI','AMCA',
  'ARKA','ASIK','ASLA','ASMA','ATEŞ','AVCI','AYAK','AYNA','BACA','BALA','BANK','BATI',
  'BİNA','BOYA','BOTA','ROTA','KOTA','BORA','BOYU','BURU','CAMI','CUMA','ÇALI','ÇATI','KATI','DARI','DALI','DELİ','DİŞİ','DOST',
  'EKME','ELMA','ERİK','ESKİ','EVLİ','EZGİ','FARE','FİDE','FİLM','GAZİ','GECE','GELE','GEBE','DEBE','GEMİ',
  'GENÇ','GIDA','GİŞE','GÖLÜ','GÖZÜ','HALI','HAVA','HATA','İĞNE','İLKE','İLAÇ','İPEK',
  'KAFE','KAFA','KAPI','KAZA','KEÇİ','KOKU','KONU','KOŞU','KÖYÜ','KRAV','KURA',
  'KUTU','KULU','MAVİ','MODA','NANE','NEHİR','OCAK','ODUN','OKUL','OLAY','ORAN','ORDU','ORMAN',
  'ORUÇ','OYUN','ÖDÜL','ÖFKE','ÖLÇÜ','ÖMÜR','ÖYKÜ','ÖZET','PANO','PARK','PARS','FARS','FARZ','TARZ','TART','PİLOT','PLAN',
  'PUMA','RENK','RİSK','SAAT','SABA','SARI','SEVGİ','SIRA','SİTE','SPOR','STİL',
  'ŞANS','KANS','ŞAİR','ŞEHİ','ŞİŞE','TALİ','TANK','TAŞI','TREN','ÖREN','TÜRK','UÇAK','UMUT',
  'USTA','UYKU','USLU','AVLA','AVLU','AYLA','UZAY','ÜLKE','ÜMİT','ÜNLÜ','ÜZÜM','VAZO','VİDE','YALI','YARA','YATIR','LEKE',
  'POST','PEST','MEST','REST','KAZI','YEDİ','YERİ','SOYU',
  // 5 Harfli
  'DENİZ','BENİZ','TEMİZ','HENÜZ','CEVİZ','GENİZ','ÇEKİÇ','KİTAP','KATİP','SOĞUK','SICAK','SEVGİ','SERGİ','VERGİ','DERGİ','GÜZEL','KÖPRÜ',
  'ÇİÇEK','ÇİLEK','DİLEK','BİLEK','BİÇEK','YÜREK','ÇANTA','CANTA','CONTA','ÇANAK','KONAK',
  'KAŞIK','KAYIK','LAYIK','YANIK','TANIK','KAVUN','KOVUN','KOYUN','BOYUN','SOYUN','TORUN',
  'ÇORBA','ZORBA','TORBA','BORSA','KAVUK','TAVUK','TARUK','TARIK','BEYİN','BESİN','KESİN','KESİM','RESİM','VERİM','SERİM',
  'GÜNEŞ','GÜLEŞ','GÜREŞ','GÜLEÇ','KAHVE','SAHVE','SAHNE','KAHPE','KALEM','KADEM','BADEM','KİLEM',
  'KAĞIT','YAĞIT','YANIT','KANIT','GENİŞ','KÖPEK','KÖTEK','KÜTEK','KÜPEŞ'
]);

function getDiffCount(w1, w2) {
  if (w1.length !== w2.length) return 999;
  let diff = 0;
  for (let i = 0; i < w1.length; i++) {
    if (w1[i] !== w2[i]) diff++;
  }
  return diff;
}

export default function SozcukSimyasi({ onGameComplete }) {
  const [difficulty, setDifficulty] = useState('orta'); // kolay | orta | zor | efsane
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [inputWord, setInputWord] = useState('');
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | playing | solved
  const [errorMsg, setErrorMsg] = useState(null);
  const [hintMsg, setHintMsg] = useState(null);
  const [solvedByDifficulty, setSolvedByDifficulty] = useState({
    kolay: new Set(),
    orta: new Set(),
    zor: new Set(),
    efsane: new Set()
  });

  const puzzles = PUZZLES_BY_DIFFICULTY[difficulty] || PUZZLES_BY_DIFFICULTY.orta;
  const activePuzzle = puzzles[puzzleIndex % puzzles.length];
  const wordLength = activePuzzle.start.length;

  const startPuzzle = (diffKey, idx) => {
    const list = PUZZLES_BY_DIFFICULTY[diffKey] || PUZZLES_BY_DIFFICULTY.orta;
    const targetIdx = idx % list.length;
    const p = list[targetIdx];
    setDifficulty(diffKey);
    setPuzzleIndex(targetIdx);
    setCurrentWord(p.start);
    setHistory([p.start]);
    setInputWord('');
    setErrorMsg(null);
    setHintMsg(null);
    setPhase('playing');
    soundService.levelUp?.();
  };

  const startGame = () => {
    setScore(0);
    startPuzzle(difficulty, 0);
  };

  const switchDifficulty = (newDiff) => {
    soundService.click?.();
    startPuzzle(newDiff, 0);
  };

  const selectPuzzle = (idx) => {
    soundService.click?.();
    startPuzzle(difficulty, idx);
  };

  const nextPuzzle = () => {
    if (puzzleIndex < puzzles.length - 1) {
      selectPuzzle(puzzleIndex + 1);
    }
  };

  const prevPuzzle = () => {
    if (puzzleIndex > 0) {
      selectPuzzle(puzzleIndex - 1);
    }
  };

  const resetCurrentPuzzle = () => {
    soundService.click?.();
    setCurrentWord(activePuzzle.start);
    setHistory([activePuzzle.start]);
    setInputWord('');
    setErrorMsg(null);
    setHintMsg(null);
    setPhase('playing');
  };

  const handleMutate = (e) => {
    e.preventDefault();
    const candidate = inputWord.trim().toLocaleUpperCase('tr-TR');

    if (candidate.length !== wordLength) {
      showError(`Kelime tam ${wordLength} harfli olmalıdır!`);
      return;
    }

    if (candidate === currentWord) {
      showError('Farklı bir kelime girmelisin!');
      return;
    }

    const diff = getDiffCount(currentWord, candidate);
    if (diff !== 1) {
      showError(`Yalnızca 1 harf değiştirebilirsin! (${diff} harf değişti)`);
      return;
    }

    const isPuzzleWord = activePuzzle.validChainWords?.includes(candidate);
    const isKnownWord = COMMON_TURKISH_WORDS.has(candidate);

    if (!isPuzzleWord && !isKnownWord) {
      showError('Geçersiz veya sözlükte bulunmayan kelime!');
      return;
    }

    // Geçerli simya mutasyonu!
    soundService.success?.();
    const newHistory = [...history, candidate];
    setHistory(newHistory);
    setCurrentWord(candidate);
    setInputWord('');
    setErrorMsg(null);
    setHintMsg(null);

    // Hedefe ulaşıldı mı?
    if (candidate === activePuzzle.target) {
      const optimalSteps = activePuzzle.hintChain.length - 1;
      const playerSteps = newHistory.length - 1;
      const stepBonus = Math.max(120, 550 - (playerSteps - optimalSteps) * 50);

      soundService.levelUp?.();
      try {
        confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // ignore
      }

      const newScore = score + stepBonus;
      setScore(newScore);
      setPhase('solved');

      setSolvedByDifficulty(prev => {
        const nextSet = new Set(prev[difficulty]);
        nextSet.add(puzzleIndex);
        return { ...prev, [difficulty]: nextSet };
      });

      if (onGameComplete) {
        onGameComplete('sozcuk_simyasi', 'esneklik', newScore, puzzleIndex + 1);
      }
    }
  };

  const undoMove = () => {
    if (history.length <= 1) return;
    soundService.click?.();
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCurrentWord(newHistory[newHistory.length - 1]);
    setErrorMsg(null);
    setHintMsg(null);
  };

  const getHint = () => {
    soundService.spellCast?.();
    const chain = activePuzzle.hintChain;
    const currentPos = chain.indexOf(currentWord);

    if (currentPos !== -1 && currentPos < chain.length - 1) {
      const nextWord = chain[currentPos + 1];
      setHintMsg(`💡 İpucu: Hedefe giden sıradaki kelime: "${nextWord}"`);
    } else {
      for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] !== activePuzzle.target[i]) {
          setHintMsg(`💡 İpucu: ${i + 1}. harfi '${activePuzzle.target[i]}' yaparak hedefe yaklaşabilirsin!`);
          break;
        }
      }
    }
  };

  const showError = (msg) => {
    soundService.error?.();
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 2500);
  };

  const isSolved = (diffKey, idx) => {
    return solvedByDifficulty[diffKey]?.has(idx);
  };

  const solvedCountInCurrentDiff = solvedByDifficulty[difficulty]?.size || 0;

  return (
    <div className="glass-card game-container anim-pop" style={{ maxWidth: '620px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '0.3rem' }}>
            <Sparkles size={13} /> Sözel Kimya & Harf Mutasyonu
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-light)', margin: 0 }}>
            Sözcük Kimyası (Simya)
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--accent-gold)' }}>
            🏆 {score}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Bölüm {puzzleIndex + 1} / {puzzles.length} ({solvedCountInCurrentDiff} / {puzzles.length} Çözüldü)
          </div>
        </div>
      </div>

      {/* 4 Zorluk Kademesi Seçici Sekmeleri */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '5px',
        marginBottom: '0.85rem'
      }}>
        <button
          onClick={() => switchDifficulty('kolay')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            border: difficulty === 'kolay' ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
            background: difficulty === 'kolay' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.25)',
            color: difficulty === 'kolay' ? '#10b981' : 'var(--text-muted)',
            fontWeight: '800',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: difficulty === 'kolay' ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          🟢 Çırak (3 Harf)
        </button>

        <button
          onClick={() => switchDifficulty('orta')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            border: difficulty === 'orta' ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
            background: difficulty === 'orta' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0,0,0,0.25)',
            color: difficulty === 'orta' ? '#fbbf24' : 'var(--text-muted)',
            fontWeight: '800',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: difficulty === 'orta' ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          🟡 Kalfa (4 Harf)
        </button>

        <button
          onClick={() => switchDifficulty('zor')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            border: difficulty === 'zor' ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
            background: difficulty === 'zor' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0,0,0,0.25)',
            color: difficulty === 'zor' ? '#f87171' : 'var(--text-muted)',
            fontWeight: '800',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: difficulty === 'zor' ? '0 0 10px rgba(239, 68, 68, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          🔴 Üstat (4 Derin)
        </button>

        <button
          onClick={() => switchDifficulty('efsane')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            border: difficulty === 'efsane' ? '1.5px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
            background: difficulty === 'efsane' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(0,0,0,0.25)',
            color: difficulty === 'efsane' ? '#c084fc' : 'var(--text-muted)',
            fontWeight: '800',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: difficulty === 'efsane' ? '0 0 10px rgba(168, 85, 247, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          🟣 Efsane (5 Harf)
        </button>
      </div>

      {/* Bölüm Gezgini (15 Bölüm Izgarası) */}
      <div style={{
        background: 'rgba(0,0,0,0.25)',
        padding: '0.55rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <button
            onClick={prevPuzzle}
            disabled={puzzleIndex === 0}
            style={{
              padding: '0.3rem 0.6rem',
              background: puzzleIndex === 0 ? 'transparent' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '6px',
              color: puzzleIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: puzzleIndex === 0 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
          >
            <ChevronLeft size={14} /> Geri
          </button>

          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
            Bölüm {puzzleIndex + 1}: {activePuzzle.title}
          </span>

          <button
            onClick={nextPuzzle}
            disabled={puzzleIndex === puzzles.length - 1}
            style={{
              padding: '0.3rem 0.6rem',
              background: puzzleIndex === puzzles.length - 1 ? 'transparent' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '6px',
              color: puzzleIndex === puzzles.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: puzzleIndex === puzzles.length - 1 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
          >
            İleri <ChevronRight size={14} />
          </button>
        </div>

        {/* 15 Bölüm Numarası Butonları */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {puzzles.map((p, idx) => {
            const solved = isSolved(difficulty, idx);
            const active = idx === puzzleIndex;
            return (
              <button
                key={idx}
                onClick={() => selectPuzzle(idx)}
                style={{
                  width: '27px',
                  height: '27px',
                  borderRadius: '6px',
                  background: active
                    ? 'linear-gradient(135deg, #00f2fe, #6366f1)'
                    : solved
                    ? 'rgba(16, 185, 129, 0.35)'
                    : 'rgba(255,255,255,0.05)',
                  border: active
                    ? '1.5px solid #00f2fe'
                    : solved
                    ? '1px solid #10b981'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: active || solved ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s'
                }}
                title={`Bölüm ${idx + 1}: ${p.title}`}
              >
                {solved ? '✓' : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {phase === 'playing' || phase === 'solved' ? (
        <>
          {/* Hedef Gösterge Paneli */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid rgba(0, 242, 254, 0.3)',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: '800' }}>BAŞLANGIÇ</div>
              <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#38bdf8', letterSpacing: '3px' }}>
                {activePuzzle.start}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ArrowRight size={22} color="#fbbf24" />
              <span style={{ fontSize: '0.62rem', color: '#fbbf24', marginTop: '2px', fontWeight: '800' }}>Hedefe Ulaş</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: '800' }}>HEDEF</div>
              <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#10b981', letterSpacing: '3px' }}>
                {activePuzzle.target}
              </div>
            </div>
          </div>

          {/* Mevcut Kelime Görünümü (Büyük Dinamik Kutucuklar) */}
          <div style={{
            padding: '1.1rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15))',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
              Mevcut Kelime (Yalnızca 1 Harf Değiştir)
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {currentWord.split('').map((char, i) => (
                <div
                  key={i}
                  style={{
                    width: wordLength === 5 ? '48px' : '54px',
                    height: wordLength === 5 ? '52px' : '58px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '2px solid #00f2fe',
                    color: '#fff',
                    fontSize: wordLength === 5 ? '1.7rem' : '2rem',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)'
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
          </div>

          {/* Giriş Formu ve İşlem Butonları */}
          {phase === 'playing' && (
            <form onSubmit={handleMutate} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={wordLength}
                  value={inputWord}
                  onChange={e => setInputWord(e.target.value)}
                  placeholder={`Yeni ${wordLength} harfli kelime...`}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid rgba(255,255,255,0.15)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.85rem 1.3rem', fontSize: '0.95rem' }}>
                  Dönüştür
                </button>
                <button
                  type="button"
                  onClick={getHint}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(251, 191, 36, 0.4)',
                    background: 'rgba(251, 191, 36, 0.12)',
                    color: '#fbbf24',
                    cursor: 'pointer'
                  }}
                  title="İpucu Al"
                >
                  <Lightbulb size={18} />
                </button>
                <button
                  type="button"
                  onClick={resetCurrentPuzzle}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  title="Bölümü Baştan Al"
                >
                  <RotateCcw size={18} />
                </button>
                {history.length > 1 && (
                  <button
                    type="button"
                    onClick={undoMove}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    title="Geri Al"
                  >
                    ↩️
                  </button>
                )}
              </div>

              {errorMsg && (
                <div style={{ fontSize: '0.82rem', color: '#f43f5e', marginTop: '6px', textAlign: 'center', fontWeight: '700' }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {hintMsg && (
                <div style={{ fontSize: '0.82rem', color: '#fbbf24', marginTop: '6px', textAlign: 'center', fontWeight: '700' }}>
                  {hintMsg}
                </div>
              )}
            </form>
          )}

          {/* Çözüldü Panosu */}
          {phase === 'solved' && (
            <div style={{
              textAlign: 'center',
              padding: '1.1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 95, 70, 0.35))',
              border: '1.5px solid rgba(16, 185, 129, 0.6)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
            }}>
              <div style={{ color: '#10b981', fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                Simya Tamamlandı! Hedefe Ulaştın!
              </div>
              <p style={{ margin: '0 0 0.8rem 0', color: '#e2e8f0', fontSize: '0.9rem' }}>
                Toplam {history.length - 1} hamlede başarıyla dönüştürüldü.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {puzzleIndex < puzzles.length - 1 ? (
                  <button
                    onClick={nextPuzzle}
                    className="btn-primary"
                    style={{
                      padding: '0.65rem 1.4rem',
                      fontSize: '0.95rem',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    Sonraki Bölüm ({puzzleIndex + 2}/15) <ChevronRight size={16} />
                  </button>
                ) : (
                  <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '1rem' }}>
                    🏆 Tebrikler! {difficulty.toUpperCase()} kademesindeki tüm 15 bölümü tamamladınız!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Zincir Akışı / Hamle Geçmişi */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>
              Simya Zincir Akışı ({history.length - 1} Hamle):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              {history.map((w, i) => (
                <React.Fragment key={i}>
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    background: i === history.length - 1 ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${i === history.length - 1 ? '#00f2fe' : 'rgba(255,255,255,0.1)'}`,
                    color: i === history.length - 1 ? '#00f2fe' : '#fff',
                    fontSize: '0.85rem',
                    fontWeight: '800'
                  }}>
                    {w}
                  </span>
                  {i < history.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>➔</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {/* Başlangıç Ekranı (Idle) */}
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Her adımda <strong>yalnızca 1 harfi değiştirerek</strong> anlamlı Türkçe kelimeler türet.<br />
            4 farklı zorluk kademesinde toplam <strong>60 benzersiz simya bölümünü</strong> tamamla!
          </div>

          <button
            className="btn-primary"
            onClick={startGame}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '0.95rem',
              fontSize: '1.05rem',
              background: 'linear-gradient(135deg, #00f2fe, #6366f1)',
              boxShadow: '0 4px 20px rgba(0, 242, 254, 0.4)'
            }}
          >
            <Play size={19} /> Simyayı Başlat
          </button>
        </div>
      )}

    </div>
  );
}
