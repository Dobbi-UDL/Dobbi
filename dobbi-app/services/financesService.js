import { supabase } from '../config/supabaseClient';

export const fetchCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('financial_categories')
            .select('*');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching financial categories: ", error.message);
        throw error;
    }
};

export const fetchEntries = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('financial_entries')
            .select('id, name, amount, date, category_id')
            .eq('user_id', userId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching financial entries: ", error.message);
        throw error;
    }
};

export const addEntry = async (entry) => {
    try {
        const { data, error } = await supabase
            .from('financial_entries')
            .insert(entry);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error adding financial entry: ", error.message);
        throw error;
    }
}

export const editEntry = async (entry) => {
    try {
        const { data, error } = await supabase
            .from('financial_entries')
            .update(entry)
            .eq('id', entry.id);
        
        if (error) throw error;
        return data;
    }
    catch (error) {
        console.error("Error editing financial entry: ", error.message);
        throw error;
    }
}

export const deleteEntry = async (entryId) => {
    try {
        const { data, error } = await supabase
            .from('financial_entries')
            .delete()
            .eq('id', entryId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error deleting financial entry: ", error.message);
        throw error;
    }
}