import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TamagotchiContext } from '../context/TamagotchiContext';

const BedroomScreen = () => {
   const { emoji, uyuyorMu, setUyuyorMu, enerji, isim } = useContext(TamagotchiContext);

   // Zzz Animasyonu için
   const zzzAnim = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      if (uyuyorMu) {
         Animated.loop(
            Animated.sequence([
               Animated.timing(zzzAnim, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
               }),
               Animated.timing(zzzAnim, {
                  toValue: 0,
                  duration: 0,
                  useNativeDriver: true,
               })
            ])
         ).start();
      } else {
         zzzAnim.setValue(0);
         zzzAnim.stopAnimation();
      }
   }, [uyuyorMu]);

   // Sekmeden çıkıldığında otomatik uyanma
   useFocusEffect(
      React.useCallback(() => {
         return () => {
            if (uyuyorMu) {
               setUyuyorMu(false);
            }
         };
      }, [uyuyorMu, setUyuyorMu])
   );

   const toggleUyku = () => {
      if (!uyuyorMu && enerji === 100) {
         Alert.alert("Zaten Dinç! ⚡", `${isim} şu an hiç yorgun değil, uyumak istemiyor.`);
         return;
      }
      setUyuyorMu(!uyuyorMu);
   };

   const isDark = uyuyorMu;

   return (
      <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
         {/* Gece Lambası */}
         <TouchableOpacity style={styles.lambContainer} onPress={toggleUyku} activeOpacity={0.8}>
            <Text style={styles.lambEmoji}>{isDark ? '🌑' : '💡'}</Text>
            <Text style={[styles.lambText, isDark ? styles.darkText : styles.lightText]}>
               {isDark ? 'Lambayı Aç' : 'Lambayı Kapat'}
            </Text>
         </TouchableOpacity>

         {/* Hayvan ve Yatak */}
         <View style={styles.bedContainer}>
            {uyuyorMu && (
               <Animated.Text style={[styles.zzz, {
                  opacity: zzzAnim,
                  transform: [
                     { translateY: zzzAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) },
                     { translateX: zzzAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) },
                     { scale: zzzAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }
                  ]
               }]}>
                  Zzz...
               </Animated.Text>
            )}
            
            <View style={styles.petBox}>
               <Text style={[styles.petEmoji, isDark && { opacity: 0.6 }]}>{emoji}</Text>
            </View>
            <View style={styles.bed} />
         </View>

         {/* Enerji Barı */}
         <View style={styles.statusBox}>
            <Text style={[styles.statusTitle, isDark && styles.darkText]}>Enerji ({enerji}/100)</Text>
            <View style={styles.barContainer}>
               <View style={[styles.barFill, { width: `${enerji}%`, backgroundColor: enerji < 20 ? '#d63031' : '#0984e3' }]} />
            </View>
            {uyuyorMu ? (
               <Text style={[styles.infoText, { color: '#74b9ff' }]}>Derin uykuda... Enerji toplanıyor!</Text>
            ) : enerji < 15 ? (
               <Text style={[styles.infoText, { color: '#d63031' }]}>Çok yorgun! Acilen uyuması gerek.</Text>
            ) : (
               <Text style={[styles.infoText, isDark && styles.darkText]}>Oyun oynamak için enerji gerekir.</Text>
            )}
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 80,
   },
   lightBg: {
      backgroundColor: '#f1f2f6',
   },
   darkBg: {
      backgroundColor: '#121212',
   },
   lambContainer: {
      alignItems: 'center',
      marginBottom: 60,
   },
   lambEmoji: {
      fontSize: 80,
      marginBottom: 10,
   },
   lambText: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   lightText: {
      color: '#2d3436',
   },
   darkText: {
      color: '#dfe6e9',
   },
   bedContainer: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 200,
      position: 'relative',
   },
   zzz: {
      position: 'absolute',
      right: -20,
      top: 0,
      fontSize: 30,
      color: '#74b9ff',
      fontWeight: 'bold',
      zIndex: 10,
   },
   petBox: {
      marginBottom: -10, // Yatağa gömülü hissi için
      zIndex: 2,
   },
   petEmoji: {
      fontSize: 120,
   },
   bed: {
      width: 180,
      height: 40,
      backgroundColor: '#0984e3',
      borderRadius: 20,
      zIndex: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
   },
   statusBox: {
      marginTop: 80,
      width: '80%',
      alignItems: 'center',
   },
   statusTitle: {
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 10,
      color: '#2d3436',
   },
   barContainer: {
      width: '100%',
      height: 20,
      backgroundColor: '#dfe6e9',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 15,
   },
   barFill: {
      height: '100%',
      borderRadius: 10,
   },
   infoText: {
      fontSize: 14,
      color: '#636e72',
      fontWeight: '600',
      textAlign: 'center',
   }
});

export default BedroomScreen;
