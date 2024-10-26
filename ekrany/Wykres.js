import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Modal, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

import DataTable from './DataTable';
import styles from './Styles.js';

const Wykres = () => {
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [caloriesData, setCaloriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysToShow, setDaysToShow] = useState(7);
  const [showHistory, setShowHistory] = useState(false);

  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    if (isFocused) {
      checkIfLoggedIn();
    }
  }, [isFocused]);

  const checkIfLoggedIn = async () => {
    try {
      const response = await fetch('http://192.168.69.198:3000/user/info');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        fetchCaloriesData(data.email);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Błąd sprawdzania statusu logowania:', error.message);
      setIsLoggedIn(false);
    }
  };

  const fetchCaloriesData = async (email) => {
    try {
      const response = await fetch('http://192.168.69.198:3000/data/odczyt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        const data = await response.json();
        setCaloriesData(data || []);
      } else {
        console.error('Błąd pobierania danych o kaloriach:', response.statusText);
      }
    } catch (error) {
      console.error('Błąd pobierania danych o kaloriach:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDaysToShowChange = (days) => {
    setDaysToShow(days);
  };
  const filteredCaloriesData = caloriesData.slice(-daysToShow);
  const chartLabels = filteredCaloriesData.map((_, index) => {
    return `Dzień ${caloriesData.length - filteredCaloriesData.length + index + 1}`;
  });

  const chartData = {
    labels: chartLabels,
    datasets: [
      {data: filteredCaloriesData},
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#e0f7fa',
    backgroundGradientTo: '#80cbc4',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#336699',
    },
    propsForBackgroundLines: {
      stroke: '#888',
    },
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#80cbc4']} style={styles.container}>
      <View style={styles.container}>
        {isLoggedIn ? (
          <View style={{ flex: 1 }}>
            {loading ? (
              <Text>Ładowanie danych...</Text>
            ) : caloriesData.length > 0 ? (
              <View>
                <View style={styles.pickerContainer2}>
                  <Picker
                    selectedValue={daysToShow}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleDaysToShowChange(itemValue)}
                  >
                    <Picker.Item label="Ostatnie 7 dni" value={7} />
                    <Picker.Item label="Ostatnie 14 dni" value={14} />
                    <Picker.Item label="Ostatnie 30 dni" value={30} />
                    <Picker.Item label="Wszystkie dni" value={caloriesData.length} />
                  </Picker>
                </View>
                <ScrollView horizontal>
                  <View style={styles.chartContainer}>
                    <LineChart
                      data={chartData}
                      width={Math.max(windowWidth - 40, filteredCaloriesData.length * 60)}
                      height={250}
                      yAxisLabel=""
                      yAxisSuffix="kcal"
                      yAxisInterval={1}
                      chartConfig={chartConfig}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                      }}
                      fromZero={true}
                      bezier
                    />
                  </View>
                </ScrollView>
                <Button
                  title="Zobacz historię"
                  onPress={() => setShowHistory(true)}
                />
                <Modal
                  visible={showHistory}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setShowHistory(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <DataTable caloriesData={caloriesData} daysToShow={daysToShow} />
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setShowHistory(false)}
                        >
                          <Text style={styles.closeButtonText}>Zamknij</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
              </View>
            ) : (
              <Text>Brak danych do wyświetlenia.</Text>
            )}
          </View>
        ) : (
          <Text>Zaloguj się, aby zobaczyć wykres.</Text>
        )}
      </View>
    </LinearGradient>
  );
};

export default Wykres;
