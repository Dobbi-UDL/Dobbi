import React, {useState} from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginHeader } from '../assets/components/LoginScreen/LoginHeader';
import { LoginForm } from '../assets/components/LoginScreen/LoginForm';
import { styles } from '../assets/styles/login';
import { supabase } from '../config/supabaseClient';

const LoginScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async ({ email, password }) => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      alert("Please enter both email and password.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (loginError) throw loginError;
  
      if (user) {
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
      }
    } catch (error) {
      setError(error.message);
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