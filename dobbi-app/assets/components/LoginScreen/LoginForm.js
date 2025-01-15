import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/login';
import i18n from '@i18n';
import { BiometricService } from '../../../services/BiometricService';

export const LoginForm = ({ onLogin, onRegister, onBiometricAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const available = await BiometricService.isBiometricAvailable();
        console.log('Biometric hardware check:', available);
        
        const enabled = await BiometricService.isBiometricsEnabled();
        console.log('Biometric enabled check:', enabled);
        
        const type = await BiometricService.getBiometricType();
        console.log('Biometric type:', type);
        
        // Temporarily force to true for testing
        setIsBiometricAvailable(true);
        setBiometricType(type || 'fingerprint');
      } catch (error) {
        console.error('Biometric check error:', error);
        // Still show button even if checks fail
        setIsBiometricAvailable(true);
      }
    };
    checkBiometrics();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      // First check if we have stored credentials
      const storedCredentials = await BiometricService.getCredentials();
      if (storedCredentials) {
        // Pre-fill the form with stored email
        setEmail(storedCredentials.email);
      }

      const authenticated = await BiometricService.authenticate();
      if (authenticated && storedCredentials) {
        onLogin(storedCredentials);
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

      {/* Force button to show regardless of isBiometricAvailable */}
      <TouchableOpacity 
        style={styles.biometricButton}
        onPress={handleBiometricAuth}
      >
        <MaterialIcons 
          name={biometricType === 'face' ? "face" : "fingerprint"} 
          size={24} 
          color="#000" 
        />
        <View>
          <Text style={styles.biometricButtonText}>
            {biometricType === 'face' 
              ? i18n.t('login_with_face') 
              : i18n.t('login_with_fingerprint')}
          </Text>
          {email && (
            <Text style={styles.biometricEmailHint}>
              {email}
            </Text>
          )}
        </View>
      </TouchableOpacity>

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
