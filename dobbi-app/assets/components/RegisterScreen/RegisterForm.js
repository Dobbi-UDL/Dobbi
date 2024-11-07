import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/register';
import i18n from '@i18n';

export const RegisterForm = ({ onRegister }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Aquí podrías añadir validaciones
    onRegister(formData);
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>{i18n.t('registerTitle')}</Text>
      <Text style={styles.subtitle}>{i18n.t('registerSubtitle')}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{i18n.t('fullName')}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('fullNamePlaceholder')}
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{i18n.t('email')}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('emailPlaceholder')}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{i18n.t('password')}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('createPasswordPlaceholder')}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{i18n.t('confirmPassword')}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('confirmPasswordPlaceholder')}
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={handleSubmit}
      >
        <Text style={styles.registerButtonText}>{i18n.t('registerButton')}</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>{i18n.t('haveAccount')} </Text>
        <TouchableOpacity onPress={handleLoginPress}>
          <Text style={styles.loginLink}>{i18n.t('loginButton')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};