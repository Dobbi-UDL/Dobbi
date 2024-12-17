import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '@i18n';
import Card from '../common/Card';
import { supabase } from '../../../config/supabaseClient'; // Asegúrate de importar tu cliente Supabase
import * as Progress from 'react-native-progress'; // Para la barra de progreso
import { useRouter } from 'expo-router';

export const ActiveGoals = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Obtener los 3 registros más cercanos a la fecha actual
    const fetchGoals = async () => {
      try {
        const { data, error } = await supabase
          .from('goal_tracking')
          .select(`
            id,
            end_date,
            goal_id,
            current_amount,
            target_amount,
            saving_goals (
              title
            )
          `)
          .order('end_date', { ascending: true })
          .limit(3);

        if (error) {
          console.error(error);
          return;
        }

        // Filtrar los registros más cercanos a la fecha actual
        const currentDate = new Date();
        const filteredGoals = data.filter((goal) => {
          const expiringDate = new Date(goal.end_date);
          return expiringDate >= currentDate; // Filtra por fechas futuras
        });

        // Calcular el progreso de cada meta
        const goalsWithProgress = filteredGoals.map((goal) => {
          const progress = goal.target_amount && goal.current_amount
            ? (goal.current_amount / goal.target_amount) * 100
            : 0; // Evita dividir por 0 o valores nulos
          return {
            id: goal.id,
            title: goal.saving_goals.title,
            progress: Math.min(progress, 100), // Asegura que el progreso no sea mayor que 100%
            end_date: goal.end_date,
            current_amount: goal.current_amount || 0, // Valor por defecto si es undefined
            target_amount: goal.target_amount || 0, // Valor por defecto si es undefined
          };
        });

        setGoals(goalsWithProgress);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <Card>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{i18n.t('activeGoalsTitle')}</Text>
        <TouchableOpacity onPress={() => router.push('/challenges')}>
          <Text style={styles.viewAll}>{i18n.t('viewAll')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.goalItem} // Redirige a GoalDetails
          >
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{item.title}</Text>
              
              {/* Barra de Progreso */}
              <Text style={styles.progressPercentage}>
                  {i18n.t('progressPercentage', { progress: item.progress })} 
                  <Text style={styles.progressText}>
                    {item.progress.toFixed(0)}% {/* Muestra el porcentaje al lado de la cantidad actual */}
                  </Text>
              </Text>
              <Progress.Bar
                progress={item.progress / 100}
                width={null}
                color="#ff6b6b"
                unfilledColor="#e0e0e0"
                borderWidth={0}
                style={styles.progressBar}
              />

              {/* Cantidad y progreso */}
              <View style={styles.amountSection}>
                <View style={styles.amountContainer}>
                  <Text style={styles.currentAmount}>
                    {i18n.t('currentAmount')}: {item.current_amount.toLocaleString() || '0'}
                  </Text>
                </View>
                <Text style={styles.targetAmount}>
                  {i18n.t('targetAmount')}: {item.target_amount.toLocaleString() || '0'}
                </Text>
              </View>

              {/* Fecha de finalización */}
              <Text style={styles.endDate}>
                {i18n.t('endDate')}: {new Date(item.end_date).toLocaleDateString()}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        )}
      />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 16,
    color: '#ff6b6b',
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 12,
  },
  amountSection: {
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  targetAmount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressPercentage: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  endDate: {
    fontSize: 14,
    color: '#666',
  },
});
