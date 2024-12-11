import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const PeriodSelector = ({ selectedPeriod, onSelectPeriod }) => {
    const periods = [
        { id: 'thisMonth', label: 'This Month' },
        { id: 'lastMonth', label: 'Last Month' },
        { id: 'last3Months', label: 'Last 3 Months' },
        { id: 'last6Months', label: 'Last 6 Months' },
        { id: 'yearToDate', label: 'Year to Date' },
        { id: 'lastYear', label: 'Last Year' },
        { id: 'customRange', label: 'Custom Range' },
    ];

    return (
        
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {periods.map((period) => (
                    <TouchableOpacity
                        key={period.id}
                        style={[
                            styles.chip,
                            selectedPeriod === period.id && styles.selectedChip
                        ]}
                        onPress={() => onSelectPeriod(period.id)}
                    >
                        <Text style={[
                            styles.chipText,
                            selectedPeriod === period.id && styles.selectedChipText
                        ]}>
                            {period.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center', // Center chips vertically
        height: '100%', // Take full height of container
        paddingRight: 16,
    },
    chip: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginHorizontal: 5,
        marginVertical: 5,
        height: 36, // Fixed height instead of minHeight
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#d76567',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1.2,
    },
    selectedChip: {
        backgroundColor: '#EE6567',
    },
    chipText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center', // Center text
        textAlignVertical: 'center',
    },
    selectedChipText: {
        color: 'white',
        fontWeight: 'bold',
    },
});