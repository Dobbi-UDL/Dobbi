import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DataTable from 'react-data-table-component';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function AdminTable() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    async function fetchCompanies() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false })
                .eq('role', 'admin');

            if (error) throw error;
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    }

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <DataTable
            title="Companies"
            columns={columns}
            data={companies}
            pagination
        />
    );
}