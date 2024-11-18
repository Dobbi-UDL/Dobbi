import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../config/supabaseClient';
//import { useRouter } from 'expo-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  //const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session on mount');
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        alert('An error occurred while checking session');
        return;
      }

      setSession(data?.session ?? null);
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setLoading(false);
      console.log('Auth state changed:', event, session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (data) => {
    try {
      console.log('Attempting registration with:', data);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { display_name: data.name },
        },
      });
      if (authError) throw authError;

      const authUser = authData?.user ?? null;
      if (authUser) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            id: authUser.id,
            username: data.name,
            points: 0
          }])
          .select('username, points');

        if (userError) throw userError;

        console.log('Inserted user into users table:', userData[0]);
      }

      console.log('Registration successful');
      return { user: authUser, error: null };

    } catch (error) {
      console.log('Signup error:', error);
      return { user: null, error };
    }
  };

  const signIn = async (data) => {
    setLoading(true);
    supabase.auth.signInWithPassword(data);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    //router.push('/');
  }

  const value = {
    signUp,
    signIn,
    signOut,
    session,
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