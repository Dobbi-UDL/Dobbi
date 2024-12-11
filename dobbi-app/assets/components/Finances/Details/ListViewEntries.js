import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './FinancialDetails.styles';
import { formatCurrency } from '../../../../utils/numberHelpers';
import { Button } from '../../common/Button';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const EmptyEntries = ({ onAdd }) => (
    <View style={styles.emptyEntriesContainer}>
        <Text style={styles.emptyEntriesText}>
            No entries yet
        </Text>
        <Button
            title="Add"
            variant="outline"
            onPress={onAdd}
            style={styles.addEntryButton}
        />
    </View>
);

export const ListViewEntries = ({ 
    entries,
    handleEdit,
    handleAddEntry,
}) => {
    const router = useRouter();
    return (
        <View style={styles.entriesContainer}>
            {entries.length > 0 ? (
                <>
                    {entries.map((entry) => (
                        <TouchableOpacity 
                            key={entry.id} 
                            style={styles.entryRow} 
                            onPress={() => handleEdit(entry)}
                        >
                            <Text style={styles.entryName}>{entry.name}</Text>
                            <Text style={styles.entryAmount}>{formatCurrency(entry.amount || 0)}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.buttons}>
                        <Button
                            title="Add Entry"
                            variant="outline"
                            onPress={handleAddEntry}
                            style={styles.addEntryButton}
                        />
                    </View>
                </>
            ) : (
                <EmptyEntries onAdd={handleAddEntry} />
            )}
        </View>
    );
};
