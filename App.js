import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './ekrany/Home';
import Info from './ekrany/Info';
import Login from './ekrany/Login';
import Rejestracja from './ekrany/Rejestracja';
import Dieta from './ekrany/Dieta';
import Produkty from './ekrany/Produkty';
import Konto from './ekrany/Konto';
import Wykres from './ekrany/Wykres';
import DataTable from './ekrany/DataTable';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: '#80cbc4',
  },
  headerTintColor: '#fff', 
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={stackScreenOptions}
    >
      <Stack.Screen name="HomeScreen" component={Home} options={{ title: 'Home' }} />
      <Stack.Screen name="Info" component={Info} options={{ title: 'Informacje o Tobie' }} />
      <Stack.Screen name="Login" component={Login} options={{ title: 'Zaloguj się' }} />
      <Stack.Screen name="Rejestracja" component={Rejestracja} options={{ title: 'Rejestracja' }} />
      <Stack.Screen name="Produkty" component={Produkty} options={{ title: 'Informacje o produktach' }} />
      <Stack.Screen name="Wykres" component={Wykres} options={{ title: 'Wykres diety' }} />
      <Stack.Screen name="DataTable" component={DataTable} options={{ title: 'Historia kalorii' }} />
    </Stack.Navigator>
  );
}

function DietaStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dieta"
      screenOptions={stackScreenOptions}
    >
      <Stack.Screen name="Dieta" component={Dieta} />
    </Stack.Navigator>
  );
}

function KontoStack() {
  return (
    <Stack.Navigator
      initialRouteName="Konto"
      screenOptions={stackScreenOptions}
    >
      <Stack.Screen name="Konto" component={Konto} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [setActiveTab] = useState('Home');

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false, 
          tabBarLabelStyle: {
            fontSize: 16,
            marginBottom: 5,
          },
          tabBarStyle: {
            backgroundColor: '#e0f7fa',
            display: 'flex',
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#888', 
          tabBarIcon: () => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Dieta') {
              iconName = 'fitness-outline';
            } else if (route.name === 'Konto') {
              iconName = 'person-circle-outline';
            }
            return <Icon name={iconName}/>;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: 'Home',
            tabBarOnPress: () => handleTabPress('Home'),
          }}
        />
        <Tab.Screen
          name="Dieta"
          component={DietaStack}
          options={{
            title: 'Dieta',
            tabBarOnPress: () => handleTabPress('Dieta'),
          }}
        />
        <Tab.Screen
          name="Konto"
          component={KontoStack}
          options={{
            title: 'Konto',
            tabBarOnPress: () => handleTabPress('Konto'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}