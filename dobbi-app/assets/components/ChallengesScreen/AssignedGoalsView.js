import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../../config/supabaseClient';
import MyGoalsCard from './MyGoalsCard'; // Cambiar a importación default
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/marketplace';
import { AddGoalForm }  from './AddGoalForm';
import { Collapsible } from '../common/Collapsible';
import i18n from '../../../i18n';
import { EditGoalForm } from './EditGoalForm';
import { AddContributionForm } from './AddContributionForm';

const AssignedGoalsView = ({ userId, refreshTrigger, onGoalUpdate, highlightGoalId }) => {
    const scrollViewRef = useRef(null);
    const [personalGoals, setPersonalGoals] = useState([]);
    const [sponsoredGoals, setSponsoredGoals] = useState([]);
    const [isPersonalExpanded, setIsPersonalExpanded] = useState(true);
    const [isSponsoredExpanded, setIsSponsoredExpanded] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [isContributionFormVisible, setIsContributionFormVisible] = useState(false);

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
            // Si el estado es final, eliminar el objetivo
            if (['completed', 'cancelled', 'failed'].includes(newStatus)) {
                // Primero eliminar el tracking
                const { error: trackingError } = await supabase
                    .from('goal_tracking')
                    .delete()
                    .eq('goal_id', goalId);

                if (trackingError) throw trackingError;

                // mostrar una alerta de objetivo eliminado
                Alert.alert('Success', 'Goal deleted successfully');
            } else {
                // Si no es estado final, solo actualizar el estado
                const { error } = await supabase
                    .from('goal_tracking')
                    .update({ goal_status: newStatus })
                    .eq('goal_id', goalId);

                if (error) throw error;
            }
            
            // Refrescar la vista
            if (onGoalUpdate) onGoalUpdate();
            fetchPersonalGoals(userId);
        } catch (error) {
            console.error('Error updating goal status:', error);
            Alert.alert('Error', 'Failed to update goal status');
        }
    };

    const handleEditGoal = (goal) => {
        setSelectedGoal(goal);
        setIsEditFormVisible(true);
    };

    const handleAddMoney = (goal) => {
        setSelectedGoal(goal);
        setIsContributionFormVisible(true);
    };

    const handleGoalUpdated = () => {
        if (onGoalUpdate) onGoalUpdate();
        setIsEditFormVisible(false);
    };

    const handleContributionAdded = () => {
        if (onGoalUpdate) onGoalUpdate();
        setIsContributionFormVisible(false);
    };

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView ref={scrollViewRef} style={styles.container}>
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
                            onEdit={() => handleEditGoal(goal)}
                            onAddMoney={handleAddMoney}  // Cambiado aquí
                            isHighlighted={goal.id === parseInt(highlightGoalId)}
                        />
                    ))}
                </Collapsible>

                {/* También añadir la prop a los sponsored goals si es necesario */}
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
                            onEdit={() => handleEditGoal(goal)}
                            onAddMoney={handleAddMoney}  // Añadir aquí también si es necesario
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

            <EditGoalForm
                visible={isEditFormVisible}
                onClose={() => setIsEditFormVisible(false)}
                goal={selectedGoal}
                onGoalUpdated={handleGoalUpdated}
            />

            <AddContributionForm
                visible={isContributionFormVisible}
                onClose={() => setIsContributionFormVisible(false)}
                goal={selectedGoal}
                onContributionAdded={handleContributionAdded}
            />
        </View>
    );
};

export default AssignedGoalsView;