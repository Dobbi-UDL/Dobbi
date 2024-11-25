import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { NetCashFlow } from '../assets/components/HomeScreen/NetCashFlow';
import { QuickActions } from '../assets/components/HomeScreen/QuickActions';
import { ActiveGoals } from '../assets/components/HomeScreen/ActiveGoals';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/home';
import { useAuth } from '../contexts/AuthContext';
import Header from '../assets/components/Header/Header';
import { useRouter } from 'expo-router';
import i18n from '../i18n';
import { useLanguage } from '@languagecontext';


export default function HomeScreen() {
  const { locale } = useLanguage();
  const router = useRouter();
  const { user, loading } = useAuth();
  const userName = user.username || 'User';

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
      <Header />
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