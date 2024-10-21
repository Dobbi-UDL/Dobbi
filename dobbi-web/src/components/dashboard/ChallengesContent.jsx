'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Trophy, Star, Target, CheckCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';

const mockData = [
    {
        title: 'Challenges Completed',
        value: '8',
        icon: Trophy,
        subtext: '2 more than last month',
        color: 'blue',
    },
    {
        title: 'Current Streak',
        value: '5 days',
        icon: Star,
        subtext: 'Keep it up!',
        color: 'yellow',
    },
    {
        title: 'Goals Achieved',
        value: '3',
        icon: Target,
        subtext: '1 more than last month',
        color: 'green',
    },
    {
        title: 'Milestones Reached',
        value: '4',
        icon: CheckCircle,
        subtext: 'No change from last month',
        color: 'purple',
    },
];

export default function ChallengesContent() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null;
    }

    const username = user.user_metadata.display_name || user.email;

    return (
        <div id="challenges-container" className="min-h-screen bg-gradient-to-br from-white to-[#E0F7FA] border border-blue-500">
            <div id="header-space" className="h-16 border"></div>
            <div id="challenges-content" className="container mx-auto px-4 py-8 border border-green-500">
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
                <div id="stats-cards" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {mockData.map((data) => (
                        <StatsCard
                            key={data.title}
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