import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './FinancialDetails.styles';
import { truncateNumber } from '../../../../utils/numberFormatting';

export const ListViewEntries = ({ entries }) => (
    <View style={styles.entriesContainer}>
        {entries.map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
                <Text style={styles.entryName}>{entry.name}</Text>
                <Text style={styles.entryAmount}>${truncateNumber(entry.amount)}</Text>
            </View>
        ))}
    </View>
);

