import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../common/Button';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomCheckbox } from '../common/CustomCheckbox';

export default function PersonalInfoScreen1({ onNext, onBack, currentStep = 2, totalSteps = 6 }) {
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    const handleNext = () => {
        if (!privacyAccepted) {
            // Show error message or toast
            return;
        }
        onNext();
    };

    return (
    <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={[styles.content, { paddingTop: 20 }]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headline}>Basic Information</Text>
                    <Text style={styles.subheadline}>
                        First, let's get to know you better
                    </Text>
                </View>
                <View style={styles.formContainer}>
                            {/* Age Range */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>What is your age range?</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker style={styles.picker}>
                                        <Picker.Item label="Select age range" value="" />
                                        <Picker.Item label="18-24" value="18-24" />
                                        <Picker.Item label="25-34" value="25-34" />
                                        <Picker.Item label="35-44" value="35-44" />
                                        <Picker.Item label="45-54" value="45-54" />
                                        <Picker.Item label="55+" value="55+" />
                                        <Picker.Item label="Prefer not to say" value="prefer_not_to_say" />
                                    </Picker>
                                </View>
                            </View>
    
                            {/* Gender */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>What is your gender?</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker style={styles.picker}>
                                        <Picker.Item label="Select gender" value="" />
                                        <Picker.Item label="Male" value="male" />
                                        <Picker.Item label="Female" value="female" />
                                        <Picker.Item label="Non-binary" value="non_binary" />
                                        <Picker.Item label="Prefer not to say" value="prefer_not_to_say" />
                                    </Picker>
                                </View>
                            </View>
    
                            {/* Employment Status */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>What is your employment status?</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker style={styles.picker}>
                                        <Picker.Item label="Select employment status" value="" />
                                        <Picker.Item label="Employed Full-Time" value="full_time" />
                                        <Picker.Item label="Employed Part-Time" value="part_time" />
                                        <Picker.Item label="Self-Employed" value="self_employed" />
                                        <Picker.Item label="Student" value="student" />
                                        <Picker.Item label="Unemployed" value="unemployed" />
                                        <Picker.Item label="Retired" value="retired" />
                                    </Picker>
                                </View>
                            </View>
    
                            <View style={styles.privacySection}>
                                <View style={styles.privacyNotice}>
                                    <MaterialIcons name="security" size={20} color="#666666" />
                                    <Text style={styles.privacyText}>
                                        Your privacy is important to us. All data is encrypted and stored securely.
                                    </Text>
                                </View>
    
                                <View style={styles.privacyCheckbox}>
                                    <CustomCheckbox
                                        value={privacyAccepted}
                                        onValueChange={setPrivacyAccepted}
                                        tintColors={{ true: '#EE6567', false: '#666666' }}
                                    />
                                    <Text style={styles.checkboxLabel}>
                                        I agree to the processing of my personal data as described in the{' '}
                                        <Text style={styles.privacyLink}>Privacy Policy</Text>
                                    </Text>
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
                                style={[
                                    styles.nextButton,
                                    !privacyAccepted && styles.nextButtonDisabled
                                ]}
                                disabled={!privacyAccepted}
                            />
                        </View>
                    </View >
                </ScrollView >
            </LinearGradient >
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
    privacySection: {
        marginTop: 24,
        marginBottom: 32,
    },
    privacyNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    privacyCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    checkboxLabel: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
    privacyText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 8,
        flex: 1,
    },
    privacyLink: {
        color: '#EE6567',
        textDecorationLine: 'underline',
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
});
