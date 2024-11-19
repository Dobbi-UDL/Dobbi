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


export default function HomeScreen() {
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
            <Text style={styles.welcomeText}>Welcome {userName}!</Text>
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