// OnboardingForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../../../config/supabaseClient";
import { Button } from "../common/Button";
import { PersonalQuestionsStep } from "./PersonalQuestionsStep";
import { MotivationQuestionsStep } from "./MotivationQuestionsStep";
import { FinancialQuestionsStep } from "./FinancialQuestionsStep";
import { EngagementQuestionsStep } from "./EngagementQuestionsStep";
import { Country, City, State } from "country-state-city";

export const OnboardingForm = ({ userId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [showPicker, setShowPicker] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [selectedValues, setSelectedValues] = useState({
    gender: "",
    country: "",
    province: "",
    city: "",
  });
  const [formData, setFormData] = useState({
    // Personal
    age: "",
    gender: "",
    country: "",
    province: "",
    city: "",

    // Motivation
    moneyManagementFeeling: "",
    biggestChallenge: "",
    financialAdviceInterest: "",
    impulsePurchaseFrequency: "",
    spendingMotivation: "",

    // Financial
    monthlyIncome: "",
    monthlyExpenses: "",

    // Engagement
    notificationFrequency: "",
  });

  const handleSubmit = async () => {
    try {
      // Update user's questionnaire status
      const { error: userError } = await supabase
        .from("users")
        .update({ has_completed_questionnaire: true })
        .eq("id", userId);

      if (userError) throw userError;

      // Store profile data
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: userId,
          personal_info: {
            age: formData.age,
            gender: formData.gender,
            country: formData.country,
            province: formData.province,
            city: formData.city,
          },
          motivation_data: {
            money_management_feeling: formData.moneyManagementFeeling,
            biggest_challenge: formData.biggestChallenge,
            financial_advice_interest: formData.financialAdviceInterest,
            impulse_purchase_frequency: formData.impulsePurchaseFrequency,
            spending_motivation: formData.spendingMotivation,
            notification_frequency: formData.notificationFrequency,
          },
          financial_data: {
            monthly_income: parseFloat(formData.monthlyIncome),
            monthly_expenses: parseFloat(formData.monthlyExpenses),
          },
        });

      if (profileError) throw profileError;

      onComplete();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save your profile. Please try again.");
    }
  };

  const handleOptionSelect = (value) => {
    if (activeField) {
      if (activeField === "country") {
        const country = Country.getAllCountries().find(
          (c) => c.isoCode === value
        );
        setSelectedValues((prev) => ({
          ...prev,
          country: value,
          countryName: country?.name || "",
          province: "", // Reset province
          city: "", // Reset city
        }));
        setFormData((prev) => ({
          ...prev,
          country: country?.name || "",
          province: "",
          city: "",
        }));
      } else if (activeField === "province") {
        const state = State.getStatesOfCountry(selectedValues.country).find(
          (s) => s.isoCode === value
        );
        setSelectedValues((prev) => ({
          ...prev,
          province: value,
          provinceName: state?.name || "",
          city: "", // Reset city when province changes
        }));
        setFormData((prev) => ({
          ...prev,
          province: state?.name || "",
          city: "",
        }));
      } else if (activeField === "city") {
        setSelectedValues((prev) => ({
          ...prev,
          city: value,
        }));
        setFormData((prev) => ({
          ...prev,
          city: value,
        }));
      } else {
        setSelectedValues((prev) => ({
          ...prev,
          [activeField]: value,
        }));
        setFormData((prev) => ({
          ...prev,
          [activeField]: value,
        }));
      }
      setShowPicker(false);
    }
  };

  const getOptionsForField = (field) => {
    switch (field) {
      case "gender":
        return [
          { id: "g1", label: "Male", value: "male" },
          { id: "g2", label: "Female", value: "female" },
          { id: "g3", label: "Other", value: "other" },
          { id: "g4", label: "Prefer not to say", value: "not_specified" },
        ];

      case "country":
        return Country.getAllCountries().map((country) => ({
          id: country.isoCode,
          label: country.name,
          value: country.isoCode,
          flag: country.flag,
        }));

      case "province":
        if (selectedValues.country) {
          const states = State.getStatesOfCountry(selectedValues.country) || [];
          return states.map((state) => ({
            id: `${selectedValues.country}-${state.isoCode}`,
            label: state.name,
            value: state.isoCode,
          }));
        }
        return [];

      case "city":
        if (selectedValues.country && selectedValues.province) {
          const cities =
            City.getCitiesOfState(
              selectedValues.country,
              selectedValues.province
            ) || [];
          return cities.map((city, index) => ({
            id: `${selectedValues.country}-${selectedValues.province}-${city.name}-${index}`,
            label: city.name,
            value: city.name,
          }));
        }
        return [];

      default:
        return [];
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalQuestionsStep
            formData={formData}
            setFormData={setFormData}
            onSelectField={(field) => {
              setActiveField(field);
              setShowPicker(true);
            }}
            selectedValues={selectedValues}
          />
        );
      case 2:
        return (
          <MotivationQuestionsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <FinancialQuestionsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <EngagementQuestionsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Dobbi!</Text>
        <Text style={styles.subtitle}>Let's get to know you better</Text>
      </View>

      {/* Scrollable Content */}
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollContent}>{renderStep()}</ScrollView>
      </View>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <Button
              title="Previous"
              onPress={() => setStep(step - 1)}
              style={styles.button}
            />
          )}
          {step < 4 ? (
            <Button
              title="Next"
              onPress={() => setStep(step + 1)}
              style={styles.button}
            />
          ) : (
            <Button
              title="Complete"
              onPress={handleSubmit}
              style={styles.button}
            />
          )}
        </View>
      </View>

      {/* Options Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {getOptionsForField(activeField).map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => handleOptionSelect(option.value)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    padding: 20,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
