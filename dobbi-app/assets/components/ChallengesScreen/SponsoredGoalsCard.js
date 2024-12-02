import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SponsoredGoalsCard = ({ challenge }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getRemainingDays = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = getRemainingDays(challenge.target_date);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.companyName}>{challenge.companies.name}</Text>
        <View style={styles.rewardContainer}>
          <Icon name="gift" size={16} color="#ff6b6b" />
          <Text style={styles.rewardText}>{challenge.points_rewards}</Text>
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
        <TouchableOpacity style={styles.assignButton}>
          <Text style={styles.assignButtonText}>Assign to me</Text>
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
  companyName: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 5,
    borderRadius: 10,
  },
  rewardText: {
    marginLeft: 5,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
  },
  assignButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SponsoredGoalsCard;