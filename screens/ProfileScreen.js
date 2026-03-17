import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const ProfileScreen = () => {
  const { isim, tur, level, xp, rozetler } = useContext(TamagotchiContext);

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

      <Text style={styles.subtitle}>Kazanılan Rozetler ({rozetler.length})</Text>
      
      {rozetler.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz hiç rozet kazanmadın.</Text>
          <Text style={styles.emptySubtext}>Evcil hayvanınla ilgilenerek rozet kazanabilirsin!</Text>
        </View>
      ) : (
        <ScrollView style={styles.badgesContainer} showsVerticalScrollIndicator={false}>
          {rozetler.map((rozet, index) => (
            <View key={index} style={styles.badgeItem}>
              <Text style={styles.badgeText}>{rozet}</Text>
            </View>
          ))}
          <View style={{height: 40}} /> {/* Alt boşluk */}
        </ScrollView>
      )}
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
  badgeItem: {
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#f1c40f',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d35400',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#dfe6e9',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#636e72',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#b2bec3',
    textAlign: 'center',
  },
});

export default ProfileScreen;
