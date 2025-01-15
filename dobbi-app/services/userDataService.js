import { supabase } from '../config/supabaseClient';

export const userDataService = {
    async getUserData(userId) {
        try {
            const { data, error } = await supabase
                .rpc('get_user_data', {
                    p_user_id: userId
                });

            if (error) throw error;

            if (!data || data.length === 0) {
                return {
                    success: false,
                    error: 'No user data found'
                };
            }

            // Transform the raw data into a more usable format
            const userData = {
                profile: data[0].profile || {},
                motivations: {
                    items: data[0].motivations?.motivation_ids || [],
                    other: data[0].motivations?.other_motivation
                },
                goals: {
                    items: data[0].goals?.goal_ids || [],
                    other: data[0].goals?.other_goal
                },
                financials: {
                    experience: data[0].financials?.experience,
                    savings: data[0].financials?.savings,
                    situation: data[0].financials?.situation,
                    debtTypes: data[0].financials?.debt_types || [],
                    otherDebt: data[0].financials?.other_debt
                },
                notifications: {
                    expenses: data[0].notifications?.expenses_reminder || false,
                    goals: data[0].notifications?.goals_updates || false,
                    rewards: data[0].notifications?.rewards_notification || false,
                    updates: data[0].notifications?.app_updates || false,
                    tips: data[0].notifications?.ai_tips || false
                }
            };

            return {
                success: true,
                data: userData
            };

        } catch (error) {
            console.error('Error fetching user data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};
