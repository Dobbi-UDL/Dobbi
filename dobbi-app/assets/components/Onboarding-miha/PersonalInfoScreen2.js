import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../common/Button';
import { Picker } from '@react-native-picker/picker';
import { SearchablePicker } from '../common/SearchablePicker';
import { locationService } from '../../../services/locationService';
import { CustomPicker } from '../common/CustomPicker';
import { MaterialIcons } from '@expo/vector-icons';
import { DatePicker } from '../common/DatePicker';

export default function PersonalInfoScreen2({ onNext, onBack, data, onDataUpdate, currentStep = 3, totalSteps = 6 }) {
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(data?.country || null);
    const [selectedRegion, setSelectedRegion] = useState(data?.region || null);
    const [age, setAge] = useState(data?.age || '');
    const [gender, setGender] = useState(data?.gender || '');
    const [education, setEducation] = useState(data?.education || '');
    const [birthday, setBirthday] = useState(data?.birthday || null);

    // Update parent state when any selection changes
    useEffect(() => {
        onDataUpdate('personal2', {
            birthday,
            gender,
            education,
            country: selectedCountry,
            region: selectedRegion
        });
    }, [birthday, gender, education, selectedCountry, selectedRegion]);

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

    const AGE_OPTIONS = [
        { value: '18-24', label: '18-24' },
        { value: '25-34', label: '25-34' },
        { value: '35-44', label: '35-44' },
        { value: '45-54', label: '45-54' },
        { value: '55-64', label: '55-64' },
        { value: '65+', label: '65+' },
        { value: 'prefer_not_to_say', label: 'Prefer not to say' }
    ];

    const GENDER_OPTIONS = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'non_binary', label: 'Non-binary' },
        { value: 'prefer_not_to_say', label: 'Prefer not to say' }
    ];

    const EDUCATION_OPTIONS = [
        { value: 'high_school', label: 'High School' },
        { value: 'bachelors', label: "Bachelor's Degree" },
        { value: 'masters', label: "Master's Degree" },
        { value: 'doctorate', label: 'Doctorate' },
        { value: 'other', label: 'Other' },
        { value: 'prefer_not_to_say', label: 'Prefer not to say' }
    ];

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
                    <DatePicker
                        label="When is your birthday?"
                        value={birthday}
                        onChange={setBirthday}
                    />

                    <CustomPicker
                        label="What is your gender?"
                        defaultIcon="person"
                        placeholder="Select gender"
                        options={GENDER_OPTIONS}
                        value={gender}
                        onSelect={(option) => setGender(option.value)}
                    />

                    <CustomPicker
                        label="What is your highest level of education?"
                        defaultIcon="school"
                        placeholder="Select education level"
                        options={EDUCATION_OPTIONS}
                        value={education}
                        onSelect={(option) => setEducation(option.value)}
                    />

                    {/* Country Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Where are you located?</Text>
                        <SearchablePicker
                            placeholder="Select country"
                            value={selectedCountry?.name}
                            items={countries}
                            onSearch={handleCountrySearch}
                            onSelect={handleCountrySelect}
                            icon="public"
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
                                icon="location-on"
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
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    labelIcon: {
        marginTop: 2,
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        overflow: 'hidden',
        height: 50,
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
