import React, { useEffect, useState, useCallback } from 'react';
import { Text, ScrollView } from 'react-native';
import { supabase } from '../../../config/supabaseClient';
import { ChallengeCard } from './ChallengeCard';
import { styles } from '../../styles/marketplace';

const SponsoredGoalsView = ({ userId, refreshTrigger, onGoalUpdate }) => {
    const [sponsoredChallenges, setSponsoredChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSponsoredChallenges = useCallback(async (userId) => {
        try {
            setLoading(true);
            const result = await supabase.rpc('fetch_untracked_challenges', {
                user_id_input: userId,
                current_date_input: new Date().toISOString().split('T')[0],
            });
            setSponsoredChallenges(result.data || []);
        } catch (error) {
            console.error('Error fetching sponsored challenges:', error);
            setError('Hubo un problema al cargar los desafíos patrocinados.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('SponsoredGoalsView refreshing...', refreshTrigger);
        if (userId) {
            fetchSponsoredChallenges(userId);
        }
    }, [userId, refreshTrigger, fetchSponsoredChallenges]);

    const handleAcceptChallenge = async (challengeId) => {
        try {
            // ... handle challenge acceptance ...
            await fetchSponsoredChallenges(userId);
        } catch (error) {
            console.error('Error accepting challenge:', error);
        }
    };

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <ScrollView 
            style={[
                styles.container,
                { paddingHorizontal: 0 } // Quita el padding horizontal del contenedor
            ]}
            contentContainerStyle={{ paddingBottom: 16 }} // Añade padding bottom para scroll
        >
            {sponsoredChallenges.length > 0 ? (
                sponsoredChallenges.map((challenge) => (
                    <ChallengeCard 
                        key={challenge.id} 
                        challenge={challenge}
                        onRefresh={() => {
                            fetchSponsoredChallenges(userId);
                            if (onGoalUpdate) onGoalUpdate();
                        }}
                    />
                ))
            ) : (
                <Text>No hay desafíos patrocinados disponibles.</Text>
            )}
        </ScrollView>
    );
};

export default SponsoredGoalsView;
