import ExpoRouter from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuración mejorada para las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: 'high',
  }),
});

// Configurar el canal para Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Dobbi',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4CAF50',
  });
}

export default function App() {
  return <ExpoRouter />;
}
