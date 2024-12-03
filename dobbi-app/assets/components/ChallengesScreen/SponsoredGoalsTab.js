import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';

export const SponsoredGoalsTab = ({ goals, onAssignGoal }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getRemainingDays = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <ScrollView style={styles.contentContainer}>
      {goals.length === 0 ? (
        <Text>No hay objetivos patrocinados disponibles</Text>
      ) : (
        goals.map((goal) => (
          <Card key={goal.id}>
            <View style={styles.cardHeader}>
              <Text style={styles.companyName}>{goal.companies.name}</Text>
              <View style={styles.rewardContainer}>
                <Icon name="gift" size={16} color="#ff6b6b" />
                <Text style={styles.rewardText}>{goal.points_rewards} puntos</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{goal.title}</Text>
            <Text style={styles.cardDescription}>{goal.description}</Text>

            <View style={styles.challengeInfo}>
              <View style={styles.infoItem}>
                <Icon name="target" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Objetivo: {formatCurrency(goal.target_amount)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="clock-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {getRemainingDays(goal.target_date)} días restantes
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.redeemButton} 
              onPress={() => onAssignGoal(goal.id)}
            >
              <Text style={styles.redeemButtonText}>Asignar a mí</Text>
            </TouchableOpacity>
          </Card>
        ))
      )}
    </ScrollView>
  );
};