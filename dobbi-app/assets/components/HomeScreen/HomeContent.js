import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/home';


export const HomeContent = ({ username }) => {
  console.log('Username:', username); // Debugging line to check if username is passed correctly
  return (
    <View style={styles.lowerSection}>
      <Text style={styles.DobbiText}>Dobbi</Text>
      <Text style={styles.WelcomeText}>Hi there, <Text style={{ fontWeight: 'bold' }}>{username}</Text>! Here is your summary report today.</Text>

    </View>
  );
};
