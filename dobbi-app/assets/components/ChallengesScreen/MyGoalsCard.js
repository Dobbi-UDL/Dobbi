import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../common/Card';
import * as Progress from 'react-native-progress';
import i18n from '../../../i18n';
import GoalManagementMenu from './GoalManagementMenu';
import { styles } from '../../styles/challenges';

const MyGoalsCard = ({ goal, onStatusChange, onEdit, onAddMoney, isHighlighted }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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

    const calculateProgressPercentage = () => {
        if (!goal.target_amount || !goal.current_amount) return 0;
        return Math.min(goal.current_amount / goal.target_amount, 1);
    };

    const getGoalStatusColor = (status) => {
        switch (status) {
            case 'active': return '#4CAF50';   // Green
            case 'stopped': return '#FF9800';   // Orange
            case 'completed': return '#2196F3'; // Blue
            case 'failed': return '#F44336';    // Red
            case 'cancelled': return '#9E9E9E'; // Gray
            case 'pending': return '#FFC107';   // Amber
            default: return '#9E9E9E';          // Gray
        }
    };

    const getGoalStatusIcon = (status) => {
        switch (status) {
            case 'active': return 'progress-check';
            case 'stopped': return 'pause-circle';
            case 'completed': return 'trophy';
            case 'failed': return 'close-circle';
            case 'cancelled': return 'cancel';
            case 'pending': return 'clock-outline';
            default: return 'help-circle';
        }
    };

    const progressPercentage = calculateProgressPercentage();

    const handleStatusChange = (newStatus) => {
        onStatusChange(newStatus);
    };

    const handleAddMoney = () => {
        if (onAddMoney) {
            onAddMoney(goal);
        }
    };

    return (
        <Card style={[
            styles.card,
            { marginBottom: isMenuOpen ? 8 : 16 },
            isHighlighted && styles.highlightedCard // Añade el estilo de resaltado si es necesario
        ]}>
            <TouchableOpacity 
                onPress={toggleMenu}
                activeOpacity={0.8}
            >
                <View style={styles.container}>
                    {/* Header Section */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.titleText} numberOfLines={2}>
                            {goal.title || i18n.t('untitled_goal')}
                        </Text>
                        <View style={styles.rewardBadge}>
                            <Icon name="gift" size={16} color="#fff" />
                            <Text style={styles.rewardText}>
                                {goal.points_rewards || 0} {i18n.t('pts')}
                            </Text>
                        </View>
                    </View>

                    {/* Goal Progress Details */}
                    <View style={styles.progressContainer}>
                        <View style={styles.amountSection}>
                            <View>
                                <Text style={styles.currentAmountText}>
                                    {formatCurrency(goal.current_amount || 0)}
                                </Text>
                                <Text style={styles.targetAmountText}>
                                    {i18n.t('of')} {formatCurrency(goal.target_amount || 0)}
                                </Text>
                            </View>
                            <Text style={styles.progressPercentageText}>
                                {(progressPercentage * 100).toFixed(0)}%
                            </Text>
                        </View>

                        {/* Progress Bar */}
                        <Progress.Bar 
                            progress={progressPercentage}
                            width={null}
                            color="#ff6b6b"
                            unfilledColor="#e0e0e0"
                            borderWidth={0}
                            style={styles.progressBar}
                        />

                        {/* Goal Status and Additional Information */}
                        <View style={styles.goalInfoContainer}>
                            <View style={styles.dateContainer}>
                                <Icon name="calendar" size={16} color="#7f8c8d" />
                                <Text style={styles.dateText}>
                                    {i18n.t('ends_on')}: {formatDate(goal.end_date)}
                                </Text>
                            </View>
                            
                            {goal.goal_status && (
                                <View style={[
                                    styles.statusBadge, 
                                    { backgroundColor: getGoalStatusColor(goal.goal_status) }
                                ]}>
                                    <Icon 
                                        name={getGoalStatusIcon(goal.goal_status)} 
                                        size={16} 
                                        color="#ffffff" 
                                    />
                                    <Text style={styles.statusText}>
                                        {goal.goal_status}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            
            <GoalManagementMenu
                goal={goal}
                isOpen={isMenuOpen}
                onStatusChange={handleStatusChange}
                onEdit={!goal.is_sponsored ? onEdit : undefined}  // Solo pasar onEdit si no es patrocinado
                onAddMoney={handleAddMoney}
            />
        </Card>
    );
};

export default MyGoalsCard;
