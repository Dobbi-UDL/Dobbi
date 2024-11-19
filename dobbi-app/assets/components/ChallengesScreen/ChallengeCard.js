import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';

export const ChallengeCard = ({ challenge }) => {
  // Función para formatear el monto como moneda
  const formatCurrency = (amount) => {
    return amount.toLocaleString('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Función para calcular días restantes
  const getRemainingDays = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = getRemainingDays(challenge.target_date);

  return (
    <TouchableOpacity>
      <Card>    
      <View style={styles.cardHeader}>
        <Text style={styles.companyName}>{challenge.companies.name}</Text>
        <View style={styles.rewardContainer}>
          <Icon name="gift" size={16} color="#ff6b6b" />
          <Text style={styles.rewardText}>{challenge.sponsor_reward}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{challenge.title}</Text>
      <Text style={styles.cardDescription}>{challenge.description}</Text>

      <View style={styles.challengeInfo}>
        <View style={styles.infoItem}>
          <Icon name="target" size={16} color="#666" />
          <Text style={styles.infoText}>
            Goal: {formatCurrency(challenge.target_amount)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="clock-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            {remainingDays} days remaining
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          Target Date: {new Date(challenge.target_date).toLocaleDateString()}
        </Text>
      </View>
      </Card>
    </TouchableOpacity>
  );
};