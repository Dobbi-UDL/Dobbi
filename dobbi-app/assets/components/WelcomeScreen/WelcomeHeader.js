import React from 'react';
import { View, Image } from 'react-native';
import { OvalShape } from './OvalShape';
import { styles } from '../../styles/welcome';

export const WelcomeHeader = () => (
  <View style={styles.upperSection}>
    <Image
      source={require('../../../assets/images/dobbi-welcome.png')}
      style={styles.heartImage}
      resizeMode="contain"
    />
    <OvalShape />
  </View>
);