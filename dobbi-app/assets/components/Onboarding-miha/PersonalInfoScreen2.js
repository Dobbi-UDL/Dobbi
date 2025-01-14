import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../common/Button';
import { Picker } from '@react-native-picker/picker';

export default function PersonalInfoScreen2({ onNext, onBack, currentStep = 3, totalSteps = 6 }) {
    const handleNext = () => {
        onNext();
    };

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.content, { paddingTop: 20 }]}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headline}>Location & Education</Text>
                        <Text style={styles.subheadline}>
                            Help us understand your background
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Education */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>What is your highest level of education?</Text>
                            <View style={styles.pickerContainer}>
                                <Picker style={styles.picker}>
                                    <Picker.Item label="Select education level" value="" />
                                    <Picker.Item label="High School" value="high_school" />
                                    <Picker.Item label="Bachelor's Degree" value="bachelors" />
                                    <Picker.Item label="Master's Degree" value="masters" />
                                    <Picker.Item label="Doctorate" value="doctorate" />
                                    <Picker.Item label="Other" value="other" />
                                    <Picker.Item label="Prefer not to say" value="prefer_not_to_say" />
                                </Picker>
                            </View>
                        </View>

                        {/* Country */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Which country do you live in?</Text>
                            <View style={styles.pickerContainer}>
                                <Picker style={styles.picker}>
                                    <Picker.Item label="Select country" value="" />
                                    <Picker.Item label="United States" value="us" />
                                    <Picker.Item label="United Kingdom" value="uk" />
                                    <Picker.Item label="Canada" value="ca" />
                                    {/* Add more countries as needed */}
                                </Picker>
                            </View>
                        </View>

                        {/* City */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Which city do you live in?</Text>
                            <View style={styles.pickerContainer}>
                                <Picker style={styles.picker}>
                                    <Picker.Item label="Select city" value="" />
                                    {/* Cities will be populated based on selected country */}
                                </Picker>
                            </View>
                        </View>
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
                            onPress={handleNext}
                            variant="primary"
                            size="lg"
                            style={styles.nextButton}
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
        paddingTop: 20, // Reduced from 100
    },
    headerContainer: {
        marginBottom: 32,
    },
    headline: {
        fontSize: 32,
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
    formContainer: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
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
    }
});
