import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Tamagotchi = ({ isim, tur }) => {
  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);

  // 1. Clean Code & Defensive Programming
  const besle = () => {
    // Açlık 10 azalır ama asla 0'ın altına düşemez.
    setAclik((prev) => Math.max(0, prev - 10));
  };

  const oyna = () => {
    // Mutluluk 10 artar ama asla 100'ü geçemez.
    setMutluluk((prev) => Math.min(100, prev + 10));
    // Açlık 5 artar ama o da asla 100'ü geçemez.
    setAclik((prev) => Math.min(100, prev + 5));
  };

  // 2. Dinamik Görsel Geri Bildirimler
  const getEmoji = () => {
    if (mutluluk > 80) return "🤩";
    if (mutluluk >= 50) return "😊";
    if (mutluluk >= 30) return "😐";
    return "🥺";
  };

  const isHungry = aclik > 70;
  // Açlık 70'in üzerindeyse arka plan uyarısı (pastel kırmızı tonu), değilse temiz beyaz liste.
  const cardBackgroundColor = isHungry ? '#ffeaa7' : '#ffffff'; // Hafif sarı/uyarı tonu da kullanılabilir ama kırmızı istenmişti.
  const finalBgColor = isHungry ? '#ffcccc' : '#ffffff'; 

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: finalBgColor }]}>
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
    width: '90%',
    maxWidth: 350,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    // Yumuşak gölgelendirme - iOS (Shadows)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    // Yumuşak gölgelendirme - Android (Elevation)
    elevation: 10,
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
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Kart içinde şeffaf alan
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
    fontWeight: '800',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15, // Yeni React Native sürümlerinde desteklenir, boşluk bırakır
  },
  button: {
    flex: 1, // Butonları eşit genişliğe zorlar
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
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Tamagotchi;
