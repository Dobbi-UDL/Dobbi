import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { useAuth } from '../../../../contexts/AuthContext';
import Button from '../../common/Button';
import styles from './FinancialDetails.styles';
import i18n from '../../../../i18n';
import { supabase } from '../../../../config/supabaseClient';

const ListViewEntries = ({ entries }) => (
    <View style={styles.entriesContainer}>
        {entries.map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
                <Text style={styles.entryName}>{entry.name}</Text>
                <Text style={styles.entryAmount}>${truncateNumber(entry.amount)}</Text>
            </View>
        ))}
    </View>
);

const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const truncateNumber = (number, maxLength = 9) => {
    const formattedNumber = formatNumberWithCommas(number.toFixed(2));
    return formattedNumber.length > maxLength ? `${formattedNumber.slice(0, maxLength)}...` : formattedNumber;
};

export default function FinancialDetails() {
    const router = useRouter();
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [fullNumber, setFullNumber] = useState('');

    // If somehow the user is not logged in, redirect to the login screen
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user]);

    // Fetch category info (name, desc, etc) from database
    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('financial_categories')
                .select('*')

            if (error) throw error;

            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories: ", error.message);
        }
    };

    fetchCategories();

    // Fetch entries from database
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const { data, error } = await supabase
                    .from('expenses')
                    .select('id, amount, name, date, category_id')
                    .eq('user_id', user.id);

                if (error) throw error;
                return data;
            }
            catch (error) {
                console.error("Error fetching entries: ", error.message);
            }
        };

        const sortEntriesIntoCategories = async () => {
            // create a list of categories with an empty list of entries
            const categoriesWithEntries = categories.map((category) => ({
                ...category,
                total: 0,
                entries: [],
            }));

            // sort entries into categories
            const entries = await fetchEntries();
            entries.forEach((entry) => {
                const category = categoriesWithEntries.find((category) => category.id === entry.category_id);
                category.total += entry.amount;
                category.entries.push(entry);
            });
            setExpenses(categoriesWithEntries);
            console.log("hebllnossmthere  ", expenses);
        };

        if (user) {
            sortEntriesIntoCategories();
        }
    }, [user]);

    const handleNumberClick = (number) => {
        console.log("Number clicked:", number); // Debugging line
        setFullNumber(formatNumberWithCommas(number.toFixed(2)));
        setModalVisible(true);
    };

    const handleStats = () => {
        alert(i18n.t("statsScreenNotImplemented"));
    };

    const handleEdit = (categoryId) => {
        alert(`${i18n.t("editCategory")}: ${categoryId}`);
    };

    const handleAddEntry = () => {
        alert(i18n.t("addEntryNotImplemented"));
    };

    return (
        <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{i18n.t("financialDetails")}</Text>
                        <TouchableOpacity onPress={handleStats} style={styles.statsButton}>
                            <Ionicons name="stats-chart" size={24} color="#EE6567" />
                        </TouchableOpacity>
                    </View>

                    <Card title={i18n.t("expenses")} cardStyle={styles.card}>
                        {expenses.filter(category => category.entries.length !== 0).map((category) => (
                            <View key={category.id}>
                                <TouchableOpacity
                                    style={styles.categoryHeader}
                                    onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                >
                                    <View style={styles.categoryIcon}>
                                        <Ionicons name="card-outline" size={22} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                    <TouchableOpacity onPress={() => handleNumberClick(category.total)}>
                                        <View style={styles.categoryAmount}>
                                            <Text style={styles.amountText}>${truncateNumber(category.total)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Button
                                        title={i18n.t("edit")}
                                        onPress={() => handleEdit(category.id)}
                                        size="sm"
                                        style={styles.editButton}
                                    />
                                </TouchableOpacity>
                                {expandedCategory === category.id && <ListViewEntries entries={category.entries} />}
                            </View>
                        ))}
                    </Card>
                </ScrollView>

                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={handleAddEntry}
                    accessibilityLabel={i18n.t("addNewEntry")}
                >
                    <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {modalVisible && (
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}
                    >
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>${fullNumber}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            );
}