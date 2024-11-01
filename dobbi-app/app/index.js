import React from 'react';
import { View } from 'react-native';
import { WelcomeHeader } from '../assets/components/WelcomeScreen/WelcomeHeader';
import { WelcomeContent } from '../assets/components/WelcomeScreen/WelcomeContent';
import { styles } from '../assets/styles/welcome';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <WelcomeHeader />
      <WelcomeContent />
    </View>
  );
};

export default WelcomeScreen;