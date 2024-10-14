"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null; // Ensure the component doesn't render anything while redirecting
    }

    return (
        <>
            <div className="h-16"></div>
            <div>
                <h1>Welcome to the dashboard, {user.email}</h1>
            </div>
            <div className="h-60"></div>
            <div id="logout-button">
                <button onClick={signOut}>Logout</button>
            </div>
        </>
    )
};

export default DashboardPage;