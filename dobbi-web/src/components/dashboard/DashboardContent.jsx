'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardContent() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div id="dashboard-container" className="container mx-auto px-4 py-8 bg-gradient-to-br from-white to-[#FFF0F0] border border-red-500">
            <div id="header-space" className="h-16 border"></div>
            <div id="dashboard-content" className="border">
                <div id="greeting" className="mb-8 border">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold mb-6 text-gray-800"
                    >
                        Welcome back, User!
                    </motion.h1>
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
