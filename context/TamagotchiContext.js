import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Vibration } from 'react-native';

export const TamagotchiContext = createContext();

export const MARKET_ITEMS = {
  elma: { id: 'elma', tip: 'yiyecek', isim: 'Elma', emoji: '🍎', fiyat: 10, aclikEtkisi: -15, mutlulukEtkisi: 2, xpEtkisi: 5, aciklama: 'Açlığı hafifçe azaltır.' },
  hamburger: { id: 'hamburger', tip: 'yiyecek', isim: 'Hamburger', emoji: '🍔', fiyat: 30, aclikEtkisi: -40, mutlulukEtkisi: 10, xpEtkisi: 10, aciklama: 'Doyurucu, lezzetli bir öğün.' },
  pizza: { id: 'pizza', tip: 'yiyecek', isim: 'Pizza', emoji: '🍕', fiyat: 50, aclikEtkisi: -60, mutlulukEtkisi: 15, xpEtkisi: 15, aciklama: 'Devasa bir ziyafet.' },
  su: { id: 'su', tip: 'icecek', isim: 'Su', emoji: '💧', fiyat: 5, aclikEtkisi: -5, mutlulukEtkisi: 5, xpEtkisi: 2, aciklama: 'Hayvanı ferahlatır.' },
  kahve: { id: 'kahve', tip: 'icecek', isim: 'Kahve', emoji: '☕', fiyat: 15, aclikEtkisi: -10, mutlulukEtkisi: 15, xpEtkisi: 5, aciklama: 'Enerji ve mutluluk verir.' },
  mucizeIksiri: { id: 'mucizeIksiri', tip: 'ozel', isim: 'Mucize İksiri', emoji: '🧪', fiyat: 100, aclikEtkisi: -100, mutlulukEtkisi: 100, xpEtkisi: 50, aciklama: 'Tüm statları fuller ve çok tecrübe kazandırır.' },
};

export const ACHIEVEMENTS = [
  { id: 'ilk_isirik', isim: 'İlk Isırık', aciklama: 'Hayvanı 1 kez besle.', zorluk: 'Kolay', xpOdul: 20, altinOdul: 10, emoji: '🥉' },
  { id: 'oyuncu', isim: 'Oyuncu', aciklama: 'Hayvanla 10 kez oyna.', zorluk: 'Kolay', xpOdul: 30, altinOdul: 20, emoji: '🎾' },
  { id: 'mutlu_dost', isim: 'Mutlu Dost', aciklama: 'Mutluluk seviyesini 100 yap.', zorluk: 'Kolay', xpOdul: 20, altinOdul: 10, emoji: '🌟' },
  { id: 'usta_bakici', isim: 'Usta Bakıcı', aciklama: '3. Seviyeye ulaş.', zorluk: 'Orta', xpOdul: 100, altinOdul: 50, emoji: '👑' },
  { id: 'obur', isim: 'Obur', aciklama: 'Hayvanı 10 kez besle.', zorluk: 'Orta', xpOdul: 50, altinOdul: 30, emoji: '🍔' },
  { id: 'odak_ustasi', isim: 'Odak Ustası', aciklama: 'Odak sayacını 5 kez başarıyla tamamla.', zorluk: 'Orta', xpOdul: 100, altinOdul: 50, emoji: '🥈' },
  { id: 'hayvan_sever', isim: 'Hayvan Sever', aciklama: 'Hayvanla tam 50 kez oyna.', zorluk: 'Orta', xpOdul: 150, altinOdul: 80, emoji: '❤️' },
  { id: 'dahi', isim: 'Dahi', aciklama: 'Odak sayacını 15 kez başarıyla tamamla.', zorluk: 'Zor', xpOdul: 300, altinOdul: 150, emoji: '🧠' },
  { id: 'efsanevi_egitmen', isim: 'Efsanevi Eğitmen', aciklama: '5. Seviyeye ulaş.', zorluk: 'Zor', xpOdul: 200, altinOdul: 100, emoji: '🎓' },
  { id: 'zengin_bakici', isim: 'Zengin Bakıcı', aciklama: 'Cüzdanında aynı anda 500 Altın biriktir.', zorluk: 'Zor', xpOdul: 250, altinOdul: 100, emoji: '🥇' },
  { id: 'milyoner', isim: 'Milyoner', aciklama: 'Cüzdanında aynı anda 1000 Altın biriktir.', zorluk: 'Zor', xpOdul: 500, altinOdul: 300, emoji: '💎' },
  { id: 'mukemmel_denge', isim: 'Mükemmel Denge', aciklama: 'Mutluluğunu yüksek tutarak 10. Seviyeye ulaş.', zorluk: 'Zor', xpOdul: 500, altinOdul: 300, emoji: '🏆' },
];

export const TamagotchiProvider = ({ children }) => {
  const [isim, setIsim] = useState("Limo");
  const [tur, setTur] = useState("Uzaylı");

  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);
  
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [rozetler, setRozetler] = useState([]);
  const [altin, setAltin] = useState(0);

  const defaultEnvanter = Object.keys(MARKET_ITEMS).reduce((acc, key) => { acc[key] = 0; return acc; }, {});
  const [envanter, setEnvanter] = useState(defaultEnvanter);

  const defaultIstatistikler = { beslenmeSayisi: 0, odakTamamlanmaSayisi: 0, oynamaSayisi: 0 };
  const [istatistikler, setIstatistikler] = useState(defaultIstatistikler);

  const [isLoaded, setIsLoaded] = useState(false);
  const [animTetikle, setAnimTetikle] = useState(0); 

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAclik = await AsyncStorage.getItem('@aclik');
        const storedMutluluk = await AsyncStorage.getItem('@mutluluk');
        const storedLevel = await AsyncStorage.getItem('@level');
        const storedXp = await AsyncStorage.getItem('@xp');
        const storedRozetler = await AsyncStorage.getItem('@rozetler');
        const storedAltin = await AsyncStorage.getItem('@altin');
        const storedEnvanter = await AsyncStorage.getItem('@envanter');
        const storedStats = await AsyncStorage.getItem('@istatistikler');

        if (storedAclik) setAclik(parseInt(storedAclik));
        if (storedMutluluk) setMutluluk(parseInt(storedMutluluk));
        if (storedLevel) setLevel(parseInt(storedLevel));
        if (storedXp) setXp(parseInt(storedXp));
        if (storedRozetler) setRozetler(JSON.parse(storedRozetler));
        if (storedAltin) setAltin(parseInt(storedAltin));
        
        if (storedEnvanter) {
          const parsed = JSON.parse(storedEnvanter);
          const cleanEnvanter = { ...defaultEnvanter };
          Object.keys(parsed).forEach(k => {
            if (MARKET_ITEMS[k]) {
              cleanEnvanter[k] = parsed[k];
            }
          });
          setEnvanter(cleanEnvanter);
        }

        if (storedStats) {
           setIstatistikler({ ...defaultIstatistikler, ...JSON.parse(storedStats) });
        }

        setIsLoaded(true);
      } catch (e) {
        console.error("Veri yüklenirken hata:", e);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      if (!isLoaded) return;
      try {
        await AsyncStorage.setItem('@aclik', aclik.toString());
        await AsyncStorage.setItem('@mutluluk', mutluluk.toString());
        await AsyncStorage.setItem('@level', level.toString());
        await AsyncStorage.setItem('@xp', xp.toString());
        await AsyncStorage.setItem('@rozetler', JSON.stringify(rozetler));
        await AsyncStorage.setItem('@altin', altin.toString());
        await AsyncStorage.setItem('@envanter', JSON.stringify(envanter));
        await AsyncStorage.setItem('@istatistikler', JSON.stringify(istatistikler));
      } catch (e) {
        console.error("Veri kaydedilirken hata:", e);
      }
    };
    saveData();
  }, [aclik, mutluluk, level, xp, rozetler, altin, envanter, istatistikler, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setAclik((prevAclik) => {
        const yeniAclik = Math.min(100, prevAclik + 1);
        if (prevAclik <= 80 && yeniAclik > 80) Vibration.vibrate(500); 
        
        setMutluluk((prevMutluluk) => {
          const azalmaMiktari = yeniAclik > 80 ? 3 : 1;
          return Math.max(0, prevMutluluk - azalmaMiktari);
        });

        return yeniAclik;
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [isLoaded]);

  // DEVASA BİR RPG ACHIEVEMENT (BAŞARIM) DÖNGÜSÜ
  useEffect(() => {
    if (!isLoaded) return;
    
    let yeniRozetler = [...rozetler];
    let kazanilanXp = 0;
    let kazanilanAltin = 0;
    let yeniKazanilanlar = [];

    ACHIEVEMENTS.forEach(ach => {
      if (!yeniRozetler.includes(ach.id)) {
        let kazanildiMi = false;
        switch(ach.id) {
          case 'ilk_isirik': kazanildiMi = istatistikler.beslenmeSayisi >= 1; break;
          case 'obur': kazanildiMi = istatistikler.beslenmeSayisi >= 10; break;
          case 'oyuncu': kazanildiMi = istatistikler.oynamaSayisi >= 10; break;
          case 'odak_ustasi': kazanildiMi = istatistikler.odakTamamlanmaSayisi >= 5; break;
          case 'dahi': kazanildiMi = istatistikler.odakTamamlanmaSayisi >= 15; break;
          case 'hayvan_sever': kazanildiMi = istatistikler.oynamaSayisi >= 50; break;
          case 'zengin_bakici': kazanildiMi = altin >= 500; break;
          case 'milyoner': kazanildiMi = altin >= 1000; break;
          case 'mukemmel_denge': kazanildiMi = (level >= 10 && mutluluk >= 95); break; 
          case 'mutlu_dost': kazanildiMi = mutluluk >= 100; break;
          case 'usta_bakici': kazanildiMi = level >= 3; break;
          case 'efsanevi_egitmen': kazanildiMi = level >= 5; break;
        }

        if (kazanildiMi) {
          yeniRozetler.push(ach.id);
          kazanilanXp += ach.xpOdul;
          kazanilanAltin += ach.altinOdul;
          yeniKazanilanlar.push(`🏆 ${ach.isim}!\n+${ach.xpOdul} XP | +${ach.altinOdul} 💰`);
        }
      }
    });

    if (yeniKazanilanlar.length > 0) {
      setRozetler(yeniRozetler);
      if (kazanilanAltin > 0) setAltin((prev) => prev + kazanilanAltin);
      
      if (kazanilanXp > 0) {
         setXp((prev) => {
            let yeniToplam = prev + kazanilanXp;
            if (yeniToplam >= 100) {
               setLevel((pLevel) => pLevel + Math.floor(yeniToplam / 100));
               Vibration.vibrate([0, 100, 50, 100]);
               return yeniToplam % 100;
            }
            return yeniToplam;
         });
      }

      Vibration.vibrate([0, 150, 150, 150, 150, 150]);
      setTimeout(() => {
         Alert.alert("BAŞARIM AÇILDI! 🌟", yeniKazanilanlar.join("\n\n"));
      }, 500);
    }
  }, [istatistikler, altin, level, mutluluk, rozetler, isLoaded]);

  // Sadece Rastgele XP Veren Temel Fonksiyon (Artık rozet mantığı checkAchievements'da)
  const processBaseXP = () => {
    const kazanilanXp = Math.floor(Math.random() * 11) + 10;
    let yeniXp = xp + kazanilanXp;
    let yeniLevel = level;

    if (yeniXp >= 100) {
      yeniLevel += Math.floor(yeniXp / 100);
      yeniXp = yeniXp % 100;
      setLevel(yeniLevel);
      Vibration.vibrate([0, 100, 50, 100]); 
    }
    setXp(yeniXp);
  };

  const oyna = () => {
    const yeniMutluluk = Math.min(100, mutluluk + 10);
    setMutluluk(yeniMutluluk);
    setAclik((prev) => Math.min(100, prev + 5));
    setAltin((prev) => prev + 5); 
    setIstatistikler(prev => ({ ...prev, oynamaSayisi: prev.oynamaSayisi + 1 }));
    
    // Oyun Hissiyati - Haptic & Pop Animasyonu
    Vibration.vibrate(30);
    setAnimTetikle((prev) => prev + 1);
    
    processBaseXP();
  };

  const esyaSatinAl = (itemId) => {
    const item = MARKET_ITEMS[itemId];
    if (altin >= item.fiyat) {
      setAltin((prev) => prev - item.fiyat);
      setEnvanter((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      Vibration.vibrate([0, 50, 50, 50]); 
      Alert.alert("Satın Alma Başarılı! 🛒", `${item.isim} çantana eklendi.`);
    } else {
      Vibration.vibrate(400); 
      Alert.alert("Yetersiz Altın ❌", `${item.isim} almak için ${item.fiyat} 💰 gerekiyor.`);
    }
  };

  const esyaKullan = (itemId) => {
    if (envanter[itemId] > 0) {
      const item = MARKET_ITEMS[itemId];
      setEnvanter((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

      if (item.tip === 'yiyecek' || item.tip === 'icecek') {
          setIstatistikler(prev => ({ ...prev, beslenmeSayisi: prev.beslenmeSayisi + 1 }));
      }

      setAclik((prev) => Math.max(0, Math.min(100, prev + item.aclikEtkisi)));
      const yeniMutluluk = Math.min(100, Math.max(0, mutluluk + item.mutlulukEtkisi));
      setMutluluk(yeniMutluluk);
      
      let yeniXp = xp + item.xpEtkisi;
      let yeniLevel = level;
      if (yeniXp >= 100) {
        yeniLevel += Math.floor(yeniXp / 100);
        setLevel(yeniLevel);
        Vibration.vibrate([0, 100, 50, 100]); 
      }
      setXp(yeniXp % 100);

      Vibration.vibrate(50);
      setAnimTetikle((prev) => prev + 1);
      
      // Sadece pop tetiklemek yerine ufak XP de eklemeyebiliriz, item.xpEtkisi eklendi.
    }
  };

  const tamamlaOdak = (sure) => {
    const xpOdulu = sure * 20; 
    const altinOdulu = sure * 10;
    
    setAltin((prev) => prev + altinOdulu);
    setIstatistikler(prev => ({ ...prev, odakTamamlanmaSayisi: prev.odakTamamlanmaSayisi + 1 }));

    const yeniXp = xp + xpOdulu;
    let yeniLevel = level;
    if (yeniXp >= 100) {
      yeniLevel += Math.floor(yeniXp / 100);
      setLevel(yeniLevel);
    }
    setXp(yeniXp % 100);

    Vibration.vibrate([0, 100, 100, 100, 100, 100]); 
    Alert.alert(
      "Odaklanma Başarılı! 🎯", 
      `Harika çalıştın! ${sure} dakikalık odaklanma sonucunda +${xpOdulu} XP ve +${altinOdulu} 💰 kazandın.`
    );
  };

  const bozOdak = () => {
    setMutluluk((prev) => Math.max(0, prev - 20));
    Vibration.vibrate(500); 
    Alert.alert(
      "Odak Bozuldu 🥺", 
      "Süreyi tamamlamadan pes ettin. Evcil hayvanın biraz üzüldü (-20 Mutluluk)."
    );
  };

  return (
    <TamagotchiContext.Provider value={{ 
      isim, tur, aclik, mutluluk, level, xp, rozetler, altin, envanter, 
      oyna, esyaSatinAl, esyaKullan, isLoaded, tamamlaOdak, bozOdak, animTetikle
    }}>
      {children}
    </TamagotchiContext.Provider>
  );
};
