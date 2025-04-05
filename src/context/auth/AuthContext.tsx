
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
    let authListener: { data: { subscription: { unsubscribe: () => void } } };
    
    const initAuth = async () => {
      try {
        // First, set up the listener for future auth changes
        authListener = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          
          if (!mounted) return;
          
          if (session) {
            console.log('Session found in auth change event');
            // Use setTimeout to prevent potential deadlocks
            setTimeout(async () => {
              if (!mounted) return;
              const formattedUser = await formatUser(session.user);
              setUser(formattedUser);
            }, 0);
          } else {
            console.log('No session in auth change event');
            setUser(null);
          }
        });
        
        // Then check for existing session
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
    
    initAuth();
    
    return () => {
      mounted = false;
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
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
