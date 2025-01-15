"use client";

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import GuestHeader from './GuestHeader';
import Navbar from './Navbar';

const Header = () => {
    const { user } = useAuth();

    return user ? <Navbar /> : <GuestHeader />;
};

export default Header;