import { supabase } from '../config/supabaseClient';

export const profileService = {
  async getProfileDetails(userId) {
    try {
      // First check if user exists in users_profile
      const { data: existingProfile } = await supabase
        .from('users_profile')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      // If no profile exists, create one
      if (!existingProfile) {
        await supabase
          .from('users_profile')
          .insert([{ id: userId }]);
      }

      // Now fetch the complete profile with left joins
      const { data, error } = await supabase
        .from('users_profile')
        .select(`
          *,
          country:available_countries!left(id, name, country_code),
          region:regions!left(id, name),
          motivations:user_motivations!left(
            motivation_ids,
            other_motivation
          ),
          goals:user_goals!left(
            goal_ids,
            other_goal
          ),
          financials:user_financials!left(
            experience,
            savings,
            situation,
            debt_types,
            other_debt
          )
        `)
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single

      if (error) {
        console.error('Error in profile details query:', error);
        throw error;
      }

      // If no data returned, return default structure
      if (!data) {
        return {
          id: userId,
          role: null,
          gender: null,
          education: null,
          country: null,
          region: null,
          motivations: { motivation_ids: [], other_motivation: '' },
          goals: { goal_ids: [], other_goal: '' },
          financials: {
            experience: null,
            savings: null,
            situation: null,
            debt_types: [],
            other_debt: ''
          }
        };
      }

      return data;
    } catch (error) {
      console.error('Error in getProfileDetails:', error);
      // Return default structure on error
      return {
        id: userId,
        role: null,
        gender: null,
        education: null,
        country: null,
        region: null,
        motivations: { motivation_ids: [], other_motivation: '' },
        goals: { goal_ids: [], other_goal: '' },
        financials: {
          experience: null,
          savings: null,
          situation: null,
          debt_types: [],
          other_debt: ''
        }
      };
    }
  },

  async updateProfile(userId, profileData) {
    try {
      // Start by updating the user profile
      const { error: profileError } = await supabase
        .from('users_profile')
        .upsert({
          id: userId,
          role: profileData.personal.role,
          gender: profileData.personal.gender,
          education: profileData.personal.education,
          country_id: profileData.personal.country?.id,
          region_id: profileData.personal.region?.id,
          birthday: profileData.personal.birthday
        });

      if (profileError) throw profileError;

      // Update motivations - delete existing first
      await supabase
        .from('user_motivations')
        .delete()
        .eq('user_id', userId);

      const { error: motivationsError } = await supabase
        .from('user_motivations')
        .insert({
          user_id: userId,
          motivation_ids: profileData.motivations.motivation_ids || [],
          other_motivation: profileData.motivations.other_motivation
        });

      if (motivationsError) throw motivationsError;

      // Update goals - delete existing first
      await supabase
        .from('user_goals')
        .delete()
        .eq('user_id', userId);

      const { error: goalsError } = await supabase
        .from('user_goals')
        .insert({
          user_id: userId,
          goal_ids: profileData.goals.goal_ids || [],
          other_goal: profileData.goals.other_goal
        });

      if (goalsError) throw goalsError;

      // Update financials - delete existing first
      await supabase
        .from('user_financials')
        .delete()
        .eq('user_id', userId);

      const { error: financialsError } = await supabase
        .from('user_financials')
        .insert({
          user_id: userId,
          experience: profileData.financials.experience,
          savings: profileData.financials.savings,
          situation: profileData.financials.situation,
          debt_types: profileData.financials.debt_types || [],
          other_debt: profileData.financials.other_debt
        });

      if (financialsError) throw financialsError;

      // Fetch existing notifications for this user
      const { data: userNotifications, error: fetchError } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      // If exactly one row, update it
      if (userNotifications?.length === 1) {
        const { error: updateError } = await supabase
          .from('user_notifications')
          .update({
            expenses_reminder: profileData.notifications.expenses_reminder ?? false,
            goals_updates: profileData.notifications.goals_updates ?? false,
            rewards_notification: profileData.notifications.rewards_notification ?? false,
            app_updates: profileData.notifications.app_updates ?? false,
            ai_tips: profileData.notifications.ai_tips ?? false,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        if (updateError) throw updateError;
      } else {
        // Otherwise, delete any rows and insert a new one
        await supabase
          .from('user_notifications')
          .delete()
          .eq('user_id', userId);

        const { error: insertError } = await supabase
          .from('user_notifications')
          .insert([{
            user_id: userId,
            expenses_reminder: profileData.notifications.expenses_reminder ?? false,
            goals_updates: profileData.notifications.goals_updates ?? false,
            rewards_notification: profileData.notifications.rewards_notification ?? false,
            app_updates: profileData.notifications.app_updates ?? false,
            ai_tips: profileData.notifications.ai_tips ?? false
          }]);
        if (insertError) throw insertError;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        error: error.message,
        details: error.details 
      };
    }
  }
};
