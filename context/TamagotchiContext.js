import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const TamagotchiContext = createContext();

export const TamagotchiProvider = ({ children }) => {
  const [isim, setIsim] = useState("Limo");
  const [tur, setTur] = useState("Uzaylı");

  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);
  
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [rozetler, setRozetler] = useState([]);
  const [altin, setAltin] = useState(0);

  // ENVANTER STATE
  const [envanter, setEnvanter] = useState({ mama: 0, iksir: 0 });

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
        if (storedEnvanter) setEnvanter(JSON.parse(storedEnvanter));

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
    }, 5000); // Test amaçlı her 5 saniyede bir

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

  const besle = () => {
    setAclik((prev) => Math.max(0, prev - 10));
    processGamification(mutluluk);
  };

  const oyna = () => {
    const yeniMutluluk = Math.min(100, mutluluk + 10);
    setMutluluk(yeniMutluluk);
    setAclik((prev) => Math.min(100, prev + 5));
    setAltin((prev) => prev + 5); 
    processGamification(yeniMutluluk);
  };

  const satinAlPremiumMama = () => {
    if (altin >= 20) {
      setAltin((prev) => prev - 20);
      setEnvanter((prev) => ({ ...prev, mama: prev.mama + 1 }));
      Alert.alert("Satın Alma Başarılı! 🍎", "Premium Mama çantana eklendi.");
    } else {
      Alert.alert("Yetersiz Altın ❌", "Premium Mama almak için 20 💰 gerekiyor.");
    }
  };

  const satinAlEnerjiIksiri = () => {
    if (altin >= 50) {
      setAltin((prev) => prev - 50);
      setEnvanter((prev) => ({ ...prev, iksir: prev.iksir + 1 }));
      Alert.alert("Satın Alma Başarılı! 💊", "Enerji İksiri çantana eklendi.");
    } else {
      Alert.alert("Yetersiz Altın ❌", "Enerji İksiri almak için 50 💰 gerekiyor.");
    }
  };

  const kullanPremiumMama = () => {
    if (envanter.mama > 0) {
      setEnvanter((prev) => ({ ...prev, mama: prev.mama - 1 }));
      setAclik(0);
      
      const yeniXp = xp + 30;
      let yeniLevel = level;
      if (yeniXp >= 100) {
        yeniLevel += Math.floor(yeniXp / 100);
        setLevel(yeniLevel);
      }
      setXp(yeniXp % 100);
    }
  };

  const kullanEnerjiIksiri = () => {
    if (envanter.iksir > 0) {
      setEnvanter((prev) => ({ ...prev, iksir: prev.iksir - 1 }));
      setMutluluk(100);
    }
  };

  const tamamlaOdak = (sure) => {
    // Sure: 1, 3, 5
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
      besle, oyna, satinAlPremiumMama, satinAlEnerjiIksiri, kullanPremiumMama, kullanEnerjiIksiri, isLoaded,
      tamamlaOdak, bozOdak
    }}>
      {children}
    </TamagotchiContext.Provider>
  );
};
