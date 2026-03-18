import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import { TamagotchiContext, MARKET_ITEMS } from '../context/TamagotchiContext';

const HomeScreen = () => {
  const { 
    isim, tur, emoji, aclik, mutluluk, level, xp, hastami,
    envanter, esyaKullan, isLoaded, animTetikle
  } = useContext(TamagotchiContext);

  // --- ANIMATED API DEĞERLERİ ---
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // 1) Sürekli Yüzen (Floating/Breathing) Animasyon Döngüsü
  React.useEffect(() => {
    if (!isLoaded) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15, // Hafifçe yukarı kayar
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0, // Geri eski yerine iner
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isLoaded, floatAnim]);

  // 2) Etkileşimde Büyüme (Pop/Scale) Animasyonu
  React.useEffect(() => {
    if (animTetikle > 0) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3, // Karakter %30 büyür
          speed: 20,
          bounciness: 12, // Jölemsi hissiyat
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1, // Eski haline döner
          speed: 10,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animTetikle, scaleAnim]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18, color: '#2d3436' }}>Yükleniyor...</Text>
      </View>
    );
  }

  const renderEmoji = () => {
    if (hastami) return '🤒 ' + (emoji || '🥚');
    return emoji || '🥚';
  };

  const isHungry = aclik > 70;
  const finalBgColor = isHungry ? '#ffcccc' : '#ffffff'; 

  // Sahip olunan eşyaları filtrele
  const sahipOlunanAcalar = Object.keys(envanter).filter((id) => envanter[id] > 0 && MARKET_ITEMS[id]);

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.card, { backgroundColor: finalBgColor }]}>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Seviye {level}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${xp}%` }]} />
            </View>
            <Text style={styles.xpText}>{xp} / 100 XP</Text>
          </View>

          {/* TAMAGOTCHI: Animated.Text kullanımı ile animasyonlar karaktere bağlandı */}
          <Animated.Text 
            style={[
              styles.emoji, 
              { transform: [{ translateY: floatAnim }, { scale: scaleAnim }] },
              hastami && { opacity: 0.6 } // Hasta olunca şeffaflaşır
            ]}
          >
            {renderEmoji()}
          </Animated.Text>
          
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

        </View>

        <View style={{height: 20}} />
      </ScrollView>

      {/* DİKEY ENVANTER SİDEBAR'I */}
      {sahipOlunanAcalar.length > 0 && (
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
            {sahipOlunanAcalar.map((id) => (
              <TouchableOpacity 
                key={id} 
                style={styles.sidebarItem} 
                onPress={() => esyaKullan(id)}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarEmoji}>{MARKET_ITEMS[id].emoji}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>x{envanter[id]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f2f6',
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    flexDirection: 'row', 
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    flexGrow: 1,
    paddingRight: 80, 
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    
     height: 10 },
    
    
    elevation: 8,
  },
  levelContainer: {
    width: '100%',
    marginBottom: 24,
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
    fontSize: 90,
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
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
    marginBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.04)', 
    paddingVertical: 14,
    borderRadius: 20,
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
    fontSize: 22,
    fontWeight: '900',
  },
  // SIDEBAR STYLES
  sidebar: {
    position: 'absolute',
    right: 15,
    top: 30,
    bottom: 30,
    width: 60,
    backgroundColor: 'transparent',
  },
  sidebarScroll: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 16,
  },
  sidebarItem: {
    width: 56,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 28, 
    alignItems: 'center',
    justifyContent: 'center',
    
     height: 4 },
    
    
    elevation: 5,
    borderWidth: 2,
    borderColor: '#f1f2f6',
  },
  sidebarEmoji: {
    fontSize: 26,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#d63031',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  }
});

export default HomeScreen;
