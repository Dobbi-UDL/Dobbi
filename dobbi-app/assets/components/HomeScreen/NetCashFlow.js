import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '@i18n';
import Card from '../common/Card';
import { supabase } from '../../../config/supabaseClient';

export default function FetchIncome() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFinancialIncomes = async () => {
    try {
      // Obtener el user_id del usuario logueado
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
  
      if (!userId) throw new Error('Usuario no logueado.');
  
      // Consultar ingresos del usuario logueado
      const { data, error } = await supabase
        .from('financial_entries')
        .select('amount')
        .join('financial_categories', 'financial_entries.category_id', 'financial_categories.id')
        .eq('financial_categories.type', 'income')
        .eq('financial_entries.user_id', userId); // Filtrar por usuario logueado
      
      if (error) throw error;
  
      // Sumar los montos
      const totalIncome = data.reduce((sum, entry) => sum + entry.amount, 0);
      setIncome(totalIncome);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };
  
  const fetchFinancialExpenses = async () => {
    try {
      // Obtener el user_id del usuario logueado
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
  
      if (!userId) throw new Error('Usuario no logueado.');
  
      // Consultar gastos del usuario logueado
      const { data, error } = await supabase
        .from('financial_entries')
        .select('amount')
        .join('financial_categories', 'financial_entries.category_id', 'financial_categories.id')
        .eq('financial_categories.type', 'expense')
        .eq('financial_entries.user_id', userId); // Filtrar por usuario logueado
      
      if (error) throw error;
  
      // Sumar los montos
      const totalExpense = data.reduce((sum, entry) => sum + entry.amount, 0);
      setExpense(totalExpense);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFinancialIncomes();
      await fetchFinancialExpenses();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <NetCashFlow income={income} expense={expense} />;
}

export const NetCashFlow = ({ income, expense }) => {
  const netCashFlow = income - expense;

  return (
    <Card>
      <Text style={styles.title}>{i18n.t('netCashFlowTitle')}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{i18n.t('monthlyIncome')}</Text>
        <Text style={styles.value}>
          {income.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{i18n.t('monthlyExpenses')}</Text>
        <Text style={styles.value}>
          {expense.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{i18n.t('netCashFlow')}</Text>
        <Text style={[styles.value, netCashFlow >= 0 ? styles.positive : styles.negative]}>
          {netCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}
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
