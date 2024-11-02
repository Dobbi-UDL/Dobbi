import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { RegisterHeader } from '../assets/components/RegisterScreen/RegisterHeader';
import { RegisterForm } from '../assets/components/RegisterScreen/RegisterForm';
import { styles } from '../assets/styles/register';
import { supabase } from '../config/supabaseClient';

const RegisterScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async ({ email, password, username }) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Registrar usuario en auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Si el registro en auth es exitoso, crear entrada en tabla users
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id, // Este es el UID que coincidirá con auth.users
              username,
              email,
              points: 0
            }
          ]);

        if (profileError) throw profileError;

        router.push('/success');
      }
    } catch (error) {
      setError(error.message);
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
        <RegisterHeader onBack={handleBack} />
        <RegisterForm onRegister={handleRegister} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;