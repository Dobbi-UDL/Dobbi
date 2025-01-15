import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import i18n from '../i18n';

export const BiometricService = {
  async isBiometricAvailable() {
    try {
      console.log('Checking biometric hardware...');
      const compatible = await LocalAuthentication.hasHardwareAsync();
      console.log('Hardware compatible:', compatible);

      if (!compatible) {
        console.log('Biometric hardware not available');
        return false;
      }
      
      console.log('Checking biometric enrollment...');
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('Biometrics enrolled:', enrolled);

      if (!enrolled) {
        console.log('No biometrics enrolled on this device');
        return false;
      }
      
      console.log('Biometrics are fully available');
      return true;
    } catch (error) {
      console.error('Detailed biometric check error:', error);
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
      console.log('Starting biometric authentication, available:', isAvailable);
      
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
        disableDeviceFallback: true, // Changed to true for both platforms
        requireConfirmation: false,
        cancelLabel: i18n.t('cancel'),
        // Remove iOS specific options for Android compatibility
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
      console.log('Saving credentials for:', email);
      await SecureStore.setItemAsync('userCredentials', JSON.stringify({ email, password }));
      await SecureStore.setItemAsync('biometricsEnabled', 'true');
      console.log('Credentials saved successfully');
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw error;
    }
  },

  async getCredentials() {
    try {
      const credentialsStr = await SecureStore.getItemAsync('userCredentials');
      console.log('Retrieved credentials:', credentialsStr ? 'exists' : 'null');
      if (!credentialsStr) return null;
      
      const credentials = JSON.parse(credentialsStr);
      return credentials.email && credentials.password ? credentials : null;
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  },

  async isBiometricsEnabled() {
    try {
      const enabled = await SecureStore.getItemAsync('biometricsEnabled');
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometrics enabled:', error);
      return false;
    }
  },
};