import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Vibration, View, Text } from 'react-native';

export const TamagotchiContext = createContext();

export const MARKET_ITEMS = {
  elma: { id: 'elma', tip: 'yiyecek', isim: 'Elma', emoji: '🍎', fiyat: 10, aclikEtkisi: -15, mutlulukEtkisi: 2, xpEtkisi: 5, aciklama: 'Açlığı hafifçe azaltır.' },
  hamburger: { id: 'hamburger', tip: 'yiyecek', isim: 'Hamburger', emoji: '🍔', fiyat: 30, aclikEtkisi: -40, mutlulukEtkisi: 10, xpEtkisi: 10, aciklama: 'Doyurucu, lezzetli bir öğün.' },
  pizza: { id: 'pizza', tip: 'yiyecek', isim: 'Pizza', emoji: '🍕', fiyat: 50, aclikEtkisi: -60, mutlulukEtkisi: 15, xpEtkisi: 15, aciklama: 'Devasa bir ziyafet.' },
  su: { id: 'su', tip: 'icecek', isim: 'Su', emoji: '💧', fiyat: 5, aclikEtkisi: -5, mutlulukEtkisi: 5, xpEtkisi: 2, aciklama: 'Hayvanı ferahlatır.' },
  kahve: { id: 'kahve', tip: 'icecek', isim: 'Kahve', emoji: '☕', fiyat: 15, aclikEtkisi: -10, mutlulukEtkisi: 15, xpEtkisi: 5, aciklama: 'Enerji ve mutluluk verir.' },
  ilac: { id: 'ilac', tip: 'ozel', isim: 'İlaç', emoji: '💊', fiyat: 30, aclikEtkisi: 0, mutlulukEtkisi: 20, xpEtkisi: 0, aciklama: 'Hastalığı anında iyileştirir.' },
  mucizeIksiri: { id: 'mucizeIksiri', tip: 'ozel', isim: 'Mucize İksiri', emoji: '🧪', fiyat: 100, aclikEtkisi: -100, mutlulukEtkisi: 100, xpEtkisi: 50, aciklama: 'Tüm statları fuller, iyileştirir ve xp verir.' },
  buyukPizza: { id: 'buyukPizza', tip: 'yiyecek', isim: 'Büyük Boy Pizza', emoji: '🍕', fiyat: 25, aclikEtkisi: -40, mutlulukEtkisi: 10, xpEtkisi: 10, aciklama: 'Açlığı 40 azaltır. Çok doyurucudur.' },
  enerjiIcecegi: { id: 'enerjiIcecegi', tip: 'icecek', isim: 'Enerji İçeceği', emoji: '🥤', fiyat: 20, aclikEtkisi: 10, mutlulukEtkisi: 30, xpEtkisi: 5, aciklama: 'Mutluluğu 30 artırır ama açlığı 10 artırır.' },
  sihirliIksir: { id: 'sihirliIksir', tip: 'ozel', isim: 'Sihirli İksir', emoji: '🧪', fiyat: 75, aclikEtkisi: 0, mutlulukEtkisi: 100, xpEtkisi: 30, aciklama: 'Anında iyileştirir, mutluluğu 100 yapar ve +30 XP verir.' },
  kralTaci: { id: 'kralTaci', tip: 'ozel', isim: 'Kral Tacı', emoji: '👑', fiyat: 200, aclikEtkisi: 0, mutlulukEtkisi: 0, xpEtkisi: 150, aciklama: 'Muazzam prestij. Anında +150 XP verir.' },
};

export const ACHIEVEMENTS = [
  { id: 'ilk_isirik', isim: 'İlk Isırık', aciklama: 'Hayvanı 1 kez besle.', zorluk: 'Kolay', xpOdul: 20, altinOdul: 10, emoji: '🥉' },
  { id: 'oyuncu', isim: 'Oyuncu', aciklama: 'Oyun salonunda 10 kez oyna.', zorluk: 'Kolay', xpOdul: 30, altinOdul: 20, emoji: '🎾' },
  { id: 'mutlu_dost', isim: 'Mutlu Dost', aciklama: 'Mutluluk seviyesini 100 yap.', zorluk: 'Kolay', xpOdul: 20, altinOdul: 10, emoji: '🌟' },
  { id: 'usta_bakici', isim: 'Usta Bakıcı', aciklama: '3. Seviyeye ulaş.', zorluk: 'Orta', xpOdul: 100, altinOdul: 50, emoji: '👑' },
  { id: 'obur', isim: 'Obur', aciklama: 'Hayvanı 10 kez besle.', zorluk: 'Orta', xpOdul: 50, altinOdul: 30, emoji: '🍔' },
  { id: 'odak_ustasi', isim: 'Odak Ustası', aciklama: 'Odak sayacını 5 kez başarıyla tamamla.', zorluk: 'Orta', xpOdul: 100, altinOdul: 50, emoji: '🥈' },
  { id: 'hayvan_sever', isim: 'Hayvan Sever', aciklama: 'Oyun salonunda tam 50 kez oyna.', zorluk: 'Orta', xpOdul: 150, altinOdul: 80, emoji: '❤️' },
  { id: 'dahi', isim: 'Dahi', aciklama: 'Odak sayacını 15 kez başarıyla tamamla.', zorluk: 'Zor', xpOdul: 300, altinOdul: 150, emoji: '🧠' },
  { id: 'efsanevi_egitmen', isim: 'Efsanevi Eğitmen', aciklama: '5. Seviyeye ulaş.', zorluk: 'Zor', xpOdul: 200, altinOdul: 100, emoji: '🎓' },
  { id: 'zengin_bakici', isim: 'Zengin Bakıcı', aciklama: 'Cüzdanında aynı anda 500 Altın biriktir.', zorluk: 'Zor', xpOdul: 250, altinOdul: 100, emoji: '🥇' },
  { id: 'milyoner', isim: 'Milyoner', aciklama: 'Cüzdanında aynı anda 1000 Altın biriktir.', zorluk: 'Zor', xpOdul: 500, altinOdul: 300, emoji: '💎' },
  { id: 'mukemmel_denge', isim: 'Mükemmel Denge', aciklama: 'Mutluluğunu yüksek tutarak 10. Seviyeye ulaş.', zorluk: 'Zor', xpOdul: 500, altinOdul: 300, emoji: '🏆' },
  { id: 'alisveriskolik', isim: 'Alışverişkolik', aciklama: 'Markette toplam 500 Altın harca.', zorluk: 'Orta', xpOdul: 100, altinOdul: 25, emoji: '🛍️' },
  { id: 'arcade_ustasi', isim: 'Arcade Ustası', aciklama: 'Oyun salonunda 20 kez yarış.', zorluk: 'Orta', xpOdul: 150, altinOdul: 50, emoji: '🕹️' },
  { id: 'evrim_uzmani', isim: 'Evrim Uzmanı', aciklama: '15. Seviyeye ulaş.', zorluk: 'Efsanevi', xpOdul: 1000, altinOdul: 500, emoji: '🚀' },
];

export const TamagotchiProvider = ({ children }) => {
  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);
  
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [rozetler, setRozetler] = useState([]);
  const [altin, setAltin] = useState(0);
  const [hastami, setHastami] = useState(false);

  const defaultEnvanter = Object.keys(MARKET_ITEMS).reduce((acc, key) => { acc[key] = 0; return acc; }, {});
  const [envanter, setEnvanter] = useState(defaultEnvanter);

  const defaultIstatistikler = { beslenmeSayisi: 0, odakTamamlanmaSayisi: 0, oynamaSayisi: 0, harcananAltin: 0 };
  const [istatistikler, setIstatistikler] = useState(defaultIstatistikler);

  const [isReady, setIsReady] = useState(false);
  const [animTetikle, setAnimTetikle] = useState(0); 

  const [oncekiLevel, setOncekiLevel] = useState(1);

  // Evrim Mantığı
  const getEvrimDurumu = () => {
    if (level >= 10) return { isim: 'Usta Limo', tur: 'Yetişkin', emoji: '🦅' };
    if (level >= 5) return { isim: 'Limo', tur: 'Yavru', emoji: '🐣' };
    return { isim: 'Bıdık', tur: 'Yumurta', emoji: '🥚' };
  };
  const evrim = getEvrimDurumu();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAclik = await AsyncStorage.getItem('@aclik');
        const storedMutluluk = await AsyncStorage.getItem('@mutluluk');
        const storedLevel = await AsyncStorage.getItem('@level');
        const storedXp = await AsyncStorage.getItem('@xp');
        const storedRozetler = await AsyncStorage.getItem('@rozetler');
        const storedAltin = await AsyncStorage.getItem('@altin');
        const storedHastami = await AsyncStorage.getItem('@hastami');
        const storedEnerji = await AsyncStorage.getItem('@enerji');
        const storedEnvanter = await AsyncStorage.getItem('@envanter');
        const storedStats = await AsyncStorage.getItem('@istatistikler');

        if (storedAclik) setAclik(parseInt(storedAclik));
        if (storedMutluluk) setMutluluk(parseInt(storedMutluluk));
        
        if (storedLevel) {
           const initialLevel = parseInt(storedLevel);
           setLevel(initialLevel);
           setOncekiLevel(initialLevel);
        }

        if (storedXp) setXp(parseInt(storedXp));
        if (storedRozetler) setRozetler(JSON.parse(storedRozetler));
        if (storedAltin) setAltin(parseInt(storedAltin));
        if (storedHastami) setHastami(storedHastami === 'true');
        
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

        setIsReady(true);
      } catch (e) {
        console.error("Veri yüklenirken hata:", e);
        setIsReady(true);
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
        await AsyncStorage.setItem('@hastami', hastami.toString());
        await AsyncStorage.setItem('@envanter', JSON.stringify(envanter));
        await AsyncStorage.setItem('@istatistikler', JSON.stringify(istatistikler));
      } catch (e) {
        console.error("Veri kaydedilirken hata:", e);
      }
    };
    saveData();
  }, [aclik, mutluluk, level, xp, rozetler, altin, hastami, envanter, istatistikler, isReady]);

  // Evrim Animasyonu / Kutlama
  useEffect(() => {
    if (isReady && level > oncekiLevel) {
       if (oncekiLevel < 5 && level >= 5) {
           setTimeout(() => Alert.alert("EVRİM GEÇİRDİ! 🌟", "Tebrikler, evcil hayvanın büyüdü ve bir Yavru (🐣) oldu!"), 500);
           Vibration.vibrate([0, 200, 100, 400]);
       } else if (oncekiLevel < 10 && level >= 10) {
           setTimeout(() => Alert.alert("EVRİM GEÇİRDİ! 🎊", "Tebrikler, evcil hayvanın usta bir Yetişkin (🦅) oldu!"), 500);
           Vibration.vibrate([0, 300, 200, 500]);
       }
       setOncekiLevel(level);
    }
  }, [level, isReady, oncekiLevel]);

  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {

      // %5 ihtimalle rastgele olay
      if (Math.random() < 0.05) {
         if (Math.random() < 0.5) {
            setAltin((prev) => prev + 50);
            Vibration.vibrate([0, 100, 100, 100]);
            Alert.alert("Hazine Bulundu! 🗺️", "Evcil hayvanın bahçede gömülü bir hazine buldu! (+50 Altın)");
         } else {
            setHastami(true);
            Vibration.vibrate([0, 500, 200, 500]);
            Alert.alert("Hastalık! 🤒", "Eyvah, evcil hayvanın üşüttü ve hastalandı! Acilen marketten 'İlaç/İksir' alıp kullanman gerekir.");
         }
      }

      setAclik((prevAclik) => {
        const yeniAclik = Math.min(100, prevAclik + 1);
        if (prevAclik <= 80 && yeniAclik > 80) Vibration.vibrate(500); 
        
        setHastami((currentHastami) => {
           setMutluluk((prevMutluluk) => {
             const azalmaMiktari = (yeniAclik > 80 ? 3 : 1) + (currentHastami ? 3 : 0);
             return Math.max(0, prevMutluluk - azalmaMiktari);
           });
           return currentHastami;
        });

        return yeniAclik;
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;
    
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
          case 'alisveriskolik': kazanildiMi = (istatistikler.harcananAltin || 0) >= 500; break;
          case 'arcade_ustasi': kazanildiMi = istatistikler.oynamaSayisi >= 20; break;
          case 'evrim_uzmani': kazanildiMi = level >= 15; break;
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
      setTimeout(() => Alert.alert("BAŞARIM AÇILDI! 🌟", yeniKazanilanlar.join("\n\n")), 500);
    }
  }, [istatistikler, altin, level, mutluluk, rozetler, isReady]);

  const esyaSatinAl = (itemId) => {
    const item = MARKET_ITEMS[itemId];
    if (altin >= item.fiyat) {
      setAltin((prev) => prev - item.fiyat);
      setIstatistikler((prev) => ({ ...prev, harcananAltin: (prev.harcananAltin || 0) + item.fiyat }));
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

      if (item.id === 'ilac' || item.id === 'mucizeIksiri' || item.id === 'sihirliIksir') {
         setHastami(false); // Hastalığı iyileştir
      }

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
    }
  };

  const oyunSessizOdulVer = (kMutluluk, kXp, kAltin) => {
    setIstatistikler(prev => ({ ...prev, oynamaSayisi: prev.oynamaSayisi + 1 }));
    setMutluluk(prev => Math.min(100, Math.max(0, prev + kMutluluk)));
    if (kAltin > 0) setAltin(prev => prev + kAltin);
    
    if (kXp > 0) {
      setXp(prev => {
        let yeniToplam = prev + kXp;
        if (yeniToplam >= 100) {
           setLevel(pLevel => pLevel + Math.floor(yeniToplam / 100));
           Vibration.vibrate([0, 100, 50, 100]);
           return yeniToplam % 100;
        }
        return yeniToplam;
      });
    }
    Vibration.vibrate(kMutluluk > 0 ? [0, 50, 50, 50] : 300);
    setAnimTetikle(prev => prev + 1);
  };

  const oyunOynaPuan = (puan) => {
    setIstatistikler(prev => ({ ...prev, oynamaSayisi: prev.oynamaSayisi + 1 }));
    if(puan > 0) {
      const kazanilanMutluluk = puan;
      const kazanilanXp = puan * 2;
      const kazanilanAltin = Math.max(5, puan); // En az 5 altın
      
      setMutluluk(prev => Math.min(100, prev + kazanilanMutluluk));
      setAltin(prev => prev + kazanilanAltin);

      setXp(prev => {
        let yeniToplam = prev + kazanilanXp;
        if (yeniToplam >= 100) {
           setLevel(pLevel => pLevel + Math.floor(yeniToplam / 100));
           Vibration.vibrate([0, 100, 50, 100]);
           return yeniToplam % 100;
        }
        return yeniToplam;
      });

      Vibration.vibrate([0, 50, 50, 50]);
      Alert.alert("Oyun Bitti! 🎮", `Harika bir iş çıkardın!\n\nSkorun: ${puan}\n+${kazanilanMutluluk} Mutluluk\n+${kazanilanXp} XP\n+${kazanilanAltin} 💰`);
      setAnimTetikle((prev) => prev + 1);
    } else {
      setMutluluk(prev => Math.max(0, prev - 10));
      Vibration.vibrate(300);
      Alert.alert("Oyun Bitti 🥺", "Hiç nesne yakalayamadın. Evcil hayvanın biraz sıkıldı (-10 Mutluluk).");
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

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f2f6' }}>
        <Text style={{ fontSize: 18, color: '#2d3436', fontWeight: 'bold' }}>Oyun Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <TamagotchiContext.Provider value={{ 
      ...evrim, aclik, mutluluk, level, xp, rozetler, altin, envanter, hastami, istatistikler,
      esyaSatinAl, esyaKullan, oyunOynaPuan, oyunSessizOdulVer, isReady, isLoaded: isReady, tamamlaOdak, bozOdak, animTetikle
    }}>
      {children}
    </TamagotchiContext.Provider>
  );
};
