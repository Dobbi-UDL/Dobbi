import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { RegisterHeader } from '../assets/components/RegisterScreen/RegisterHeader';
import { RegisterForm } from '../assets/components/RegisterScreen/RegisterForm';
import { styles } from '../assets/styles/register';

const RegisterScreen = () => {
  const router = useRouter();

  const handleRegister = (formData) => {
    // Implementar la lógica de registro
    console.log('Register attempt:', formData);
  };
  
  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <RegisterHeader onBack={handleBack} />
        <RegisterForm onRegister={handleRegister} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;