import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/login';
import i18n from '@i18n';
import { BiometricService } from '../../../services/BiometricService';

export const LoginForm = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);

  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await BiometricService.isBiometricAvailable();
      const enabled = await BiometricService.isBiometricsEnabled(); // Verificar si está habilitado
      const type = await BiometricService.getBiometricType();
      setBiometricType(type);
      setIsBiometricAvailable(available && enabled); // Solo mostrar si está disponible Y habilitado
    };
    checkBiometrics();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      console.log('Attempting biometric authentication...'); // Para debugging
      const authenticated = await BiometricService.authenticate();
      console.log('Authentication result:', authenticated); // Para debugging
      
      if (authenticated) {
        const credentials = await BiometricService.getCredentials();
        console.log('Credentials retrieved:', credentials ? 'yes' : 'no'); // Para debugging
        
        if (credentials) {
          onLogin(credentials);
        }
      }
    } catch (error) {
      console.error('Error in biometric auth:', error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>{i18n.t('loginWelcome')}</Text>
      <Text style={styles.subtitle}>{i18n.t('loginSubtitle')}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{i18n.t('email')}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{i18n.t('password')}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>{i18n.t('forgotPassword')}</Text>
      </TouchableOpacity>

      {isBiometricAvailable && (
        <TouchableOpacity 
          style={styles.biometricButton}
          onPress={handleBiometricAuth}
        >
          <Icon 
            name={biometricType === 'face' ? 'face-recognition' : 'fingerprint'} 
            size={24} 
            color="#ff6b6b" 
          />
          <Text style={styles.biometricButtonText}>
            {i18n.t(biometricType === 'face' ? 'login_with_face_id' : 'login_with_biometrics')}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => onLogin({ email, password })}
      >
        <Text style={styles.loginButtonText}>{i18n.t('loginButton')}</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>{i18n.t('noAccount')} </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.registerLink}>{i18n.t('register')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};