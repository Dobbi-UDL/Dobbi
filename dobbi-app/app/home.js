import React from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import NotificationService from '../services/NotificationService';
import { NetCashFlow } from '../assets/components/HomeScreen/NetCashFlow';
import { QuickActions } from '../assets/components/HomeScreen/QuickActions';
import { ActiveGoals } from '../assets/components/HomeScreen/ActiveGoals';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/home';
import { useAuth } from '../contexts/AuthContext';
import Header from '../assets/components/Header/Header';
import { useRouter } from 'expo-router';
import i18n from '../i18n';
import { testAutomaticSavings } from '../services/goalService';

export default function HomeScreen() {
  // const { locale } = useLanguage();
  const router = useRouter();
  const { user, loading } = useAuth();
  const userName = user?.username || 'User';

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  const sendTestNotification = async () => {
    try {
      console.log('Intentando enviar notificación...');
      const identifier = await NotificationService.sendTestNotification();
      console.log('Notificación enviada correctamente:', identifier);
      Alert.alert(
        "Éxito",
        "Notificación enviada. Si no la ves, verifica los permisos en la configuración de tu dispositivo."
      );
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      Alert.alert(
        "Error",
        "No se pudo enviar la notificación. Verifica los permisos: " + error.message
      );
    }
  };

  const sendGoalReminder = async () => {
    await NotificationService.scheduleNotificationAsync({
      content: {
        title: "¡Objetivo cerca! 🎯",
        body: `¡${userName}, estás cerca de alcanzar tu objetivo!`,
        data: { screen: 'goals' },
      },
      trigger: {
        seconds: 5, // La notificación aparecerá en 5 segundos
      },
    });
  };

  const renderQuickActions = () => (
    <QuickActions 
      additionalActions={[
        {
          title: "Test Notificación",
          icon: "bell",
          onPress: sendTestNotification
        },
        {
          title: "Recordatorio",
          icon: "target",
          onPress: sendGoalReminder
        }
      ]}
    />
  );

  return (
    <>
      <Header title="Home" />
      <View style={styles.container}>
        <FlatList
          style={styles.contentContainer}
          data={[
            { key: 'netCashFlow' },
            { key: 'quickActions' },
            { key: 'activeGoals' },
            { key: 'savingGoals' },
          ]}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={() => (
            <Text style={styles.welcomeText}>{i18n.t("welcome")} {userName}!</Text>
          )}
          renderItem={({ item }) => {
            switch (item.key) {
              case 'netCashFlow':
                return <NetCashFlow />;
              case 'quickActions':
                return renderQuickActions();
              case 'activeGoals':
                return <ActiveGoals />;
              default:
                return null;
            }
          }}
        />
        <BottomNavBar />
      </View>
    </>
  );
}