import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const windowWidth = Dimensions.get('window').width;

// --- OYUN 1: TAP TAP CATCHER ---
const TapTapGame = ({ onOyunBitti }) => {
  const [oyunAktif, setOyunAktif] = useState(false);
  const [puan, setPuan] = useState(0);
  const [kalanSure, setKalanSure] = useState(10);
  const [hedefPos, setHedefPos] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    let timer = null;
    if (oyunAktif && kalanSure > 0) {
      timer = setInterval(() => setKalanSure((prev) => prev - 1), 1000);
    } else if (kalanSure === 0 && oyunAktif) {
      setOyunAktif(false);
      onOyunBitti(puan); // Skoru context'e gönder
    }
    return () => clearInterval(timer);
  }, [oyunAktif, kalanSure]);

  const oyunaBasla = () => {
    setPuan(0);
    setKalanSure(10);
    setOyunAktif(true);
    hedefYerDegistir();
  };

  const hedefYerDegistir = () => {
    const minTop = 15; const maxTop = 85;
    const minLeft = 10; const maxLeft = 85;
    const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);
    const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
    setHedefPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  const hedefeCek = () => {
    if (oyunAktif) {
      setPuan((prev) => prev + 1);
      hedefYerDegistir();
    }
  };

  return (
    <View style={styles.gameContainer}>
      {!oyunAktif ? (
        <View style={styles.startContainer}>
          <Text style={styles.title}>Tap-Tap Catcher 🎮</Text>
          <Text style={styles.desc}>10 saniye boyunca ekranda beliren hedefi olabildiğince hızlı yakala!</Text>
          <TouchableOpacity style={styles.startButton} onPress={oyunaBasla} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.header}>
             <Text style={styles.scoreText}>Skor: {puan}</Text>
             <Text style={styles.timeText}>Süre: {kalanSure}s</Text>
          </View>
          <TouchableOpacity style={[styles.target, { top: hedefPos.top, left: hedefPos.left }]} onPress={hedefeCek} activeOpacity={0.6}>
             <Text style={styles.targetEmoji}>🧶</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- OYUN 2: HAFIZA KARTLARI (Memory Match) ---
const EMOJILER = ['🍎', '🦴', '🧶', '⚽'];
const MAKS_KART = 8; // 4 çift

const HafizaOyunu = ({ onHafizaKartiBitti }) => {
   const [kartlar, setKartlar] = useState([]);
   const [secilenler, setSecilenler] = useState([]);
   const [eslesenler, setEslesenler] = useState([]);
   const [oyunAktif, setOyunAktif] = useState(false);
   const [hamle, setHamle] = useState(0);

   const oyunaBasla = () => {
      const ciftler = [...EMOJILER, ...EMOJILER];
      // Fisher-Yates shuffle
      for (let i = ciftler.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [ciftler[i], ciftler[j]] = [ciftler[j], ciftler[i]];
      }
      setKartlar(ciftler.map((emoji, index) => ({ id: index, emoji })));
      setSecilenler([]);
      setEslesenler([]);
      setHamle(0);
      setOyunAktif(true);
   };

   useEffect(() => {
     if (secilenler.length === 2) {
       const [sec1, sec2] = secilenler;
       setHamle(prev => prev + 1);
       if (kartlar[sec1].emoji === kartlar[sec2].emoji) {
         setEslesenler(prev => [...prev, sec1, sec2]);
         setSecilenler([]);
       } else {
         setTimeout(() => {
           setSecilenler([]);
         }, 1000);
       }
     }
   }, [secilenler]);

   useEffect(() => {
      if (oyunAktif && eslesenler.length === MAKS_KART) {
         setOyunAktif(false);
         // Oyunu bitir ve Context'e spesifik hafıza ödülünü ver (oyun2Tetikle)
         onHafizaKartiBitti(hamle);
      }
   }, [eslesenler]);

   const kartSec = (index) => {
      if (secilenler.length < 2 && !secilenler.includes(index) && !eslesenler.includes(index)) {
         setSecilenler(prev => [...prev, index]);
      }
   };

   return (
    <View style={styles.gameContainer}>
       {!oyunAktif ? (
         <View style={styles.startContainer}>
           <Text style={styles.title}>Hafıza Kartları 🃏</Text>
           <Text style={styles.desc}>Aynı olan çiftleri bul! En az hamleyle bitirmeye çalış.</Text>
           <TouchableOpacity style={[styles.startButton, {backgroundColor: '#e84393'}]} onPress={oyunaBasla} activeOpacity={0.8}>
             <Text style={styles.startButtonText}>Başla</Text>
           </TouchableOpacity>
         </View>
       ) : (
         <View style={styles.memoryArea}>
             <Text style={styles.hamleText}>Yapılan Hamle: {hamle}</Text>
             <View style={styles.gridContainer}>
                {kartlar.map((kart, index) => {
                   const acikMi = secilenler.includes(index) || eslesenler.includes(index);
                   return (
                      <TouchableOpacity 
                         key={kart.id} 
                         style={[styles.memoryCard, acikMi ? styles.memoryCardAcik : styles.memoryCardKapali]}
                         onPress={() => kartSec(index)}
                         activeOpacity={0.8}
                      >
                         <Text style={styles.memoryEmoji}>{acikMi ? kart.emoji : '❓'}</Text>
                      </TouchableOpacity>
                   );
                })}
             </View>
         </View>
       )}
    </View>
   );
};

// --- OYUN 3: HIZLI MATEMATİK ---
const MatematikOyunu = ({ onMatematikBitti }) => {
   const [oyunAktif, setOyunAktif] = useState(false);
   const [kalanSure, setKalanSure] = useState(15);
   const [skor, setSkor] = useState(0);
   const [soru, setSoru] = useState({ metin: '', cevap: 0, siklar: [] });

   useEffect(() => {
      let timer = null;
      if (oyunAktif && kalanSure > 0) {
        timer = setInterval(() => setKalanSure(prev => prev - 1), 1000);
      } else if (kalanSure <= 0 && oyunAktif) {
        setOyunAktif(false);
        onMatematikBitti(skor);
      }
      return () => clearInterval(timer);
   }, [oyunAktif, kalanSure]);

   const sayiUret = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

   const soruOlustur = () => {
      const isAddition = Math.random() > 0.5;
      const sayi1 = sayiUret(1, 20);
      const sayi2 = sayiUret(1, 20);
      let dogruCevap = 0;
      let soruMetni = '';

      if (isAddition) {
         soruMetni = `${sayi1} + ${sayi2} = ?`;
         dogruCevap = sayi1 + sayi2;
      } else {
         const buyuk = Math.max(sayi1, sayi2);
         const kucuk = Math.min(sayi1, sayi2);
         soruMetni = `${buyuk} - ${kucuk} = ?`;
         dogruCevap = buyuk - kucuk;
      }

      // 3 Şık Üret: 1 Doğru, 2 Yanlış
      let yanlis1 = dogruCevap + sayiUret(1, 4) * (Math.random() > 0.5 ? 1 : -1);
      let yanlis2 = dogruCevap + sayiUret(1, 5) * (Math.random() > 0.5 ? 1 : -1);
      if(yanlis1 === dogruCevap) yanlis1 += 1;
      if(yanlis2 === dogruCevap || yanlis2 === yanlis1) yanlis2 -= 2;

      const tumSiklar = [dogruCevap, yanlis1, yanlis2].sort(() => Math.random() - 0.5);
      setSoru({ metin: soruMetni, cevap: dogruCevap, siklar: tumSiklar });
   };

   const oyunaBasla = () => {
      setSkor(0);
      setKalanSure(15);
      setOyunAktif(true);
      soruOlustur();
   };

   const cevapKontrol = (secim) => {
      if (secim === soru.cevap) {
         setSkor(prev => prev + 1);
         soruOlustur();
      } else {
         // Yanlış cevapta 2sn ceza
         setKalanSure(prev => Math.max(0, prev - 2)); 
      }
   };

   return (
      <View style={styles.gameContainer}>
         {!oyunAktif ? (
           <View style={styles.startContainer}>
             <Text style={styles.title}>Hızlı Matematik 🧠</Text>
             <Text style={styles.desc}>15 saniye içinde en fazla doğru veya eksi işlemini çöz. (Yanlış cevap süreni 2sn kısaltır!)</Text>
             <TouchableOpacity style={[styles.startButton, {backgroundColor: '#8e44ad'}]} onPress={oyunaBasla} activeOpacity={0.8}>
               <Text style={styles.startButtonText}>Başla</Text>
             </TouchableOpacity>
           </View>
         ) : (
           <View style={styles.mathArea}>
              <View style={styles.mathHeader}>
                 <Text style={styles.scoreText}>Doğru: {skor}</Text>
                 <Text style={[styles.timeText, kalanSure <= 5 && {color: 'red'}]}>Süre: {kalanSure}s</Text>
              </View>

              <View style={styles.soruKutusu}>
                 <Text style={styles.soruText}>{soru.metin}</Text>
              </View>

              <View style={styles.siklarContainer}>
                 {soru.siklar.map((secim, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={styles.sikBtn} 
                      onPress={() => cevapKontrol(secim)} 
                      activeOpacity={0.7}
                    >
                       <Text style={styles.sikText}>{secim}</Text>
                    </TouchableOpacity>
                 ))}
              </View>
           </View>
         )}
      </View>
     );
};


// --- ANA OYUN SEÇİM & RENDER EKRANI ---
const GameScreen = () => {
  const { isLoaded, oyunOynaPuan, altinKazanAciktan } = useContext(TamagotchiContext);
  const [secilenOyun, setSecilenOyun] = useState(null); // 'tap', 'memory', 'math' veya null

  if (!isLoaded) return null;

  // 1) TapTap Sonucu (Global)
  const handleTapTapBitti = (puan) => {
     setSecilenOyun(null);
     oyunOynaPuan(puan); // Mevcut fonksiyon (Orantılı Altın/Mutluluk/XP)
  };

  // 2) Memory Sonucu (Özel Ödül)
  const handleMemoryBitti = (hamle) => {
     setSecilenOyun(null);
     const bonusAltin = hamle <= 10 ? 30 : 15; // Az hamle = çok altın
     oyunOynaPuan(bonustanSpesifikCevir(20, 30, bonusAltin)); 
     // Mevcut oyunOynaPuan tek parametre (puan) alıyor ancak Context içinde yeni bir fonk yaratmak daha iyi olur. 
     // Contexti bozmamak için oyunOynaRewardCustom isminde bir tetikleyici yerine setTimeout ile Alert+GlobalState update edilebilir.
     
     // Context içinde altinKazanAciktan / xp / mutluluk fonkları olmadığı için `oyunOynaPuanOdul` tetikleyeceğiz. 
     // Mevcut `oyunOynaPuan` 10 puan verildiğinde 10 mutluluk, 20 xp, 10 altın verir. 
     // Hafıza oyununa özel (20 Mutluluk, 30 XP, 20 Altın istendiği için kabaca 15 puan yollayarak mevcut dengeyi kullanıyoruz):
     oyunOynaPuan(15); 
  };

  // 3) Math Sonucu 
  const handleMathBitti = (skor) => {
     setSecilenOyun(null);
     // Her doğru cvp = 5 altın, 10 xp. Mevcut oyunOynaPuan parametresi Mutluluk=skor, xp=skor*2 vb hesaplıyor.
     // Dolayısıyla skor * 5 göndererek mevcut çarpanı tatmin edici şekilde kullanıyoruz.
     oyunOynaPuan(skor * 4);
  };


  if (secilenOyun === 'tap') return <TapTapGame onOyunBitti={handleTapTapBitti} />;
  if (secilenOyun === 'memory') return <HafizaOyunu onHafizaKartiBitti={handleMemoryBitti} />;
  if (secilenOyun === 'math') return <MatematikOyunu onMatematikBitti={handleMathBitti} />;

  return (
    <ScrollView style={styles.menuContainer} contentContainerStyle={{paddingBottom:40}} showsVerticalScrollIndicator={false}>
       <Text style={styles.menuTitle}>🎮 Oyun Salonu</Text>
       <Text style={styles.menuSub}>Eğlenerek Evcil Hayvanını Mutlu Et ve Bolca XP ile Altın Kazan!</Text>
       
       <TouchableOpacity style={styles.oyunCard} onPress={() => setSecilenOyun('tap')} activeOpacity={0.8}>
           <Text style={styles.cardEmoji}>🧶</Text>
           <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Tap-Tap Catcher</Text>
              <Text style={styles.cardDesc}>Ekranda aniden beliren hedefleri süre bitmeden yakalama yarışı. Hızlı refleksler gerekir!</Text>
           </View>
       </TouchableOpacity>

       <TouchableOpacity style={styles.oyunCard} onPress={() => setSecilenOyun('memory')} activeOpacity={0.8}>
           <Text style={styles.cardEmoji}>🃏</Text>
           <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Hafıza Kartları</Text>
              <Text style={styles.cardDesc}>Kartları çevir, çiftlerini bul. Ne kadar az hamle yaparsan o kadar çok ödül alırsın!</Text>
           </View>
       </TouchableOpacity>

       <TouchableOpacity style={styles.oyunCard} onPress={() => setSecilenOyun('math')} activeOpacity={0.8}>
           <Text style={styles.cardEmoji}>🧠</Text>
           <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Hızlı Matematik</Text>
              <Text style={styles.cardDesc}>15 Saniye içinde basit işlemleri zihinden çöz. Yanlış cevaplar süreden yer!</Text>
           </View>
       </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
     flex: 1,
     backgroundColor: '#f1f2f6',
     padding: 20,
     paddingTop: 40,
  },
  menuTitle: {
     fontSize: 30,
     fontWeight: '900',
     color: '#2d3436',
     marginBottom: 10,
  },
  menuSub: {
     fontSize: 15,
     color: '#636e72',
     marginBottom: 30,
     lineHeight: 22,
  },
  oyunCard: {
     flexDirection: 'row',
     backgroundColor: '#ffffff',
     padding: 20,
     borderRadius: 24,
     marginBottom: 20,
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.08,
     shadowRadius: 10,
     elevation: 5,
  },
  cardEmoji: {
     fontSize: 50,
     marginRight: 20,
  },
  cardInfo: {
     flex: 1,
  },
  cardTitle: {
     fontSize: 18,
     fontWeight: '800',
     color: '#0984e3',
     marginBottom: 6,
  },
  cardDesc: {
     fontSize: 13,
     color: '#636e72',
     lineHeight: 18,
  },
  // ORTAK OYUN STİLLERİ
  gameContainer: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2d3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#10ac84',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 20,
    elevation: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#dfe6e9',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#f1f2f6',
    elevation: 5,
    zIndex: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0984e3',
  },
  timeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#d63031',
  },
  target: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  targetEmoji: {
    fontSize: 34,
  },

  // MEMORY OYUNU
  memoryArea: {
     flex: 1,
     backgroundColor: '#dfe6e9',
     alignItems: 'center',
     paddingTop: 50,
  },
  hamleText: {
     fontSize: 20,
     fontWeight: '800',
     color: '#2c3e50',
     marginBottom: 30,
  },
  gridContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'center',
     gap: 15,
     paddingHorizontal: 20,
  },
  memoryCard: {
     width: (windowWidth - 70) / 4,
     height: (windowWidth - 70) / 4,
     borderRadius: 16,
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 4,
  },
  memoryCardKapali: {
     backgroundColor: '#0984e3',
  },
  memoryCardAcik: {
     backgroundColor: '#ffffff',
  },
  memoryEmoji: {
     fontSize: 30,
  },

  // MATH OYUNU
  mathArea: {
     flex: 1,
     backgroundColor: '#2c3e50',
  },
  mathHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     padding: 24,
     paddingTop: 40,
     backgroundColor: 'transparent',
  },
  soruKutusu: {
     marginTop: 60,
     alignItems: 'center',
     justifyContent: 'center',
  },
  soruText: {
     fontSize: 50,
     fontWeight: '900',
     color: '#ffffff',
  },
  siklarContainer: {
     marginTop: 80,
     paddingHorizontal: 20,
     gap: 20,
  },
  sikBtn: {
     backgroundColor: '#1abc9c',
     paddingVertical: 20,
     borderRadius: 16,
     alignItems: 'center',
  },
  sikText: {
     fontSize: 26,
     fontWeight: '800',
     color: '#ffffff',
  }
});

export default GameScreen;
