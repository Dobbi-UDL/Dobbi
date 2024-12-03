import React from 'react';
import Stats from '../assets/components/Finances/Stats/Stats';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';

export default function StatsScreen() {
    return (
        <>
            <Header />
            <Stats />
            <BottomNavBar />
        </>
    );
}
