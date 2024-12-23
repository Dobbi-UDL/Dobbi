import { supabase } from '../config/supabaseClient';
import { addExperiencePoints } from '../utils/experienceSystem';

// Función helper para comparar fechas
const isSameDateTime = (date1, date2) => {
  return date1.getHours() === date2.getHours() &&
         date1.getMinutes() === date2.getMinutes() &&
         date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth();
};

// Función para testing con fecha específica
export const shouldProcessAutomaticSavings = (testDate = null) => {
  const today = testDate || new Date();
  const targetDate = new Date('2023-12-23T01:15:00');
  
  return isSameDateTime(today, targetDate);
};

export const processMonthlyAutomaticSavings = async (testDate = null) => {
  try {
    const today = testDate || new Date();
    
    // Comprobar si es el momento de procesar
    if (!shouldProcessAutomaticSavings(today)) {
      console.log('No es momento de procesamiento automático');
      console.log('Hora actual:', today);
      console.log('Esperando: 2023-12-23 01:15');
      return;
    }

    console.log('Iniciando procesamiento automático:', today);

    // Obtener todos los objetivos activos
    const { data: activeGoals, error: goalsError } = await supabase
      .from('goal_tracking')
      .select(`
        *,
        saving_goals (
          id,
          title,
          target_amount,
          points_rewards
        )
      `)
      .eq('goal_status', 'active');

    if (goalsError) throw goalsError;

    // Procesar cada objetivo activo
    for (const tracking of activeGoals) {
      try {
        const newAmount = tracking.current_amount + tracking.monthly_saving;
        const isCompleted = newAmount >= tracking.target_amount;

        if (isCompleted) {
          // El objetivo se ha completado
          const userId = tracking.user_id.toString();

          // Obtener puntos actuales del usuario
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('points')
            .eq('id', userId)
            .single();

          if (userError) throw userError;

          // Calcular experiencia y actualizar puntos
          const experiencePoints = Math.round(tracking.saving_goals.points_rewards * 0.3);
          const currentPoints = userData.points || 0;
          const newPoints = currentPoints + tracking.saving_goals.points_rewards;

          // Actualizar puntos del usuario
          await supabase
            .from('users')
            .update({ points: newPoints })
            .eq('id', userId);

          // Añadir experiencia
          await addExperiencePoints(
            userId,
            experiencePoints,
            `Completed saving goal: ${tracking.saving_goals.title}`
          );

          // Eliminar el objetivo y su tracking
          await supabase
            .from('goal_tracking')
            .delete()
            .eq('goal_id', tracking.goal_id);

          await supabase
            .from('saving_goals')
            .delete()
            .eq('id', tracking.goal_id);

        } else {
          // Actualizar el monto actual
          await supabase
            .from('goal_tracking')
            .update({ 
              current_amount: newAmount,
              last_automatic_saving: today.toISOString()
            })
            .eq('goal_id', tracking.goal_id);
        }
      } catch (error) {
        console.error(`Error processing goal ${tracking.goal_id}:`, error);
        // Continuar con el siguiente objetivo aunque haya error
      }
    }

    console.log('Procesamiento automático completado');
    return true;

  } catch (error) {
    console.error('Error en el procesamiento automático:', error);
    return false;
  }
};

// Función de ayuda para testing
export const testAutomaticSavings = async () => {
  const testDate = new Date('2023-12-23T01:19:00');
  console.log('Ejecutando test con fecha:', testDate);
  return await processMonthlyAutomaticSavings(testDate);
};
