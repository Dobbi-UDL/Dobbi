import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { ProfileContent } from '../assets/components/ProfileScreen/ProfileContent';
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
      <ScrollView style={styles.contentContainer}>
        <ProfileContent username={username} />
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

export default HomeScreen;