import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GuestHeader from '@/components/common/GuestHeader';
import Navbar from '@/components/common/Navbar';

const Header = () => {
    const { user } = useAuth();

    return user ? <Navbar /> : <GuestHeader />;
};

export default Header;