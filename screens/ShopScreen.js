import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShopScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🛒</Text>
      <Text style={styles.title}>Market</Text>
      <Text style={styles.subtitle}>Çok Yakında!</Text>
      <Text style={styles.description}>Evcil hayvanın için yiyecek ve şapka gibi eşyalar alabileceğin pazar burası olacak.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ff9f43',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ShopScreen;
