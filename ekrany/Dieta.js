import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import styles from './Styles.js';

export default function Dieta() {
  const [calories, setCalories] = useState('');
  const isFocused = useIsFocused();
  const [totalCalories, setTotalCalories] = useState(0);
  const [remainingCalories, setRemainingCalories] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [mode, setMode] = useState('normal');
  const [category, setCategory] = useState('');
  const [faqVisible, setFaqVisible] = useState(false);
  const [bdKcal, setBdKcal] = useState(0);
  const [SubFaqStates, setSubFaqStates] = useState({
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false,
  });

  useEffect(() => {
    if (isFocused) {
      fetchUserInfo();
      fetchTotalCalories();
    }
  }, [isFocused]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://192.168.69.198:3000/user/info');
      if (!response.ok) {
        setUserEmail('');
        setBdKcal(2200);
        return;
      }
  
      const userData = await response.json();
      setUserEmail(userData.email);
  
      const dataToSend = { email: userData.email };
  
      const dietaResponse = await fetch('http://192.168.69.198:3000/data/dieta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
  
      if (!dietaResponse.ok) {
        console.error('Błąd pobierania danych diety:', dietaResponse.statusText);
        return;
      }
  
      const dataDieta = await dietaResponse.json();
      setBdKcal(dataDieta.proposedCalories);
  
    } catch (error) {
      console.error('Błąd pobierania informacji:', error.message);
    }
  };

  const fetchTotalCalories = async () => {
    try {
      const storedTotalCalories = await AsyncStorage.getItem('totalCalories');
      if (storedTotalCalories !== null) {
        setTotalCalories(parseInt(storedTotalCalories));
      }
    } catch (error) {
      console.error('Błąd pobierania sumy kalorii:', error.message);
    }
  };

  const handleAddCalories = async () => {
    try {
      const parsedCalories = parseInt(calories) || 0;  
      let tryb = 0;
      if (mode === 'chudnięcie') {
        tryb = -250;
      } else if (mode === 'przytycie') {
        tryb = 250;
      }
      let dieta = bdKcal;

      const newTotalCalories = totalCalories + parsedCalories;
      setTotalCalories(newTotalCalories);
      const calorieDifference = newTotalCalories - dieta;

      if (calorieDifference <= -800 + tryb) {
        setCategory('Zbyt mało kalorii');
      } else if (calorieDifference <= -400 + tryb) {
        setCategory('Możesz spokojnie zjeść więcej');
      } else if (calorieDifference <= -200 + tryb) {
        setCategory('Blisko celu');
      } else if (calorieDifference <= 200 + tryb) {
        setCategory('Odpowiednia ilość');
      } else if (calorieDifference <= 400 + tryb) {
        setCategory('Za dużo kalorii');
      } else {
        setCategory('Bardzo dużo kalorii');
      }

      if (calorieDifference >= 800) {
        setCategory('Ekstremalnie za dużo kalorii - Należy ograniczyć spożycie');
      }
      const remainingCalories = dieta - newTotalCalories;
      setRemainingCalories(remainingCalories);
      await AsyncStorage.setItem('totalCalories', newTotalCalories.toString());
      await AsyncStorage.setItem('remainingCalories', remainingCalories.toString());
    } catch (error) {
      console.error('Błąd dodawania kalorii', error.message);
    }
  };

  const handleResetCalories = async () => {
    try {
      await AsyncStorage.setItem('totalCalories', '0');
      await AsyncStorage.setItem('remainingCalories', '0');
      setTotalCalories(0);
      setRemainingCalories(0); 
      setCategory('');
    } catch (error) {
      console.error('Błąd resetowania kalorii:', error.message);
    }
  };

  const handleSaveCalories = async () => {
    try {
      Alert.alert('Potwierdzenie','Czy na pewno chcesz zapisać kalorie i zakończyć dzień?',
        [{
            text: 'Nie',
            style: 'cancel',
          },
          {
            text: 'Tak',
            onPress: async () => {
              const response = await fetch('http://192.168.69.198:3000/data/zapis', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail, calories: totalCalories })
              });
          
              if (!response.ok) {
                throw new Error('Błąd zapisywania kalorii');
              }
              handleResetCalories(); 
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Błąd zapisywania kalorii:', error.message);
    }
  };

  const toggleFaq = () => {
    setFaqVisible(!faqVisible);
  };

  const toggleSubFaq = (faq) => {
    setSubFaqStates({
      ...SubFaqStates,
      [faq]: !SubFaqStates[faq],
    });
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Zbyt mało kalorii':
        return styles.lowCalories;
      case 'Możesz spokojnie zjeść więcej':
        return styles.sufficientCalories;
      case 'Blisko celu':
        return styles.idealWeightLoss;
      case 'Odpowiednia ilość':
        return styles.normalWeight;
      case 'Za dużo kalorii':
        return styles.idealWeightGain;
      case 'Bardzo dużo kalorii':
        return styles.highCalories;
      case 'Ekstremalnie za dużo kalorii - Należy ograniczyć spożycie':
        return styles.extremeHighCalories;
      default:
        return null;
    }
  };

  const barColors = {
    red: '#E57373',
    orange: '#FFB74D',
    green: '#81C784',
    blue: '#64B5F6',
    purple: '#BA68C8',
    pink: '#F06292',
    grey: '#E0E0E0',
  };

  const getProgressBarColor = (category) => {
    switch (category) {
      case 'Zbyt mało kalorii':
        return barColors.red;
      case 'Możesz spokojnie zjeść więcej':
        return barColors.orange;
      case 'Blisko celu':
        return barColors.blue;
      case 'Odpowiednia ilość':
        return barColors.green;
      case 'Za dużo kalorii':
        return barColors.purple;
      case 'Bardzo dużo kalorii':
        return barColors.pink;
      case 'Ekstremalnie za dużo kalorii - Należy ograniczyć spożycie':
        return barColors.red;
      default:
        return barColors.grey;
    }
  };

  const setProgress = (totalCalories) => {
    let targetCalories = 2200;
    if (userEmail) {
      targetCalories = bdKcal;
    }

    let tryb = 0;
    if (!userEmail) {
      if (mode === 'chudnięcie') {
        tryb = -250;
      } else if (mode === 'przytycie') {
        tryb = 250;
      }
    }
    const progress = totalCalories / (targetCalories + tryb);
    return isNaN(progress) ? 0 : (progress > 1 ? 1 : progress);
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80cbc4']}
      style={styles.container}
    >
      <ScrollView >
        {userEmail && (
          <Text style={styles.header2}>
            Zalogowany jako: {userEmail}
          </Text>
        )}
        <Text style={styles.header2}>
          Twoja dieta: {mode === 'chudnięcie' ? bdKcal - 250 : mode === 'przytycie' ? bdKcal + 250 : bdKcal} kcal
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={mode}
            onValueChange={(itemValue, itemIndex) => setMode(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Utrzymanie wagi" value="normal" />
            <Picker.Item label="Zmniejszenie wagi" value="chudnięcie" />
            <Picker.Item label="Zwiększenie wagi" value="przytycie" />
          </Picker>
        </View>
        <TextInput
          placeholder="Wprowadź ilość kalorii"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button title="Wprowadź kalorie" onPress={handleAddCalories} color="#388E3C" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Resetuj" onPress={handleResetCalories} color="#FBC02D" />
        </View>
        <View style={styles.buttonContainer}>
          {userEmail && (
            <Button title="Zapisz" onPress={handleSaveCalories} color="#0288D1" />
          )}
        </View>
        <Text style={[styles.categoryText, getCategoryStyle(category)]}>{category}</Text>
        <Text style={styles.label}>Suma kalorii: {totalCalories}</Text>
        <ProgressBar
          progress={setProgress(totalCalories)}
          color={getProgressBarColor(category)}
          style={[styles.progressBar, { alignSelf: 'stretch' }]}
        />
          {mode === 'chudnięcie' && remainingCalories - 250 > 0 && (
            <Text style={styles.label}>Pozostało: {remainingCalories - 250}</Text>
          )}
          {mode === 'przytycie' && remainingCalories + 250 > 0 && (
            <Text style={styles.label}>Pozostało: {remainingCalories + 250}</Text>
          )}
          {mode !== 'chudnięcie' && mode !== 'przytycie' && remainingCalories > 0 && (
            <Text style={styles.label}>Pozostało: {remainingCalories}</Text>
          )}
        <View style={styles.faqContainer}>
          <TouchableOpacity onPress={toggleFaq}>
            <Text style={styles.faqHeader}>
              FAQ {faqVisible ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {faqVisible && (
            <View>
              <TouchableOpacity onPress={() => toggleSubFaq('faq1')}>
                <Text style={styles.faqText}>
                  Co oznaczają kategorie? {SubFaqStates.faq1 ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {SubFaqStates.faq1 && (
                <>
                  <Text style={styles.faqSubText}>Zbyt mało kalorii - Aby nie szkodzić własnemu zdrowiu, należy zjeść więcej.</Text>
                  <Text style={styles.faqSubText}>Blisko celu - Zbliżasz się do określonego w swoim trybie celu. Jest to nadal jednak wartość około 200 kalorii mniejsza od celu.</Text>
                  <Text style={styles.faqSubText}>Dobra ilość kalorii - Jeśli chcesz zmniejszyć, zwiększyć, lub utrzymać swoją wagę bez szkodzeniu swojemu zdrowiu, jest to idealna ilość spożycia kalorii</Text>
                  <Text style={styles.faqSubText}>Dużo kalorii i Bardzo dużo kalorii - Oba oznaczają, że została przekroczona docelowa ilość kalorii.</Text>
                  <Text style={styles.faqSubText}>Ekstremalnie za dużo kalorii - Ilość dodanych kalorii jest bardzo duża, co może zaszkodzić zdrowiu</Text>
                </>
              )}
              <TouchableOpacity onPress={() => toggleSubFaq('faq2')}>
                <Text style={styles.faqText}>
                  Dlaczego nie widzę efektów? {SubFaqStates.faq2 ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {SubFaqStates.faq2 && (
                <>
                  <Text style={styles.faqSubText}>Efekty stosowania odpowiedniej diety zależą od wielu czynników, takich jak wysiłek fizyczny czy odpowiednia kontrola diety. </Text>
                  <Text style={styles.faqSubText}>Często efekty nie są widoczne od razu, trzeba na nie czekać pewien czas.</Text>
                </>
              )}
              <TouchableOpacity onPress={() => toggleSubFaq('faq3')}>
                <Text style={styles.faqText}>
                  Co jeśli zjem za dużo lub za mało? {SubFaqStates.faq3 ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {SubFaqStates.faq3 && (
                <>
                  <Text style={styles.faqSubText}>Jeśli jednego dnia zjesz za dużo lub za mało, wróć do swojej diety następnego dnia. Jednodniowe odchylenia nie wpłyną znacząco na twoje wyniki.</Text>
                  <Text style={styles.faqSubText}>Zjesz mało kalorii jednego dnia? Postaraj się następnego dnia spożywać posiłki regularnie, możesz także zjeść trochę więcej.</Text>
                  <Text style={styles.faqSubText}>Za dużą ilości kalorii staraj się spalić poprzez wysiłek fizyczny.</Text>
                </>
              )}
              <TouchableOpacity onPress={() => toggleSubFaq('faq4')}>
                <Text style={styles.faqText}>
                  Jak ćwiczenia wpływają na dietę? {SubFaqStates.faq4 ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {SubFaqStates.faq4 && (
                <>
                  <Text style={styles.faqSubText}>Ćwiczenie wpływają na dietę bezpośrednio </Text>
                  <Text style={styles.faqSubText}>Jeśli spalisz 200 kcal aktywnością fizyczną, możesz pozwolić sobie w diecie na dodatkowe 200 kcal.</Text>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
