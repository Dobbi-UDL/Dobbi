import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { useAuth } from '../../../../contexts/AuthContext';
import { CustomModal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { styles } from './FinancialDetails.styles';
import i18n from '../../../../i18n';
import { fetchCategories, fetchEntries, addEntry, editEntry, deleteEntry } from '../../../../services/financesService';
import { CategoryHeader } from './CategoryHeader';
import { formatCurrency } from '../../../../utils/numberHelpers';
import { AddEntryForm } from './AddEntryForm';
import { EditEntryForm } from './EditEntryForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonthSelector } from './MonthSelector';

export default function FinancialDetails() {
    const router = useRouter();
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [financialData, setFinancialData] = useState({ income: [], expenses: [] });

    const [expandedCategory, setExpandedCategory] = useState(null);
    

    const [addEntryModalVisible, setAddEntryModalVisible] = useState(false);
    const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false);

    const [preselectedCategory, setPreselectedCategory] = useState(null);
    const [entryToEdit, setEntryToEdit] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataErrors, setDataErrors] = useState([]);
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [allIssuesResolved, setAllIssuesResolved] = useState(false);

    // Replace archivedErrors with snoozedUntil
    const [snoozedUntil, setSnoozedUntil] = useState(null);
    const [showSnoozeSuccess, setShowSnoozeSuccess] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportComment, setReportComment] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [reportReference, setReportReference] = useState('');

    const [reportedIssues, setReportedIssues] = useState(new Set());

    // Load reported issues from storage
    useEffect(() => {
        loadReportedIssues();
    }, []);

    const loadReportedIssues = async () => {
        try {
            const saved = await AsyncStorage.getItem('reportedIssues');
            if (saved) {
                setReportedIssues(new Set(JSON.parse(saved)));
            }
        } catch (error) {
            console.error('Error loading reported issues:', error);
        }
    };

    const formatSnoozeTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = Date.now();
        const diffHours = Math.round((timestamp - now) / (1000 * 60 * 60));

        if (diffHours < 24) {
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        
        loadFinancialData(); 
        
    }, [user]);

    const loadFinancialData = async () => {
        try{
            let fetchedCategories = categories;
            if(categories.length === 0) {
                fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            }

            const entries = await fetchEntries(user.id);
            const { expenseCategories, incomeCategories } = sortEntriesIntoCategories(fetchedCategories, entries);

            setFinancialData({ income: incomeCategories, expenses: expenseCategories });
            setLoading(false);
        } catch (error) {
            console.error("Error loading financial data: ", error);
            setLoading(false);
        }   
    };

    const sortEntriesIntoCategories = (categories, entries) => {
        // Log invalid entries
        const invalidEntries = entries.filter(entry => 
            (!entry || !entry.id || entry.amount === null || !entry.name) &&
            !reportedIssues.has(entry?.id)
        );
        
        if (invalidEntries.length > 0) {
            console.warn('Found invalid entries:', invalidEntries);
            invalidEntries.forEach(entry => {
                console.log('Invalid entry details:', {
                    id: entry?.id,
                    name: entry?.name,
                    amount: entry?.amount,
                    category_id: entry?.category_id
                });
            });
            setDataErrors(invalidEntries);
        }

        // Filter out invalid entries
        const validEntries = entries.filter(entry => 
            entry && entry.id && entry.amount !== null && entry.name
        );

        const categoriesWithEntries = categories.map((category) => ({
            ...category,
            total: 0,
            entries: [],
        }));
        
        validEntries.forEach((entry) => {
            const category = categoriesWithEntries.find((cat) => cat.id === entry.category_id);
            if (category) {
                category.total += entry.amount;
                category.entries.push(entry);
            }
        });

        const expenseCategories = categoriesWithEntries.filter((category) => category.type === 'expense' && category.entries.length > 0);
        const incomeCategories = categoriesWithEntries.filter((category) => category.type === 'income' && category.entries.length > 0);

        return { expenseCategories, incomeCategories };
    };

    const handleStats = () => {
        router.push('/stats');
    };
    

    const handleAddEntry = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        setPreselectedCategory(category);
        setAddEntryModalVisible(true);
    };

    const handleFloatingButtonPress = () => {
        setPreselectedCategory(null);
        setAddEntryModalVisible(true);
    };

    const handleEdit = async (entry) => {
        if (!entry || !entry.id) {
            console.warn("Invalid entry detected");
            return;
        }
        
        // Remove the entry from dataErrors before editing
        setDataErrors(prev => prev.filter(e => e.id !== entry.id));
        setEntryToEdit(entry);
        setEditCategoryModalVisible(true);
    };

    const closeEditModal = async () => {
        setEditCategoryModalVisible(false);
        setEntryToEdit(null);
        // Ensure data is fully refreshed
        await loadFinancialData();
        // Clear any remaining errors for this entry
        if (entryToEdit) {
            const updatedErrors = dataErrors.filter(e => e.id !== entryToEdit.id);
            setDataErrors(updatedErrors);
            
            // Check if this was the last error
            if (updatedErrors.length === 0) {
                setAllIssuesResolved(true);
                // Auto-close after 2 seconds
                setTimeout(() => {
                    setShowErrorDetails(false);
                    setAllIssuesResolved(false);
                }, 2000);
            }
        }
    };

    // Modify the onRefresh function
    const onRefresh = async () => {
        setRefreshing(true);
        await loadFinancialData();
        // Reset snooze if it was set to 'refresh'
        if (snoozedUntil === 'refresh') {
            setSnoozedUntil(null);
        }
        setRefreshing(false);
    };

    const handleReportIssue = () => {
        setShowErrorDetails(true);
    };

    const handleDeleteInvalidEntry = async (entryId) => {
        if (!entryId) {
            console.warn("Cannot delete entry without ID");
            return;
        }

        // First show confirmation dialog
        Alert.alert(
            "Delete Invalid Entry",
            "Are you sure you want to delete this entry? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteEntry(entryId);
                            // Remove the entry from dataErrors
                            const updatedErrors = dataErrors.filter(entry => entry.id !== entryId);
                            setDataErrors(updatedErrors);
                            
                            // Check if this was the last error
                            if (updatedErrors.length === 0) {
                                setAllIssuesResolved(true);
                                // Auto-close after 2 seconds
                                setTimeout(() => {
                                    setShowErrorDetails(false);
                                    setAllIssuesResolved(false);
                                }, 2000);
                            }
                            
                            // Refresh the data
                            onRefresh();
                        } catch (error) {
                            console.error("Error deleting invalid entry:", error);
                            Alert.alert(
                                "Error",
                                "Failed to delete the invalid entry. Please try again.",
                                [{ text: "OK" }]
                            );
                        }
                    }
                }
            ]
        );
    };

    const renderErrorEntry = (entry, index, total) => {
        const category = categories.find(c => c.id === entry?.category_id);
        const problems = [
            !entry?.name && 'Transaction name is missing',
            entry?.amount === null && 'Amount is not valid',
            !entry?.id && 'Transaction ID is missing'
        ].filter(Boolean);

        const getEntryDescription = () => {
            const type = category?.type === 'income' ? 'Income' : 'Expense';
            const name = entry?.name || 'Unnamed transaction';
            const date = entry?.date ? new Date(entry.date).toLocaleDateString() : null;
            const categoryName = category?.name || 'Uncategorized';

            if (date) {
                return (
                    <View style={styles.errorTitleContainer}>
                        <Text style={styles.errorTitleMain}>{`${type}: ${name}`}</Text>
                        <Text style={styles.errorTitleSecondary}>
                            {`${date} • ${categoryName}`}
                        </Text>
                    </View>
                );
            }
            return (
                <View style={styles.errorTitleContainer}>
                    <Text style={styles.errorTitleMain}>{`${type}: ${name}`}</Text>
                    <Text style={styles.errorTitleSecondary}>{categoryName}</Text>
                </View>
            );
        };
    
        return (
            <View key={entry?.id || Math.random()}>
                <View style={styles.errorEntry}>
                    <View style={styles.errorHeader}>
                        <Ionicons name="warning-outline" size={24} color="#CC0000" />
                        {getEntryDescription()}
                    </View>
                    <View style={styles.errorContent}>
                        <View style={styles.problemsContainer}>
                            <Text style={styles.problemsTitle}>{problems.length} {problems.length === 1 ? 'problem' : 'problems'} found:</Text>
                            {problems.map((problem, index) => (
                                <View key={index} style={styles.problemRow}>
                                    <Ionicons name="close-circle" size={16} color="#CC0000" />
                                    <Text style={styles.problemText}>{problem}</Text>
                                </View>
                            ))}
                        </View>

                        {(entry?.name || entry?.amount !== null) && (
                            <View style={styles.availableDataContainer}>
                                <Text style={styles.availableDataTitle}>Available data:</Text>
                                <View style={styles.availableDataList}>
                                    {entry?.name && (
                                        <View style={styles.availableDataItem}>
                                            <Text style={styles.availableDataLabel}>Name:</Text>
                                            <Text style={styles.availableDataValue}>{entry.name}</Text>
                                        </View>
                                    )}
                                    {entry?.amount !== null && (
                                        <View style={styles.availableDataItem}>
                                            <Text style={styles.availableDataLabel}>Amount:</Text>
                                            <Text style={styles.availableDataValue}>${entry.amount}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        
                        <View style={styles.errorActionButtons}>
                            <TouchableOpacity
                                style={[styles.errorActionButton, styles.fixButton]}
                                onPress={() => handleEdit(entry)}
                            >
                                <Ionicons name="build-outline" size={16} color="#4A90E2" />
                                <Text style={styles.fixButtonText}>Fix</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.errorActionButton, styles.deleteButton]}
                                onPress={() => handleDeleteInvalidEntry(entry?.id)}
                            >
                                <Ionicons name="trash-outline" size={16} color="#CC0000" />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {index < total - 1 && <View style={styles.errorDivider} />}
            </View>
        );
    };

    const handleDismiss = () => {
        Alert.alert(
            "Snooze Issues",
            "Hide these alerts temporarily. They will reappear after the selected time.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "30m",
                    onPress: () => handleSnooze(Date.now() + 1800000)
                },
                {
                    text: "1 Hour",
                    onPress: () => handleSnooze(Date.now() + 3600000)
                },
                {
                    text: "Until tomorrow",
                    onPress: () => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(9, 0, 0, 0);
                        handleSnooze(tomorrow.getTime());
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const handleSnooze = (timestamp) => {
        setSnoozedUntil(timestamp);
        setShowErrorDetails(false);
        setShowSnoozeSuccess(true);
        setTimeout(() => setShowSnoozeSuccess(false), 3000); // Hide after 3 seconds
    };

    const handleReport = () => {
        Alert.alert(
            "Report Data Issues",
            "Would you like to report these issues to our support team? They will be hidden until resolved.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Report",
                    onPress: submitReport
                }
            ]
        );
    };

    const submitReport = async () => {
        try {
            // Store reported issue IDs
            const newReportedIssues = new Set(reportedIssues);
            dataErrors.forEach(error => {
                if (error?.id) {
                    newReportedIssues.add(error.id);
                }
            });
            
            // Save to storage
            await AsyncStorage.setItem('reportedIssues', JSON.stringify([...newReportedIssues]));
            setReportedIssues(newReportedIssues);
            
            // Clear current errors
            setDataErrors([]);
            setShowErrorDetails(false);

            // Show confirmation
            Alert.alert(
                "Issues Reported",
                "Thank you for reporting these issues. They will be hidden until resolved.",
                [{ text: "OK" }]
            );
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to report issues. Please try again.",
                [{ text: "OK" }]
            );
        }
    };

    // Add handler to clear reported issues (for testing)
    const clearReportedIssues = async () => {
        try {
            await AsyncStorage.removeItem('reportedIssues');
            setReportedIssues(new Set());
            onRefresh(); // Reload data to show all issues again
        } catch (error) {
            console.error('Error clearing reported issues:', error);
        }
    };

    const handleMonthChange = (date) => {
        // To be implemented: Update data based on selected month
        console.log('Month changed:', date);
    };

    return (
        <View style={styles.container}>
            {showSnoozeSuccess && (
                <View style={styles.snoozeSuccess}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.snoozeSuccessText}>
                        Issues snoozed until <Text style={styles.snoozeTime}>{formatSnoozeTime(snoozedUntil)}</Text>
                    </Text>
                </View>
            )}

            {dataErrors.length > 0 && !snoozedUntil && (
                <TouchableOpacity 
                    style={styles.errorBanner}
                    onPress={handleReportIssue}
                >
                    <Ionicons name="warning" size={20} color="#CC0000" />
                    <Text style={styles.errorText}>
                        {dataErrors.length} {dataErrors.length === 1 ? 'issue' : 'issues'} found with your data. Tap to review.
                    </Text>
                </TouchableOpacity>
            )}

            <MonthSelector 
                onMonthChange={handleMonthChange}
                onStatsPress={handleStats}
                issuesCount={dataErrors.length}
                onIssuesPress={handleReportIssue}
                isSnoozed={!!snoozedUntil}
            />

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {['income', 'expenses'].map((type) => (
                    <Card key={type} title={i18n.t(type)} cardStyle={styles.card}>
                        {financialData[type].map((category) => (
                            <CategoryHeader
                                key={category.id}
                                category={category}
                                expandedCategory={expandedCategory}
                                setExpandedCategory={setExpandedCategory}
                                
                                handleEdit={handleEdit}
                                handleAddEntry={handleAddEntry}
                            />
                        ))}
                    </Card>
                ))}
                <View style={styles.footer} />
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleFloatingButtonPress}
                accessibilityLabel={i18n.t("addNewEntry")}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            

            <AddEntryForm
                visible={addEntryModalVisible}
                categories={categories}
                preselectedCategory={preselectedCategory}
                userId={user.id}
                onSubmit={addEntry}
                onClose={() => {
                    setAddEntryModalVisible(false);
                    setPreselectedCategory(null);
                }}
                onRefresh={onRefresh}
            />

            <EditEntryForm
                visible={editCategoryModalVisible}
                entry={entryToEdit}
                userId={user.id}
                onUpdate={editEntry}
                onDelete={deleteEntry}
                onClose={closeEditModal}  // Use the new close handler
                onRefresh={onRefresh}
            />

            <CustomModal
                visible={showErrorDetails}
                onClose={() => setShowErrorDetails(false)}
                title="Data Issues Found"
            >
                <View style={styles.errorModalContent}>
                    {allIssuesResolved ? (
                        <View style={styles.successContainer}>
                            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                            <Text style={styles.successText}>All data issues have been successfully resolved!</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.errorModalDescription}>
                                The following entries have invalid or missing data:
                            </Text>
                            <View style={styles.errorEntriesList}>
                                {dataErrors.map((entry, index) => renderErrorEntry(entry, index, dataErrors.length))}
                            </View>
                            <View style={styles.errorActions}>
                                <Button
                                    title="Dismiss"
                                        variant="outline"
                                        onPress={handleDismiss}
                                        style={styles.dismissButton}
                                />
                                <Button
                                    title="Report"
                                    onPress={handleReport}
                                    style={styles.reportButton}
                                />
                            </View>
                        </>
                    )}
                </View>
            </CustomModal>
        </View>
    );
}
