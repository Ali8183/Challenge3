import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const ShopScreen = () => {
  const { altin, satinAlPremiumMama, satinAlEnerjiIksiri } = useContext(TamagotchiContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market</Text>
        <View style={styles.coinBadge}>
          <Text style={styles.coinText}>🪙 {altin}</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Altınlarınla evcil hayvanın için özel öğeler satın alabilirsin. Oynadıkça +5 altın kazanırsın!
      </Text>

      {/* Item 1 */}
      <View style={styles.itemCard}>
        <Text style={styles.itemEmoji}>🍎</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>Premium Mama</Text>
          <Text style={styles.itemDesc}>Açlığı tamamen sıfırlar ve anında +30 XP kazandırır.</Text>
        </View>
        <TouchableOpacity 
          style={styles.buyButton} 
          onPress={satinAlPremiumMama}
          activeOpacity={0.7}
        >
          <Text style={styles.buyButtonText}>20 🪙</Text>
        </TouchableOpacity>
      </View>

      {/* Item 2 */}
      <View style={styles.itemCard}>
        <Text style={styles.itemEmoji}>💊</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>Enerji İksiri</Text>
          <Text style={styles.itemDesc}>Evcil hayvanını anında çok mutlu yapar (%100 Mutluluk).</Text>
        </View>
        <TouchableOpacity 
          style={styles.buyButton} 
          onPress={satinAlEnerjiIksiri}
          activeOpacity={0.7}
        >
          <Text style={styles.buyButtonText}>50 🪙</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3436',
  },
  coinBadge: {
    backgroundColor: '#f1c40f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#f39c12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  coinText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  description: {
    fontSize: 15,
    color: '#636e72',
    lineHeight: 22,
    marginBottom: 30,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  itemEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 13,
    color: '#636e72',
    lineHeight: 18,
  },
  buyButton: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  buyButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
});

export default ShopScreen;
