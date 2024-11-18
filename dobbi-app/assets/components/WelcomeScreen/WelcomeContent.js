import React from 'react';
import { View, Text } from 'react-native';
import { CustomButton } from './CustomButton';
import { styles } from '../../styles/welcome';
import i18n from '@i18n';

export const WelcomeContent = ({ onLoginPress, onRegisterPress }) => (
  <View style={styles.lowerSection}>
    <Text style={styles.title}>{i18n.t('welcomeTitle')}</Text>
    <Text style={styles.subtitle}>{i18n.t('welcomeSubtitle')}</Text>
    
    <CustomButton type="register" title={i18n.t('loginButton')} onPress={onLoginPress} />
    <Text style={styles.questionText}>{i18n.t('questionText')}</Text>
    <CustomButton type="login" title={i18n.t('registerButton')} onPress={onRegisterPress} />
  </View>
);

