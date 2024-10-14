import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function AdminTable() {
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAdmins()
    }, [])

    async function fetchAdmins() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('test_admin')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAdmins(data)
        } catch (error) {
            console.error('Error fetching admins:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">ID</th>
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-center">Created At</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {admins.map((admin) => (
                        <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{admin.id}</td>
                            <td className="py-3 px-6 text-left">{admin.name}</td>
                            <td className="py-3 px-6 text-center">{new Date(admin.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}