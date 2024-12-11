import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomModal } from '../../common/Modal';

export const SavingsRateModal = ({ visible, onClose }) => {

    const renderContent = () => {
        return (
            <View>
                <Text style={styles.contentTitle}>What is Savings Rate?</Text>
                <Text style={styles.contentText}>
                    Your savings rate is the percentage of your income that you’re saving instead of spending. It’s calculated as:
                </Text>
                <Text style={styles.formula}>Savings Rate = (Savings ÷ Income) × 100</Text>

                <Text style={styles.contentTitle}>Why It Matters</Text>
                <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Prepares you for unexpected expenses</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Helps achieve long-term goals</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Builds financial security</Text>
                    </View>
                </View>

                <Text style={styles.contentTitle}>Example Calculation</Text>
                <Text style={styles.contentText}>
                    If you earn $2,000 a month and save $400:
                </Text>
                <Text style={styles.formula}>(400 ÷ 2,000) × 100 = 20%</Text>
                <Text style={styles.contentText}>
                    You're saving 20% of your income!
                </Text>

                <Text style={styles.contentTitle}>What Your Rate Means</Text>
                <View style={styles.rateItem}>
                    <MaterialCommunityIcons name="emoticon-excited-outline" size={24} color="#4CAF50" />
                    <Text style={styles.rateText}>
                        <Text style={styles.bold}>20% or more - Excellent:</Text> Strong financial habits.
                    </Text>
                </View>
                <View style={styles.rateItem}>
                    <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#FFC107" />
                    <Text style={styles.rateText}>
                        <Text style={styles.bold}>10% to 20% - Good:</Text> You're on the right track.
                    </Text>
                </View>
                <View style={styles.rateItem}>
                    <MaterialCommunityIcons name="emoticon-neutral-outline" size={24} color="#FF9800" />
                    <Text style={styles.rateText}>
                        <Text style={styles.bold}>0% to 10% - Fair:</Text> Consider increasing your savings.
                    </Text>
                </View>
                <View style={styles.rateItem}>
                    <MaterialCommunityIcons name="emoticon-sad-outline" size={24} color="#F44336" />
                    <Text style={styles.rateText}>
                        <Text style={styles.bold}>Below 0% - Needs Attention:</Text> You're spending more than you earn.
                    </Text>
                </View>

                <Text style={styles.contentTitle}>Tips to Improve</Text>
                <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="arrow-up-bold" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Set a monthly savings goal</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="arrow-up-bold" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Track your expenses</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <MaterialCommunityIcons name="arrow-up-bold" size={20} color="#EE6567" />
                        <Text style={styles.bulletText}>Cut unnecessary costs</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            title="Understanding Your Savings Rate"
        >
            <View style={styles.content}>
                {renderContent()}
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    content: {
        // Remove width and margin styles to let the modal adjust to content
    },
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
    formula: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 16,
        color: '#EE6567',
        paddingHorizontal: 12,
    },
    rateItem: {
        flexDirection: 'row',
        alignItems: 'top',
        marginBottom: 10,
    },
    rateText: {
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
        color: '#555',
        textAlign: 'justify',
    },
    bold: {
        fontWeight: 'bold',
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
    },
    yourRateContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FFE3E3',
        borderRadius: 8,
        alignItems: 'center',
    },
    yourRateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#EE6567',
        marginBottom: 8,
    },
    yourRateSubtext: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});
