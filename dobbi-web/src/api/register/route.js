import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
    const { email, password, name, userType } = await request.json()

    // Check if it's an app user trying to register through the web
    if (userType === 'app_user' && !request.headers.get('x-app-platform')) {
        return new Response(JSON.stringify({ error: 'App users can only register through the mobile app' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 403,
        })
    }

    try {
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })

        if (authError) throw authError

        if (authUser && authUser.user) {
            if (userType === 'company') {
                const { error: profileError } = await supabase
                    .from('test_companies')
                    .insert([{ id: authUser.user.id, name, status: 'pending' }])

                if (profileError) throw profileError
            } else if (userType === 'app_user') {
                const { error: profileError } = await supabase
                    .from('test_app_users')
                    .insert([{ id: authUser.user.id, name }])

                if (profileError) throw profileError
            }

            return new Response(JSON.stringify({ message: 'User created successfully' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            })
        } else {
            throw new Error('Failed to create auth user')
        }
    } catch (error) {
        console.error('Registration error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        })
    }
}