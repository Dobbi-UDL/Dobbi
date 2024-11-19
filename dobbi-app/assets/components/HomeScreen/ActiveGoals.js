import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '@i18n';
import Card from '../common/Card';

export const ActiveGoals = () => {

  const goals = [
    { id: 1, title: i18n.t('goalVacation'), progress: 75 },
    { id: 2, title: i18n.t('goalCreditCard'), progress: 50 },
    { id: 3, title: i18n.t('goalInvest'), progress: 30 },
  ];

  return (
    <Card>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{i18n.t('activeGoalsTitle')}</Text>
        <TouchableOpacity onPress={() => console.log(i18n.t('viewAllGoalsAction'))}>
          <Text style={styles.viewAll}>{i18n.t('viewAll')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{item.title}</Text>
              <Text style={styles.goalProgress}>
                {i18n.t('goalProgress', { progress: item.progress })}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
          </View>
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
    color: '#333',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    color: '#666',
  },
});