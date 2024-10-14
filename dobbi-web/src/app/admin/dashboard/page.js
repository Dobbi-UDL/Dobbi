'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"
import { AdminTable } from "@/components/admin/tables/AdminTable"
import { CompanyTable } from "@/components/admin/tables/CompanyTable"
import { UsersTable } from "@/components/admin/tables/UsersTable"
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('companies')
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!user) router.push('/login');
    });

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        {activeTab === 'companies' && <CompanyTable />}
                        {activeTab === 'admins' && <AdminTable />}
                        {activeTab === 'users' && <UsersTable />}
                    </div>
                </main>
            </div>
        </div>
    )
}