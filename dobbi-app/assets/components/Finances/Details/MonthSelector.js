import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MonthYearPickerModal } from './MonthYearPickerModal';

export const MonthSelector = ({ onMonthChange, onStatsPress, issuesCount, onIssuesPress, isSnoozed, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
    const [showPicker, setShowPicker] = useState(false);

    // Update when selectedDate prop changes
    useEffect(() => {
        if (selectedDate && selectedDate.getTime() !== currentDate.getTime()) {
            setCurrentDate(selectedDate);
        }
    }, [selectedDate]);

    const formatMonth = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(newDate);
        onMonthChange?.(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(newDate);
        onMonthChange?.(newDate);
    };

    const handleMonthPress = () => {
        setShowPicker(true);
    };

    const handleDateSelected = (date) => {
        setCurrentDate(date);
        onMonthChange?.(date);
    };

    return (
        <View style={styles.container}>
            {/* Left side */}
            <View style={styles.sideContainer}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={issuesCount ? onIssuesPress : undefined}
                >
                    <Ionicons
                        name="alert-circle-outline"
                        size={24}
                        color={issuesCount ? (isSnoozed ? "#E9B4B5" : "#CC0000") : "#E9B4B5"}
                    />
                    {issuesCount > 0 && (
                        <View style={[styles.badge, isSnoozed && styles.badgeSnoozed]}>
                            <Text style={styles.badgeText}>{issuesCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Center - Month Controls */}
            <View style={styles.monthControls}>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={handlePrevMonth}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <Ionicons name="chevron-back" size={24} color="#E9B4B5" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.monthSelector} onPress={handleMonthPress}>
                    <Text style={styles.monthText}>{formatMonth(currentDate)}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#666" style={styles.calendarIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={handleNextMonth}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <Ionicons name="chevron-forward" size={24} color="#E9B4B5" />
                </TouchableOpacity>
            </View>

            {/* Right side */}
            <View style={styles.sideContainer}>
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={onStatsPress}
                >
                    <Ionicons name="stats-chart" size={24} color="#f66c72" />
                </TouchableOpacity>
            </View>

            <MonthYearPickerModal
                visible={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={handleDateSelected}
                initialDate={currentDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    sideContainer: {
        width: 40,  // Fixed width to maintain layout
        alignItems: 'center',
    },
    placeholder: {
        width: 24,  // Same as icon size
        height: 24,
    },
    monthControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'center',  // Center the month selector
    },
    arrowButton: {
        padding: 8,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        shadowColor: '#EE6567',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    monthText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1C1C1E',
        marginRight: 8,
    },
    calendarIcon: {
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#CC0000',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeSnoozed: {
        backgroundColor: '#E9B4B5',
    },
    iconButtonHidden: {
        opacity: 0.3,  // Makes the button visible but subtle when there are no issues
    },
});

