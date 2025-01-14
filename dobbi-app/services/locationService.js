import { supabase } from '../config/supabaseClient';

export const locationService = {
    async searchCountries(searchTerm = '') {
        try {
            const { data, error } = await supabase
                .rpc('search_countries', {
                    search_term: searchTerm
                });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching countries:', error);
            return [];
        }
    },

    async searchRegions(searchTerm = '', countryId) {
        try {
            const { data, error } = await supabase
                .rpc('search_regions', {
                    search_term: searchTerm,
                    country_id_param: countryId
                });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching regions:', error);
            return [];
        }
    },

    // Get all available countries (since we'll have a limited set)
    async getAvailableCountries() {
        try {
            const { data, error } = await supabase
                .from('available_countries')
                .select('id, name, country_code')
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching available countries:', error);
            return [];
        }
    }
};
