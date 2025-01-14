import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import i18n from '../i18n';

export const BiometricService = {
  async isBiometricAvailable() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  },

  async getBiometricType() {
    try {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('Supported biometric types:', supportedTypes); // Para debugging
      
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
      const biometricType = await this.getBiometricType();
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: biometricType === 'face' 
          ? i18n.t('face_id_prompt') 
          : i18n.t('biometric_auth_prompt'),
        fallbackLabel: i18n.t('biometric_fallback'),
        disableDeviceFallback: false,
        cancelLabel: i18n.t('cancel'),
        requireConfirmation: false, // Importante para iOS
      });

      console.log('Authentication result:', result); // Para debugging
      return result.success;
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
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