import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export const NotificationToggle = ({ label, value, onToggle, enabled = true }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#E5E5E5', true: '#FFE5E5' }}
      thumbColor={value ? '#ff6b6b' : '#999999'}
      disabled={!enabled}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});