import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


import styles from './Styles.js';

export default function Login() {
  const navigation = useNavigation();
  const [values, setValues] = useState({
    email: '',
    haslo: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

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

  const goToRegistrationScreen = () => {
    navigation.navigate('Rejestracja');
  };

  const handleLogin = async () => {
    try {
      if (values.email !== '' && values.haslo !== '') {
        const response = await fetch('http://192.168.69.198:3000/user/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Zalogowano pomyślnie');
          navigation.navigate('HomeScreen');
        } else {
          console.error('Błąd logowania:', data.message);
        }
      } else {
        Alert.alert('Błąd', 'Wszystkie pola są wymagane.');
      }
    } catch (error) {
      console.error('Błąd logowania:', error.message);
    }
  };

  const handleInputChange = (key, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: value
    }));
  };

  return (
    <LinearGradient
    colors={['#e0f7fa', '#80cbc4']}
    style={styles.container}
  >
    <View style={styles.container}>
        <>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            onChangeText={text => handleInputChange('email', text)} 
            value={values.email} 
            keyboardType="email-address" 
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Hasło" 
            onChangeText={text => handleInputChange('haslo', text)} 
            value={values.haslo} 
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Zaloguj się" onPress={handleLogin} color="#4CAF50"/>
          </View>
          <Text alignSelf="center">Nie masz konta?</Text>
          <View style={styles.buttonContainer}  >
            <Button title="Zarejestruj się" onPress={goToRegistrationScreen}  />
          </View>
        </>
    </View>
    </LinearGradient>
  );
}
