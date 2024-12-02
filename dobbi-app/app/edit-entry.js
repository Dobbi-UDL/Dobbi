import React from 'react';
import EditEntry from '../assets/components/Finances/Details/EditEntry';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import i18n from '../i18n';
import { useLanguage } from '@languagecontext';

const EditEntryScreen = ({ route, navigation }) => {
    const { locale } = useLanguage();

    return (
        <>
            <Header />
            <EditEntry route={route} navigation={navigation} />
            <BottomNavBar />
        </>
    );
};

export default EditEntryScreen;