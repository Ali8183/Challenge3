import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const windowWidth = Dimensions.get('window').width;

// --- REUSABLE GAME OVER UI ---
const GameOverOverlay = ({ odul, onTekrarOyna, onMenuyeDon }) => {
   return (
      <View style={styles.gameOverOverlay}>
         <View style={styles.gameOverCard}>
            <Text style={styles.gameOverEmoji}>{odul.mutluluk >= 0 ? '🎉' : '🥺'}</Text>
            <Text style={styles.gameOverTitle}>Oyun Bitti!</Text>
            
            <View style={styles.rewardsContainer}>
               {odul.altin > 0 && <Text style={styles.rewardText}>+{odul.altin} 🪙 Altın</Text>}
               {odul.xp > 0 && <Text style={styles.rewardText}>+{odul.xp} 🌟 XP</Text>}
               {odul.mutluluk > 0 && <Text style={styles.rewardText}>+{odul.mutluluk} 😊 Mutluluk</Text>}
               {odul.mutluluk < 0 && <Text style={[styles.rewardText, { color: '#d63031' }]}>{odul.mutluluk} 🥺 Mutluluk</Text>}
            </View>

            <View style={styles.gameOverButtons}>
               <TouchableOpacity style={[styles.goBtn, styles.goBtnAgain]} onPress={onTekrarOyna} activeOpacity={0.8}>
                  <Text style={styles.goBtnText}>🔄 Tekrar Oyna</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.goBtn, styles.goBtnMenu]} onPress={onMenuyeDon} activeOpacity={0.8}>
                  <Text style={styles.goBtnText}>🔙 Menüye Dön</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};


// --- OYUN 1: TAP TAP CATCHER ---
const TapTapGame = ({ onMenuCikisi, oyunSessizOdulVer }) => {
  const [oyunAktif, setOyunAktif] = useState(false);
  const [oyunBitti, setOyunBitti] = useState(false);
  const [kazanilanOdul, setKazanilanOdul] = useState({ altin: 0, xp: 0, mutluluk: 0 });
  const [puan, setPuan] = useState(0);
  const [kalanSure, setKalanSure] = useState(10);
  const [hedefPos, setHedefPos] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    let timer = null;
    if (oyunAktif && kalanSure > 0) {
      timer = setInterval(() => setKalanSure((prev) => prev - 1), 1000);
    } else if (kalanSure === 0 && oyunAktif) {
      setOyunAktif(false);
      
      let kMutluluk = puan;
      let kXp = puan * 2;
      let kAltin = Math.max(5, puan);
      if (puan === 0) {
         kMutluluk = -10; kXp = 0; kAltin = 0;
      }
      setKazanilanOdul({ mutluluk: kMutluluk, xp: kXp, altin: kAltin });
      setOyunBitti(true);
    }
    return () => clearInterval(timer);
  }, [oyunAktif, kalanSure]);

  const oyunaBasla = () => {
    setPuan(0);
    setKalanSure(10);
    setOyunBitti(false);
    setOyunAktif(true);
    hedefYerDegistir();
  };

  const handleTekrarOyna = () => {
    oyunSessizOdulVer(kazanilanOdul.mutluluk, kazanilanOdul.xp, kazanilanOdul.altin);
    oyunaBasla();
  };

  const handleMenuyeDon = () => {
    oyunSessizOdulVer(kazanilanOdul.mutluluk, kazanilanOdul.xp, kazanilanOdul.altin);
    onMenuCikisi();
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
      {oyunBitti ? (
         <GameOverOverlay odul={kazanilanOdul} onTekrarOyna={handleTekrarOyna} onMenuyeDon={handleMenuyeDon} />
      ) : !oyunAktif ? (
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
const MAKS_KART = 8; 

const HafizaOyunu = ({ onMenuCikisi, oyunSessizOdulVer }) => {
   const [kartlar, setKartlar] = useState([]);
   const [secilenler, setSecilenler] = useState([]);
   const [eslesenler, setEslesenler] = useState([]);
   const [oyunAktif, setOyunAktif] = useState(false);
   const [oyunBitti, setOyunBitti] = useState(false);
   const [kazanilanOdul, setKazanilanOdul] = useState({ altin: 0, xp: 0, mutluluk: 0 });
   const [hamle, setHamle] = useState(0);

   const oyunaBasla = () => {
      const ciftler = [...EMOJILER, ...EMOJILER];
      for (let i = ciftler.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [ciftler[i], ciftler[j]] = [ciftler[j], ciftler[i]];
      }
      setKartlar(ciftler.map((emoji, index) => ({ id: index, emoji })));
      setSecilenler([]);
      setEslesenler([]);
      setHamle(0);
      setOyunBitti(false);
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
         // Yarım saniye bekleyip sonucu göster
         setTimeout(() => {
            const gercekHamle = Number(hamle) || 10;
            const kazanilanPuan = gercekHamle <= 12 ? 15 : 10; 
            
            setKazanilanOdul({
                mutluluk: kazanilanPuan,
                xp: kazanilanPuan * 2,
                altin: Math.max(5, kazanilanPuan)
            });
            setOyunBitti(true);
         }, 500);
      }
   }, [eslesenler, oyunAktif]);

   const handleTekrarOyna = () => {
    oyunSessizOdulVer(kazanilanOdul.mutluluk, kazanilanOdul.xp, kazanilanOdul.altin);
    oyunaBasla();
   };

   const handleMenuyeDon = () => {
    oyunSessizOdulVer(kazanilanOdul.mutluluk, kazanilanOdul.xp, kazanilanOdul.altin);
    onMenuCikisi();
   };

   const kartSec = (index) => {
      if (secilenler.length < 2 && !secilenler.includes(index) && !eslesenler.includes(index)) {
         setSecilenler(prev => [...prev, index]);
      }
   };

   return (
    <View style={styles.gameContainer}>
       {oyunBitti ? (
          <GameOverOverlay odul={kazanilanOdul} onTekrarOyna={handleTekrarOyna} onMenuyeDon={handleMenuyeDon} />
       ) : !oyunAktif ? (
         <View style={styles.startContainer}>
           <Text style={styles.title}>Hafıza Kartları 🃏</Text>
           <Text style={styles.desc}>Aynı olan çiftleri bul! En az hamleyle bitirmeye çalış.</Text>
           <TouchableOpacity style={[styles.startButton, {backgroundColor: '#e84393'}]} onPress={oyunaBasla} activeOpacity={0.8}>
             <Text style={styles.startButtonText}>Başla</Text>
           </TouchableOpacity>
         </View>
       ) : (
         <ScrollView style={styles.memoryArea} contentContainerStyle={{ paddingBottom: 150, paddingTop: 50, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
             <Text style={styles.hamleText}>Yapılan Hamle: {hamle}</Text>
             <View style={styles.gridContainer}>
                {kartlar && kartlar.length > 0 && kartlar.map((kart, index) => {
                   const acikMi = secilenler.includes(index) || eslesenler.includes(index);
                   return (
                      <TouchableOpacity 
                         key={kart?.id ?? index} 
                         style={[styles.memoryCard, acikMi ? styles.memoryCardAcik : styles.memoryCardKapali]}
                         onPress={() => kartSec(index)}
                         activeOpacity={0.8}
                      >
                         <Text style={styles.memoryEmoji}>{acikMi ? kart.emoji : '❓'}</Text>
                      </TouchableOpacity>
                   );
                })}
             </View>
         </ScrollView>
       )}
    </View>
   );
};

// --- OYUN 3: HIZLI MATEMATİK ---
const MatematikOyunu = ({ onMenuCikisi, oyunSessizOdulVer }) => {
   const [oyunAktif, setOyunAktif] = useState(false);
   const [oyunBitti, setOyunBitti] = useState(false);
   const [kazanilanOdul, setKazanilanOdul] = useState({ altin: 0, xp: 0, mutluluk: 0 });
   const [kalanSure, setKalanSure] = useState(15);
   const [skor, setSkor] = useState(0);
   const [soru, setSoru] = useState({ metin: '', cevap: 0, siklar: [] });

   useEffect(() => {
      let timer = null;
      if (oyunAktif && kalanSure > 0) {
        timer = setInterval(() => setKalanSure(prev => prev - 1), 1000);
      } else if (kalanSure <= 0 && oyunAktif) {
        setOyunAktif(false);
        const calcSkor = skor * 4;
        let kMutluluk = calcSkor;
        let kXp = calcSkor * 2;
        let kAltin = Math.max(5, calcSkor);
        if (skor === 0) {
           kMutluluk = -10; kXp = 0; kAltin = 0;
        }
        setKazanilanOdul({ mutluluk: kMutluluk, xp: kXp, altin: kAltin });
        setOyunBitti(true);
      }
      return () => clearInterval(timer);
   }, [oyunAktif, kalanSure]);

   const sayiUret = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

   const soruOlustur = () => {
      const isAddition = Math.random() > 0.5;
      const sayi1 = sayiUret(1, 20);
      const sayi2 = sayiUret(1, 20);
      let dogruCevap = 0; let soruMetni = '';

      if (isAddition) {
         soruMetni = `${sayi1} + ${sayi2} = ?`; dogruCevap = sayi1 + sayi2;
      } else {
         const buyuk = Math.max(sayi1, sayi2); const kucuk = Math.min(sayi1, sayi2);
         soruMetni = `${buyuk} - ${kucuk} = ?`; dogruCevap = buyuk - kucuk;
      }

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
      setOyunBitti(false);
      setOyunAktif(true);
      soruOlustur();
   };

   const cevapKontrol = (secim) => {
      if (secim === soru.cevap) {
         setSkor(prev => prev + 1);
         soruOlustur();
      } else {
         setKalanSure(prev => Math.max(0, prev - 2)); 
      }
   };

   const handleTekrarOyna = () => {
      oyunSessizOdulVer(kazanilanOdul.mutluluk, kazanilanOdul.xp, kazanilanOdul.altin);
      oyunaBasla();
   };
  
   const handleMenuyeDon = () => {
      oyunSessizOdulVer(kazanilanOdul.mutluluk, kazanilanOdul.xp, kazanilanOdul.altin);
      onMenuCikisi();
   };

   return (
      <View style={styles.gameContainer}>
         {oyunBitti ? (
            <GameOverOverlay odul={kazanilanOdul} onTekrarOyna={handleTekrarOyna} onMenuyeDon={handleMenuyeDon} />
         ) : !oyunAktif ? (
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
                    <TouchableOpacity key={idx} style={styles.sikBtn} onPress={() => cevapKontrol(secim)} activeOpacity={0.7}>
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
  const { isLoaded, oyunSessizOdulVer, enerji } = useContext(TamagotchiContext);
  const [secilenOyun, setSecilenOyun] = useState(null); 

  if (!isLoaded) return null;

  const handleOyunSec = (oyunId) => {
     if (enerji < 15) {
        Alert.alert("Çok Yorgun! 😴", "Evcil hayvanın yorgunluktan bitap durumda. Oyun oynamadan önce 'Yatak Odası'na gidip biraz uyumalı!");
        return;
     }
     setSecilenOyun(oyunId);
  };

  const handleMenuDonus = () => {
     setSecilenOyun(null);
  };

  if (secilenOyun === 'tap') return <TapTapGame onMenuCikisi={handleMenuDonus} oyunSessizOdulVer={oyunSessizOdulVer} />;
  if (secilenOyun === 'memory') return <HafizaOyunu onMenuCikisi={handleMenuDonus} oyunSessizOdulVer={oyunSessizOdulVer} />;
  if (secilenOyun === 'math') return <MatematikOyunu onMenuCikisi={handleMenuDonus} oyunSessizOdulVer={oyunSessizOdulVer} />;

  return (
    <ScrollView style={styles.menuContainer} contentContainerStyle={{paddingBottom:40}} showsVerticalScrollIndicator={false}>
       <Text style={styles.menuTitle}>🎮 Oyun Salonu</Text>
       <Text style={styles.menuSub}>Eğlenerek Evcil Hayvanını Mutlu Et ve Bolca XP ile Altın Kazan!</Text>
       
       <TouchableOpacity style={styles.oyunCard} onPress={() => handleOyunSec('tap')} activeOpacity={0.8}>
           <Text style={styles.cardEmoji}>🧶</Text>
           <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Tap-Tap Catcher</Text>
              <Text style={styles.cardDesc}>Ekranda aniden beliren hedefleri süre bitmeden yakalama yarışı. Hızlı refleksler gerekir!</Text>
           </View>
       </TouchableOpacity>

       <TouchableOpacity style={styles.oyunCard} onPress={() => handleOyunSec('memory')} activeOpacity={0.8}>
           <Text style={styles.cardEmoji}>🃏</Text>
           <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Hafıza Kartları</Text>
              <Text style={styles.cardDesc}>Kartları çevir, çiftlerini bul. Ne kadar az hamle yaparsan o kadar çok ödül alırsın!</Text>
           </View>
       </TouchableOpacity>

       <TouchableOpacity style={styles.oyunCard} onPress={() => handleOyunSec('math')} activeOpacity={0.8}>
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
  menuContainer: { flex: 1, backgroundColor: '#f1f2f6', padding: 20, paddingTop: 40 },
  menuTitle: { fontSize: 30, fontWeight: '900', color: '#2d3436', marginBottom: 10 },
  menuSub: { fontSize: 15, color: '#636e72', marginBottom: 30, lineHeight: 22 },
  oyunCard: {
     flexDirection: 'row', backgroundColor: '#ffffff', padding: 20, borderRadius: 24,
     marginBottom: 20, alignItems: 'center', 
      height: 6 },   elevation: 5,
  },
  cardEmoji: { fontSize: 50, marginRight: 20 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0984e3', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#636e72', lineHeight: 18 },
  
  // ORTAK OYUN STİLLERİ
  gameContainer: { flex: 1, backgroundColor: '#f1f2f6' },
  startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 32, fontWeight: '900', color: '#2d3436', marginBottom: 16, textAlign: 'center' },
  desc: { fontSize: 16, color: '#636e72', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  startButton: { backgroundColor: '#10ac84', paddingVertical: 18, paddingHorizontal: 50, borderRadius: 20, elevation: 8 },
  startButtonText: { color: '#ffffff', fontSize: 20, fontWeight: '900' },
  gameArea: { flex: 1, backgroundColor: '#dfe6e9', position: 'relative' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 24, paddingTop: 40,
    backgroundColor: '#f1f2f6', elevation: 5, zIndex: 10,
  },
  scoreText: { fontSize: 24, fontWeight: '900', color: '#0984e3' },
  timeText: { fontSize: 24, fontWeight: '900', color: '#d63031' },
  target: {
    position: 'absolute', width: 60, height: 60, backgroundColor: '#ffffff', borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  targetEmoji: { fontSize: 34 },

  // MEMORY OYUNU
  memoryArea: { flex: 1, backgroundColor: '#dfe6e9' },
  hamleText: { fontSize: 20, fontWeight: '800', color: '#2c3e50', marginBottom: 30 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingHorizontal: 20 },
  memoryCard: { width: 75, height: 90, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  memoryCardKapali: { backgroundColor: '#0984e3' },
  memoryCardAcik: { backgroundColor: '#ffffff' },
  memoryEmoji: { fontSize: 30 },

  // MATH OYUNU
  mathArea: { flex: 1, backgroundColor: '#2c3e50' },
  mathHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, paddingTop: 40, backgroundColor: 'transparent' },
  soruKutusu: { marginTop: 60, alignItems: 'center', justifyContent: 'center' },
  soruText: { fontSize: 50, fontWeight: '900', color: '#ffffff' },
  siklarContainer: { marginTop: 80, paddingHorizontal: 20, gap: 20 },
  sikBtn: { backgroundColor: '#1abc9c', paddingVertical: 20, borderRadius: 16, alignItems: 'center' },
  sikText: { fontSize: 26, fontWeight: '800', color: '#ffffff' },

  // GAME OVER OVERLAY
  gameOverOverlay: {
     flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
     justifyContent: 'center', alignItems: 'center', padding: 20
  },
  gameOverCard: {
     width: '100%', maxWidth: 350, backgroundColor: '#ffffff',
     borderRadius: 30, padding: 30, alignItems: 'center',
       height: 10 },
       elevation: 15
  },
  gameOverEmoji: { fontSize: 60, marginBottom: 10 },
  gameOverTitle: { fontSize: 28, fontWeight: '900', color: '#2d3436', marginBottom: 20 },
  rewardsContainer: {
     backgroundColor: '#f1f2f6', width: '100%', borderRadius: 20,
     padding: 20, alignItems: 'center', marginBottom: 30
  },
  rewardText: { fontSize: 18, fontWeight: '800', color: '#0984e3', marginVertical: 4 },
  gameOverButtons: { width: '100%', gap: 12 },
  goBtn: { width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  goBtnAgain: { backgroundColor: '#10ac84' },
  goBtnMenu: { backgroundColor: '#d63031' },
  goBtnText: { color: '#ffffff', fontSize: 18, fontWeight: '900' }
});

export default GameScreen;
