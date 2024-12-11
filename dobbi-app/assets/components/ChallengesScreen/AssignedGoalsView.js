import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../../config/supabaseClient';
import { MyGoalsCard } from './MyGoalsCard';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/marketplace';
import { SavingGoalsPopup } from './AddGoalForm'; // Import the new popup component

const AssignedGoalsView = ({ userId }) => {
    const [personalGoals, setPersonalGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchPersonalGoals(userId);
        }
    }, [userId]);

    const fetchPersonalGoals = async (userId) => {
        try {
            setLoading(true);
            const result = await supabase.rpc('fetch_user_goals', {
                user_id_input: userId,
                current_date_input: new Date().toISOString().split('T')[0],
            });
            setPersonalGoals(result.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching personal goals:', error);
            setError('Hubo un problema al cargar tus objetivos.');
            setLoading(false);
        }
    };

    const openCreateChallengePopup = () => {
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const handleGoalCreated = () => {
        // Refresh goals after creating a new one
        fetchPersonalGoals(userId);
    };

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {personalGoals.length > 0 ? (
                    personalGoals.map((goal) => <MyGoalsCard key={goal.id} goal={goal} />)
                ) : (
                    <Text>No tienes objetivos aún.</Text>
                )}
            </ScrollView>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={openCreateChallengePopup}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Saving Goals Popup */}
            <SavingGoalsPopup
                visible={isPopupVisible}
                onClose={closePopup}
                userId={userId}
                onGoalCreated={handleGoalCreated}
            />
        </View>
    );
};

export default AssignedGoalsView;