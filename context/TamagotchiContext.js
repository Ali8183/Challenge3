import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const TamagotchiContext = createContext();

export const MARKET_ITEMS = {
  // YİYECEK
  elma: { id: 'elma', tip: 'yiyecek', isim: 'Elma', emoji: '🍎', fiyat: 10, aclikEtkisi: -15, mutlulukEtkisi: 2, xpEtkisi: 5, aciklama: 'Açlığı hafifçe azaltır.' },
  hamburger: { id: 'hamburger', tip: 'yiyecek', isim: 'Hamburger', emoji: '🍔', fiyat: 30, aclikEtkisi: -40, mutlulukEtkisi: 10, xpEtkisi: 10, aciklama: 'Doyurucu, lezzetli bir öğün.' },
  pizza: { id: 'pizza', tip: 'yiyecek', isim: 'Pizza', emoji: '🍕', fiyat: 50, aclikEtkisi: -60, mutlulukEtkisi: 15, xpEtkisi: 15, aciklama: 'Devasa bir ziyafet.' },
  // İÇECEK
  su: { id: 'su', tip: 'icecek', isim: 'Su', emoji: '💧', fiyat: 5, aclikEtkisi: -5, mutlulukEtkisi: 5, xpEtkisi: 2, aciklama: 'Hayvanı ferahlatır.' },
  kahve: { id: 'kahve', tip: 'icecek', isim: 'Kahve', emoji: '☕', fiyat: 15, aclikEtkisi: -10, mutlulukEtkisi: 15, xpEtkisi: 5, aciklama: 'Enerji ve mutluluk verir.' },
  // ÖZEL ÖGELER
  mucizeIksiri: { id: 'mucizeIksiri', tip: 'ozel', isim: 'Mucize İksiri', emoji: '🧪', fiyat: 100, aclikEtkisi: -100, mutlulukEtkisi: 100, xpEtkisi: 50, aciklama: 'Tüm statları fuller ve çok tecrübe kazandırır.' },
};

export const TamagotchiProvider = ({ children }) => {
  const [isim, setIsim] = useState("Limo");
  const [tur, setTur] = useState("Uzaylı");

  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);
  
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [rozetler, setRozetler] = useState([]);
  const [altin, setAltin] = useState(0);

  // ENVANTER STATE (Dinamik başlangıç)
  const defaultEnvanter = Object.keys(MARKET_ITEMS).reduce((acc, key) => { acc[key] = 0; return acc; }, {});
  const [envanter, setEnvanter] = useState(defaultEnvanter);

  const [isLoaded, setIsLoaded] = useState(false);

  // Verileri AsyncStorage'dan Yükle
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

        if (storedAclik) setAclik(parseInt(storedAclik));
        if (storedMutluluk) setMutluluk(parseInt(storedMutluluk));
        if (storedLevel) setLevel(parseInt(storedLevel));
        if (storedXp) setXp(parseInt(storedXp));
        if (storedRozetler) setRozetler(JSON.parse(storedRozetler));
        if (storedAltin) setAltin(parseInt(storedAltin));
        
        if (storedEnvanter) {
          const parsed = JSON.parse(storedEnvanter);
          setEnvanter({ ...defaultEnvanter, ...parsed }); // Yeni eşya eklendiyse default ile merge ediyoruz
        }

        setIsLoaded(true);
      } catch (e) {
        console.error("Veri yüklenirken hata:", e);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // State'ler her değiştiğinde AsyncStorage'a Kaydet
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
      } catch (e) {
        console.error("Veri kaydedilirken hata:", e);
      }
    };
    saveData();
  }, [aclik, mutluluk, level, xp, rozetler, altin, envanter, isLoaded]);

  // GERÇEKÇİ YAŞAM DÖNGÜSÜ (Açlık Artar, Mutluluk Düşer)
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setAclik((prevAclik) => {
        const yeniAclik = Math.min(100, prevAclik + 1);
        
        setMutluluk((prevMutluluk) => {
          // Eğer açlık 80'in üzerindeyse, hayvan acı çeker ve mutluluk çok daha hızlı (x3) düşer.
          const azalmaMiktari = yeniAclik > 80 ? 3 : 1;
          return Math.max(0, prevMutluluk - azalmaMiktari);
        });

        return yeniAclik;
      });
    }, 5000); // Test amaçlı her 5 saniyede bir (ileride uzatılabilir)

    return () => clearInterval(interval);
  }, [isLoaded]);

  const processGamification = (yeniMutluluk) => {
    const kazanilanXp = Math.floor(Math.random() * 11) + 10;
    let yeniXp = xp + kazanilanXp;
    let yeniLevel = level;

    if (yeniXp >= 100) {
      yeniLevel += Math.floor(yeniXp / 100);
      yeniXp = yeniXp % 100;
      setLevel(yeniLevel);
    }
    setXp(yeniXp);

    const yeniRozetler = [...rozetler];
    let rozetEklendiMi = false;

    const rozetEkle = (rozet) => {
      if (!yeniRozetler.includes(rozet)) {
        yeniRozetler.push(rozet);
        rozetEklendiMi = true;
        Alert.alert("Tebrikler! 🎉", `Kazandığın Rozet: ${rozet}`);
      }
    };

    if (rozetler.length === 0) rozetEkle("🥉 İlk Adım");
    if (yeniMutluluk >= 100) rozetEkle("🌟 Mutlu Dost");
    if (yeniLevel >= 3) rozetEkle("👑 Usta Bakıcı");
    if (yeniLevel >= 5) rozetEkle("🎓 Efsanevi Eğitmen");

    if (rozetEklendiMi) {
      setRozetler(yeniRozetler);
    }
  };

  const oyna = () => {
    const yeniMutluluk = Math.min(100, mutluluk + 10);
    setMutluluk(yeniMutluluk);
    setAclik((prev) => Math.min(100, prev + 5));
    setAltin((prev) => prev + 5); 
    processGamification(yeniMutluluk);
  };

  const esyaSatinAl = (itemId) => {
    const item = MARKET_ITEMS[itemId];
    if (altin >= item.fiyat) {
      setAltin((prev) => prev - item.fiyat);
      setEnvanter((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      Alert.alert("Satın Alma Başarılı! 🛒", `${item.isim} çantana eklendi.`);
    } else {
      Alert.alert("Yetersiz Altın ❌", `${item.isim} almak için ${item.fiyat} 💰 gerekiyor.`);
    }
  };

  const esyaKullan = (itemId) => {
    if (envanter[itemId] > 0) {
      const item = MARKET_ITEMS[itemId];
      setEnvanter((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

      setAclik((prev) => Math.max(0, Math.min(100, prev + item.aclikEtkisi)));
      const yeniMutluluk = Math.min(100, Math.max(0, mutluluk + item.mutlulukEtkisi));
      setMutluluk(yeniMutluluk);
      
      let yeniXp = xp + item.xpEtkisi;
      let yeniLevel = level;
      if (yeniXp >= 100) {
        yeniLevel += Math.floor(yeniXp / 100);
        setLevel(yeniLevel);
      }
      setXp(yeniXp % 100);

      processGamification(yeniMutluluk);
    }
  };

  const tamamlaOdak = (sure) => {
    const xpOdulu = sure * 20; 
    const altinOdulu = sure * 10;
    
    setAltin((prev) => prev + altinOdulu);
    
    const yeniXp = xp + xpOdulu;
    let yeniLevel = level;
    if (yeniXp >= 100) {
      yeniLevel += Math.floor(yeniXp / 100);
      setLevel(yeniLevel);
    }
    setXp(yeniXp % 100);

    Alert.alert(
      "Odaklanma Başarılı! 🎯", 
      `Harika çalıştın! ${sure} dakikalık odaklanma sonucunda +${xpOdulu} XP ve +${altinOdulu} 💰 kazandın.`
    );
  };

  const bozOdak = () => {
    setMutluluk((prev) => Math.max(0, prev - 20));
    Alert.alert(
      "Odak Bozuldu 🥺", 
      "Süreyi tamamlamadan pes ettin. Evcil hayvanın biraz üzüldü (-20 Mutluluk)."
    );
  };

  return (
    <TamagotchiContext.Provider value={{ 
      isim, tur, aclik, mutluluk, level, xp, rozetler, altin, envanter, 
      oyna, esyaSatinAl, esyaKullan, isLoaded, tamamlaOdak, bozOdak
    }}>
      {children}
    </TamagotchiContext.Provider>
  );
};
