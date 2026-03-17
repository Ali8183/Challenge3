import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { TamagotchiContext, MARKET_ITEMS } from '../context/TamagotchiContext';

const HomeScreen = () => {
  const { 
    isim, tur, aclik, mutluluk, level, xp, 
    envanter, esyaKullan, oyna, isLoaded 
  } = useContext(TamagotchiContext);

  const [besleModalVisible, setBesleModalVisible] = useState(false);

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

  // Envanterdeki ürünleri ayır
  const beslenmeEsyalari = Object.keys(envanter).filter(
    (id) => envanter[id] > 0 && (MARKET_ITEMS[id].tip === 'yiyecek' || MARKET_ITEMS[id].tip === 'icecek')
  );
  const ozelEsyalar = Object.keys(envanter).filter(
    (id) => envanter[id] > 0 && MARKET_ITEMS[id].tip === 'ozel'
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* GAMIFICATION: Özel Ögeler Çantası */}
      <View style={styles.inventoryCard}>
        <Text style={styles.inventoryTitle}>🎒 Özel Ögeler</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inventoryItemsRow}>
          {ozelEsyalar.length > 0 ? (
            ozelEsyalar.map((id) => (
              <TouchableOpacity 
                key={id}
                style={styles.invItem}
                onPress={() => esyaKullan(id)}
                activeOpacity={0.7}
              >
                <Text style={styles.invEmojiText}>
                  {MARKET_ITEMS[id].emoji} x{envanter[id]}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
             <Text style={styles.emptyStText}>Çantanda henüz özel eşya yok.</Text>
          )}
        </ScrollView>
      </View>

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
            onPress={() => setBesleModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Besle 🍽️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.playButton]} 
            onPress={oyna}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Oyna 🎾</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* BESLENME MODALI */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={besleModalVisible}
        onRequestClose={() => setBesleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ne Yedirmek İstersin? 😋</Text>
              <Pressable onPress={() => setBesleModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalItemsContainer} showsVerticalScrollIndicator={false}>
              {beslenmeEsyalari.length > 0 ? (
                beslenmeEsyalari.map((id) => (
                  <TouchableOpacity 
                    key={id}
                    style={styles.foodItem}
                    onPress={() => {
                        esyaKullan(id);
                        if(envanter[id] === 1 && beslenmeEsyalari.length === 1) {
                           setBesleModalVisible(false); // sonuncu bittiyse kapat
                        }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.foodEmoji}>{MARKET_ITEMS[id].emoji}</Text>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodTitle}>{MARKET_ITEMS[id].isim} (x{envanter[id]})</Text>
                      <Text style={styles.foodDesc}>{MARKET_ITEMS[id].aciklama}</Text>
                    </View>
                    <View style={styles.useButton}>
                       <Text style={styles.useButtonText}>Kullan</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyFoodContainer}>
                  <Text style={styles.emptyFoodEmoji}>🛒</Text>
                  <Text style={styles.emptyFoodText}>Çantanda yiyecek veya içecek kalmamış!</Text>
                  <Text style={styles.emptyFoodSubtext}>Markete gidip bir şeyler satın almalısın.</Text>
                </View>
              )}
            </ScrollView>
            
          </View>
        </View>
      </Modal>

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
    paddingTop: 10,
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
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    marginBottom: 20,
  },
  inventoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 12,
  },
  inventoryItemsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 20, // scroll için boşluk
  },
  emptyStText: {
    fontSize: 14,
    color: '#b2bec3',
    fontStyle: 'italic',
  },
  invItem: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0984e3',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  invEmojiText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0984e3',
  },
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2d3436',
  },
  closeButton: {
    backgroundColor: '#f1f2f6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#636e72',
  },
  modalItemsContainer: {
    paddingBottom: 20,
    gap: 12,
  },
  foodItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  foodEmoji: {
    fontSize: 34,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
    marginRight: 10,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 4,
  },
  foodDesc: {
    fontSize: 12,
    color: '#636e72',
  },
  useButton: {
    backgroundColor: '#ff9f43',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  useButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  emptyFoodContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyFoodEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyFoodText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 6,
  },
  emptyFoodSubtext: {
    fontSize: 14,
    color: '#636e72',
  }
});

export default HomeScreen;
