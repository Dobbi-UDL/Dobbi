import { supabase } from '../config/supabaseClient';
import { Alert } from 'react-native';

export const assignGoal = async (goalId, userId) => {
  try {
    // Primero, recuperamos la información del objetivo de saving_goals
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

    // Calcular la fecha de finalización
    const startDate = new Date();
    let endDate = new Date();

    // Si ya ha pasado el día 10 del mes, el objetivo se completa el mes siguiente
    if (startDate.getDate() > 10) {
      endDate.setMonth(endDate.getMonth() + 2);
      endDate.setDate(1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(1);
    }

    // Verificar si puede ahorrar (ingresos mayores que gastos + ahorro mensual)
    const canSave = financialData.total_income > 
      (financialData.total_expense + goalData.monthly_saving);

    // Preparar los datos para insertar en goal_tracking
    const goalTrackingData = {
      user_id: userId,
      goal_id: goalId,
      current_amount: canSave ? goalData.monthly_saving : 0,
      completed: false, // Cambia de `false` a un array vacío
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      monthly_saving: goalData.monthly_saving,
      target_amount: goalData.target_amount,
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
      canSave 
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