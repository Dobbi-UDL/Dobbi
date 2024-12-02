import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './FinancialDetails.styles';
import { truncateNumber } from '../../../../utils/numberFormatting';
import { Button } from '../../common/Button';
import { useRouter } from 'expo-router';

export const ListViewEntries = ({ 
    entries,
    handleNumberClick,
    handleEdit,
    handleAddEntry,
}) => {
    const router = useRouter();
    return (
        <View style={styles.entriesContainer}>
            {entries.map((entry) => (
                <TouchableOpacity 
                    key={entry.id} 
                    style={styles.entryRow} 
                    onPress={() => handleEdit(entry)}
                >
                    <Text style={styles.entryName}>{entry.name}</Text>
                    <TouchableOpacity onPress={() => handleNumberClick(entry.amount)}>
                        <Text style={styles.entryAmount}>${truncateNumber(entry.amount)}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
            <View style={styles.buttons}>
                <Button
                    title="Add Entry"
                    variant="outline"
                    onPress={() => handleAddEntry(entries.category_id)}
                    style={styles.addEntryButton}
                />
            </View>
        </View>
    );
};
