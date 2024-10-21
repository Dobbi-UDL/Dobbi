'use client';
import { supabase } from '@/lib/supabase';

export const getCompanyById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        // Return the company data
        console.log("Fetched company data: ", data);
        return data;

    } catch (error) {
        console.error("Error fetching company data: ", error);
        throw error;
    }
};

export const updateCompanyById = async (id, updatedFields) => {
    try {
        const { data, error } = await supabase
            .from('companies')
            .update(updatedFields)
            .eq('id', id);

        if (error) {
            throw error;
        }

        console.log("Updated company data: ", data);
        return data;
    } catch (error) {
        console.error("Error updating company data: ", error);
        throw error;
    }
};

export const uploadLogo = async (file, id) => {
    const { data, error } = await supabase.storage
        .from('company_logos')
        .upload(`${id}/${file.name}`, file, {
            cacheControl: '3600',
            upsert: false  // prevent overwriting existing files
        });

    if (error) {
        throw error;
    }

    return data.path;
};

export const getPublicUrl = async (filePath) => {
    console.log("Fetching public URL for file path:", filePath);
    const { data } = supabase
        .storage
        .from('company_logos')
        .getPublicUrl(filePath);

    console.log("Fetched public URL:", data.publicURL);
    return data.publicUrl;
};

export const updateCompanyLogo = async (companyId, logoPath) => {
    const { error } = await supabase
        .from('companies')
        .update({ logo: logoPath })
        .eq('id', companyId);

    if (error) {
        console.error("Error updating company logo:", error);
        return;
    }

    console.log("Company logo updated successfully");
};
