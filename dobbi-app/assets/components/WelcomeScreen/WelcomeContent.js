import React from 'react';
import { View, Text } from 'react-native';
import { CustomButton } from './CustomButton';
import { styles } from '../../styles/welcome';

export const WelcomeContent = () => (
  <View style={styles.lowerSection}>
    <Text style={styles.title}>Welcome to Dobbi</Text>
    <Text style={styles.subtitle}>
      Your Smart Financial Assistant{'\n'}Making Money Management Simple
    </Text>
    
    <CustomButton type="register" title="Register" />
    <Text style={styles.questionText}>Are you new? {'\n'}</Text>
    <CustomButton type="login" title="Log In" />
  </View>
);