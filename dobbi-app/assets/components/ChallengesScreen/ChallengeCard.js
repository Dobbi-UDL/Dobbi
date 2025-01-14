import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../common/Card';
import { assignGoal } from '../../../services/goalService';
import { useAuth } from '../../../contexts/AuthContext';
import i18n from '../../../i18n';
import { supabase } from '../../../config/supabaseClient';
import { styles } from '../../styles/challenges';

export const ChallengeCard = ({ challenge, onRefresh }) => {
    const { user } = useAuth();

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'N/A';
        return amount.toLocaleString('de-DE', { 
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'N/A';
        }
    };

    const handleAssignChallenge = async () => {
        try {
            if (!user?.id) {
                Alert.alert("Error", "Please log in first");
                return;
            }

            const { error: trackingError } = await supabase
                .from('goal_tracking')
                .insert({
                    user_id: user.id,
                    goal_id: challenge.id,
                    current_amount: 0,
                    start_date: new Date().toISOString(),
                    end_date: challenge.expiring_date,
                    monthly_saving: challenge.monthly_saving,
                    target_amount: challenge.target_amount,
                    completed: false,
                    goal_status: 'pending'
                });
                const { error: redemptionError } = await supabase
                    .from('goal_statistics')
                    .insert([{
                        user_id: user.id,
                        goal_id: challenge.id,
                        type_action: 'redemption'
                    }]);

                if (redemptionError) throw redemptionError;

            if (trackingError) throw trackingError;

            Alert.alert("Success", "Challenge accepted successfully!");
            
            // Notificar el cambio inmediatamente
            if (onRefresh) {
                onRefresh();
            }

        } catch (error) {
            console.error("Error accepting challenge:", error);
            Alert.alert("Error", "Failed to accept challenge");
        }
    };

    const handleChallengeClick = async () => {
        if (!user?.id) {
            console.error("No user ID available");
            return;
        }

        try {
            const { data, error } = await supabase
                .from('goal_statistics')
                .select('*')
                .eq('user_id', user.id)
                .eq('goal_id', challenge.id)
                .eq('type_action', 'click');

            if (error) {
                console.error('Error checking interaction:', error);
                return;
            }

            if (data.length === 0) {
                const { error: insertError } = await supabase
                    .from('goal_statistics')
                    .insert([{
                        user_id: user.id,
                        goal_id: challenge.id,
                        type_action: 'click'
                    }]);

                if (insertError) {
                    console.error('Error inserting interaction:', insertError);
                } else {
                    console.log(`Challenge ${challenge.id} clicked`);
                }
            }
        } catch (error) {
            console.error('Error handling challenge click:', error);
        }
    };

    return (
        <TouchableOpacity onPress={handleChallengeClick}>
            <Card style={localStyles.card}>
                {/* Header with Title and Points */}
                <View style={localStyles.header}>
                    <Text style={localStyles.title} numberOfLines={2}>
                        {challenge.title || i18n.t('title_placeholder')}
                    </Text>
                    <View style={localStyles.points}>
                        <Icon name="gift" size={16} color="#fff" />
                        <Text style={localStyles.pointsText}>
                            {challenge.points_rewards || 0} {i18n.t('pts')}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={localStyles.description} numberOfLines={2}>
                    {challenge.description || i18n.t('description_placeholder')}
                </Text>

                {/* Metrics Grid */}
                <View style={localStyles.metrics}>
                    <MetricItem
                        icon="cash"
                        value={formatCurrency(challenge.monthly_saving)}
                        label={i18n.t('monthly_amount')}
                        color="#4CAF50"
                    />
                    <MetricItem
                        icon="target"
                        value={formatCurrency(challenge.target_amount)}
                        label={i18n.t('target_amount')}
                        color="#2196F3"
                    />
                    <MetricItem
                        icon="calendar"
                        value={formatDate(challenge.expiring_date)}
                        label={i18n.t('expiring_date')}
                        color="#FF9800"
                    />
                </View>

                {/* Accept Button */}
                <TouchableOpacity 
                    style={localStyles.button} 
                    onPress={handleAssignChallenge}
                >
                    <Text style={localStyles.buttonText}>
                        {i18n.t('accept_challenge')}
                    </Text>
                </TouchableOpacity>
            </Card>
        </TouchableOpacity>
    );
};

// Componente auxiliar para métricas
const MetricItem = ({ icon, value, label, color }) => (
    <View style={styles.metricItem}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </View>
);