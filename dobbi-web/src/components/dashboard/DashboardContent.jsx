import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiTarget, FiGift, FiCheck, FiTrendingUp } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import StatCard from '@/components/dashboard/StatsCard';
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DashboardContent() {
    const { user } = useAuth();
    const router = useRouter();

    const [goalClicks, setGoalClicks] = useState(0);
    const [goalRedemptions, setGoalRedemptions] = useState(0);
    const [offerClicks, setOfferClicks] = useState(0);
    const [activeOffers, setActiveOffers] = useState(0);
    const [offerRedemptions, setOfferRedemptions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: goalClicksData} = await supabase
                    .from('goal_statistics')
                    .select(`
                        *,
                        saving_goals!inner (
                            *,
                            companies (
                                *
                            )
                        )
                    `)
                    .eq('saving_goals.company_id', user.id) 
                    .eq('type_action', 'click');
                        
                const { data: goalRedemptionsData} = await supabase
                    .from('goal_statistics')
                    .select(`
                        *,
                        saving_goals!inner (
                            *,
                            companies (
                                *
                            )
                        )
                    `)
                    .eq('saving_goals.company_id', user.id) 
                    .eq('type_action', 'redemption');

                const { data: offerClicksData } = await supabase
                    .from('offer_interactions')
                    .select('*, offers!inner (*)')
                    .eq('type_action', 'click')
                    .eq('offers.company_id', user.id);

                const { data: offerRedemptionsData } = await supabase
                    .from('offer_interactions')
                    .select('*, offers!inner (*)')
                    .eq('type_action', 'redeem')
                    .eq('offers.company_id', user.id);


                const { data: activeOffersData } = await supabase
                    .from('offers')
                    .select('*')
                    .eq('offer_status', 'active')
                    .eq('company_id', user.id);

                setGoalClicks(goalClicksData?.length || 0);
                setGoalRedemptions(goalRedemptionsData?.length || 0);
                setOfferClicks(offerClicksData?.length || 0);
                setActiveOffers(activeOffersData?.length || 0);
                setOfferRedemptions(offerRedemptionsData?.length || 0);

                // Process monthly statistics
                const monthlyData = processMonthlyStats(goalClicksData, goalRedemptionsData, offerClicksData, offerRedemptionsData);
                setMonthlyStats(monthlyData);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [user.id]);

    const processMonthlyStats = (goalClicks, goalRedemptions, offerClicks, offerRedemptions) => {
        const monthlyStats = {};

        [
            { data: goalClicks, type: 'goalClicks' },
            { data: goalRedemptions, type: 'goalRedemptions' },
            { data: offerClicks, type: 'offerClicks' },
            { data: offerRedemptions, type: 'offerRedemptions' }
        ].forEach(({ data, type }) => {
            data?.forEach(item => {
                const date = new Date(item.created_at);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!monthlyStats[monthKey]) {
                    monthlyStats[monthKey] = {
                        month: monthKey,
                        goalClicks: 0,
                        goalRedemptions: 0,
                        offerClicks: 0,
                        offerRedemptions: 0
                    };
                }
                monthlyStats[monthKey][type]++;
            });
        });

        return Object.values(monthlyStats).sort((a, b) => a.month.localeCompare(b.month));
    };

    const statsData = [
        {
            title: 'Goal Clicks',
            value: goalClicks,
            icon: FiTarget,
            subtext: 'Total goal interactions',
            color: 'blue'
        },
        {
            title: 'Goal Redemptions',
            value: goalRedemptions,
            icon: FiCheck,
            subtext: 'Goals redeemed',
            color: 'green'
        },
        {
            title: 'Offer Clicks',
            value: offerClicks,
            icon: FiGift,
            subtext: 'Total offer interactions',
            color: 'purple'
        },
        {
            title: 'Active Offers',
            value: activeOffers,
            icon: FiTrendingUp,
            subtext: 'Currently active offers',
            color: 'orange'
        }
    ];

    const getMaxValue = (data) => {
        return Math.max(...data.flatMap(item => [
            item.goalClicks,
            item.goalRedemptions,
            item.offerClicks
        ]));
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    const username = user.user_metadata.display_name || user.email;

    const filteredMonthlyStats = monthlyStats.filter((item) => {
        if (!startDate || !endDate) return true;
        // Convert "YYYY-MM" to an actual date
        const itemDate = new Date(item.month + '-01');
        return itemDate >= startDate && itemDate <= endDate;
    });

    return (
        <div id="dashboard-container" className="min-h-screen bg-gradient-to-br from-white to-[#FFF0F0]">
            <div id="header-space" className="h-16"></div>
            <div id="dashboard-content" className="container mx-auto px-4 py-8">
                <div id="greeting" className="mb-8">
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
                    {isLoading ? (
                        <div>Loading statistics...</div>
                    ) : (
                        statsData.map((data, index) => (
                            <StatCard
                                key={index}
                                title={data.title}
                                value={data.value}
                                icon={data.icon}
                                subtext={data.subtext}
                                color={data.color}
                            />
                        ))
                    )}
                </div>
                
                {!isLoading && monthlyStats.length > 0 && (
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left">Month</th>
                                                <th className="px-4 py-2 text-left">Goal Clicks</th>
                                                <th className="px-4 py-2 text-left">Goal Redemptions</th>
                                                <th className="px-4 py-2 text-left">Offer Clicks</th>
                                                <th className="px-4 py-2 text-left">Offer Redemptions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyStats.map((stat, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-4 py-2">{stat.month}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 bg-gray-200 h-4 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-blue-500 transition-all"
                                                                    style={{ 
                                                                        width: `${(stat.goalClicks / getMaxValue(monthlyStats)) * 100}%` 
                                                                    }}
                                                                />
                                                            </div>
                                                            <span>{stat.goalClicks}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 bg-gray-200 h-4 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-green-500 transition-all"
                                                                    style={{ 
                                                                        width: `${(stat.goalRedemptions / getMaxValue(monthlyStats)) * 100}%` 
                                                                    }}
                                                                />
                                                            </div>
                                                            <span>{stat.goalRedemptions}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 bg-gray-200 h-4 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-purple-500 transition-all"
                                                                    style={{ 
                                                                        width: `${(stat.offerClicks / getMaxValue(monthlyStats)) * 100}%` 
                                                                    }}
                                                                />
                                                            </div>
                                                            <span>{stat.offerClicks}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 bg-gray-200 h-4 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-purple-500 transition-all"
                                                                    style={{ 
                                                                        width: `${(stat.offerRedemptions / getMaxValue(monthlyStats)) * 100}%` 
                                                                    }}
                                                                />
                                                            </div>
                                                            <span>{stat.offerRedemptions}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-2">Total Interactions</h3>
                                        <p className="text-2xl font-bold">
                                            {goalClicks + goalRedemptions + offerClicks + offerRedemptions}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-2">Goal Redemption Rate</h3>
                                        <p className="text-2xl font-bold">
                                            {goalClicks ? ((goalRedemptions / goalClicks) * 100).toFixed(1) : 0}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-2">Offer Redemption Rate</h3>
                                        <p className="text-2xl font-bold">
                                            {offerClicks ? ((offerRedemptions / offerClicks) * 100).toFixed(1) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* New interactive chart below */}
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Monthly Stats Chart</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4">
                                    <div>
                                        <label className="block font-medium mb-1">Start Date</label>
                                        <DatePicker 
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select start date"
                                            className="border rounded px-2 py-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">End Date</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select end date"
                                            className="border rounded px-2 py-1"
                                        />
                                    </div>
                                </div>
                                <div className="w-full overflow-x-auto">
                                    <LineChart
                                        width={700}
                                        height={300}
                                        data={filteredMonthlyStats}
                                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="goalClicks" stroke="#8884d8" name="Goal Clicks" />
                                        <Line type="monotone" dataKey="goalRedemptions" stroke="#82ca9d" name="Goal Redemptions" />
                                        <Line type="monotone" dataKey="offerClicks" stroke="#ffc658" name="Offer Clicks" />
                                        <Line type="monotone" dataKey="offerRedemptions" stroke="#f66c72" name="Offer Redemptions" />
                                    </LineChart>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}