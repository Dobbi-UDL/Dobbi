import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import i18n from '@i18n';
import Card from '../common/Card';
import { supabase } from '../../../config/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';

export const NetCashFlow = () => {
  const { user } = useAuth();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinancialData = async () => {
    if (!user?.id) {
      setError('Usuario no logueado.');
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const { data, error } = await supabase
        .from('user_financial_summary')
        .select('total_income, total_expense')
        .eq('user_id', user.id);
  
      if (error) throw new Error(error.message);
  
      const [result] = data || [{ total_income: 0, total_expense: 0 }];
      setIncome(result.total_income || 0);
      setExpense(result.total_expense || 0);
    } catch (err) {
      console.error('Error fetching financial data:', err.message);
      setError(err.message || 'Error al obtener los datos financieros.');
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchFinancialData();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{i18n.t('loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{i18n.t('error')}: {error}</Text>
      </View>
    );
  }
  
  const netCashFlow = income - expense;

  return (
    <Card>
      <Text style={styles.title}>{i18n.t('netCashFlowTitle')}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{i18n.t('monthlyIncome')}</Text>
        <Text style={styles.value}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(income)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{i18n.t('monthlyExpenses')}</Text>
        <Text style={styles.value}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(expense)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{i18n.t('netCashFlow')}</Text>
        <Text style={[styles.value, netCashFlow >= 0 ? styles.positive : styles.negative]}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(netCashFlow)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  error: {
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
  },
});
