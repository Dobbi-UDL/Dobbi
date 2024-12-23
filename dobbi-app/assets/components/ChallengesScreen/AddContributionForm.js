import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { CustomModal } from "../common/Modal";
import { Button } from "../common/Button";
import { supabase } from "../../../config/supabaseClient";
import i18n from "../../../i18n"
import { addExperiencePoints } from '../../../utils/experienceSystem';

export const AddContributionForm = ({ visible, onClose, goal, onContributionAdded }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        Alert.alert(i18n.t('invalid_amount'), i18n.t('enter_valid_amount'));
        return;
      }

      const { data: trackingData, error: trackingError } = await supabase
        .from("goal_tracking")
        .select('current_amount, user_id')
        .eq('goal_id', goal.id)
        .single();

      if (trackingError) {
        console.error('Error fetching goal tracking:', trackingError);
        throw trackingError;
      }

      if (!trackingData || !trackingData.user_id) {
        console.error('No tracking data or user_id found');
        Alert.alert("Error", "Goal tracking information not found");
        return;
      }

      // Asegurarse de que el user_id sea una cadena
      const userId = trackingData.user_id?.toString();
      console.log('User ID (as string):', userId); // Debug log

      const newAmount = trackingData.current_amount + parseFloat(amount);
      const isCompleted = newAmount >= goal.target_amount;

      if (isCompleted) {
        // Eliminar el objetivo y su tracking
        await supabase
          .from('goal_tracking')
          .delete()
          .eq('goal_id', goal.id);

        await supabase
          .from('saving_goals')
          .delete()
          .eq('id', goal.id);

        // Calcular experiencia (30% de los puntos de recompensa)
        const experiencePoints = Math.round(goal.points_rewards * 0.3);

        try {
          // Primero obtener los puntos actuales del usuario
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('points')
            .eq('id', userId)
            .single();

          if (userError) throw userError;

          // Calcular nuevos puntos
          const currentPoints = userData.points || 0;
          const newPoints = currentPoints + goal.points_rewards;

          // Actualizar puntos del usuario
          const { error: pointsError } = await supabase
            .from('users')
            .update({ points: newPoints })
            .eq('id', userId);

          if (pointsError) throw pointsError;

          // Añadir experiencia
          const { didLevelUp } = await addExperiencePoints(
            userId,
            experiencePoints,
            `Completed saving goal: ${goal.title}`
          );

          Alert.alert(
            "¡Felicidades!",
            didLevelUp 
              ? `¡Has completado tu objetivo! Has ganado ${goal.points_rewards} puntos y ${experiencePoints} puntos de experiencia. ¡Has subido de nivel!`
              : `¡Has completado tu objetivo! Has ganado ${goal.points_rewards} puntos y ${experiencePoints} puntos de experiencia.`
          );
        } catch (error) {
          console.error('Error updating user rewards:', error);
          // Continuar con el flujo aunque falle la actualización
        }
      } else {
        // Actualizar el monto
        const { error: updateError } = await supabase
          .from("goal_tracking")
          .update({ current_amount: newAmount })
          .eq('goal_id', goal.id);

        if (updateError) throw updateError;
      }

      if (onContributionAdded) onContributionAdded();
      setAmount("");
      onClose();

      if (!isCompleted) {
        Alert.alert("Success", "Contribution added successfully!");
      }
    } catch (error) {
      console.error("Error handling contribution:", error);
      Alert.alert("Error", "Failed to process contribution. Please try again.");
    }
  };

  return (
    <CustomModal
      title="Add Contribution"
      visible={visible}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.label}>{i18n.t('contribution_amount')}</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={i18n.t('cancel_button')}
            onPress={onClose}
            variant="outline"
            style={styles.button}
          />
          <Button
            title={i18n.t('add_contribution_button')}
            onPress={handleSubmit}
            style={styles.button}
          />
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 12,
    color: "#333",
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
