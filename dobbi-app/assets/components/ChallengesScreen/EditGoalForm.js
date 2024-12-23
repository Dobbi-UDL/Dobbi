import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { CustomModal } from "../common/Modal";
import { Button } from "../common/Button";
import { supabase } from "../../../config/supabaseClient";
import i18n from "../../../i18n"
import { calculateGoalMetrics } from '../../utils/goalCalculations';
import { styles } from "../../styles/challenges";

export const EditGoalForm = ({ visible, onClose, goal, onGoalUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [monthlySaving, setMonthlySaving] = useState("");
  const [expiringDate, setExpiringDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isValidAmount, setIsValidAmount] = useState(true);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description);
      setTargetAmount(goal.target_amount.toString());
      setMonthlySaving(goal.monthly_saving.toString());
      setCurrentAmount(goal.current_amount || 0);
      // Asegurarse de que la fecha sea válida
      try {
        const date = new Date(goal.expiring_date);
        if (isNaN(date.getTime())) {
          // Si la fecha es inválida, usar la fecha actual
          setExpiringDate(new Date());
        } else {
          setExpiringDate(date);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
        setExpiringDate(new Date());
      }
    }
  }, [goal]);

  useEffect(() => {
    if (targetAmount && monthlySaving) {
      const amount = parseFloat(targetAmount);
      const saving = parseFloat(monthlySaving);
      const remaining = amount - currentAmount; // Calcular cantidad restante

      if (amount > 0 && saving > 0 && remaining > 0) {
        // Calcular meses necesarios basado en la cantidad restante
        const monthsNeeded = Math.ceil(remaining / saving);
        const estimatedEndDate = new Date();
        estimatedEndDate.setMonth(estimatedEndDate.getMonth() + monthsNeeded);
        
        setExpiringDate(estimatedEndDate);

        // Recalcular puntos basado en la cantidad total y el tiempo
        const { points } = calculateGoalMetrics(amount, saving, estimatedEndDate);
        // Puedes mostrar los puntos actualizados en la UI si lo deseas
      }
    }
  }, [targetAmount, monthlySaving, currentAmount]);

  useEffect(() => {
    if (targetAmount && monthlySaving) {
      const targetAmountValue = parseFloat(targetAmount);
      const monthlySavingValue = parseFloat(monthlySaving);
      setIsValidAmount(monthlySavingValue <= targetAmountValue);
    }
  }, [targetAmount, monthlySaving]);

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
      const remaining = amount - currentAmount;
      
      // Recalcular puntos basado en la cantidad restante y el tiempo
      const monthsNeeded = Math.ceil(remaining / saving);
      const estimatedEndDate = new Date();
      estimatedEndDate.setMonth(estimatedEndDate.getMonth() + monthsNeeded);
      
      const { points } = calculateGoalMetrics(amount, saving, estimatedEndDate);

      const { error: goalError } = await supabase
        .from("saving_goals")
        .update({
          title: title,
          description: description,
          target_amount: amount,
          monthly_saving: saving,
          expiring_date: expiringDate.toISOString(),
          points_rewards: points // Actualizar los puntos
        })
        .eq('id', goal.id);

      if (goalError) throw goalError;

      const { error: trackingError } = await supabase
        .from("goal_tracking")
        .update({
          end_date: expiringDate.toISOString(),
          monthly_saving: parseFloat(monthlySaving),
          target_amount: parseFloat(targetAmount),
        })
        .eq('goal_id', goal.id);

      if (trackingError) throw trackingError;

      if (onGoalUpdated) onGoalUpdated();
      onClose();
      Alert.alert("Success", i18n.t('goal_updated'));
    } catch (error) {
      console.error("Error updating saving goal:", error);
      Alert.alert("Error", i18n.t('goal_update_error'));
    }
  };

  const handleClose = () => {
    Alert.alert(
      i18n.t('cancel'),
      i18n.t('cancel_changes_message'),
      [
        {
          text: i18n.t('no'),
          style: "cancel"
        },
        {
          text: i18n.t('yes'),
          onPress: () => {
            resetForm();
            onClose();
          }
        }
      ]
    );
  };

  const resetForm = () => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description);
      setTargetAmount(goal.target_amount.toString());
      setMonthlySaving(goal.monthly_saving.toString());
      setExpiringDate(new Date(goal.expiring_date));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setExpiringDate(selectedDate);
    }
  };

  return (
    <CustomModal
      title={i18n.t('edit_goal_title')}
      visible={visible}
      onClose={handleClose}
      onSubmit={handleSubmit}  // Añadir esta prop
      fullWidth={true}         // Añadir esta prop
    >
      <View style={styles.EditGoalContainer}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('goal_title')}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n.t('title_placeholder')}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('goal_description')}</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={i18n.t('description_placeholder')}
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
              {expiringDate instanceof Date && !isNaN(expiringDate.getTime())
                ? expiringDate.toLocaleDateString()
                : 'Select date'}
            </Text>
          </View>
        </View>
            
        {/* Mostrar información del progreso actual */}
        <View style={styles.section}>
          <View style={styles.progressInfo}>
            <Text style={styles.infoLabel}>Current Progress:</Text>
            <Text style={styles.infoValue}>
              ${currentAmount} / ${targetAmount}
              {` (${((currentAmount / parseFloat(targetAmount)) * 100).toFixed(1)}%)`}
            </Text>
          </View>
        </View>

        {/* Submit Buttons */}
        <View style={styles.submitButtonContainer}>
          <Button
            title={i18n.t('cancel_button')}
            onPress={handleClose}
            variant="outline"
            style={styles.submitButton}
          />
          <Button
            title={i18n.t('update_goal_button')}
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
}

export default EditGoalForm;
