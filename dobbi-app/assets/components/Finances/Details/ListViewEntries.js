import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './FinancialDetails.styles';
import { truncateNumber } from '../../../../utils/numberFormatting';
import { Button } from '../../common/Button';
export const ListViewEntries = ({ 
    entries,
    handleNumberClick,
    handleEdit,
    handleAddEntry,
}) => (
    <View style={styles.entriesContainer}>
        {entries.map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
                <Text style={styles.entryName}>{entry.name}</Text>
                <TouchableOpacity onPress={() => handleNumberClick(entry.amount)}>
                    <Text style={styles.entryAmount}>${truncateNumber(entry.amount)}</Text>
                </TouchableOpacity>
            </View>
        ))}
        <View style={styles.buttons}>
            <Button
                title="Update"
                variant="primary"
                onPress={() => handleEdit(entries.category_id)}
                style={styles.updateButton}
            />
            <Button
                title="Add Entry"
                variant="outline"
                onPress={() => handleAddEntry(entries.category_id)}
                style={styles.addEntryButton}
            />
            
        </View>
    </View>
);

