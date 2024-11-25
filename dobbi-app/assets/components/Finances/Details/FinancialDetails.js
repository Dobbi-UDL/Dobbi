import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { useAuth } from '../../../../contexts/AuthContext';
import { Button } from '../../common/Button';
import { styles } from './FinancialDetails.styles';
import i18n from '../../../../i18n';
import { supabase } from '../../../../config/supabaseClient';
import { fetchCategories, fetchEntries } from '../../../../services/financesService';
import { CategoryHeader } from './CategoryHeader';

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
        } else {
            loadFinancialData(); 
        }
    }, [user]);

    const loadFinancialData = async () => {
        try{
            if (!categories){
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

    const handleNumberClick = (number) => {
        alert(number);
    };

    const handleEdit = (categoryId) => {
        alert("Not implemented yet");
    };

    return (
        <View>
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
        </View>
    )
}
