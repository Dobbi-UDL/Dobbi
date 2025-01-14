import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../../i18n';
import { styles } from '../../styles/challenges';

const GoalManagementMenu = ({ goal, isOpen, onStatusChange, onEdit, onAddMoney }) => {
    if (!isOpen) return null;

    const getActionButtons = (status) => {
        const buttons = [];
        
        // Solo mostrar acciones si el objetivo no está en un estado final
        if (!['completed', 'cancelled', 'failed'].includes(status)) {
            switch (status) {
                case 'pending':
                    buttons.push({
                        icon: 'play',
                        color: '#4CAF50',
                        label: i18n.t('activate'),
                        action: () => onStatusChange('active')
                    });
                    break;
                case 'active':
                    buttons.push({
                        icon: 'pause',
                        color: '#FF9800',
                        label: i18n.t('pause'),
                        action: () => onStatusChange('stopped')
                    });
                    if (typeof onAddMoney === 'function') {
                        buttons.push({
                            icon: 'cash',
                            color: '#4CAF50',
                            label: i18n.t('add_money'),
                            action: onAddMoney
                        });
                    }
                    break;
                case 'stopped':
                    buttons.push({
                        icon: 'play',
                        color: '#4CAF50',
                        label: i18n.t('resume'),
                        action: () => onStatusChange('active')
                    });
                    break;
            }

            if (['pending', 'active', 'stopped'].includes(status)) {
                buttons.push({
                    icon: 'close',
                    color: '#F44336',
                    label: i18n.t('cancel'),
                    action: () => onStatusChange('cancelled')
                });
            }

            // Solo añadir el botón de editar si no es un objetivo patrocinado
            if (!goal.is_sponsored) {
                buttons.push({
                    icon: 'pencil',
                    color: '#2196F3',
                    label: i18n.t('edit'),
                    action: onEdit
                });
            }
        }

        return buttons;
    };

    const actions = getActionButtons(goal.goal_status);

    return (
        <View style={styles.menuContainer}>
            <View style={styles.actionStrip}>
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.actionWrapper}
                        onPress={action.action}
                    >
                        <View style={[styles.iconButton, { backgroundColor: action.color }]}>
                            <Ionicons name={action.icon} size={20} color="#fff" />
                        </View>
                        <Text style={styles.actionLabel}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default GoalManagementMenu;