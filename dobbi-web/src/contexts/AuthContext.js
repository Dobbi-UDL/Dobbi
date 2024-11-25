//Web app context for user authentication
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        console.log('AuthProvider useEffect running');

        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            supabase.auth.
            setUser(session?.user ?? null);
            setLoading(false);
        };

        fetchSession();

        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signUp = async (data) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (!response.ok) throw new Error(result.error);

            return { data: result, error: null };
        } catch (error) {
            console.error('Registration error:', error);
            return { data: null, error };
        }
    };

    const signIn = async (data) => {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(data);
        if (signInError) {
            return { data: null, error: signInError };
        }

        const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', signInData.user.id)
            .single();
        console.log('companyData:', companyData.rol);
        if (companyData.role === 'admin') {
            setIsAdmin(true);
        }
        if (companyError) {
            return { data: null, error: companyError };
        }

        return { data: signInData, error: null };
    };


    const value = {
        signUp,
        signIn,
        signOut: () => supabase.auth.signOut(),
        user,
        isAdmin,
    };

    console.log('AuthProvider rendering, user:', user);

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};