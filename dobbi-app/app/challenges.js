import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { ChallengeCard } from '../assets/components/ChallengesScreen/ChallengeCard';
import { MyGoalsCard } from '../assets/components/ChallengesScreen/MyGoalsCard';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/marketplace';
import Header from '../assets/components/Header/Header';
import { useLanguage } from '@languagecontext';
import TabView from '../assets/components/common/TabView';
import { useAuth } from '../contexts/AuthContext';

const ChallengesScreen = () => {
  const { locale } = useLanguage();
  const [personalGoals, setPersonalGoals] = useState([]);
  const [sponsoredChallenges, setSponsoredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchChallenges(user.id);
    }
  }, [user]);

  const tabs = ['My Goals', 'Sponsored Challenges'];

  const fetchChallenges = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const currentDate = new Date().toISOString().split('T')[0];

      // Fetch personal goals
      const personalGoalsResult = await supabase.rpc('fetch_user_goals', {
        user_id_input: userId,
        current_date_input: currentDate
      });

      // Fetch sponsored challenges
      const sponsoredResult = await supabase.rpc('fetch_untracked_challenges', {
        user_id_input: userId,
        current_date_input: currentDate
      });

      // Set results
      setPersonalGoals(personalGoalsResult.data || []);
      setSponsoredChallenges(sponsoredResult.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Hubo un problema al cargar los desafíos.');
      setLoading(false);
    }
  };

  // Render Personal Goals content
  const renderPersonalGoals = () => {
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {personalGoals.length > 0 ? (
          personalGoals.map((goal) => (
            <MyGoalsCard key={goal.id} goal={goal} />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Aún no tienes objetivos creados</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  // Render Sponsored Challenges content
  const renderSponsoredChallenges = () => {
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {sponsoredChallenges.length > 0 ? (
          sponsoredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No hay desafíos patrocinados disponibles</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      <Header />
      <TabView tabs={tabs}>
        {renderPersonalGoals()}
        {renderSponsoredChallenges()}
      </TabView>
      <BottomNavBar />
    </>
  );
};

export default ChallengesScreen;