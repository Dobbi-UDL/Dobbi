import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/login';
import i18n from '@i18n';

export const LoginForm = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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