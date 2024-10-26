import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import styles from './Styles.js';

export default function Konto() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    checkIfLoggedIn();
  }, [isFocused]);

  const goToLoginScreen = () => {
    navigation.navigate('Login');
  };

  const goToRegistrationScreen = () => {
    navigation.navigate('Rejestracja');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.69.198:3000/user/logout', {
        method: 'POST',
      });
      if (response.ok) {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Błąd wylogowywania:', error.message);
    }
  };

  const checkIfLoggedIn = async () => {
    try {
      const response = await fetch('http://192.168.69.198:3000/user/info');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserEmail(data.email);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Błąd sprawdzania statusu logowania:', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80cbc4']}
      style={styles.container}
    >
    <View style={styles.container}>
      <Text style={styles.header} alignSelf="center">Zarządzanie kontem</Text>
      {!isLoggedIn && (
        <><View style={styles.buttonContainer}>
            <Button title="Zaloguj się" onPress={goToLoginScreen} color="#4CAF50" />
          </View><View style={styles.buttonContainer}>
              <Button title="Zarejestruj się" onPress={goToRegistrationScreen} color="#4CAF50" />
            </View></>
      )}
      {isLoggedIn && (
        <View>
          <Text style={styles.header2} alignSelf="center">Zalogowany jako: {userEmail}</Text>
            <View style={styles.buttonContainer}>
             <Button title="Wyloguj się" onPress={handleLogout} color="#C62828"/>
            </View>
          </View>
      )}
    </View>
    </LinearGradient>
  );
}