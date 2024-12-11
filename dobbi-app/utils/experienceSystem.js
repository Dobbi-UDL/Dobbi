// utils/experienceSystem.js
export const calculateXPForLevel = (level) => {
  return level * 100;
};

export const calculateProgressPercentage = (currentXp, level) => {
  const xpNeeded = calculateXPForLevel(level);
  return (currentXp / xpNeeded) * 100;
};

export const addExperiencePoints = async (userData, amount, description) => {
  try {
    let currentXP = userData?.current_xp || 0;
    let currentLevel = userData?.current_level || 1;

    const newXP = currentXP + amount;
    const xpNeeded = calculateXPForLevel(currentLevel);

    // Check if level up
    if (newXP >= xpNeeded) {
      currentLevel++;
      currentXP = newXP - xpNeeded;
    } else {
      currentXP = newXP;
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        current_xp: currentXP,
        current_level: currentLevel,
      })
      .eq("id", userData.id)
      .select();

    if (error) throw error;

    await supabase.from("experience_history").insert({
      user_id: userData.id,
      amount: amount,
      description: description,
      timestamp: new Date().toISOString(),
    });

    return {
      currentXP,
      currentLevel,
    };
  } catch (error) {
    console.error("Error adding experience points:", error);
    throw error;
  }
};
