import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const NetCashFlow = () => {
  // Datos de ejemplo
  const monthlyIncome = 5000;
  const monthlyExpenses = 3500;
  const netCashFlow = monthlyIncome - monthlyExpenses;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Net Cash Flow</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Monthly Income</Text>
        <Text style={styles.value}>{monthlyIncome.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Monthly Expenses</Text>
        <Text style={styles.value}>{monthlyExpenses.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Net Cash Flow</Text>
        <Text style={[styles.value, netCashFlow >= 0 ? styles.positive : styles.negative]}>
          {netCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#FF5252',
  },
});