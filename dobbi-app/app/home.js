import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { HomeContent } from '../assets/components/HomeScreen/HomeContent';
import { FinancialSummary } from '../assets/components/HomeScreen/FinancialSummary';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/home';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'react-native';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

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
      <ScrollView style={styles.contentContainer}>
        <HomeContent username={username} />
        <FinancialSummary />
      </ScrollView>
      <Button
        title="Click Me"
        onPress={signOut}
      />
      <BottomNavBar />
    </View>
  );
};

export default HomeScreen;