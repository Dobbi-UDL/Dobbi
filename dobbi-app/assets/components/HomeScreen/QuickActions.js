import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const QuickActions = () => {
  const actions = [
    { icon: 'plus', label: 'Add Income' },
    { icon: 'minus', label: 'Add Expense' },
    { icon: 'chart-line', label: 'Budget' },
    { icon: 'bookmark-plus-outline', label: 'Set Goal' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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