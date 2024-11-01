import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles/welcome';

export const CustomButton = ({ type, title, onPress }) => (
  <TouchableOpacity 
    style={[
      styles.button,
      type === 'register' ? styles.registerButton : styles.loginButton
    ]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
