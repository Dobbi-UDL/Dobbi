import { supabase } from "@/lib/supabaseAdmin";

export async function DELETE(request) {
    const { userId } = await request.json();
    console.log('Attempting to delete user with ID:', userId);

    try {
        // Delete user from auth
        const { error } = await supabase.auth.admin.deleteUser(userId);

        if (error) throw error;

        // Companies are deleted on cascade, so no need to delete company data

        return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Deletion error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }
}
