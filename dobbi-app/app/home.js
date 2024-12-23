import React from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
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

  const handleTestSavings = async () => {
    try {
      console.log('Iniciando test de ahorros automáticos...');
      const result = await testAutomaticSavings();
      console.log('Resultado del test:', result);
      Alert.alert(
        'Test Completado',
        result ? 'Procesamiento automático ejecutado con éxito' : 'No se ejecutó el procesamiento'
      );
    } catch (error) {
      console.error('Error en test:', error);
      Alert.alert('Error', 'Error ejecutando el test de ahorros automáticos');
    }
  };

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

  return (
    <>
      <Header title="Home" />
      <View style={styles.container}>
        <FlatList
          style={styles.contentContainer}
          data={[
            { key: 'test' }, // Añadir el botón de test al principio
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
              case 'test':
                return __DEV__ ? (
                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={handleTestSavings}
                  >
                    <Text style={styles.testButtonText}>
                      Test Automatic Savings (DEV)
                    </Text>
                  </TouchableOpacity>
                ) : null;
              case 'netCashFlow':
                return <NetCashFlow />;
              case 'quickActions':
                return <QuickActions />;
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