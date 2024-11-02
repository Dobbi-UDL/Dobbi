import React from 'react';
import { View, Text } from 'react-native';
import { CustomButton } from './CustomButton';
import { styles } from '../../styles/welcome';

export const WelcomeContent = ({ onLoginPress, onRegisterPress }) => (
  <View style={styles.lowerSection}>
    <Text style={styles.title}>Welcome to Dobbi</Text>
    <Text style={styles.subtitle}>
      Your Smart Financial Assistant{'\n'}Making Money Management Simple
    </Text>
    
    <CustomButton type="register" title="Log In" onPress={onLoginPress} />
    <Text style={styles.questionText}>Are you new? {'\n'}</Text>
    <CustomButton type="login" title="Register" onPress={onRegisterPress} />
  </View>
);
