import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/marketplace';
import Card from '../common/Card';
import { assignGoal } from '../../../services/goalService';
import { useAuth } from '../../../contexts/AuthContext';

export const ChallengeCard = ({ challenge }) => {
    const { user } = useAuth();
    // Función para formatear el monto como moneda
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
            // Opcional: puedes agregar acciones adicionales después de asignar
            console.log("Objetivo asignado exitosamente:", result);
        }
        } else {
        Alert.alert("Error", "No se pudo asignar el objetivo porque no hay un usuario válido.");
        }
    };


    return (
        <TouchableOpacity>
        <Card>
            {/* Header con el nombre de la compañía y los puntos de recompensa */}
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

            {/* Título y descripción del desafío */}
            <Text style={styles.cardTitle}>{challenge.title || 'Título no disponible'}</Text>
            <Text style={styles.cardDescription}>
            {challenge.description || 'Descripción no disponible'}
            </Text>

            {/* Información adicional del desafío */}
            <View style={styles.challengeInfo}>
            <View style={styles.infoItem}>
                <Icon name="cash" size={16} color="#666" />
                <Text style={styles.infoText}>
                Ahorro mensual: {formatCurrency(challenge.monthly_saving)}
                </Text>
            </View>
            <View style={styles.infoItem}>
                <Icon name="calendar" size={16} color="#666" />
                <Text style={styles.infoText}>
                Vence: {formatDate(challenge.expiring_date)}
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
