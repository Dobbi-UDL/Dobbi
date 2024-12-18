import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./OnboardingStyles.js";

export const EngagementQuestionsStep = ({ formData, setFormData }) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Almost Done!</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          How often would you like to receive financial updates?
        </Text>
        <Picker
          selectedValue={formData.notificationFrequency}
          onValueChange={(value) =>
            setFormData({ ...formData, notificationFrequency: value })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select frequency" value="" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Only when necessary" value="necessary" />
        </Picker>
      </View>
    </View>
  );
};
