import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { WelcomeHeader } from '../assets/components/WelcomeScreen/WelcomeHeader';
import { WelcomeContent } from '../assets/components/WelcomeScreen/WelcomeContent';
import { styles } from '../assets/styles/welcome';
import { useLanguage } from '@languagecontext';

const WelcomeScreen = () => {
  const { locale } = useLanguage();
  const router = useRouter();

  const handleRegisterPress = () => {
    console.log('WelcomeScreen: Register button pressed');
    try {
      router.push('/onboarding');
    } catch (error) {
      console.error('Error navigating to register:', error);
    }
  };

  const handleLoginPress = () => {
    console.log('WelcomeScreen: Login button pressed');
    try {
      router.push('/login');
    } catch (error) {
      console.error('Error navigating to login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WelcomeHeader />
      <WelcomeContent 
        onLoginPress={handleLoginPress} 
        onRegisterPress={handleRegisterPress} />
    </View>
  );
};export default WelcomeScreen;