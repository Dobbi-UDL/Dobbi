import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginHeader } from '../assets/components/LoginScreen/LoginHeader';
import { LoginForm } from '../assets/components/LoginScreen/LoginForm';
import { styles } from '../assets/styles/login';

const LoginScreen = () => {
  const router = useRouter();

  const handleLogin = (email, password) => {
    // Implementar la lógica de login
    console.log('Login attempt:', email, password);
  };

  const handleRegister = () => {
    // Navegación a la pantalla de registro (cuando la creemos)
    router.push('/register');
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
        <LoginHeader onBack={handleBack} />
        <LoginForm 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;