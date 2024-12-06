import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';
import * as Progress from 'react-native-progress';

export const MyGoalsCard = ({ goal }) => {
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'No disponible';
        return amount.toLocaleString('de-DE', { 
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha no disponible';
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Fecha no disponible';
        }
    };

    // Calcula el porcentaje de progreso
    const calculateProgressPercentage = () => {
        if (!goal.target_amount || !goal.current_amount) return 0;
        return Math.min(goal.current_amount / goal.target_amount, 1);
    };

    return (
        <TouchableOpacity style={localStyles.cardContainer}>
            <Card>
                {/* Header con nombre del objetivo y puntos de recompensa */}
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {goal.title || 'Objetivo sin título'}
                    </Text>
                    <View style={styles.rewardContainer}>
                        <Icon name="gift" size={16} color="#ff6b6b" />
                        <Text style={styles.rewardText}>
                            {goal.points_rewards || 0} puntos
                        </Text>
                    </View>
                </View>

                {/* Información de progreso */}
                <View style={localStyles.progressContainer}>
                    <View style={localStyles.amountContainer}>
                        <Text style={localStyles.amountText}>
                            {formatCurrency(goal.current_amount || 0)}
                        </Text>
                        <Text style={localStyles.targetText}>
                            de {formatCurrency(goal.target_amount || 0)}
                        </Text>
                    </View>

                    {/* Barra de progreso */}
                    <Progress.Bar 
                        progress={calculateProgressPercentage()}
                        width={null}
                        color="#ff6b6b"
                        unfilledColor="#e0e0e0"
                        borderWidth={0}
                        style={localStyles.progressBar}
                    />

                    {/* Porcentaje de progreso */}
                    <View style={localStyles.progressTextContainer}>
                        <Text style={localStyles.progressText}>
                            {(calculateProgressPercentage() * 100).toFixed(0)}% completado
                        </Text>
                        <View style={localStyles.dateContainer}>
                            <Icon name="calendar" size={16} color="#666" />
                            <Text style={localStyles.dateText}>
                                Finaliza: {formatDate(goal.end_date)}
                            </Text>
                        </View>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    cardContainer: {
        marginBottom: 15,
    },
    progressContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    targetText: {
        fontSize: 14,
        color: '#666666',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    progressTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        color: '#ff6b6b',
        fontWeight: '600',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666666',
    },
});