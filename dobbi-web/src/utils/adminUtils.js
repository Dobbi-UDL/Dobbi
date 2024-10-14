import { supabase } from '../lib/supabaseAdmin';

export async function checkIfAdmin(data) {
    if (data?.user?.id) {
        const { data: adminData, error: adminError } = await supabase
            .from('test_admins')
            .select('id')
            .eq('id', data.user.id)
            .single();

        if (adminError) throw adminError;

        if (adminData) return true;
    }
    return false;
}