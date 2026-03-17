import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const Tamagotchi = ({ isim, tur }) => {
  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);

  // GAMIFICATION: Level ve XP state'leri
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  // GAMIFICATION: Kazanılan rozetleri (başarımları) tutan state
  const [rozetler, setRozetler] = useState([]);

  // Oyunlaştırma işlemlerini (XP kazanımı, Level Atlama ve Rozet kazanımı) yöneten ortak fonskiyon
  const processGamification = (yeniMutluluk) => {
    // 10-20 arası rastgele XP kazanımı
    const kazanilanXp = Math.floor(Math.random() * 11) + 10;
    let yeniXp = xp + kazanilanXp;
    let yeniLevel = level;

    // XP 100 veya üzeri olursa level atlat, kalanı aktar
    if (yeniXp >= 100) {
      yeniLevel += Math.floor(yeniXp / 100);
      yeniXp = yeniXp % 100;
    }

    setLevel(yeniLevel);
    setXp(yeniXp);

    // Rozet Kontrolleri
    const yeniRozetler = [...rozetler];
    let rozetKazanildiMi = false;

    // Yeni rozet ekleme koşulu fonksiyonu
    const rozetEkle = (rozet) => {
      if (!yeniRozetler.includes(rozet)) {
        yeniRozetler.push(rozet);
        rozetKazanildiMi = true;
        // Küçük tebrik alerti
        Alert.alert("Tebrikler! 🎉", `Kazandığın Rozet: ${rozet}`);
      }
    };

    // İlk adımı (ilk tıklamayı) test et
    if (rozetler.length === 0) rozetEkle("🥉 İlk Adım");
    // Diğer koşullar
    if (yeniMutluluk >= 100) rozetEkle("🌟 Mutlu Dost");
    if (yeniLevel >= 3) rozetEkle("👑 Usta Bakıcı");

    if (rozetKazanildiMi) {
      setRozetler(yeniRozetler);
    }
  };

  // 1. Clean Code & Defensive Programming
  const besle = () => {
    setAclik((prev) => Math.max(0, prev - 10));
    // Level ve XP'yi besleme sonrası güncelle
    processGamification(mutluluk);
  };

  const oyna = () => {
    const yeniMutluluk = Math.min(100, mutluluk + 10);
    setMutluluk(yeniMutluluk);
    setAclik((prev) => Math.min(100, prev + 5));
    // Level ve XP'yi oynama sonrası güncelle
    processGamification(yeniMutluluk);
  };

  // 2. Dinamik Görsel Geri Bildirimler
  const getEmoji = () => {
    if (mutluluk > 80) return "🤩";
    if (mutluluk >= 50) return "😊";
    if (mutluluk >= 30) return "😐";
    return "🥺";
  };

  const isHungry = aclik > 70;
  // Açlık 70'in üzerindeyse arka plan uyarısı (pastel kırmızı tonu)
  const finalBgColor = isHungry ? '#ffcccc' : '#ffffff'; 

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: finalBgColor }]}>
        
        {/* GAMIFICATION: Level ve XP (Progress Bar Şeklinde) */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Seviye {level}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${xp}%` }]} />
          </View>
          <Text style={styles.xpText}>{xp} / 100 XP</Text>
        </View>

        <Text style={styles.emoji}>{getEmoji()}</Text>
        
        <View style={styles.infoContainer}>
            <Text style={styles.name}>{isim}</Text>
            <Text style={styles.type}>Tür: {tur}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Açlık</Text>
            <Text style={[styles.statValue, { color: isHungry ? '#c0392b' : '#2d3436' }]}>
              {aclik}/100
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Mutluluk</Text>
            <Text style={[styles.statValue, { color: mutluluk < 30 ? '#c0392b' : '#2d3436' }]}>
              {mutluluk}/100
            </Text>
          </View>
        </View>

        {/* GAMIFICATION: Rozet Panosu */}
        {rozetler.length > 0 && (
          <View style={styles.badgesWrapper}>
            <Text style={styles.badgesTitle}>Kazanılan Rozetler ({rozetler.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {rozetler.map((rozet, index) => (
                <View key={index} style={styles.badgeItem}>
                  <Text style={styles.badgeText}>{rozet}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.feedButton]} 
            onPress={besle}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Besle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.playButton]} 
            onPress={oyna}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Oyna</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// 3. Modern Arayüz ve Flexbox Mimarisi
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  levelContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0984e3',
    marginBottom: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#dfe6e9',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#74b9ff',
    borderRadius: 6,
  },
  xpText: {
    fontSize: 13,
    color: '#636e72',
    fontWeight: '700',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    color: '#636e72',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20, // Alt kısma eklenecek rozetlere yer bırakmak için düşürüldü
    backgroundColor: 'rgba(0, 0, 0, 0.04)', 
    paddingVertical: 12,
    borderRadius: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  badgesWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  badgesTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 12,
  },
  badgeItem: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#f1c40f',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#d35400',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15, 
  },
  button: {
    flex: 1, 
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedButton: {
    backgroundColor: '#ff9f43',
  },
  playButton: {
    backgroundColor: '#10ac84',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default Tamagotchi;
