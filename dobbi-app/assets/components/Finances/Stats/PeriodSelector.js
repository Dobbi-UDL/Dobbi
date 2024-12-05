import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        <View style={styles.mainContainer}>
            <TouchableOpacity style={styles.downloadChip}>
                <Icon name="download" size={16} color="#EE6567" />
                <Text style={styles.downloadChipText}>Export</Text>
            </TouchableOpacity>
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
        </View>
    );
};

// Styles for grey chips and pink selected chip
const unselectedChipBackground = '#f5f5f5';
const unselectedChipBorder = '#e5e5e5';

const styles1 = StyleSheet.create({
    container: {
        maxWidth: '100%',
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center', // Center chips vertically
        height: '100%', // Take full height of container
    },
    chip: {
        backgroundColor: unselectedChipBackground,
        borderColor: unselectedChipBorder,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginHorizontal: 5,
        marginVertical: 5,
        borderWidth: 1,
        
        height: 36, // Fixed height instead of minHeight
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedChip: {
        backgroundColor: '#FFE9E9',
        borderColor: '#EE6567',
    },
    chipText: {
        fontSize: 14,
        lineHeight: 20, // Add explicit line height
        fontWeight: '500',
        color: '#666666',
        textAlign: 'center', // Center text
        textAlignVertical: 'center',
    },
    selectedChipText: {
        color: '#EE6567',
    }
});


    // Styles for white chips and red selected chip
const styles2 = StyleSheet.create({
    container: {
        maxWidth: '100%',
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center', // Center chips vertically
        height: '100%', // Take full height of container
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
        shadowColor: '#000',
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
    downloadChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE9E9',
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 8, // Adjust spacing between export button and scrolling chips
        marginHorizontal: 5,
        marginVertical: 5,
        height: 36,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EE6567',
    },
    downloadChipText: {
        fontSize: 14,
        color: '#EE6567',
        fontWeight: '500',
        marginLeft: 4,
    },
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingRight: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
});

const styles = styles2;