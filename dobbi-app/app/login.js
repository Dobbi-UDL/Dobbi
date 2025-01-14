import React, { useEffect, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginHeader } from '../assets/components/LoginScreen/LoginHeader';
import { LoginForm } from '../assets/components/LoginScreen/LoginForm';
import { styles } from '../assets/styles/login';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '@languagecontext';
import { BiometricService } from '../services/BiometricService';
import i18n from '../i18n';

const LoginScreen = () => {
  const { locale } = useLanguage();
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  useEffect(() => {
    // Redirect to home if user is authenticated
    if (user && !authLoading) {
      router.replace('/home');
    }
  }, [user, authLoading]);

  const checkBiometrics = async () => {
    const available = await BiometricService.isBiometricAvailable();
    const enabled = await BiometricService.isBiometricsEnabled();
    setIsBiometricAvailable(available && enabled); // Solo habilitar si ambos son true
    
    // Solo intentar autenticación biométrica si está habilitada
    if (available && enabled) {
      handleBiometricAuth();
    }
  };

  const handleBiometricAuth = async () => {
    const authenticated = await BiometricService.authenticate();
    if (authenticated) {
      const credentials = await BiometricService.getCredentials();
      if (credentials) {
        handleLogin(credentials);
      }
    }
  };

  const handleLogin = async ({ email, password }) => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const { error: signInError } = await signIn({ email, password });
      
      if (signInError) throw signInError;

      // Preguntar si desea habilitar la autenticación biométrica
      if (isBiometricAvailable && !(await BiometricService.isBiometricsEnabled())) {
        Alert.alert(
          i18n.t('enable_biometrics'),
          i18n.t('enable_biometrics_prompt'),
          [
            { 
              text: i18n.t('cancel'), 
              style: "cancel" 
            },
            { 
              text: i18n.t('yes'), 
              onPress: () => BiometricService.saveCredentials(email, password)
            }
          ]
        );
      }
    } catch (error) {
      console.log('Login error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  }

  const handleBack = () => {
    router.push('/welcome');
  };

  // Only show loading when both local loading and auth loading are false
  const isLoading = loading && authLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <LoginHeader onBack={handleBack} />
            <LoginForm
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;