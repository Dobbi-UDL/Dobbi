import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function CompanyTable() {
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCompanies()
    }, [])

    async function fetchCompanies() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('test_companies')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setCompanies(data)
        } catch (error) {
            console.error('Error fetching companies:', error)
        } finally {
            setLoading(false)
        }
    }

    async function updateCompanyStatus(id, newStatus) {
        try {
            const { data, error } = await supabase
                .from('test_companies')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error
            fetchCompanies()
        } catch (error) {
            console.error('Error updating company status:', error)
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
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Created At</th>
                        <th className="py-3 px-6 text-center">Updated At</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {companies.map((company) => (
                        <tr key={company.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{company.id}</td>
                            <td className="py-3 px-6 text-left">{company.name}</td>
                            <td className="py-3 px-6 text-center">
                                <span className={`bg-${company.status === 'verified' ? 'green' : company.status === 'rejected' ? 'red' : 'yellow'}-200 text-${company.status === 'verified' ? 'green' : company.status === 'rejected' ? 'red' : 'yellow'}-600 py-1 px-3 rounded-full text-xs`}>
                                    {company.status}
                                </span>
                            </td>
                            <td className="py-3 px-6 text-center">{new Date(company.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-6 text-center">{new Date(company.updated_at).toLocaleDateString()}</td>
                            <td className="py-3 px-6 text-center">
                                <div className="flex item-center justify-center">
                                    <button
                                        onClick={() => updateCompanyStatus(company.id, 'verified')}
                                        className="w-4 mr-2 transform hover:text-[#F66C72] hover:scale-110"
                                    >
                                        ✓
                                    </button>
                                    <button
                                        onClick={() => updateCompanyStatus(company.id, 'rejected')}
                                        className="w-4 mr-2 transform hover:text-[#F66C72] hover:scale-110"
                                    >
                                        ✗
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}