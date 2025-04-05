
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthUser } from './types';
import { formatUser } from './utils';
import { useAuthOperations } from './useAuthOperations';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { signIn, signUp, signOut, googleSignIn } = 
    useAuthOperations(setUser, setLoading);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (mounted) {
        if (session) {
          console.log('Session found in auth change event');
          const formattedUser = await formatUser(session.user);
          setUser(formattedUser);
        } else {
          console.log('No session in auth change event');
          setUser(null);
        }
      }
    });
    
    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (mounted) {
          if (sessionData?.session) {
            console.log('Existing session found during initialization');
            const formattedUser = await formatUser(sessionData.session.user);
            setUser(formattedUser);
          } else {
            console.log('No existing session found during initialization');
            setUser(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };
    
    initSession();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    googleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
