import React from 'react';
import { View } from 'react-native';
import { OvalShape } from './OvalShape';
import { styles } from '../../styles/home';

export const HomeHeader = () => (
  <View style={styles.upperSection}>
    <OvalShape />
  </View>
);
