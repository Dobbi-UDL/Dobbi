import React, { useEffect, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { RegisterHeader } from '../assets/components/RegisterScreen/RegisterHeader';
import { RegisterForm } from '../assets/components/RegisterScreen/RegisterForm';
import { styles } from '../assets/styles/register';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '@languagecontext';

export default function RegisterScreen() {
  const { locale } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { signUp, user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect to home if user is authenticated
    if ( user && !authLoading ) {
      router.replace('/success');
    }
  }, [user, authLoading]);

  const handleRegister = async ({ username, email, password }) => {
    try {
      console.log("Register button pressed");
      setLoading(true);
      const { error } = await signUp({ username, email, password });

      if (error) throw error;

    } catch (error) {
      console.log('Registration error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
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
        {loading || authLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <RegisterHeader onBack={handleBack} />
            <RegisterForm onRegister={handleRegister} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}