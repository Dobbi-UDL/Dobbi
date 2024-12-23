import { supabase } from '../config/supabaseClient'; 

// La experiencia ganada es el 30% de los puntos de recompensa del objetivo
// Esto ayuda a mantener un progreso más gradual en el sistema de niveles
const XP_CONVERSION_RATE = 0.3;

export const calculateXPForLevel = (level) => {
  return level * 100;
};

export const calculateProgressPercentage = (currentXp, level) => {
  const xpNeeded = calculateXPForLevel(level);
  return (currentXp / xpNeeded) * 100;
};

export const addExperiencePoints = async (userId, amount, description) => {
  try {
    console.log('Adding XP - Raw userId:', userId); // Debug log

    // Validación más estricta del userId
    if (!userId || typeof userId !== 'string') {
      const idString = String(userId).trim();
      if (!idString) {
        throw new Error('Invalid userId: empty or invalid value');
      }
      userId = idString;
    }

    console.log('Processed userId:', userId); // Debug log

    // Obtener datos actuales del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('current_xp, current_level')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      throw userError;
    }

    if (!userData) {
      console.error('User not found for ID:', userId);
      throw new Error('User not found');
    }

    let currentXP = userData.current_xp || 0;
    let currentLevel = userData.current_level || 1;

    const newXP = currentXP + amount;
    const xpNeeded = calculateXPForLevel(currentLevel);

    // Check if level up
    if (newXP >= xpNeeded) {
      currentLevel++;
      currentXP = newXP - xpNeeded;
    } else {
      currentXP = newXP;
    }

    // Actualizar usuario
    const { error: updateError } = await supabase
      .from('users')
      .update({
        current_xp: currentXP,
        current_level: currentLevel,
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    return {
      currentXP,
      currentLevel,
      didLevelUp: newXP >= xpNeeded
    };
  } catch (error) {
    console.error('Error in addExperiencePoints:', error);
    console.error('Failed userId:', userId);
    throw error;
  }
};
