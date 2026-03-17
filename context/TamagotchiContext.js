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

        if (storedAclik) setAclik(parseInt(storedAclik));
        if (storedMutluluk) setMutluluk(parseInt(storedMutluluk));
        if (storedLevel) setLevel(parseInt(storedLevel));
        if (storedXp) setXp(parseInt(storedXp));
        if (storedRozetler) setRozetler(JSON.parse(storedRozetler));

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
      if (!isLoaded) return; // Henüz yüklenmediyse kaydetmeyi atla (sıfırlanmasın)
      try {
        await AsyncStorage.setItem('@aclik', aclik.toString());
        await AsyncStorage.setItem('@mutluluk', mutluluk.toString());
        await AsyncStorage.setItem('@level', level.toString());
        await AsyncStorage.setItem('@xp', xp.toString());
        await AsyncStorage.setItem('@rozetler', JSON.stringify(rozetler));
      } catch (e) {
        console.error("Veri kaydedilirken hata:", e);
      }
    };
    saveData();
  }, [aclik, mutluluk, level, xp, rozetler, isLoaded]);

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
    processGamification(yeniMutluluk);
  };

  return (
    <TamagotchiContext.Provider value={{ 
      isim, tur, aclik, mutluluk, level, xp, rozetler, 
      besle, oyna, isLoaded 
    }}>
      {children}
    </TamagotchiContext.Provider>
  );
};
