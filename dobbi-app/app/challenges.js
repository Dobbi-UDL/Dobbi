import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import AssignedGoalsView from '../assets/components/ChallengesScreen/AssignedGoalsView';
import SponsoredGoalsView from '../assets/components/ChallengesScreen/SponsoredGoalsView';
import TabView from '../assets/components/common/TabView';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import { useAuth } from '../contexts/AuthContext';

const ChallengesScreen = () => {
    const { highlightGoalId } = useLocalSearchParams();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ['Assigned Goals', 'Sponsored Goals'];
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        // Si hay un highlightGoalId, asegúrate de mostrar la pestaña correcta
        if (highlightGoalId) {
            setActiveTab(0); // Asume que los objetivos están en la primera pestaña
        }
    }, [highlightGoalId]);

    const handleGoalUpdate = () => {
        console.log('Refreshing all views...');
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            <Header title={'Saving goals'}/>
            <TabView 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            >
                <AssignedGoalsView 
                    userId={user?.id} 
                    refreshTrigger={refreshTrigger} 
                    onGoalUpdate={handleGoalUpdate}
                    highlightGoalId={highlightGoalId}
                />
                <SponsoredGoalsView 
                    userId={user?.id} 
                    refreshTrigger={refreshTrigger}
                    onGoalUpdate={handleGoalUpdate}
                />
            </TabView>
            <BottomNavBar />
        </>
    );
};

export default ChallengesScreen;
