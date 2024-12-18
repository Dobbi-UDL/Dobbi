import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../common/Card';
import { assignGoal } from '../../../services/goalService';
import { useAuth } from '../../../contexts/AuthContext';
import i18n from '../../../i18n';

export const ChallengeCard = ({ challenge }) => {
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
        if (user && user.id) {
            const result = await assignGoal(challenge.id, user.id);
            if (result) {
                console.log("Objetivo asignado exitosamente:", result);
                router.puss('/my-goals');
            }
        } else {
            Alert.alert("Error", "No se pudo asignar el objetivo. Por favor, inicia sesión.");
        }
    };

    return (
        <TouchableOpacity style={localStyles.container}>
            <Card style={localStyles.card}>
                {/* Header Section */}
                <View style={localStyles.headerContainer}>
                    <View style={localStyles.companySection}>
                        <Text style={localStyles.companyName} numberOfLines={1}>
                            {challenge.company_name || i18n.t('company_name_placeholder')}
                        </Text>
                    </View>
                    <View style={localStyles.rewardBadge}>
                        <Icon name="gift" size={16} color="#fff" />
                        <Text style={localStyles.rewardText}>
                            {challenge.points_rewards || 0} {i18n.t('pts')}
                        </Text>
                    </View>
                </View>

                {/* Challenge Details */}
                <View style={localStyles.contentContainer}>
                    <Text style={localStyles.titleText} numberOfLines={2}>
                        {challenge.title || i18n.t('title_placeholder')}
                    </Text>
                    <Text style={localStyles.descriptionText} numberOfLines={3}>
                        {challenge.description || i18n.t('description_placeholder')}
                    </Text>

                    {/* Challenge Metrics */}
                    <View style={localStyles.metricsContainer}>
                        <View style={localStyles.metricItem}>
                            <Icon name="cash" size={20} color="#4a4a4a" />
                            <Text style={localStyles.metricText}>
                            {i18n.t('monthly_amount')}: {formatCurrency(challenge.monthly_saving)}
                            </Text>
                        </View>
                        <View style={localStyles.metricItem}>
                            <Icon name="target" size={20} color="#4a4a4a" />
                            <Text style={localStyles.metricText}>
                                {i18n.t('target_amount')}: {formatCurrency(challenge.target_amount)}
                            </Text>
                        </View>
                        <View style={localStyles.metricItem}>
                            <Icon name="calendar" size={20} color="#4a4a4a" />
                            <Text style={localStyles.metricText}>
                                {i18n.t('expiring_date')}: {formatDate(challenge.expiring_date)}
                            </Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity 
                        style={localStyles.actionButton} 
                        onPress={handleAssignChallenge}
                    >
                        <Text style={localStyles.actionButtonText}>{i18n.t('accept_challenge')}</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    container: {
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 10,
    },
    card: {
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        padding: 10,
        overflow: 'hidden',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 2,
    },
    companySection: {
        flex: 1,
        marginRight: 10,
    },
    companyName: {
        fontSize: 25,
        fontWeight: '600',
        color: '#333333',
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    rewardText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
    },
    contentContainer: {
        padding: 16,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 16,
    },
    metricsContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metricText: {
        marginLeft: 10,
        fontSize: 14,
        textAlignVertical: 'center',
        color: '#4a4a4a',
    },
    actionButton: {
        backgroundColor: '#ff6b6b',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});