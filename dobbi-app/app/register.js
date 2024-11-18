import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { RegisterHeader } from '../assets/components/RegisterScreen/RegisterHeader';
import { RegisterForm } from '../assets/components/RegisterScreen/RegisterForm';
import { styles } from '../assets/styles/register';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async ({ name, email, password }) => {
    try {
      console.log("Register button pressed");
      setLoading(true);
      const { error } = await signUp({ name, email, password });

      if (error) throw error;
      router.push('/success');

    } catch (error) {
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
        {loading ? (
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