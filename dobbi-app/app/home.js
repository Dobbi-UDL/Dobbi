import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { NetCashFlow } from '../assets/components/HomeScreen/NetCashFlow';
import { QuickActions } from '../assets/components/HomeScreen/QuickActions';
import { ActiveGoals } from '../assets/components/HomeScreen/ActiveGoals';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/home';
import { useAuth } from '../contexts/AuthContext';
import Header from '../assets/components/Header/Header';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      setLoading(false);
    } else {
      router.push('/login');
    }
  }, [session, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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