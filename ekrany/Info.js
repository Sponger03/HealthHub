import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

import styles from './Styles.js'; 

export default function Info() {
  const [waga, setWaga] = useState('');
  const [wzrost, setWzrost] = useState('');
  const [wiek, setWiek] = useState('');
  const [plec, setPlec] = useState('male');
  const [userEmail, setUserEmail] = useState('');
  const [bdKcal, setBdKcal] = useState(0);
  
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://192.168.69.198:3000/user/info');
      const data = await response.json();

      if (response.ok) {
        setUserEmail(data.email);
      } else {
        setUserEmail('');
      }
    } catch (error) {
      console.error('Błąd pobierania danych:', error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        email: userEmail,
        waga: parseFloat(waga),
        wzrost: parseFloat(wzrost),
        wiek: parseInt(wiek),
        plec: plec,
      };

      const response = await fetch('http://192.168.69.198:3000/data/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Dane zostały zapisane');
        setBdKcal(data.proposedCalories);
        Keyboard.dismiss();
      } else {
        console.error('Błąd zapisywania danych:');
      }
    } catch (error) {
      console.error('Błąd zapisywania danych:');
    }
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80cbc4']}
      style={styles.container}
    >
    <View style={styles.container}>
      <Text style={styles.label}>Waga:</Text>
      <TextInput style={styles.input} value={waga} onChangeText={text => setWaga(text)} keyboardType="numeric" />
      <Text style={styles.label}>Wzrost:</Text>
      <TextInput style={styles.input} value={wzrost} onChangeText={text => setWzrost(text)} keyboardType="numeric" />
      <Text style={styles.label}>Wiek:</Text>
      <TextInput style={styles.input} value={wiek} onChangeText={text => setWiek(text)} keyboardType="numeric" />
      <Text style={styles.label}>Płeć:</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={plec} style={styles.picker} onValueChange={(itemValue, itemIndex) => setPlec(itemValue)}>
        <Picker.Item label="Mężczyzna" value="male" />
        <Picker.Item label="Kobieta" value="female" />
      </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Zapisz" onPress={handleSubmit} color="#4CAF50" />
      </View>
      {bdKcal !== 0 && (
        <Text style={styles.dieta}>
          Twoja dieta to {bdKcal} kcal
        </Text>
      )}
    </View>
    </LinearGradient>
  );
}
