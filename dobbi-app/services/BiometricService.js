import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import i18n from '../i18n';

export const BiometricService = {
  async isBiometricAvailable() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        console.log('Biometric hardware not available');
        return false;
      }
      
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        console.log('No biometrics enrolled on this device');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  },

  async getBiometricType() {
    try {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('Supported biometric types:', supportedTypes);
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'face';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'fingerprint';
      }
      return null;
    } catch (error) {
      console.error('Error getting biometric type:', error);
      return null;
    }
  },

  async authenticate() {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return false;
      }

      const biometricType = await this.getBiometricType();
      const promptMessage = Platform.select({
        ios: biometricType === 'face' 
          ? i18n.t('face_id_prompt') 
          : i18n.t('biometric_auth_prompt'),
        android: i18n.t('biometric_auth_prompt'),
      });

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: Platform.OS === 'ios' ? i18n.t('biometric_fallback') : undefined,
        cancelLabel: Platform.OS === 'ios' ? i18n.t('cancel') : undefined,
        disableDeviceFallback: Platform.OS === 'android',
        requireConfirmation: false,
        promptDescriptionIOS: Platform.OS === 'ios' ? i18n.t('biometric_prompt_description') : undefined,
      });

      console.log('Authentication result:', result);
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },

  async saveCredentials(email, password) {
    try {
      await SecureStore.setItemAsync('userCredentials', JSON.stringify({ email, password }));
      await SecureStore.setItemAsync('biometricsEnabled', 'true');
    } catch (error) {
      console.error('Error guardando credenciales:', error);
    }
  },

  async getCredentials() {
    try {
      const credentials = await SecureStore.getItemAsync('userCredentials');
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error obteniendo credenciales:', error);
      return null;
    }
  },

  async isBiometricsEnabled() {
    return await SecureStore.getItemAsync('biometricsEnabled') === 'true';
  }
};