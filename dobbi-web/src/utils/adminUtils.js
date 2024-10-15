import { supabase } from '../lib/supabaseAdmin';

export async function checkIfAdmin(data) {
    if (data?.user?.id) {
        console.log('Checking if user is admin:', data.user.id);
        const { data: adminData, error: adminError } = await supabase
            .from('test_admins')
            .select('id')
            .eq('id', data.user.id)
            .select();
        
        console.log('Admin data:', adminData);
        console.log('Admin error:', adminError);
        
        if (adminError) throw adminError;

        if (adminData) return true;
    }
    return false;
}