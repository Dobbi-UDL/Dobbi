import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomModal } from "../common/Modal";
import { Button } from "../common/Button";
import { supabase } from "../../../config/supabaseClient";
import i18n from "../../../i18n"
import { calculateGoalMetrics } from '../../utils/goalCalculations';
import { styles } from "../../styles/challenges";

export const AddGoalForm = ({ visible, onClose, userId, onGoalCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [monthlySaving, setMonthlySaving] = useState("");
  const [expiringDate, setExpiringDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [estimatedPoints, setEstimatedPoints] = useState(0);
  const [isValidAmount, setIsValidAmount] = useState(true);

  // Validation Form
  const isFormValid = () => {
    const targetAmountValue = parseFloat(targetAmount);
    const monthlySavingValue = parseFloat(monthlySaving);
    
    return (
      title.trim() !== "" &&
      description.trim() !== "" &&
      targetAmountValue > 0 &&
      monthlySavingValue > 0 &&
      monthlySavingValue <= targetAmountValue
    );
  };

  useEffect(() => {
    if (targetAmount && monthlySaving) {
      const targetAmountValue = parseFloat(targetAmount);
      const monthlySavingValue = parseFloat(monthlySaving);
      setIsValidAmount(monthlySavingValue <= targetAmountValue);
    }
  }, [targetAmount, monthlySaving]);

  useEffect(() => {
    if (targetAmount && monthlySaving && expiringDate) {
      const amount = parseFloat(targetAmount);
      const saving = parseFloat(monthlySaving);
      if (amount > 0 && saving > 0) {
        const { estimatedEndDate, points } = calculateGoalMetrics(amount, saving);
        setExpiringDate(estimatedEndDate);
        // Puedes mostrar los puntos en la UI si lo deseas
      }
    }
  }, [targetAmount, monthlySaving]);

  useEffect(() => {
    if (targetAmount && monthlySaving && expiringDate) {
        const amount = parseFloat(targetAmount);
        const saving = parseFloat(monthlySaving);
        if (amount > 0 && saving > 0) {
            const { points } = calculateGoalMetrics(amount, saving, expiringDate);
            setEstimatedPoints(points);
        }
    }
  }, [targetAmount, monthlySaving, expiringDate]);

  const handleSubmit = async () => {
    const targetAmountValue = parseFloat(targetAmount);
    const monthlySavingValue = parseFloat(monthlySaving);
    
    if (monthlySavingValue > targetAmountValue) {
      Alert.alert(i18n.t('invalid_amount'), i18n.t('monthly_saving_error'));
      return;
    }

    if (!isFormValid()) {
      Alert.alert(i18n.t('incomplete_form'), i18n.t('fill_fields'));
      return;
    }

    try {
      const amount = parseFloat(targetAmount);
      const saving = parseFloat(monthlySaving);
      const { points } = calculateGoalMetrics(amount, saving);

      // Insert saving goal with calculated points
      const { data: goalData, error: goalError } = await supabase
        .from("saving_goals")
        .insert({
          creator_id: userId,
          title: title,
          description: description,
          target_amount: amount,
          monthly_saving: saving,
          expiring_date: expiringDate.toISOString(),
          is_sponsored: false,
          points_rewards: points // Añadir los puntos calculados
        })
        .select()
        .single();

      if (goalError) throw goalError;

      // Create goal tracking entry
      const { error: trackingError } = await supabase
        .from("goal_tracking")
        .insert({
          user_id: userId,
          goal_id: goalData.id,
          current_amount: 0,
          start_date: new Date().toISOString(),
          end_date: expiringDate.toISOString(),
          monthly_saving: parseFloat(monthlySaving),
          target_amount: parseFloat(targetAmount),
          completed: false,
          goal_status: "pending",
        });

      if (trackingError) throw trackingError;

      // Notify parent components
      if (onGoalCreated) onGoalCreated();

      // Reset form and close
      resetForm();
      onClose();

      Alert.alert("Success", i18n.t('goal_created'));
    } catch (error) {
      console.error("Error creating saving goal:", error);
      Alert.alert("Error", i18n.t('goal_creation_error'));
    }
  };

  const handleClose = () => {
    Alert.alert(
      "Are you sure?",
      "You will lose any unsaved changes.",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            resetForm();
            onClose();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTargetAmount("");
    setMonthlySaving("");
    setExpiringDate(new Date());
  };

  return (
    <CustomModal
      title="Create Saving Goal"
      visible={visible}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <View style={styles.GoalContainer}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('goal_title')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., New Laptop Fund"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe your saving goal"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Target Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('goal_target_amount')}</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Monthly Saving */}
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('goal_monthly_saving')}</Text>
          <View style={[styles.amountInputContainer, !isValidAmount && styles.inputError]}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={monthlySaving}
              onChangeText={setMonthlySaving}
              keyboardType="decimal-pad"
            />
          </View>
          {!isValidAmount && (
            <Text style={styles.errorText}>{i18n.t('monthly_saving_error')}</Text>
          )}
        </View>

        {/* Expiring Date */}
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('goal_target_date')}</Text>
          <View style={styles.dateButtonDisabled}>
            <Ionicons name="calendar-outline" size={24} color="#999" />
            <Text style={styles.dateButtonTextDisabled}>
              {expiringDate.toLocaleDateString('en-GB')}
            </Text>
          </View>
        </View>
            
        {/* Estimated Points and Time Range */}
        <View style={styles.section}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Estimated Points:</Text>
                <Text style={styles.infoValue}>{estimatedPoints} pts</Text>
            </View>
        </View>

        {/* Submit Buttons */}
        <View style={styles.submitButtonContainer}>
          <Button
            title={i18n.t('cancel_button')}
            onPress={handleClose}
            variant="outline"
            style={styles.deleteButton}
          />
          <Button
            title={i18n.t('create_goal_button')}
            onPress={handleSubmit}
            disabled={!isFormValid()}
            style={[
              styles.submitButton,
              !isFormValid() && styles.submitButtonDisabled,
            ]}
          />
        </View>
      </View>
    </CustomModal>
  );
};

