import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const PeriodSelector = ({ selectedPeriod, onSelectPeriod }) => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleExport = (fileType) => {
        // Handle export logic here
        setShowExportMenu(false);
    };

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
            <View>
                <TouchableOpacity 
                    style={styles.downloadChip}
                    onPress={() => setShowExportMenu(true)}
                >
                    <Icon name="download" size={16} color="#EE6567" />
                    <Text style={styles.downloadChipText}>Export</Text>
                </TouchableOpacity>

                <Modal
                    transparent
                    visible={showExportMenu}
                    onRequestClose={() => setShowExportMenu(false)}
                    animationType="fade"
                >
                    <Pressable 
                        style={styles.modalOverlay}
                        onPress={() => setShowExportMenu(false)}
                    >
                        <View style={styles.exportMenu}>
                            <TouchableOpacity 
                                style={styles.exportOption}
                                onPress={() => handleExport('csv')}
                            >
                                <Icon name="file-delimited" size={20} color="#666666" />
                                <Text style={styles.exportOptionText}>Export as CSV</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.exportOption}
                                onPress={() => handleExport('pdf')}
                            >
                                <Icon name="file-pdf-box" size={20} color="#666666" />
                                <Text style={styles.exportOptionText}>Export as PDF</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
            </View>

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

const styles = StyleSheet.create({
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    exportMenu: {
        backgroundColor: 'white',
        marginTop: 140,
        marginHorizontal: 16,
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    exportOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 4,
    },
    exportOptionText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#666666',
    },
    scrollContent: {
        paddingRight: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
});