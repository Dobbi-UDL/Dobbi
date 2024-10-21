import { supabase } from "../../../lib/supabaseAdmin";

export async function POST(request) {
    const { name, email, password } = await request.json();
    console.log('Attempting registration with:', { name, email, password });

    try {
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { 
                display_name: name,
             },
        });

        if (authError) throw authError;

        if (authUser && authUser.user) {
            // Insert user into companies table
            const { data: companyData, error: companyError } = await supabase
                .from('companies')
                .insert([{ id: authUser.user.id, name, status: 'pending' }])
                .select();

            if (companyError) throw companyError;

            return new Response(JSON.stringify(
                {
                    message: 'User created successfully',
                    user: companyData[0]
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200,
                });
        } else {
            throw new Error('Failed to create auth user');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }
}