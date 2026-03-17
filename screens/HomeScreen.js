import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const HomeScreen = () => {
  const { 
    isim, tur, aclik, mutluluk, level, xp, 
    envanter, kullanPremiumMama, kullanEnerjiIksiri, 
    besle, oyna, isLoaded 
  } = useContext(TamagotchiContext);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18, color: '#2d3436' }}>Yükleniyor...</Text>
      </View>
    );
  }

  const getEmoji = () => {
    if (mutluluk > 80) return "🤩";
    if (mutluluk >= 50) return "😊";
    if (mutluluk >= 30) return "😐";
    return "🥺";
  };

  const isHungry = aclik > 70;
  const finalBgColor = isHungry ? '#ffcccc' : '#ffffff'; 

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      <View style={[styles.card, { backgroundColor: finalBgColor }]}>
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

      {/* GAMIFICATION: Envanter */}
      <View style={styles.inventoryCard}>
        <Text style={styles.inventoryTitle}>🎒 Çantam</Text>
        
        <View style={styles.inventoryItems}>
          <View style={styles.inventoryItem}>
            <Text style={styles.invEmoji}>🍎 x{envanter.mama}</Text>
            <TouchableOpacity 
              style={[styles.invButton, envanter.mama === 0 && styles.invButtonDisabled]}
              disabled={envanter.mama === 0}
              onPress={kullanPremiumMama}
            >
              <Text style={styles.invButtonText}>Kullan</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inventoryItem}>
            <Text style={styles.invEmoji}>💊 x{envanter.iksir}</Text>
            <TouchableOpacity 
              style={[styles.invButton, envanter.iksir === 0 && styles.invButtonDisabled]}
              disabled={envanter.iksir === 0}
              onPress={kullanEnerjiIksiri}
            >
              <Text style={styles.invButtonText}>Kullan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{height: 20}} />
    </ScrollView>
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
  },
  contentContainer: {
    alignItems: 'center',
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
    marginBottom: 20,
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
    marginBottom: 20,
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
  // INVENTORY STYLES
  inventoryCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inventoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 16,
  },
  inventoryItems: {
    flexDirection: 'column',
    gap: 12,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  invEmoji: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
  },
  invButton: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  invButtonDisabled: {
    backgroundColor: '#b2bec3',
  },
  invButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default HomeScreen;
