import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TamagotchiProvider, TamagotchiContext } from './context/TamagotchiContext';

import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';
import FocusScreen from './screens/FocusScreen';
import GameScreen from './screens/GameScreen';

const Tab = createBottomTabNavigator();

const GlobalHeaderRight = () => {
  const { altin, isReady } = useContext(TamagotchiContext);
  if (!isReady) return null;
  
  return (
    <View style={styles.headerCoinContainer}>
      <Text style={styles.headerCoinText}>💰 {altin}</Text>
    </View>
  );
};

const NavigationLogic = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#0984e3',
          tabBarInactiveTintColor: '#b2bec3',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            height: 60,
            paddingBottom: 10
          },
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f1f2f6'
          },
          headerTitleStyle: {
            fontWeight: '800',
            color: '#2d3436'
          },
          headerRight: () => <GlobalHeaderRight />
        }}
      >
        <Tab.Screen 
          name="Ev" 
          component={HomeScreen} 
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
            title: "Evcil Hayvanım"
          }}
        />
        <Tab.Screen 
          name="Odak" 
          component={FocusScreen} 
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🎯</Text>,
            title: "Odak"
          }}
        />
        <Tab.Screen 
          name="Market" 
          component={ShopScreen} 
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🛒</Text>,
            title: "Market"
          }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏆</Text>,
            title: "Başarımlar"
          }}
        />
        <Tab.Screen 
          name="Oyunlar" 
          component={GameScreen} 
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🎮</Text>,
            title: "Oyun Salonu"
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <TamagotchiProvider>
      <NavigationLogic />
    </TamagotchiProvider>
  );
}

const styles = StyleSheet.create({
  headerCoinContainer: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1c40f',
    marginRight: 16,
  },
  headerCoinText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f39c12',
  },
});
