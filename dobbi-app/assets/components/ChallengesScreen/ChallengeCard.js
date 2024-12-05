import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';
import { assignGoal } from '../../../services/goalService';
import { useAuth } from '../../../contexts/AuthContext';

export const ChallengeCard = ({ challenge }) => {
    const { user } = useAuth();

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

    const handleAssignChallenge = async () => {
        if (user && user.id) {
            const result = await assignGoal(challenge.id, user.id);
            if (result) {
                console.log("Objetivo asignado exitosamente:", result);
            }
        } else {
            Alert.alert("Error", "No se pudo asignar el objetivo porque no hay un usuario válido.");
        }
    };

    return (
        <TouchableOpacity style={localStyles.cardContainer}>
            <Card>
                {/* Header con información de la compañía y puntos */}
                <View style={styles.cardHeader}>
                    <Text style={styles.companyName}>
                        {challenge.company_name || 'Compañía no disponible'}
                    </Text>
                    <View style={styles.rewardContainer}>
                        <Icon name="gift" size={16} color="#ff6b6b" />
                        <Text style={styles.rewardText}>
                            {challenge.points_rewards || 0} puntos
                        </Text>
                    </View>
                </View>

                {/* Título y descripción */}
                <Text style={styles.cardTitle}>{challenge.title || 'Título no disponible'}</Text>
                <Text style={styles.cardDescription}>
                    {challenge.description || 'Descripción no disponible'}
                </Text>

                {/* Información detallada del desafío */}
                <View style={localStyles.detailsContainer}>
                    <View style={localStyles.detailRow}>
                        <View style={localStyles.detailItem}>
                            <Icon name="cash" size={16} color="#666" />
                            <Text style={localStyles.detailText}>
                                Ahorro mensual: {formatCurrency(challenge.monthly_saving)}
                            </Text>
                        </View>
                        <View style={localStyles.detailItem}>
                            <Icon name="calendar" size={16} color="#666" />
                            <Text style={localStyles.detailText}>
                                Vence: {formatDate(challenge.expiring_date)}
                            </Text>
                        </View>
                    </View>

                    {/* Nuevo: Monto objetivo */}
                    <View style={localStyles.targetAmountContainer}>
                        <Icon name="target" size={16} color="#666" />
                        <Text style={localStyles.targetAmountText}>
                            Monto objetivo: {formatCurrency(challenge.target_amount)}
                        </Text>
                    </View>
                </View>

                {/* Botón para asignar el desafío */}
                <TouchableOpacity 
                    style={styles.assignButton} 
                    onPress={handleAssignChallenge}
                >
                    <Text style={styles.assignButtonText}>Asignar objetivo</Text>
                </TouchableOpacity>
            </Card>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    cardContainer: {
        marginBottom: 15,
    },
    detailsContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailText: {
        marginLeft: 5,
        color: '#666666',
        fontSize: 13,
    },
    targetAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 8,
    },
    targetAmountText: {
        marginLeft: 5,
        color: '#333333',
        fontWeight: '600',
    }
});