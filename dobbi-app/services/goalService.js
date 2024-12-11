import { supabase } from '../config/supabaseClient';
import { Alert } from 'react-native';

export const assignGoal = async (goalId, userId) => {
  try {
    // Recuperar información del objetivo desde saving_goals
    const { data: goalData, error: goalError } = await supabase
      .from('saving_goals')
      .select('monthly_saving, target_amount')
      .eq('id', goalId)
      .single();

    if (goalError) throw goalError;

    // Verificar el flujo financiero del usuario
    const { data: financialData, error: financialError } = await supabase
      .from('user_financial_summary')
      .select('total_income, total_expense')
      .eq('user_id', userId)
      .single();

    if (financialError) throw financialError;

    // Calcular la fecha de inicio y finalización
    const startDate = new Date();
    let endDate = new Date();

    if (startDate.getDate() > 10) {
      endDate.setMonth(endDate.getMonth() + 2);
      endDate.setDate(1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(1);
    }

    // Verificar si el usuario puede ahorrar
    const canSave = financialData.total_income > 
      (financialData.total_expense + goalData.monthly_saving);

    // Determinar el estado inicial del objetivo
    const goalStatus = canSave ? 'working' : 'pending';

    // Preparar los datos para insertar en goal_tracking
    const goalTrackingData = {
      user_id: userId,
      goal_id: goalId,
      current_amount: goalStatus === 'working' ? goalData.monthly_saving : 0,
      completed: false,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      monthly_saving: goalData.monthly_saving,
      target_amount: goalData.target_amount,
      goal_status: goalStatus, // Estado inicial del objetivo
    };

    // Insertar en goal_tracking
    const { data: insertedGoal, error: insertError } = await supabase
      .from('goal_tracking')
      .insert(goalTrackingData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Notificar éxito
    Alert.alert(
      'Objetivo Asignado', 
      goalStatus === 'working' 
        ? 'Has asignado el objetivo exitosamente.' 
        : 'Objetivo asignado, pero no podrás ahorrar este mes debido a tu situación financiera.'
    );

    return insertedGoal;

  } catch (error) {
    console.error('Error al asignar objetivo:', error);
    Alert.alert('Error', 'No se pudo asignar el objetivo. Inténtalo de nuevo.');
    return null;
  }
};
