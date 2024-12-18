import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./OnboardingStyles";

export const PersonalQuestionsStep = ({
  formData,
  setFormData,
  onSelectField,
  selectedValues,
}) => {
  const renderSelectInput = (label, field, placeholder) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.selectButton,
          field === "city" && !selectedValues.country && styles.disabledButton,
        ]}
        onPress={() => {
          if (field === "city" && !selectedValues.country) return;
          onSelectField(field);
        }}
      >
        <Text
          style={[
            styles.selectButtonText,
            !selectedValues[field] && styles.placeholderText,
          ]}
        >
          {selectedValues[field] ||
            (field === "city" && !selectedValues.country
              ? "Select country first"
              : placeholder)}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>

      {/* Age input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(value) => setFormData({ ...formData, age: value })}
          keyboardType="numeric"
          placeholder="Enter your age"
          maxLength={3}
        />
      </View>

      {/* Selection inputs */}
      {renderSelectInput("Gender", "gender", "Select gender")}
      {renderSelectInput("Country", "country", "Select country")}
      {renderSelectInput(
        "Province",
        "province",
        selectedValues.country ? "Select province" : "Select country first"
      )}
      {renderSelectInput(
        "City",
        "city",
        selectedValues.province ? "Select city" : "Select province first"
      )}
    </View>
  );
};
