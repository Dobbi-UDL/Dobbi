import React from 'react';
import AssignedGoalsView from '../assets/components/ChallengesScreen/AssignedGoalsView';
import SponsoredGoalsView from '../assets/components/ChallengesScreen/SponsoredGoalsView';
import TabView from '../assets/components/common/TabView';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import i18n from '../i18n';
import { useAuth } from '../contexts/AuthContext';

const ChallengesScreen = () => {
    const { user } = useAuth();
    const tabs = ['Assigned Goals', 'Sponsored Goals'];

    return (
        <>
            <Header title={'Saving goals'}/>
            <TabView tabs={tabs}>
                <AssignedGoalsView userId={user?.id} />
                <SponsoredGoalsView userId={user?.id} />
            </TabView>
            <BottomNavBar />
        </>
    );
};

export default ChallengesScreen;
