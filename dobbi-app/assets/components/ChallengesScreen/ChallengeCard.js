import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../common/Card';
import { assignGoal } from '../../../services/goalService';
import { useAuth } from '../../../contexts/AuthContext';
import i18n from '../../../i18n';
import { supabase } from '../../../config/supabaseClient';

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

    return (
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
    );
};

// Componente auxiliar para métricas
const MetricItem = ({ icon, value, label, color }) => (
    <View style={localStyles.metricItem}>
        <Icon name={icon} size={24} color={color} />
        <Text style={localStyles.metricValue}>{value}</Text>
        <Text style={localStyles.metricLabel}>{label}</Text>
    </View>
);

const localStyles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16, // Añadido margen horizontal consistente
        width: 'auto',       // Asegura que la card respete los márgenes
        alignSelf: 'stretch', // Hace que la card ocupe el ancho disponible
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginRight: 12,
    },
    points: {
        flexDirection: 'row',
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
    },
    pointsText: {
        color: '#fff',
        marginLeft: 4,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    metrics: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
        textAlign: 'center',
    },
    metricLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
    },
    button: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});