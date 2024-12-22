import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '@i18n';
import Card from '../common/Card';
import { supabase } from '../../../config/supabaseClient'; // Asegúrate de importar tu cliente Supabase
import * as Progress from 'react-native-progress'; // Para la barra de progreso
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';  // Añadir esta importación

export const ActiveGoals = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const router = useRouter();
  const { user } = useAuth();  // Obtener el usuario actual

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
          .eq('user_id', user.id)  // Añadir filtro por user_id
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
            goal_id: goal.goal_id, // Añadir goal_id
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

    if (user) {  // Solo ejecutar si hay un usuario
      fetchGoals();
    }
  }, [user]);  // Añadir user como dependencia

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{i18n.t('activeGoalsTitle')}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/challenges')}
        >
          <Text style={styles.viewAll}>{i18n.t('viewAll')}</Text>
          <Icon name="chevron-right" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.goalItem}
            onPress={() => router.push({
              pathname: '/challenges',
              params: { highlightGoalId: item.goal_id } // Usar goal_id en lugar de id
            })}
          >
            <View style={styles.goalInfo}>
              <View style={styles.mainInfo}>
                <Text style={styles.goalTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.currentAmount}>
                    ${item.current_amount.toLocaleString()}
                  </Text>
                  <Text style={styles.targetAmount}>
                    /${item.target_amount.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <Progress.Bar
                  progress={item.progress / 100}
                  width={null}
                  color="#ff6b6b"
                  unfilledColor="#f0f0f0"
                  borderWidth={0}
                  height={5} // Aumentado de 4
                  style={styles.progressBar}
                />
                <Text style={styles.progressText}>
                  {item.progress.toFixed(0)}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 0, // Eliminar margen horizontal
    marginVertical: 8,
    padding: 20, // Aumentado de 16
    width: '100%', // Asegurar que ocupe todo el ancho
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, // Aumentado de 12
  },
  title: {
    fontSize: 22, // Aumentado de 20
    fontWeight: '700',
    color: '#2d3436',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 14,
    color: '#ff6b6b',
    marginRight: 4,
  },
  goalItem: {
    paddingVertical: 12, // Aumentado de 8
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  goalInfo: {
    gap: 8,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16, // Aumentado de 15
    fontWeight: '600',
    color: '#2d3436',
    flex: 1,
    marginRight: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentAmount: {
    fontSize: 16, // Aumentado de 15
    fontWeight: '500',
    color: '#2d3436',
  },
  targetAmount: {
    fontSize: 13,
    color: '#95a5a6',
    marginLeft: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4, // Añadido para dar más espacio
  },
  progressBar: {
    flex: 1,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ff6b6b',
    minWidth: 35,
  },
});
