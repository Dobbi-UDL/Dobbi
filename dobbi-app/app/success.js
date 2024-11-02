import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SuccessHeader } from '../assets/components/SuccessRegister/SuccessHeader';
import { SuccessContent } from '../assets/components/SuccessRegister/SuccessContent';
import { styles } from '../assets/styles/success';

const SuccessScreen = () => {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Navigate after countdown completes
  useEffect(() => {
    if (remainingTime === 0) {
      router.replace('/login');
    }
  }, [remainingTime]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SuccessHeader />
      <SuccessContent remainingTime={remainingTime} />
    </KeyboardAvoidingView>
  );
};

export default SuccessScreen;
