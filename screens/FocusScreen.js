import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const FocusScreen = () => {
  const { tamamlaOdak, bozOdak } = useContext(TamagotchiContext);

  // Süreler: 1dk, 3dk, 5dk
  const SEYANLAR = [1, 3, 5];

  const [seciliSure, setSeciliSure] = useState(3); 
  const [kalanSaniye, setKalanSaniye] = useState(3 * 60);
  const [aktif, setAktif] = useState(false);

  useEffect(() => {
    let interval = null;
    if (aktif && kalanSaniye > 0) {
      interval = setInterval(() => {
        setKalanSaniye((prev) => prev - 1);
      }, 1000);
    } else if (kalanSaniye === 0 && aktif) {
      clearInterval(interval);
      setAktif(false);
      tamamlaOdak(seciliSure);
      setKalanSaniye(seciliSure * 60);
    }
    return () => clearInterval(interval);
  }, [aktif, kalanSaniye]);

  const sureSec = (dk) => {
    if (aktif) return;
    setSeciliSure(dk);
    setKalanSaniye(dk * 60);
  };

  const timerBaslat = () => {
    if (kalanSaniye > 0 && !aktif) {
      setAktif(true);
    }
  };

  const timerDurdurPesEt = () => {
    setAktif(false);
    setKalanSaniye(seciliSure * 60);
    bozOdak();
  };

  const formatSaniye = (toplamSaniye) => {
    const d = Math.floor(toplamSaniye / 60);
    const s = toplamSaniye % 60;
    return `${d < 10 ? '0' : ''}${d}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odaklanma Modu 🎯</Text>
      <Text style={styles.description}>
        Süreyi bozmadan tamamlarsan XP ve 💰 kazanacaksın. Ama pes edersen evcil hayvanın üzülür!
      </Text>

      {/* Süre Seçenekleri */}
      <View style={styles.optionsContainer}>
        {SEYANLAR.map((dk) => (
          <TouchableOpacity 
            key={dk}
            style={[
              styles.optionButton, 
              seciliSure === dk && styles.optionButtonActive,
              aktif && styles.optionButtonDisabled 
            ]}
            onPress={() => sureSec(dk)}
            activeOpacity={0.7}
            disabled={aktif}
          >
            <Text style={[
              styles.optionText,
              seciliSure === dk && styles.optionTextActive,
              aktif && styles.optionTextDisabled
            ]}>
              {dk} Dk
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{formatSaniye(kalanSaniye)}</Text>
        <Text style={styles.timerStatus}>{aktif ? 'Odaklanıyorsun...' : 'Hazır!'}</Text>
      </View>

      {!aktif ? (
        <TouchableOpacity style={styles.startButton} onPress={timerBaslat} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Odaklanmaya Başla</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.giveUpButton} onPress={timerDurdurPesEt} activeOpacity={0.8}>
          <Text style={styles.giveUpButtonText}>Pes Et (Cezalı)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: '#dfe6e9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  optionButtonActive: {
    backgroundColor: '#0984e3',
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: '#636e72',
    fontWeight: '700',
  },
  optionTextActive: {
    color: '#ffffff',
  },
  optionTextDisabled: {
    color: '#b2bec3',
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    
     height: 10 },
    
    
    elevation: 10,
    borderWidth: 6,
    borderColor: '#0984e3',
  },
  timerText: {
    fontSize: 60,
    fontWeight: '900',
    color: '#2d3436',
    fontVariant: ['tabular-nums'], 
  },
  timerStatus: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 8,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#10ac84',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    
     height: 6 },
    
    
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  giveUpButton: {
    backgroundColor: '#d63031',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    
     height: 6 },
    
    
    elevation: 5,
  },
  giveUpButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default FocusScreen;
