"use client"; 

import { useEffect, useState } from 'react';
import { PieChart, PiggyBank, Users, Gift, Briefcase, ClipboardCheck, Megaphone } from 'lucide-react';
import { useScroll } from "@/contexts/ScrollContext";

const userFeatures = [
    {
        icon: <PieChart className="w-12 h-12 text-[#F66C72]" />,
        title: 'Expense Tracking',
        description: 'Track and categorize your expenses to gain insights into your spending habits.',
        color: 'bg-[#F66C72]'
    },
    {
        icon: <PiggyBank className="w-12 h-12 text-[#F66C72]" />,
        title: 'Saving Goals',
        description: 'Set and track saving goals to achieve your financial objectives.',
        color: 'bg-[#F66C72]'
    },
    {
        icon: <Users className="w-12 h-12 text-[#F66C72]" />,
        title: 'Community Insights',
        description: 'Compare your financial habits with others in your demographic group.',
        color: 'bg-[#F66C72]'
    },
    {
        icon: <Gift className="w-12 h-12 text-[#F66C72]" />,
        title: 'Exclusive Deals',
        description: 'Earn points and unlock exclusive discounts from partner companies.',
        color: 'bg-[#F66C72]'
    }
]

const companyFeatures = [
    {
        icon: <Briefcase className="w-12 h-12 text-[#F66C72]" />,
        title: 'Advanced Analytics',
        description: 'Gain deep insights into user behavior and offer performance with our advanced analytics tools.',
        color: 'bg-[#F66C72]'
    },
    {
        icon: <ClipboardCheck className="w-12 h-12 text-[#F66C72]" />,
        title: 'Targeted Marketing',
        description: 'Create targeted marketing campaigns based on detailed demographic data.',
        color: 'bg-[#F66C72]'
    },
    {
        icon: <Megaphone className="w-12 h-12 text-[#F66C72]" />,
        title: 'Brand Promotion',
        description: 'Promote your brand through sponsored challenges and exclusive offers.',
        color: 'bg-[#F66C72]'
    }
];


function FeatureCard({ icon, title, description, color }) {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105`}>
            <div className="text-center">
                <div className="inline-block p-3 rounded-full bg-white shadow-md mb-4">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    )
}

export default function Features() {
    const { scrollY } = useScroll();
    const features = [...userFeatures, ...companyFeatures];
    const [visibleElements, setVisibleElements] = useState({
        title: false,
        cards: Array(features.length).fill(false),
    });

    const title_threshold = 250; 
    const cards_threshold = 300;

    useEffect(() => {
        const newVisibleElements = {
            title: scrollY > title_threshold,
            cards: features.map((_, index) => scrollY > (cards_threshold + index * 100)),
        };

        setVisibleElements(newVisibleElements);
    }, [scrollY]);

    const indexDiff = userFeatures.length;
    return (
        <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6">
                <h2
                    className={`text-3xl font-bold text-center text-gray-800 mb-12 transition-transform duration-10700 ease-in-out transform ${visibleElements.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-20px]'}`}
                >
                    Key Features
                </h2>
                <div className="mb-12">
                    <div id="user-features" className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        {userFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className={`transition-transform duration-700 ease-in-out transform ${visibleElements.cards[index] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-50px]'}`}
                            >
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            </div>
                        ))}
                    </div>

                    <p></p>

                    <div id="company-features" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {companyFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className={`transition-transform duration-700 ease-in-out transform ${visibleElements.cards[index + indexDiff] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-50px]'}`}
                            >
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
