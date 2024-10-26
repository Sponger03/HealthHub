import React, { useState } from 'react';
import { View, Button, TextInput, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import styles from './Styles.js';

export default function Registration() {
  const navigation = useNavigation();
  const [values, setValues] = useState({
    email: '',
    haslo: '' 
  });

  const goToLoginScreen = () => {
    navigation.navigate('Login');
  };

  const handleRegistration = async () => {
    try {
      if (values.email !== '' && values.haslo !== '') { 
        const response = await fetch('http://192.168.69.198:3000/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values), 
        });

        if (response.ok) {
          goToLoginScreen();
        } else {
          console.error('Rejestracja nieudana:');
        }
      } else {
        Alert.alert('Błąd', 'Wszystkie pola są wymagane.');
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error);
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
      <TextInput style={styles.input} placeholder="Email" onChangeText={text => handleInputChange('email', text)} value={values.email} keyboardType="email-address" autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Hasło" onChangeText={text => handleInputChange('haslo', text)} value={values.haslo} secureTextEntry/>
      <View style={styles.buttonContainer}>
      <Button title="Zarejestruj się" onPress={handleRegistration} />
      </View>
      <Text alignSelf="center">Masz konto?</Text>
      <View style={styles.buttonContainer}>
      <Button title="Zaloguj się" onPress={goToLoginScreen}  color="#4CAF50"/>
      </View>
    </View>
   </LinearGradient>
  );
}


