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
  const [showBiometric, setShowBiometric] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const available = await BiometricService.isBiometricAvailable();
      const enabled = await BiometricService.isBiometricsEnabled();
      console.log('Biometrics check:', { available, enabled });
      
      setIsBiometricAvailable(available && enabled);
      setShowBiometric(available && enabled);

      // Only auto-trigger biometric prompt on first load
      if (available && enabled) {
        handleBiometricAuth();
      }
    } catch (error) {
      console.error('Biometrics check error:', error);
    }
  };

  useEffect(() => {
    // Redirect to home if user is authenticated
    if (user && !authLoading) {
      router.replace('/home');
    }
  }, [user, authLoading]);

  const handleLogin = async ({ email, password }) => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const { error: signInError } = await signIn({ email, password });
      
      if (signInError) throw signInError;

      // Check if biometrics available but not yet enabled
      const biometricsAvailable = await BiometricService.isBiometricAvailable();
      const biometricsEnabled = await BiometricService.isBiometricsEnabled();
      
      if (biometricsAvailable && !biometricsEnabled) {
        // Show biometric enrollment prompt before redirecting
        return new Promise((resolve) => {
          Alert.alert(
            i18n.t('enable_biometrics'),
            i18n.t('enable_biometrics_prompt'),
            [
              { 
                text: i18n.t('cancel'), 
                style: "cancel",
                onPress: () => {
                  router.replace('/home');
                  resolve();
                }
              },
              { 
                text: i18n.t('yes'), 
                onPress: async () => {
                  try {
                    await BiometricService.saveCredentials(email, password);
                    Alert.alert('Success', 'Biometric login has been enabled!', [
                      {
                        text: 'OK',
                        onPress: () => {
                          router.replace('/home');
                          resolve();
                        }
                      }
                    ]);
                  } catch (error) {
                    console.error('Error saving biometric credentials:', error);
                    Alert.alert('Error', 'Failed to enable biometric login');
                    router.replace('/home');
                    resolve();
                  }
                }
              }
            ]
          );
        });
      }

      // If biometrics already enabled or not available, redirect immediately
      router.replace('/home');
    } catch (error) {
      console.log('Login error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Modified biometric authentication handler
  const handleBiometricAuth = async () => {
    try {
      const authenticated = await BiometricService.authenticate();
      if (authenticated) {
        const credentials = await BiometricService.getCredentials();
        console.log('Retrieved credentials after auth:', credentials ? 'yes' : 'no');
        
        if (credentials) {
          handleLogin(credentials);
        } else {
          console.log('No stored credentials found after successful biometric auth');
        }
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
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
              onBiometricAuth={handleBiometricAuth}
              showBiometric={showBiometric}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;