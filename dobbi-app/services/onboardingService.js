import { supabase } from '../config/supabaseClient';

export const onboardingService = {
    async saveOnboardingData(userId, data) {
        try {
            // Start a transaction by using multiple requests
            const {
                role, birthday, gender, education, country, region,  // Profile data
                motivations, otherMotivation,                       // Motivations
                goals, otherGoal,                                   // Goals
                experience, savings, situation, debtTypes, otherDebt, // Financials
                notifications                                        // Notifications
            } = data;

            // Insert profile data
            const { error: profileError } = await supabase
                .from('users_profile')
                .insert({
                    id: userId,
                    role,
                    birthday,
                    gender,
                    education,
                    country_id: country?.id,
                    region_id: region?.id
                });

            if (profileError) throw profileError;

            // Insert motivations
            const { error: motivationsError } = await supabase
                .from('user_motivations')
                .insert({
                    user_id: userId,
                    motivation_ids: motivations,
                    other_motivation: otherMotivation
                });

            if (motivationsError) throw motivationsError;

            // Insert goals
            const { error: goalsError } = await supabase
                .from('user_goals')
                .insert({
                    user_id: userId,
                    goal_ids: goals,
                    other_goal: otherGoal
                });

            if (goalsError) throw goalsError;

            // Insert financials
            const { error: financialsError } = await supabase
                .from('user_financials')
                .insert({
                    user_id: userId,
                    experience,
                    savings,
                    situation,
                    debt_types: debtTypes,
                    other_debt: otherDebt
                });

            if (financialsError) throw financialsError;

            // Insert notification preferences
            const { error: notificationsError } = await supabase
                .from('user_notifications')
                .insert({
                    user_id: userId,
                    expenses_reminder: notifications.expenses ?? false,
                    goals_updates: notifications.goals ?? false,
                    rewards_notification: notifications.rewards ?? false,
                    app_updates: notifications.updates ?? false,
                    ai_tips: notifications.tips ?? false
                });

            if (notificationsError) throw notificationsError;

            return { success: true };

        } catch (error) {
            console.error('Error saving onboarding data:', error);
            return { success: false, error };
        }
    }
};
