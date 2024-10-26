import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './Styles';

const DataTable = ({ caloriesData, daysToShow }) => {
  return (
    <ScrollView>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Historia</Text>
        </View>
        {caloriesData.slice(-daysToShow).map((value, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.rowText}>{`Dzień ${caloriesData.length - daysToShow + index + 1}`}</Text>
            <Text style={styles.rowText}>{value !== null ? `${value} kcal` : ''}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DataTable;
