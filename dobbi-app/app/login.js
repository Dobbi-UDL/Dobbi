import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginHeader } from '../assets/components/LoginScreen/LoginHeader';
import { LoginForm } from '../assets/components/LoginScreen/LoginForm';
import { styles } from '../assets/styles/login';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ email, password }) => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error: loginError } = await signIn({ email, password });

      if (loginError) throw loginError;

      // Check if user exists in the 'users' table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        // Successful login
        router.replace('/home');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
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