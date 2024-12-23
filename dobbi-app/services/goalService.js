import { supabase } from '../config/supabaseClient';
import { addExperiencePoints } from '../utils/experienceSystem';

export const processMonthlyAutomaticSavings = async () => {
  try {
    const today = new Date();
    
    // Solo procesar si es día 5
    if (today.getDate() !== 5) {
      console.log('No es día de procesamiento automático');
      return false;
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

    // Si no hay objetivos activos, también consideramos que se procesó correctamente
    if (!activeGoals || activeGoals.length === 0) {
      console.log('No hay objetivos activos para procesar');
      return true;
    }

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
    return true; // Retornar true explícitamente cuando todo se procesó

  } catch (error) {
    console.error('Error en el procesamiento automático:', error);
    return false; // Retornar false explícitamente en caso de error
  }
};
