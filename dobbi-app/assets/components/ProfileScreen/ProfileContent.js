import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/home';


export const ProfileContent = ({ username }) => {
  console.log('Username:', username); // Debugging line to check if username is passed correctly
  return (
    <View style={styles.lowerSection}>
      <Text style={styles.welcomeText}>Testing profile screen for you,</Text>
      <Text style={styles.usernameText}>{username}</Text>
    </View>
  );
};