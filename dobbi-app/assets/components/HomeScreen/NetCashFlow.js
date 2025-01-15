import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import i18n from '@i18n';
import Card from '../common/Card';
import { supabase } from '../../../config/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

      // If no data exists or data array is empty, use default values
      if (!data || data.length === 0) {
        setIncome(0);
        setExpense(0);
      } else {
        const [result] = data;
        setIncome(result.total_income || 0);
        setExpense(result.total_expense || 0);
      }
    } catch (err) {
      console.error('Error fetching financial data:', err.message);
      setError(err.message || 'Error al obtener los datos financieros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Return early and reset state if no user
    if (!user) {
        setLoading(false);
        setIncome(0);
        setExpense(0);
        return;
    }
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
    <>
      {!user ? null : (
        <View style={styles.mainContainer}>
          <Card style={styles.container}>
            <Text style={styles.title}>{i18n.t('netCashFlowTitle')}</Text>

            <View style={styles.flowContainer}>
              {/* Income Section */}
              <View style={styles.flowSection}>
                <View style={[styles.iconContainer, styles.incomeIcon]}>
                  <Icon name="trending-up" size={24} color="#4CAF50" />
                </View>
                <View style={styles.flowInfo}>
                  <Text style={styles.flowLabel}>{i18n.t('monthlyIncome')}</Text>
                  <Text style={[styles.flowAmount, styles.incomeText]}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(income)}
                  </Text>
                </View>
              </View>

              {/* Expenses Section */}
              <View style={styles.flowSection}>
                <View style={[styles.iconContainer, styles.expenseIcon]}>
                  <Icon name="trending-down" size={24} color="#FF5252" />
                </View>
                <View style={styles.flowInfo}>
                  <Text style={styles.flowLabel}>{i18n.t('monthlyExpenses')}</Text>
                  <Text style={[styles.flowAmount, styles.expenseText]}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(expense)}
                  </Text>
                </View>
              </View>

              {/* Net Flow Section */}
              <View style={styles.netFlowSection}>
                <View style={[styles.netFlowContainer, netCashFlow >= 0 ? styles.positiveFlow : styles.negativeFlow]}>
                  <Icon 
                    name={netCashFlow >= 0 ? "arrow-up-circle" : "arrow-down-circle"} 
                    size={28} 
                    color="#FFF" 
                  />
                  <View style={styles.netFlowInfo}>
                    <Text style={styles.netFlowLabel}>{i18n.t('netCashFlow')}</Text>
                    <Text style={styles.netFlowAmount}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(netCashFlow)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  container: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 8,
    width: '100%', // Ajusta este valor según necesites
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 24,
    textAlign: 'center', // Añadido para centrar título
  },
  flowContainer: {
    gap: 16,
    width: '100%', // Asegura que el contenedor ocupe todo el ancho
  },
  flowSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center', // Añadido para centrar contenido
    width: '100%', // Asegura que la sección ocupe todo el ancho
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  incomeIcon: {
    backgroundColor: '#E8F5E9',
  },
  expenseIcon: {
    backgroundColor: '#FFEBEE',
  },
  flowInfo: {
    flex: 1,
  },
  flowLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  flowAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#FF5252',
  },
  netFlowSection: {
    marginTop: 8,
    width: '100%', // Asegura que la sección ocupe todo el ancho
  },
  netFlowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Añadido para centrar contenido
    padding: 16,
    borderRadius: 12,
  },
  positiveFlow: {
    backgroundColor: '#4CAF50',
  },
  negativeFlow: {
    backgroundColor: '#FF5252',
  },
  netFlowInfo: {
    marginLeft: 16,
  },
  netFlowLabel: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
  },
  netFlowAmount: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  error: {
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
  },
});
