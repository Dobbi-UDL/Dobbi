import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Modal,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';

export const MyGoalsTab = ({ goals, onCreateGoal, onUpdateGoal, onDiscardGoal }) => {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    monthly_amount: '',
    start_date: new Date(),
    target_date: null,
    description: ''
  });

  const calculateProgress = (goal) => {
    // Lógica para calcular el progreso del objetivo
    const currentSaved = goal.current_amount || 0;
    const totalTarget = goal.target_amount;
    return (currentSaved / totalTarget) * 100;
  };

  const calculatePointRewards = (monthly_amount, target_amount) => {
    // Cálculo de puntos basado en la proporción de ahorro mensual
    const monthsToTarget = Math.ceil(target_amount / monthly_amount);
    return Math.round((monthly_amount / target_amount) * 100);
  };

  const handleCreateGoal = () => {
    // Calcular fecha de fin automáticamente
    const monthsToTarget = Math.ceil(
      parseFloat(newGoal.target_amount) / parseFloat(newGoal.monthly_amount)
    );
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + monthsToTarget);

    const goalToCreate = {
      ...newGoal,
      target_date: endDate,
      points_rewards: calculatePointRewards(
        parseFloat(newGoal.monthly_amount), 
        parseFloat(newGoal.target_amount)
      ),
      current_amount: 0
    };

    onCreateGoal(goalToCreate);
    setCreateModalVisible(false);
  };

  const renderCreateGoalModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCreateModalVisible}
      onRequestClose={() => setCreateModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Nuevo Objetivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Título del Objetivo"
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({...newGoal, title: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Objetivo Total (€)"
            keyboardType="numeric"
            value={newGoal.target_amount}
            onChangeText={(text) => setNewGoal({...newGoal, target_amount: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Ahorro Mensual (€)"
            keyboardType="numeric"
            value={newGoal.monthly_amount}
            onChangeText={(text) => setNewGoal({...newGoal, monthly_amount: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción (Opcional)"
            multiline
            value={newGoal.description}
            onChangeText={(text) => setNewGoal({...newGoal, description: text})}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={handleCreateGoal}
            >
              <Text style={styles.modalSaveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createGoalButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.createGoalButtonText}>Crear Nuevo Objetivo</Text>
      </TouchableOpacity>

      <ScrollView style={styles.contentContainer}>
        {goals.length === 0 ? (
          <Text style={styles.emptyStateText}>
            No tienes objetivos de ahorro aún. ¡Crea tu primer objetivo!
          </Text>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} style={styles.goalCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{goal.title}</Text>
                <View style={styles.rewardContainer}>
                  <Icon name="gift" size={16} color="#ff6b6b" />
                  <Text style={styles.rewardText}>{goal.points_rewards} puntos</Text>
                </View>
              </View>

              <ProgressBar 
                progress={calculateProgress(goal)} 
                style={styles.goalProgressBar}
              />

              <View style={styles.goalDetailsContainer}>
                <View style={styles.goalDetailItem}>
                  <Icon name="calendar" size={16} color="#666" />
                  <Text style={styles.goalDetailText}>
                    Fecha Fin: {new Date(goal.target_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.goalDetailItem}>
                  <Icon name="cash" size={16} color="#666" />
                  <Text style={styles.goalDetailText}>
                    Objetivo: {goal.target_amount.toLocaleString()}€
                  </Text>
                </View>
              </View>

              <View style={styles.cardActionContainer}>
                <TouchableOpacity 
                  style={styles.editGoalButton}
                  onPress={() => {/* Lógica de edición */}}
                >
                  <Text style={styles.editGoalButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.discardGoalButton}
                  onPress={() => onDiscardGoal(goal.id)}
                >
                  <Text style={styles.discardGoalButtonText}>Descartar</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {renderCreateGoalModal()}
    </View>
  );
};