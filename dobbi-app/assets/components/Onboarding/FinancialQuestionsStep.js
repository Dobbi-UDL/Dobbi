import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./OnboardingStyles.js";

export const FinancialQuestionsStep = ({ formData, setFormData }) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Financial Snapshot</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Monthly Income</Text>
        <View style={styles.currencyInput}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            value={formData.monthlyIncome}
            onChangeText={(value) =>
              setFormData({ ...formData, monthlyIncome: value })
            }
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Monthly Expenses</Text>
        <View style={styles.currencyInput}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            value={formData.monthlyExpenses}
            onChangeText={(value) =>
              setFormData({ ...formData, monthlyExpenses: value })
            }
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>
      </View>
    </View>
  );
};
