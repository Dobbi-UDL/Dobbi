import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./OnboardingStyles.js";

export const MotivationQuestionsStep = ({ formData, setFormData }) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Financial Journey</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          How do you feel about managing your money?
        </Text>
        <Picker
          selectedValue={formData.moneyManagementFeeling}
          onValueChange={(value) =>
            setFormData({ ...formData, moneyManagementFeeling: value })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select an option" value="" />
          <Picker.Item label="Confident" value="confident" />
          <Picker.Item label="Average" value="average" />
          <Picker.Item label="Overwhelmed" value="overwhelmed" />
          <Picker.Item label="Not sure where to start" value="unsure" />
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          What's your biggest financial challenge?
        </Text>
        <Picker
          selectedValue={formData.biggestChallenge}
          onValueChange={(value) =>
            setFormData({ ...formData, biggestChallenge: value })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select a challenge" value="" />
          <Picker.Item label="Saving money" value="saving" />
          <Picker.Item label="Tracking expenses" value="tracking" />
          <Picker.Item label="Paying off debt" value="debt" />
          <Picker.Item label="Sticking to a budget" value="budgeting" />
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>What motivates your spending the most?</Text>
        <Picker
          selectedValue={formData.spendingMotivation}
          onValueChange={(value) =>
            setFormData({ ...formData, spendingMotivation: value })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select motivation" value="" />
          <Picker.Item label="Necessity" value="necessity" />
          <Picker.Item label="Discounts/Deals" value="discounts" />
          <Picker.Item label="Emotional needs" value="emotional" />
          <Picker.Item label="Social influence" value="social" />
        </Picker>
      </View>
    </View>
  );
};
