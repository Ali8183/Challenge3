import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TamagotchiContext, ACHIEVEMENTS } from '../context/TamagotchiContext';

const ProfileScreen = () => {
  const { isim, tur, level, xp, rozetler, istatistikler, altin, mutluluk } = useContext(TamagotchiContext);

  const getZorlukRengi = (zorluk) => {
    if (zorluk === 'Kolay') return '#00b894';
    if (zorluk === 'Orta') return '#fdcb6e';
    if (zorluk === 'Zor') return '#d63031';
    if (zorluk === 'Efsanevi') return '#8e44ad';
    return '#636e72';
  };

  const getIlerleme = (ach) => {
    let mevcut = 0; let max = 1;
    switch(ach.id) {
      case 'ilk_isirik': mevcut = istatistikler.beslenmeSayisi; max = 1; break;
      case 'obur': mevcut = istatistikler.beslenmeSayisi; max = 10; break;
      case 'oyuncu': mevcut = istatistikler.oynamaSayisi; max = 10; break;
      case 'odak_ustasi': mevcut = istatistikler.odakTamamlanmaSayisi; max = 5; break;
      case 'dahi': mevcut = istatistikler.odakTamamlanmaSayisi; max = 15; break;
      case 'hayvan_sever': mevcut = istatistikler.oynamaSayisi; max = 50; break;
      case 'zengin_bakici': mevcut = altin; max = 500; break;
      case 'milyoner': mevcut = altin; max = 1000; break;
      case 'mukemmel_denge': mevcut = level; max = 10; break; 
      case 'mutlu_dost': mevcut = mutluluk; max = 100; break;
      case 'usta_bakici': mevcut = level; max = 3; break;
      case 'efsanevi_egitmen': mevcut = level; max = 5; break;
      case 'alisveriskolik': mevcut = istatistikler.harcananAltin || 0; max = 500; break;
      case 'arcade_ustasi': mevcut = istatistikler.oynamaSayisi; max = 20; break;
      case 'evrim_uzmani': mevcut = level; max = 15; break;
    }
    const yuzde = Math.min(100, Math.max(0, (mevcut / max) * 100));
    return { yuzde, mevcut: Math.floor(Math.min(mevcut, max)), max };
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
                {!acikMi && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${getIlerleme(ach).yuzde}%` }]} />
                    </View>
                    <Text style={styles.progressText}>%{Math.round(getIlerleme(ach).yuzde)} ({getIlerleme(ach).mevcut}/{getIlerleme(ach).max})</Text>
                  </View>
                )}
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
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#dfe6e9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0984e3',
  },
  progressText: {
    fontSize: 10,
    color: '#636e72',
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'right'
  }
});

export default ProfileScreen;
