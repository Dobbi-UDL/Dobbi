import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { useAuth } from '../../../../contexts/AuthContext';
import Button from '../../common/Button';
import styles from './FinancialDetails.styles';
import i18n from '../../../../i18n';

const ListViewEntries = ({ entries }) => (
    <View style={styles.entriesContainer}>
        {entries.map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
                <Text style={styles.entryName}>{entry.name}</Text>
                <Text style={styles.entryAmount}>${entry.amount.toFixed(2)}</Text>
            </View>
        ))}
    </View>
);

export default function FinancialDetails() {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const router = useRouter();
    const { user } = useAuth();

    const categories = [
        {
            id: "income",
            name: i18n.t("totalIncome"),
            amount: 1946,
            trend: "up",
            entries: [
                { id: 1, name: i18n.t("salary"), amount: 1800, date: "2024-01-01" },
                { id: 2, name: i18n.t("freelance"), amount: 146, date: "2024-01-15" },
            ],
        },
        {
            id: "entertainment",
            name: i18n.t("entertainment"),
            amount: 95.98,
            trend: "up",
            entries: [
                { id: 1, name: i18n.t("netflixSubscription"), amount: 15.99, date: "2024-01-01" },
                { id: 2, name: i18n.t("gymMembership"), amount: 49.99, date: "2024-01-01" },
                { id: 3, name: i18n.t("movieTickets"), amount: 30, date: "2024-01-15" },
            ],
        },
        {
            id: "food",
            name: i18n.t("food"),
            amount: 120.45,
            trend: "down",
            entries: [
                { id: 1, name: i18n.t("groceries"), amount: 80.45, date: "2024-01-01" },
                { id: 2, name: i18n.t("dinnerOut"), amount: 40, date: "2024-01-15" },
            ],
        },
        {
            id: "transport",
            name: i18n.t("transport"),
            amount: 45,
            trend: "down",
            entries: [
                { id: 1, name: i18n.t("busTicket"), amount: 2.50, date: "2024-01-01" },
                { id: 2, name: i18n.t("uber"), amount: 42.50, date: "2024-01-15" },
            ]
        }
    ];

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

            <Card title={i18n.t("income")} cardStyle={styles.card}>
                {categories
                    .filter((cat) => cat.id === "income")
                    .map((category) => (
                        <View key={category.id}>
                            <TouchableOpacity
                                style={styles.categoryHeader}
                                onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                            >
                                <View style={styles.categoryIcon}>
                                    <Ionicons name="cash-outline" size={22} color="#FFFFFF" />
                                </View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <View style={styles.categoryAmount}>
                                    <Text style={styles.amountText}>${category.amount.toFixed(2)}</Text>
                                </View>
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

            <Card title={i18n.t("expenses")} cardStyle={styles.card}>
                {categories
                    .filter((cat) => cat.id !== "income")
                    .map((category) => (
                        <View key={category.id}>
                            <TouchableOpacity
                                style={styles.categoryHeader}
                                onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                            >
                                <View style={styles.categoryIcon}>
                                    <Ionicons name="card-outline" size={22} color="#FFFFFF" />
                                </View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <View style={styles.categoryAmount}>
                                    <Text style={styles.amountText}>${category.amount.toFixed(2)}</Text>
                                </View>
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
        </View>
    );
}