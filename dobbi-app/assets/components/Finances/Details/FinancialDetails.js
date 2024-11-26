import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { useAuth } from '../../../../contexts/AuthContext';
import { Button } from '../../common/Button';
import { CustomModal } from '../../common/Modal';
import { styles } from './FinancialDetails.styles';
import i18n from '../../../../i18n';
import { supabase } from '../../../../config/supabaseClient';
import { fetchCategories, fetchEntries } from '../../../../services/financesService';
import { CategoryHeader } from './CategoryHeader';
import { formatNumberWithCommas } from '../../../../utils/numberFormatting';

export default function FinancialDetails() {
    const router = useRouter();
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [financialData, setFinancialData] = useState({ income: [], expenses: [] });

    const [expandedCategory, setExpandedCategory] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [fullNumber, setFullNumber] = useState('');
    
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        
        loadFinancialData(); 
        
    }, [user]);

    const loadFinancialData = async () => {
        try{
                if(categories.length === 0) {
                    const fetchedCategories = await fetchCategories();
                    setCategories(fetchedCategories);
                }

            const entries = await fetchEntries(user.id);
            const { expenseCategories, incomeCategories } = sortEntriesIntoCategories(categories, entries);

            setFinancialData({ income: incomeCategories, expenses: expenseCategories });
            
        } catch (error) {
            console.error("Error loading financial data: ", error);
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
        setModalVisible(true);
    };

    const handleEdit = (categoryId) => {
        alert("Not implemented yet");
    };

    const handleAddEntry = () => {
        alert("Not implemented yet");
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadFinancialData();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
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
                            />
                        ))}
                    </Card>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleAddEntry}
                accessibilityLabel={i18n.t("addNewEntry")}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            >
                <Text style={styles.modalText}>
                    {"Your total amount is:\n\n"} ${fullNumber}
                </Text>
            </CustomModal>
                    
        </View>
    );
}
