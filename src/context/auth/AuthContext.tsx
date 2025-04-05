
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
    
    // This will store our subscription to auth state changes
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;
    
    const initAuth = async () => {
      try {
        // First, set up the listener for future auth changes
        // CRITICAL: We need to make sure we don't trigger recursive auth state updates
        authSubscription = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          
          if (!mounted) return;
          
          // Use setTimeout to break potential deadlock/recursion
          // This defers the execution until the next event loop
          setTimeout(() => {
            if (!mounted) return;
            
            if (session && session.user) {
              console.log('Session found in auth change event');
              // Format user data without making additional Supabase calls in the callback
              formatUser(session.user).then(formattedUser => {
                if (mounted) {
                  setUser(formattedUser);
                }
              });
            } else {
              console.log('No session in auth change event');
              setUser(null);
            }
          }, 0);
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
          
          // Set loading to false once we've initialized
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
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
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
