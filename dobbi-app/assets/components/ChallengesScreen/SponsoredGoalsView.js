import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { supabase } from '../../../config/supabaseClient';
import { ChallengeCard } from './ChallengeCard';
import { styles } from '../../styles/marketplace';

const SponsoredGoalsView = ({ userId }) => {
    const [sponsoredChallenges, setSponsoredChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            fetchSponsoredChallenges(userId);
        }
    }, [userId]);

    const fetchSponsoredChallenges = async (userId) => {
        try {
            setLoading(true);
            const result = await supabase.rpc('fetch_untracked_challenges', {
                user_id_input: userId,
                current_date_input: new Date().toISOString().split('T')[0],
            });
            setSponsoredChallenges(result.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sponsored challenges:', error);
            setError('Hubo un problema al cargar los desafíos patrocinados.');
            setLoading(false);
        }
    };

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {sponsoredChallenges.length > 0 ? (
                sponsoredChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
            ) : (
                <Text>No hay desafíos patrocinados disponibles.</Text>
            )}
        </ScrollView>
    );
};

export default SponsoredGoalsView;
