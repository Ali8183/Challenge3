import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TamagotchiContext, MARKET_ITEMS } from '../context/TamagotchiContext';

const ShopScreen = () => {
  const { esyaSatinAl } = useContext(TamagotchiContext);

  const yiyecekler = Object.values(MARKET_ITEMS).filter(i => i.tip === 'yiyecek');
  const icecekler = Object.values(MARKET_ITEMS).filter(i => i.tip === 'icecek');
  const ozel = Object.values(MARKET_ITEMS).filter(i => i.tip === 'ozel');

  const renderSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.isim}</Text>
            <Text style={styles.itemDesc}>{item.aciklama}</Text>
          </View>
          <TouchableOpacity 
            style={styles.buyButton} 
            onPress={() => esyaSatinAl(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.buyButtonText}>{item.fiyat} 💰</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        Marketimize hoş geldin! Evcil hayvanını beslemek ve mutlu etmek için ürünler alabilirsin.
      </Text>

      {renderSection('🍔 Yiyecekler', yiyecekler)}
      {renderSection('🧃 İçecekler', icecekler)}
      {renderSection('🎓 Özel Ögeler', ozel)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    padding: 20,
    paddingTop: 30,
  },
  description: {
    fontSize: 15,
    color: '#636e72',
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
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
    fontSize: 17,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
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
