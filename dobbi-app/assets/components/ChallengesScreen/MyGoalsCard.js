import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../common/Card';
import * as Progress from 'react-native-progress';
import i18n from '../../../i18n';

export const MyGoalsCard = ({ goal }) => {
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

    return (
        <TouchableOpacity style={localStyles.container}>
            <Card style={localStyles.card}>
                {/* Header Section */}
                <View style={localStyles.headerContainer}>
                    <Text style={localStyles.titleText} numberOfLines={2}>
                        {goal.title || i18n.t('untitled_goal')}
                    </Text>
                    <View style={localStyles.rewardBadge}>
                        <Icon name="gift" size={16} color="#fff" />
                        <Text style={localStyles.rewardText}>
                            {goal.points_rewards || 0} {i18n.t('pts')}
                        </Text>
                    </View>
                </View>

                {/* Goal Progress Details */}
                <View style={localStyles.progressContainer}>
                    <View style={localStyles.amountSection}>
                        <View>
                            <Text style={localStyles.currentAmountText}>
                                {formatCurrency(goal.current_amount || 0)}
                            </Text>
                            <Text style={localStyles.targetAmountText}>
                                {i18n.t('of')} {formatCurrency(goal.target_amount || 0)}
                            </Text>
                        </View>
                        <Text style={localStyles.progressPercentageText}>
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
                        style={localStyles.progressBar}
                    />

                    {/* Goal Status and Additional Information */}
                    <View style={localStyles.goalInfoContainer}>
                        <View style={localStyles.dateContainer}>
                            <Icon name="calendar" size={16} color="#7f8c8d" />
                            <Text style={localStyles.dateText}>
                                {i18n.t('ends_on')}: {formatDate(goal.end_date)}
                            </Text>
                        </View>
                        
                        {goal.goal_status && (
                            <View style={[
                                localStyles.statusBadge, 
                                { backgroundColor: getGoalStatusColor(goal.goal_status) }
                            ]}>
                                <Icon 
                                    name={getGoalStatusIcon(goal.goal_status)} 
                                    size={16} 
                                    color="#ffffff" 
                                />
                                <Text style={localStyles.statusText}>
                                    {goal.goal_status}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    goalInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
        textTransform: 'capitalize',
    }, 
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
        padding: 0,
        overflow: 'hidden',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        flex: 1,
        marginRight: 10,
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
    progressContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    amountSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    currentAmountText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    targetAmountText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    progressPercentageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff6b6b',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginBottom: 12,
    },
    goalInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#7f8c8d',
    },
});
