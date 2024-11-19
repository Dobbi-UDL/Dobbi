import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      console.log('Checking session on mount');
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        alert('An error occurred while checking session');
        return;
      }

      // Set current session
      setSession(data?.session ?? null);

      // Set current user if session exists, else remain null
      if(data?.session?.user) {
        await fetchUserData(session.id);
      }

      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
      console.log('Auth state changed:', event, session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    try{
      console.log('Fetching user data for:', userId);
      console.log('Current user:', user);
      console.log('Current session:', session);
      const { data, error } = await supabase
        .from('users')
        .select('id, username, points')
        .eq('id', userId)
        .single();

      if(error) throw error;

      setUser(data);
    }catch(error){
      console.log('Error fetching user data:', error);
    }
  };

  const signUp = async (data) => {
    try {
      console.log('Attempting registration with:', data);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { display_name: data.username },
        },
      });
      if (authError) throw authError;

      const authUser = authData?.user ?? null;
      if (authUser) {
        console.log('Trying to insert user into users table:',
          { id: authUser.id, username: data.username, points: 0 });
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            id: authUser.id,
            username: data.username,
            points: 0
          }])
          .select('id, username, points');

        if (userError) throw userError;

        console.log('Inserted user into users table:', userData[0]);
        setUser(userData[0]);
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
    return await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  }

  const value = {
    signUp,
    signIn,
    signOut,
    session,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};