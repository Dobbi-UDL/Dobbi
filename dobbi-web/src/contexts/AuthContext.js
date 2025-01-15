"use client";

//Web app context for user authentication
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("AuthProvider useEffect running");

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.email);
      }
      setLoading(false);
    };

    fetchSession();  // removed the extra 's' here

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminRole(session.user.email);
        }
        setLoading(false);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const checkAdminRole = async (email) => {
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("role")
      .eq("email", email)
      .single();
    if (companyError) {
      console.error("Error fetching company data:", companyError);
      return;
    }
    if (companyData?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const signUp = async (data) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      return { data: result, error: null };
    } catch (error) {
      console.error("Registration error:", error);
      return { data: null, error };
    }
  };

  const signIn = async (data) => {
    // Check if the user exists in the companies table
    console.log("email", data.email);
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("email", data.email);
    if (companyError) {
      return { data: null, error: companyError };
    }
    console.log("companyData", companyData);

    if (!companyData || companyData.length === 0) {
      return {
        data: null,
        error: new Error("User not found in companies table"),
      };
    }

    if (companyData[0].status === "pending") {
      return {
        data: companyData[0],
        error: new Error("User registration is pending"),
      };
    }

    if (companyData[0].status === "rejected") {
      return {
        data: companyData[0],
        error: new Error("User registration is rejected"),
      };
    }

    // Proceed with sign in if user exists in companies table
    const { user: signInData, error: signInError } =
      await supabase.auth.signInWithPassword(data);

    if (signInError) {
      return { data: null, error: signInError };
    }
    if (companyData[0].role === "admin") {
      setIsAdmin(true);
    }

    return { data: companyData[0], error: null };
  };

  const value = {
    signUp,
    signIn,
    signOut: () => {
      supabase.auth.signOut();
      setIsAdmin(false); // Reset isAdmin on sign out
    },
    user,
    isAdmin,
  };

  console.log("AuthProvider rendering, user:", user);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Single export statement for all exports
export { AuthContext, AuthProvider };
