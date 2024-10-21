import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import routes from '@/config/routes';

const LogoutPage = () => {
    const router = useRouter();
    const { signOut } = useAuth();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await signOut();

                // Add a delay before redirecting 
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Redirect to the home page after sign out is complete
                router.push(routes.home);

            } catch (error) {
                console.error("Error logging out:", error);
            }
        };

        handleLogout();
    }, [signOut, router]);

    return (
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Logging you out...</h1>
                <p className="text-lg text-gray-600">Thank you for using Dobbi. See you soon!</p>
            </motion.div>
        </div>
    );
};

export default LogoutPage;
