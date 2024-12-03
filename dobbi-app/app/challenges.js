import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../config/supabaseClient';
import { styles } from '../assets/styles/marketplace';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { SponsoredGoalsTab } from '../assets/components/ChallengesScreen/SponsoredGoalsTab';
import { MyGoalsTab } from '../assets/components/ChallengesScreen/MyGoalsTab';

const SavingGoalsScreen = () => {
  const [activeTab, setActiveTab] = useState('sponsored');
  const [sponsoredGoals, setSponsoredGoals] = useState([]);
  const [userGoals, setUserGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      // Recuperar objetivos patrocinados sin asignar
      const { data: sponsoredData, error: sponsoredError } = await supabase
        .from('saving_goals')
        .select('*')
        .gt('target_date', new Date());
    
      // Recuperar objetivos del usuario
      const { data: userGoalsData, error: userGoalsError } = await supabase
        .from('saving_goals')
        .select('*, companies:company_id (name)')
        .not('user_id', 'is', null);

      if (sponsoredError || userGoalsError) {
        throw sponsoredError || userGoalsError;
      }

      setSponsoredGoals(sponsoredData || []);
      setUserGoals(userGoalsData || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignGoal = async (goalId) => {
    try {
      // Lógica para asignar un objetivo patrocinado al usuario
      // Necesitarás añadir la lógica de autenticación para obtener el user_id
      const { data, error } = await supabase
        .from('saving_goals')
        .update({ user_id: 'current_user_id' }) // Reemplazar con ID del usuario autenticado
        .eq('id', goalId);

      if (error) throw error;

      // Actualizar los estados después de asignar
      fetchGoals();
    } catch (error) {
      console.error('Error assigning goal:', error);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      // Lógica para crear un nuevo objetivo para el usuario
      const { data, error } = await supabase
        .from('saving_goals')
        .insert({
          ...goalData,
          user_id: 'current_user_id', // Reemplazar con ID del usuario autenticado
        });

      if (error) throw error;

      // Actualizar los estados después de crear
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'sponsored' && styles.activeTab
        ]}
        onPress={() => setActiveTab('sponsored')}
      >
        <Text style={[
          styles.tabText, 
          activeTab === 'sponsored' && styles.activeTabText
        ]}>
          Objetivos Patrocinados
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'myGoals' && styles.activeTab
        ]}
        onPress={() => setActiveTab('myGoals')}
      >
        <Text style={[
          styles.tabText, 
          activeTab === 'myGoals' && styles.activeTabText
        ]}>
          Mis Objetivos
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {renderTabs()}
      {activeTab !== 'sponsored' ? (
        <MyGoalsTab 
        goals={userGoals} 
        onCreateGoal={handleCreateGoal} 
      />
      ) : (
        <SponsoredGoalsTab 
          goals={sponsoredGoals} 
          onAssignGoal={handleAssignGoal} 
        />
      )}
      <BottomNavBar/>
    </View>
  );
};

export default SavingGoalsScreen;