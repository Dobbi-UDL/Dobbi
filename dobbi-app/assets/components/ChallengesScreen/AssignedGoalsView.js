import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../../config/supabaseClient';
import MyGoalsCard from './MyGoalsCard'; // Cambiar a importación default
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/marketplace';
import { AddGoalForm }  from './AddGoalForm';
import { Collapsible } from '../common/Collapsible';
import i18n from '../../../i18n';

const AssignedGoalsView = ({ userId, refreshTrigger, onGoalUpdate, highlightGoalId }) => {
    const scrollViewRef = useRef(null);
    const [personalGoals, setPersonalGoals] = useState([]);
    const [sponsoredGoals, setSponsoredGoals] = useState([]);
    const [isPersonalExpanded, setIsPersonalExpanded] = useState(true);
    const [isSponsoredExpanded, setIsSponsoredExpanded] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Añadimos useCallback para mejorar el rendimiento
    const fetchPersonalGoals = useCallback(async (userId) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.rpc('fetch_user_goals', {
                user_id_input: userId,
                current_date_input: new Date().toISOString().split('T')[0],
            });

            if (error) throw error;

            // Asegúrate de que data no sea null
            const goals = data || [];
            console.log('Fetched goals:', goals); // Para debug

            const personal = goals.filter(goal => !goal.is_sponsored);
            const sponsored = goals.filter(goal => goal.is_sponsored);

            console.log('Personal goals:', personal); // Para debug
            console.log('Sponsored goals:', sponsored); // Para debug

            setPersonalGoals(personal);
            setSponsoredGoals(sponsored);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setError('Error loading goals');
        } finally {
            setLoading(false);
        }
    }, []);

    // Añadir función para encontrar y hacer scroll al objetivo
    const scrollToHighlightedGoal = useCallback(() => {
        if (highlightGoalId && scrollViewRef.current) {
            const goalIndex = personalGoals.findIndex(goal => goal.id === parseInt(highlightGoalId));
            if (goalIndex !== -1) {
                // Calcular la posición aproximada
                const approximatePosition = goalIndex * 200; // Altura aproximada de cada card
                scrollViewRef.current.scrollTo({ y: approximatePosition, animated: true });
                setIsPersonalExpanded(true); // Asegurar que la sección esté expandida
            }
        }
    }, [highlightGoalId, personalGoals]);

    // Actualizamos useEffect para escuchar cambios en refreshTrigger
    useEffect(() => {
        if (userId) {
            fetchPersonalGoals(userId);
        }
    }, [userId, refreshTrigger, fetchPersonalGoals]);

    useEffect(() => {
        if (highlightGoalId && userId) {
            fetchPersonalGoals(userId);
            // Dar tiempo para que se renderice la lista
            setTimeout(scrollToHighlightedGoal, 100);
        }
    }, [highlightGoalId, userId]);

    const openCreateChallengePopup = () => {
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const handleGoalCreated = () => {
        // Trigger refresh in both views
        if (onGoalUpdate) onGoalUpdate();
        fetchPersonalGoals(userId);
    };

    const handleStatusChange = async (goalId, newStatus) => {
        try {
            const { error } = await supabase
                .from('goal_tracking')
                .update({ goal_status: newStatus })
                .eq('goal_id', goalId);

            if (error) throw error;
            
            // Trigger refresh in both views
            if (onGoalUpdate) onGoalUpdate();
            fetchPersonalGoals(userId);
        } catch (error) {
            console.error('Error updating goal status:', error);
        }
    };

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                ref={scrollViewRef}
                style={styles.container}
            >
                <Collapsible
                    title={`${i18n.t('personal_goals')} (${personalGoals.length})`}
                    isExpanded={isPersonalExpanded}
                    onToggle={() => setIsPersonalExpanded(!isPersonalExpanded)}
                >
                    {personalGoals.map((goal) => (
                        <MyGoalsCard
                            key={goal.id}
                            goal={goal}
                            onStatusChange={(status) => handleStatusChange(goal.id, status)}
                            onEdit={() => {/* Handle edit */}}
                            onUpdate={onGoalUpdate}
                            isHighlighted={goal.id === highlightGoalId}
                        />
                    ))}
                </Collapsible>

                <Collapsible
                    title={`${i18n.t('sponsored_goals')} (${sponsoredGoals.length})`}
                    isExpanded={isSponsoredExpanded}
                    onToggle={() => setIsSponsoredExpanded(!isSponsoredExpanded)}
                >
                    {sponsoredGoals.map((goal) => (
                        <MyGoalsCard
                            key={goal.id}
                            goal={goal}
                            onStatusChange={(status) => handleStatusChange(goal.id, status)}
                            onEdit={() => {/* Handle edit */}}
                        />
                    ))}
                </Collapsible>
            </ScrollView>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={openCreateChallengePopup}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Saving Goals Popup */}
            <AddGoalForm
                visible={isPopupVisible}
                onClose={closePopup}
                userId={userId}
                onGoalCreated={handleGoalCreated}
            />
        </View>
    );
};

export default AssignedGoalsView;