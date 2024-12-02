import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { supabase } from '../config/supabaseClient';
import SponsoredGoalsCard from '../assets/components/ChallengesScreen/SponsoredGoalsCard';
import MyGoalsCard from '../assets/components/ChallengesScreen/MyGoalsCard';
import TabSlider from '../assets/components/ChallengesScreen/TabSlider';
import CreateGoalModal from '../assets/components/ChallengesScreen/CreateGoalModal';
import  Header  from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { useLanguage } from '@languagecontext';
import { styles } from '../assets/styles/marketplace';

const SavingGoalsScreen = () => {
  const { locale } = useLanguage();
  const [challenges, setChallenges] = useState([]);
  const [userGoals, setUserGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);

  useEffect(() => {
    fetchChallenges();
    fetchUserGoals();
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

  const fetchUserGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goal_tracking')
        .select(`
          *
        `);
      
      if (error) throw error;
      setUserGoals(data);
    } catch (error) {
      console.error('Error fetching user goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = (newGoal) => {
    // Lógica para crear un nuevo objetivo
    console.log('New Goal:', newGoal);
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
          <TabSlider
            sponsoredChallenges={challenges}
            userGoals={userGoals}
            onCreateGoal={() => setShowCreateGoalModal(true)}
          />
        </ScrollView>
        <BottomNavBar />
      </View>
      <CreateGoalModal
        visible={showCreateGoalModal}
        onClose={() => setShowCreateGoalModal(false)}
        onSubmit={handleCreateGoal}
      />
    </>
  );
};

export default SavingGoalsScreen;