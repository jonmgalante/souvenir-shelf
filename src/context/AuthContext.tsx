
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Provider } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  instagramSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  const formatUser = async (supabaseUser: User | null): Promise<AuthUser | null> => {
    if (!supabaseUser) return null;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, photo_url')
        .eq('id', supabaseUser.id)
        .single();
      
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
        photoUrl: profile?.photo_url || supabaseUser.user_metadata?.avatar_url,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
        photoUrl: supabaseUser.user_metadata?.avatar_url,
      };
    }
  };

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
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      // Hardcode the production URL and never use localhost
      const redirectUrl = 'https://www.souvieshelf.com/collection';
      console.log('Google sign-in redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const instagramSignIn = async () => {
    try {
      // Hardcode the production URL and never use localhost
      const redirectUrl = 'https://www.souvieshelf.com/collection';
      console.log('Instagram sign-in redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUrl,
          scopes: 'instagram_basic,instagram_content_publish',
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Social sign in error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    googleSignIn,
    instagramSignIn,
  };

  console.log('AuthProvider: Current state:', { user: !!user, loading, initialized });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
