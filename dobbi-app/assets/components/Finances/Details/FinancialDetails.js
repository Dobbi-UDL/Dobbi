import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { useAuth } from '../../../../contexts/AuthContext';
import { CustomModal } from '../../common/Modal';
import { styles } from './FinancialDetails.styles';
import i18n from '../../../../i18n';
import { fetchCategories, fetchEntries, addEntry, editEntry, deleteEntry } from '../../../../services/financesService';
import { CategoryHeader } from './CategoryHeader';
import { formatNumberWithCommas } from '../../../../utils/numberFormatting';
import { AddEntryForm } from './AddEntryForm';
import { EditEntryForm } from './EditEntryForm';

export default function FinancialDetails() {
    const router = useRouter();
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [financialData, setFinancialData] = useState({ income: [], expenses: [] });

    const [expandedCategory, setExpandedCategory] = useState(null);
    
    const [numberModalVisible, setNumberModalVisible] = useState(false);
    const [fullNumber, setFullNumber] = useState('');

    const [addEntryModalVisible, setAddEntryModalVisible] = useState(false);
    const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false);

    const [preselectedCategory, setPreselectedCategory] = useState(null);
    const [entryToEdit, setEntryToEdit] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

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
        const categoriesWithEntries = categories.map((category) => ({
            ...category,
            total: 0,
            entries: [],
        }));
        
        entries.forEach((entry) => {
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
        alert("Not implemented yet");
    };
    
    const handleNumberClick = (number) => {
        setFullNumber(formatNumberWithCommas(number.toFixed(2)));
        console.log("fullNumber: ", fullNumber);
        setNumberModalVisible(true);
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

    const handleEdit = (entry) => {
        console.log("pressed edit: ", entry);
        setEntryToEdit(entry);
        setEditCategoryModalVisible(true);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadFinancialData();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{i18n.t("financialDetails")}</Text>
                        <TouchableOpacity onPress={handleStats} style={styles.statsButton}>
                            <Ionicons name="stats-chart" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                    </View>

                    {['income', 'expenses'].map((type) => (
                        <Card key={type} title={i18n.t(type)} cardStyle={styles.card}>
                            {financialData[type].map((category) => (
                                <CategoryHeader
                                    key={category.id}
                                    category={category}
                                    expandedCategory={expandedCategory}
                                    setExpandedCategory={setExpandedCategory}
                                    handleNumberClick={handleNumberClick}
                                    handleEdit={handleEdit}
                                    handleAddEntry={handleAddEntry}
                                />
                            ))}
                        </Card>
                    ))}
                    <View style={styles.footer} />
                </ScrollView>
            )}

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleFloatingButtonPress}
                accessibilityLabel={i18n.t("addNewEntry")}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <CustomModal
                visible={numberModalVisible}
                onClose={() => setNumberModalVisible(false)}
                title="Your total amount is:"
            >
                <Text style={styles.modalText}>
                    ${fullNumber}
                </Text>
            </CustomModal>

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
                onClose={() => {
                    setEditCategoryModalVisible(false);
                    // Don't need to reset entryToEdit because it will be reset next time an entry is pressed
                }}
                onRefresh={onRefresh}
            />
        </View>
    );
}
