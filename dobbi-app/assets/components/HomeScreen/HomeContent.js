import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/home';


export const HomeContent = ({ username }) => {
  console.log('Username:', username); // Debugging line to check if username is passed correctly
  return (
    <View style={styles.lowerSection}>
      <Text style={styles.welcomeText}>Welcome back,</Text>
      <Text style={styles.usernameText}>{username}</Text>
    </View>
  );
};
