import React, { useEffect, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginHeader } from '../assets/components/LoginScreen/LoginHeader';
import { LoginForm } from '../assets/components/LoginScreen/LoginForm';
import { styles } from '../assets/styles/login';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);


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
      
      if (signInError) {
        throw signInError;
      }

    } catch (error) {
      console.log('Login error:', error);
      alert(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  }

  const handleBack = () => {
    router.back();
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