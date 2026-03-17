import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const GameScreen = () => {
  const { isLoaded, oyunOynaPuan } = useContext(TamagotchiContext);
  const [oyunAktif, setOyunAktif] = useState(false);
  const [puan, setPuan] = useState(0);
  const [kalanSure, setKalanSure] = useState(10);
  const [hedefPos, setHedefPos] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    let timer = null;
    if (oyunAktif && kalanSure > 0) {
      timer = setInterval(() => {
        setKalanSure((prev) => prev - 1);
      }, 1000);
    } else if (kalanSure === 0 && oyunAktif) {
      setOyunAktif(false);
      oyunOynaPuan(puan);
    }
    return () => clearInterval(timer);
  }, [oyunAktif, kalanSure]);

  const oyunaBasla = () => {
    setPuan(0);
    setKalanSure(10);
    setOyunAktif(true);
    hedefYerDegistir();
  };

  const hedefYerDegistir = () => {
    const minTop = 15;
    const maxTop = 85;
    const minLeft = 10;
    const maxLeft = 85;

    const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);
    const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);

    setHedefPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  const hedefeCek = () => {
    if (oyunAktif) {
      setPuan((prev) => prev + 1);
      hedefYerDegistir();
    }
  };

  if (!isLoaded) return null;

  return (
    <View style={styles.container}>
      {!oyunAktif ? (
        <View style={styles.startContainer}>
          <Text style={styles.title}>Tap-Tap Catcher 🎮</Text>
          <Text style={styles.desc}>
            10 saniye boyunca ekranda beliren hedefi olabildiğince hızlı yakala! 
            Tıkladığın kadar Mutluluk, Altın ve XP kazanırsın.
          </Text>
          <Text style={styles.lastScore}>Son Skor: {puan}</Text>
          
          <TouchableOpacity style={styles.startButton} onPress={oyunaBasla} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Oyuna Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.header}>
            <Text style={styles.scoreText}>Skor: {puan}</Text>
            <Text style={styles.timeText}>Süre: {kalanSure}s</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.target, { top: hedefPos.top, left: hedefPos.left }]}
            onPress={hedefeCek}
            activeOpacity={0.6}
          >
            <Text style={styles.targetEmoji}>🧶</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2d3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  lastScore: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0984e3',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#10ac84',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 20,
    shadowColor: '#10ac84',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#dfe6e9',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#f1f2f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0984e3',
  },
  timeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#d63031',
  },
  target: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  targetEmoji: {
    fontSize: 34,
  }
});

export default GameScreen;
