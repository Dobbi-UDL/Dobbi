import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { ChallengeCard } from '../assets/components/ChallengesScreen/ChallengeCard';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/marketplace';
import Header from '../assets/components/Header/Header';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('saving_goals')
        .select(`
          *,
          companies:company_id (
            name
          )
        `);
      
      if (error) throw error;
      setChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
    <Header />
    <View style={[styles.container, styles.flexContainer]}>
      <ScrollView style={styles.contentContainer}>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </ScrollView>
      <BottomNavBar />
    </View>
    </>
  );
};

export default ChallengesScreen;
