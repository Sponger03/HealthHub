import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Styles from './Styles';

export default function Produkty() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [triedSearch, setTriedSearch] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) {
      setError('Wpisz nazwę produktu');
      setTriedSearch(true);
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const response = await fetch('http://192.168.69.198:3000/api/food/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchTerm }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych produktu');
      }

      const data = await response.json();
      if (data.length === 0) {
        setError('Nie znaleziono produktów pasujących do wyszukiwanej nazwy');
        setSearchResults([]);
      } else {
        const formattedData = data.map((product) => ({
          id: product.id,
          name: product.product_name,
          calories: product.nutriments['energy-kcal_100g'] || 'Niedostępne',
          protein: product.nutriments.proteins_100g || 'Niedostępne',
          carbohydrates: product.nutriments.carbohydrates_100g || 'Niedostępne',
          fat: product.nutriments.fat_100g || 'Niedostępne',
          salt: product.nutriments.salt_100g || 'Niedostępne',
          servingSize: product.serving_size || 'Niedostępne',
          quantity: product.quantity || 'Niedostępne',
          imageUrl: product.image_url ? product.image_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637',
        }));

        setSearchResults(formattedData);
        setError(null);
      }
    } catch (error) {
      console.error('Błąd wyszukiwania produktu:', error);
      setError('Błąd wyszukiwania produktu');
      setSearchResults([]);
    } finally {
      setSearching(false);
      setTriedSearch(true);
    }
  };

  const renderItem = ({ item }) => (
    <LinearGradient
    colors={['#ffffff', '#f0f0f0']}
    style={Styles.productItem}
  >
    <View style={Styles.productItem}>
      <Image source={{ uri: item.imageUrl }} style={Styles.productImage} resizeMode="contain" />
      <Text style={Styles.productName}>{item.name}</Text>
      <Text alignSelf="center">Wartości na 100g</Text>
      <View style={Styles.infoRow}>
        <View style={Styles.nutrientColumn}>
          <Text style={Styles.nutrientLabel}>Kalorie:</Text>
          <Text>{item.calories} kcal</Text>
        </View>
        <View style={Styles.nutrientColumn}>
          <Text style={Styles.nutrientLabel}>Węglowodany:</Text>
          <Text>{item.carbohydrates} g</Text>
        </View>
      </View>
      <View style={Styles.infoRow}>
        <View style={Styles.nutrientColumn}>
          <Text style={Styles.nutrientLabel}>Tłuszcze:</Text>
          <Text>{item.fat} g</Text>
        </View>
        <View style={Styles.nutrientColumn}>
          <Text style={Styles.nutrientLabel}>Sól:</Text>
          <Text>{item.salt}</Text>
        </View>
      </View>
      <Text style={Styles.servingInfo}>{`Rozmiar porcji: ${item.servingSize} | Ilość: ${item.quantity}`}</Text>
      
    </View>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#e0f7fa', '#80cbc4']} style={Styles.container}>
      <View style={Styles.container}>
        <Text style={Styles.heading}>Wyszukaj produkt</Text>
        <TextInput
          style={Styles.input}
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          placeholder="Wpisz nazwę produktu"
        />
        <Button title="Szukaj" onPress={handleSearch} />

        {searching && <Text style={Styles.searchingText}>Szukanie produktów...</Text>}

        {triedSearch && error && <Text style={Styles.error}>{error}</Text>}

        {searchResults.length === 0 && !error && triedSearch && (
          <Text style={Styles.warning}>
            Nie znaleziono produktów pasujących do wyszukiwanej nazwy.
          </Text>
        )}

        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={Styles.productList}
          />
        )}
      </View>
    </LinearGradient>
  );
}
