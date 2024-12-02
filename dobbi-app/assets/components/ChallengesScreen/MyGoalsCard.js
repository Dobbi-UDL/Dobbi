import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ProgressBarAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MyGoalsCard = ({ goal }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getProgressPercentage = (currentAmount, targetAmount) => {
    return (currentAmount / targetAmount) * 100;
  };

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const target = new Date(endDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const progressPercentage = getProgressPercentage(goal.current_amount, goal.target_amount);
  const remainingDays = getRemainingDays(goal.end_date);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{goal.name}</Text>
        <View style={styles.pointsContainer}>
          <Icon name="gift" size={16} color="#B8860B" />
          <Text style={styles.pointsText}>{goal.points_rewards}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progressPercentage / 100}
          color="#ff6b6b"
        />
        <Text style={styles.progressText}>
          {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
        </Text>
      </View>

      <View style={styles.challengeInfo}>
        <View style={styles.infoItem}>
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            Planned End: {new Date(goal.end_date).toLocaleDateString()}
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
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Discard Goal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 5,
    borderRadius: 10,
  },
  pointsText: {
    marginLeft: 5,
    color: '#B8860B',
    fontWeight: '500',
  },
  progressBar: {
    marginVertical: 10,
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666666',
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    color: '#666666',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyGoalsCard;