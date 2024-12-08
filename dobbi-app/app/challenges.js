import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { ChallengeCard } from '../assets/components/ChallengesScreen/ChallengeCard';
import { MyGoalsCard } from '../assets/components/ChallengesScreen/MyGoalsCard';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { styles } from '../assets/styles/marketplace';
import Header from '../assets/components/Header/Header';
import { useLanguage } from '@languagecontext';
import TabBar from '../assets/components/common/TabBar';
import { useAuth } from '../contexts/AuthContext';

const ChallengesScreen = () => {
  const { locale } = useLanguage();
  const [challenges, setChallenges] = useState([]);
  const [personalGoals, setPersonalGoals] = useState([]);
  const [sponsoredChallenges, setSponsoredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // Cambiar a 0
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchChallenges(user.id);
    }
  }, [user, activeTab]); // Agregar activeTab como dependencia

  const tabs = ['Mis Objetivos', 'Objetivos Patrocinados'];

  const fetchChallenges = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const currentDate = new Date().toISOString().split('T')[0];

      // Obtener objetivos personales
      const personalGoalsResult = await supabase.rpc('fetch_user_goals', {
        user_id_input: userId,
        current_date_input: currentDate
      });

      // Obtener objetivos patrocinados
      const sponsoredResult = await supabase.rpc('fetch_untracked_challenges', {
        user_id_input: userId,
        current_date_input: currentDate
      });

      // Separar los resultados
      setPersonalGoals(personalGoalsResult.data || []);
      setSponsoredChallenges(sponsoredResult.data || []);
      
      // Establecer los challenges según la pestaña activa
      setChallenges(
        activeTab === 0 
          ? (personalGoalsResult.data || []) 
          : (sponsoredResult.data || [])
      );

      console.log('Personal Goals:', personalGoalsResult.data);
      console.log('Sponsored Challenges:', sponsoredResult.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Hubo un problema al cargar los desafíos.');
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    // Cambiar los challenges según la pestaña
    setChallenges(
      index === 0 
        ? personalGoals 
        : sponsoredChallenges
    );
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
      <Header title="Saving Goals" />
      <View style={[styles.container, styles.flexContainer]}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
        <ScrollView style={styles.contentContainer}>
          {activeTab === 0 ? (
            challenges.length > 0 ? (
              challenges.map((goal) => (
                <MyGoalsCard key={goal.id} goal={goal} />
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>Aún no tienes objetivos creados</Text>
              </View>
            )
          ) : (
            challenges.length > 0 ? (
              challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No hay desafíos patrocinados disponibles</Text>
              </View>
            )
          )}
        </ScrollView>
        <BottomNavBar />
      </View>
    </>
  );
};

export default ChallengesScreen;