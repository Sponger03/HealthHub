import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './Styles.js';

export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isFocused) {
      checkIfLoggedIn();
    }
  }, [isFocused]);

  const checkIfLoggedIn = async () => {
    try {
      const response = await fetch('http://192.168.69.198:3000/user/info');
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Błąd sprawdzania statusu logowania:', error.message);
    }
  };

  const goToInfoScreen = () => {
    navigation.navigate('Info');
  };
  
  const goToWykresScreen = () => {
    navigation.navigate('Wykres');
  };

  const goToDieta = () => {
    navigation.navigate('Dieta');
  };

  const goToProdukty = () => {
    navigation.navigate('Produkty'); 
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80cbc4']}
      style={styles.container}
    >
      <Text style={styles.header}>Zdrowe Żywienie</Text>

      <View style={styles.buttonContainer}>
        <Button title="Dziennik kalorii" onPress={goToDieta} color="#4CAF50" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Wyszukaj informacje o produktach" onPress={goToProdukty} color="#4CAF50" />
      </View>

      {isLoggedIn && (
        <>
        <Text marginTop={40} style={styles.header}>Mój profil</Text>
          <View style={styles.buttonContainer}>
            <Button title="Wprowadź informacje o sobie" onPress={goToInfoScreen} color="#4CAF50" />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Wykres diety" onPress={goToWykresScreen} color="#4CAF50" />
          </View>
        </>
      )}

      
    </LinearGradient>
  );
}
