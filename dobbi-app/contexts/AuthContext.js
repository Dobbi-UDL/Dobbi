import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../config/supabaseClient';
import { useRouter } from 'expo-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, points')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signUp = async (data) => {
    try {
      const { user: authUser, error: authError } = await supabase.auth.signUp(data);
      if (authError) throw authError;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ id: authUser.id, username: data.username, email: data.email }])
        .select();

      if (userError) throw userError;

      console.log('Inserted user into users table:', userData[0]);
      await fetchUserData(authUser.id);

      console.log('Registration successful');
      return { user: authUser, error: null };
    } catch (error) {
      console.log('Signup error:', error);
      return { user: null, error };
    }
  };

  const signIn = async (data) => {
    setLoading(true);
    const { user: authUser, error } = await supabase.auth.signInWithPassword(data);
    if (authUser) {
      await fetchUserData(authUser.id);
    }
    setLoading(false);
    return { user: authUser, error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
    router.push('/login');
  };

  const value = {
    signUp,
    signIn,
    signOut,
    session,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};