import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  static async sendTestNotification() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('No notification permissions');
      }

      const notification = {
        title: "¡Hola! Soy Dobbi 🤖",
        body: "Tu asistente financiero está aquí para ayudarte",
        sound: true,
        priority: 'high',
        android: {
          channelId: 'default',
          color: '#4CAF50',
          vibrate: [0, 250, 250, 250]
        },
        ios: {
          sound: true,
          _displayInForeground: true
        }
      };

      const identifier = await Notifications.presentNotificationAsync(notification);
      console.log('Notificación enviada con ID:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default NotificationService;