import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginHeader } from '../assets/components/LoginScreen/LoginHeader';
import { LoginForm } from '../assets/components/LoginScreen/LoginForm';
import { styles } from '../assets/styles/login';

const LoginScreen = () => {
  const router = useRouter();

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (user) {
        // Verificar que el usuario existe en la tabla users
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          // Login exitoso, guardar datos del usuario si necesitas
          // Puedes usar un estado global como Context o Redux aquí
          router.replace('/'); // O la ruta que prefieras después del login
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