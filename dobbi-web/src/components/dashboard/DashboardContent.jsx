'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Gift, Eye, MousePointer, CheckCircle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

const mockData = [
    {
        title: 'Active Offers',
        value: '5',
        icon: Gift,
        subtext: 'No change from last month',
        color: 'orange',
    },
    {
        title: 'Views This Month',
        value: '100',
        icon: Eye,
        subtext: '20% increase from last month',
        color: 'green',
    },
    {
        title: 'Clicks This Month',
        value: '50',
        icon: MousePointer,
        subtext: '10% increase from last month',
        color: 'purple',
    },
    {
        title: 'Redemptions This Month',
        value: '10',
        icon: CheckCircle,
        subtext: '5% decrease from last month',
        color: 'red',
    },
];

export default function DashboardContent() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null;
    }

    const username = user.user_metadata.display_name || user.email;

    return (
        <div id="dashboard-container" className="bg-gradient-to-br from-white to-[#FFF0F0] border border-red-500">
            <div id="header-space" className="h-16 border"></div>
            <div id="dashboard-content" className="container mx-auto px-4 py-8 border border-blue-500">
                <div id="greeting" className="mb-8 border">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold mb-6 text-gray-800"
                    >
                        Welcome back, {username}!
                    </motion.h1>
                </div>
                <div id="stat-cards" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {mockData.map((data) => (
                        <StatCard
                            title={data.title}
                            value={data.value}
                            icon={data.icon}
                            subtext={data.subtext}
                            color={data.color}
                        />
                    ))}
                </div>
                <div id="logout-button" className="border">
                    <button
                        onClick={signOut}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}