import React from 'react';
import { View, Text, Button } from 'react-native';

export default function FinancialContextScreen({ onNext, onBack }) {
    return (
        <View>
            <Text>Financial Context</Text>
            <Button title="Next" onPress={onNext} />
            <Button title="Back" onPress={onBack} />
        </View>
    );
}