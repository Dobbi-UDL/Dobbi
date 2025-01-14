import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../common/Button';
import { Picker } from '@react-native-picker/picker';
import { SearchablePicker } from '../common/SearchablePicker';
import { locationService } from '../../../services/locationService';

export default function PersonalInfoScreen2({ onNext, onBack, currentStep = 3, totalSteps = 6 }) {
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        const data = await locationService.getAvailableCountries();
        setCountries(data);
    };

    const handleCountrySearch = async (searchTerm) => {
        const data = await locationService.searchCountries(searchTerm);
        setCountries(data);
    };

    const handleRegionSearch = async (searchTerm) => {
        if (!selectedCountry) return;
        const data = await locationService.searchRegions(searchTerm, selectedCountry.id);
        setRegions(data);
    };

    const handleCountrySelect = async (country) => {
        setSelectedCountry(country);
        setSelectedRegion(null);
        // Load all regions for the selected country immediately
        if (country) {
            const data = await locationService.searchRegions('', country.id);
            setRegions(data);
        } else {
            setRegions([]);
        }
    };

    const handleNext = () => {
        onNext();
    };

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headline}>A Few Quick Details</Text>
                    <Text style={styles.subheadline}>
                        This helps us create a better experience for you
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    {/* Age */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>What is your age?</Text>
                        <View style={styles.pickerContainer}>
                            <Picker style={styles.picker}>
                                <Picker.Item label="Select age" value="" />
                                <Picker.Item label="18-24" value="18-24" />
                                <Picker.Item label="25-34" value="25-34" />
                                <Picker.Item label="35-44" value="35-44" />
                                <Picker.Item label="45-54" value="45-54" />
                                <Picker.Item label="55-64" value="55-64" />
                                <Picker.Item label="65+" value="65+" />
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

                    {/* Country Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Where are you located?</Text>
                        <SearchablePicker
                            placeholder="Select country"
                            value={selectedCountry?.name}
                            items={countries}
                            onSearch={handleCountrySearch}
                            onSelect={handleCountrySelect}
                        />
                    </View>

                    {/* Region Selection */}
                    {selectedCountry && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Select your region</Text>
                            <SearchablePicker
                                placeholder="Select region"
                                value={selectedRegion?.name}
                                items={regions}
                                onSearch={handleRegionSearch}
                                onSelect={setSelectedRegion}
                            />
                        </View>
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
                        onPress={handleNext}
                        variant="primary"
                        size="lg"
                        style={styles.nextButton}
                    />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
