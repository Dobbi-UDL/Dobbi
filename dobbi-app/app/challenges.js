import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { ChallengeCard } from '../assets/components/ChallengesScreen/ChallengeCard';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/marketplace';
import Header from '../assets/components/Header/Header';
import { useLanguage } from '@languagecontext';
import TabBar from '../assets/components/common/TabBar';
import { useAuth } from '../contexts/AuthContext';

const ChallengesScreen = () => {
  const { locale } = useLanguage();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchChallenges(user.id);
    }
  }, [user]);

  const tabs = ['Mis Objetivos', 'Objetivos Patrocinados'];

  const fetchChallenges = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const currentDate = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.rpc('fetch_untracked_challenges', {
        user_id_input: userId,
        current_date_input: currentDate
      });
      if (error) throw error;
      setChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Hubo un problema al cargar los desafíos.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
  };

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
    <>
      <Header />
      <View style={[styles.container, styles.flexContainer]}>
        <TabBar 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabPress={handleTabPress} 
        />
        <ScrollView style={styles.contentContainer}>
          {activeTab === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>Aún no tienes objetivos creados</Text>
            </View>
          ) : (
            challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))
          )}
        </ScrollView>
        <BottomNavBar />
      </View>
    </>
  );
};

export default ChallengesScreen;
