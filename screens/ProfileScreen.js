import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TamagotchiContext, ACHIEVEMENTS } from '../context/TamagotchiContext';

const ProfileScreen = () => {
  const { isim, tur, level, xp, rozetler } = useContext(TamagotchiContext);

  const getZorlukRengi = (zorluk) => {
    if (zorluk === 'Kolay') return '#00b894';
    if (zorluk === 'Orta') return '#fdcb6e';
    if (zorluk === 'Zor') return '#d63031';
    return '#636e72';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Başarımlar 🏆</Text>

      <View style={styles.infoCard}>
        <Text style={styles.petName}>{isim}</Text>
        <Text style={styles.petType}>Tür: {tur}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Seviye {level}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{xp} XP</Text>
          </View>
        </View>
      </View>

      <Text style={styles.subtitle}>Tüm Görevler ({rozetler.length}/{ACHIEVEMENTS.length})</Text>
      
      <ScrollView style={styles.badgesContainer} showsVerticalScrollIndicator={false}>
        {ACHIEVEMENTS.map((ach) => {
          // Açık mı kontrolü
          const acikMi = rozetler.includes(ach.id);
          
          return (
            <View key={ach.id} style={[styles.achCard, !acikMi && styles.achCardLocked]}>
              <View style={[styles.iconWrapper, !acikMi && styles.iconWrapperLocked]}>
                <Text style={styles.achEmoji}>{acikMi ? ach.emoji : '🔒'}</Text>
              </View>
              
              <View style={styles.achInfo}>
                <Text style={[styles.achTitle, !acikMi && styles.achTitleLocked]}>
                  {ach.isim}
                </Text>
                <Text style={styles.achDesc}>{ach.aciklama}</Text>
                <View style={styles.rewardsRow}>
                  <Text style={styles.rewardText}>+{ach.xpOdul} XP</Text>
                  <Text style={styles.rewardText}>+{ach.altinOdul} 💰</Text>
                </View>
              </View>

              <View style={styles.statusBox}>
                <Text style={[styles.zorlukText, { color: getZorlukRengi(ach.zorluk) }]}>
                  {ach.zorluk}
                </Text>
                {acikMi ? (
                  <Text style={styles.unlockedText}>✅ Kazanıldı</Text>
                ) : (
                  <Text style={styles.lockedText}>Kilitli</Text>
                )}
              </View>
            </View>
          );
        })}
        <View style={{height: 40}} /> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  petName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2d3436',
  },
  petType: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statBox: {
    backgroundColor: '#74b9ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statValue: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 15,
  },
  badgesContainer: {
    flex: 1,
  },
  // ACHIEVEMENT CARD STYLES
  achCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#0984e3',
  },
  achCardLocked: {
    backgroundColor: '#f5f6fa',
    borderColor: '#dfe6e9',
    opacity: 0.7,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1c40f',
  },
  iconWrapperLocked: {
    backgroundColor: '#dfe6e9',
    borderColor: '#b2bec3',
  },
  achEmoji: {
    fontSize: 24,
  },
  achInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  achTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 4,
  },
  achTitleLocked: {
    color: '#636e72',
  },
  achDesc: {
    fontSize: 12,
    color: '#636e72',
    lineHeight: 16,
    marginBottom: 8,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0984e3',
  },
  statusBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 60,
  },
  zorlukText: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10ac84',
  },
  lockedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b2bec3',
  }
});

export default ProfileScreen;
