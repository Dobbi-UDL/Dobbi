import React from 'react';
import { View, Text, Button } from 'react-native';

export default function CompletionScreen({ onNext, onBack }) {
    return (
        <View>
        <Text>Thank you for completing the onboarding process!</Text>
        <Button title="Back" onPress={onBack} />
        <Button title="Finish" onPress={onNext} />
        </View>
    );
    }