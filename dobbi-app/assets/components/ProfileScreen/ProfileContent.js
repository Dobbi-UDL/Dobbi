import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/home';

export const ProfileContent = ({ username }) => {
  return (
    <View style={styles.lowerSection}>
      <Text style={styles.welcomeText}>Welcome back,</Text>
      <Text style={styles.usernameText}>{username}</Text>
    </View>
  );
};