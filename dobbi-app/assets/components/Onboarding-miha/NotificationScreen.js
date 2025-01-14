import React from 'react';
import { View, Text, Button } from 'react-native';

export default function NotificationScreen({ onNext, onBack }) {
    return (
        <View>
            <Text>Enable notifications</Text>
            <Button title="Next" onPress={onNext} />
            <Button title="Back" onPress={onBack} />
        </View>
    );
}