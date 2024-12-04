
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomModal } from '../../common/Modal';

export const ComparisonExplanationModal = ({ visible, onClose, currentTotal, previousTotal, percentageChange }) => {
    const isIncrease = percentageChange > 0;

    const renderContent = () => {
        return (
            <View>
                <Text style={styles.contentTitle}>What Does This Chart Show?</Text>
                <Text style={styles.contentText}>
                    This chart compares your expenses over two different time periods: your current period and the previous period.
                    {'\n\n'}
                    Your current period is the one you selected, while the previous period is the one immediately before it.
                    {'\n\n'}
                    For instance, if you selected 'January 2024 to February 2024', the chart will compare these expenses to those from 'November 2023 to December 2023'.
                </Text>

                <Text style={styles.contentTitle}>Interpreting the Chart</Text>
                <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="square" size={20} color="#4CAF50" />
                        <Text style={styles.bulletText}>Green bars represent your current period expenses.</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="square" size={20} color="#2196F3" />
                        <Text style={styles.bulletText}>Blue bars represent your previous period expenses.</Text>
                    </View>
                </View>

                <Text style={styles.contentTitle}>Analysis Tips</Text>
                <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="arrow-right" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Identify categories with significant changes in spending.</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="arrow-right" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Look for seasonal spending patterns.</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="arrow-right" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Focus on categories with unexpected increases.</Text>
                    </View>
                </View>

                <Text style={styles.contentTitle}>Actionable Steps</Text>
                <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Set budget limits for categories where spending increased.</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Maintain or further reduce spending in categories where it decreased.</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Plan ahead for expected seasonal changes in spending.</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            title="Understanding Your Expense Comparison"
        >
            {renderContent()}
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        marginTop: 16,
    },
    contentText: {
        fontSize: 16,
        marginBottom: 16,
        color: '#555',
        textAlign: 'justify',
    },
    bulletList: {
        marginBottom: 16,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bulletText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#555',
        flex: 1,
    },
    statusContainer: {
        backgroundColor: '#FFF5F5',
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 4,
        borderRadius: 8,
        marginBottom: 16,
    },
});