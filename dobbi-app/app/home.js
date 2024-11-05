import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { supabase } from '../config/supabaseClient';
import AppHeader from '../assets/components/Header/AppHeader';
import { NetCashFlow } from '../assets/components/HomeScreen/NetCashFlow';
import { QuickActions } from '../assets/components/HomeScreen/QuickActions';
import { ActiveGoals } from '../assets/components/HomeScreen/ActiveGoals';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/home';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader username={username} />
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
  );
};

export default HomeScreen;