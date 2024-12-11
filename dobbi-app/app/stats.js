import React from 'react';
import Stats from '../assets/components/Finances/Stats/Stats';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import i18n from '../i18n';

const StatsScreen = () => {
    return (
        <>
        <Header title="Statistics" />
        <Stats />
        <BottomNavBar />
        </>
    );
};

export default StatsScreen;
