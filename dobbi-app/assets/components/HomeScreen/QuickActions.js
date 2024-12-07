import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '@i18n';
import Card from '../common/Card';

export const QuickActions = () => {

  const actions = [
    { icon: 'plus', label: i18n.t('addIncome') },
    { icon: 'minus', label: i18n.t('addExpense') },
    { icon: 'chart-line', label: i18n.t('budget') },
    { icon: 'bookmark-plus-outline', label: i18n.t('setGoal') },
  ];

  return (
    <Card>
      <Text style={styles.title}>{i18n.t('quickActionsTitle')}</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={() => console.log(`Pressed ${action.label}`)}
          >
            <View style={styles.iconContainer}>
              <Icon name={action.icon} size={24} color="#ff6b6b" />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    color: '#666',
  },
});