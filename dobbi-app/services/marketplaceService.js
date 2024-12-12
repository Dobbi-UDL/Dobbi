import { supabase } from '../config/supabaseClient';

export async function getCategories() {
    try {
        const { data, error } = await supabase
            .from('offer_categories')
            .select('id, name') // Add name field to selection

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export async function getUnredeemedOffersbyCategory(userId, categoryId) {
    try {
        const { data, error } = await supabase.rpc('get_unredeemed_offers_by_category', {
            p_user_id: userId,
            p_category_id: categoryId // This expects a UUID, not a string name
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error fetching unredeemed offers for category ${categoryId}:`, error);
        throw error;
    }
}

export async function getAllUnredeemedOffers(userId) {
    try {
        const categories = await getCategories();

        const unredeemedOffers = await Promise.all(
            categories.map(async (category) => {
                try {
                    const offers = await getUnredeemedOffersbyCategory(userId, category.id);
                    return {
                        category_name: category.name, // Now category.name will be available
                        category_id: category.id,
                        offers
                    };
                } catch (error) {
                    console.error(`Error fetching offers for category ${category.name}:`, error);
                    return {
                        category: category.name,
                        categoryId: category.id,
                        offers: []
                    };
                }
            })
        );

        // Filter out categories with no offers and log for debugging
        const filteredOffers = unredeemedOffers.filter(item => item.offers && item.offers.length > 0);
        return filteredOffers;

    } catch (error) {
        console.error('Error fetching all unredeemed offers:', error);
        throw error;
    }
}

