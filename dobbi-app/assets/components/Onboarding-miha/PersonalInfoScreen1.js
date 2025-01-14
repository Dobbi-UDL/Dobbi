import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../common/Button';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated } from 'react-native';

export default function PersonalInfoScreen1({ onNext, onBack, data, onDataUpdate, currentStep = 2, totalSteps = 6 }) {
    const [selectedRole, setSelectedRole] = useState(data?.role || null);

    // Update parent state when selection changes
    useEffect(() => {
        onDataUpdate('personal1', { role: selectedRole });
    }, [selectedRole]);

    const roles = [
        { 
            id: 'student',
            title: 'Student & Graduate',
            icon: 'school',
            description: 'Managing student life, part-time work, or starting your first job. Focus on building good financial habits.'
        },
        { 
            id: 'early_career',
            title: 'Young Professional',
            icon: 'work',
            description: 'Building your career, planning first major purchases, and learning about investments.'
        },
        { 
            id: 'family',
            title: 'Family & Home',
            icon: 'family-restroom',
            description: 'Balancing family expenses, planning for the future, and managing household finances.'
        },
        { 
            id: 'professional',
            title: 'Established Professional',
            icon: 'business-center',
            description: 'Growing wealth, optimizing investments, and planning long-term financial strategies.'
        }
    ];

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.content, { paddingTop: 20 }]}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headline}>Tell Us About Yourself</Text>
                        <Text style={styles.subheadline}>
                            Pick the option that best matches your journey
                        </Text>
                    </View>

                    <View style={styles.selectionContainer}>
                        <View style={styles.rolesGrid}>
                            {roles.map((role) => (
                                <TouchableOpacity
                                    key={role.id}
                                    style={[
                                        styles.roleCard,
                                        selectedRole === role.id && styles.roleCardSelected
                                    ]}
                                    onPress={() => setSelectedRole(role.id)}
                                >
                                    <MaterialIcons 
                                        name={role.icon} 
                                        size={32} 
                                        color={selectedRole === role.id ? '#EE6567' : '#666666'} 
                                    />
                                    <Text style={[
                                        styles.roleTitle,
                                        selectedRole === role.id && styles.roleTitleSelected
                                    ]}>
                                        {role.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedRole && (
                            <Animated.View style={styles.descriptionWrapper}>
                                <MaterialIcons 
                                    name="info-outline" 
                                    size={16} 
                                    color="#666666" 
                                    style={styles.infoIcon}
                                />
                                <Text style={styles.descriptionText}>
                                    {roles.find(r => r.id === selectedRole)?.description}
                                </Text>
                            </Animated.View>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Back"
                            onPress={onBack}
                            variant="text"
                            style={styles.backButton}
                        />
                        <Button
                            title="Next"
                            onPress={onNext}
                            variant="primary"
                            size="lg"
                            style={[
                                styles.nextButton,
                                !selectedRole && styles.nextButtonDisabled
                            ]}
                            disabled={!selectedRole}
                        />
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 20,
    },
    headerContainer: {
        marginBottom: 32,
    },
    headline: {
        fontSize: 30,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subheadline: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
    },
    selectionContainer: {
        marginBottom: 24,
    },
    rolesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 8,
    },
    roleCard: {
        width: '48.5%', // Match MotivationScreen card width
        aspectRatio: undefined, // Remove to match other screens
        height: 120,
        borderRadius: 12, // Match common border radius
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E5E5E5',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    roleCardSelected: {
        borderColor: '#EE6567',
        backgroundColor: '#FFF5F5',
    },
    roleTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
        textAlign: 'center',
        lineHeight: 18,
    },
    roleTitleSelected: {
        color: '#EE6567',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    backButton: {
        flex: 1,
        marginRight: 12,
    },
    nextButton: {
        flex: 2,
        borderRadius: 24,
        shadowColor: '#d76567',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
    descriptionWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
        marginTop: 8,
    },
    infoIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    descriptionText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: '#666666',
        textAlign: 'left',
    },
});
