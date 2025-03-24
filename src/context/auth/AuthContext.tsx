
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthContextType, AuthUser } from './types';
import { formatUser } from './utils';
import { useAuthOperations } from './useAuthOperations';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  const { signIn, signUp, signOut, googleSignIn } = 
    useAuthOperations(setUser, setLoading);

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    let mounted = true;
    
    const initAuth = async () => {
      try {
        console.log('AuthProvider: Checking for existing session');
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (mounted) {
          if (sessionData?.session) {
            console.log('AuthProvider: Found existing session, formatting user');
            const formattedUser = await formatUser(sessionData.session.user);
            setUser(formattedUser);
            console.log('AuthProvider: User state updated with session data');
          } else {
            console.log('AuthProvider: No session found, clearing user state');
            setUser(null);
          }
          
          setLoading(false);
          setInitialized(true);
          console.log('AuthProvider: Initial loading state set to false');
        }
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (mounted) {
            if (session) {
              console.log('AuthProvider: Session available in auth change, formatting user');
              const formattedUser = await formatUser(session.user);
              setUser(formattedUser);
            } else {
              console.log('AuthProvider: No session in auth change, clearing user');
              setUser(null);
            }
            
            if (loading) {
              setLoading(false);
              console.log('AuthProvider: Auth change - loading set to false');
            }
          }
        });
        
        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
          setInitialized(true);
          console.log('AuthProvider: Error occurred, setting loading to false');
        }
      }
    };
    
    initAuth();
    
    return () => {
      mounted = false;
    };
  }, [loading]);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    googleSignIn,
  };

  console.log('AuthProvider: Current state:', { user: !!user, loading, initialized });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
