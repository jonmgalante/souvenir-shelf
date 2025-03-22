import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Provider } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const formatUser = async (supabaseUser: User | null): Promise<AuthUser | null> => {
    if (!supabaseUser) return null;
    
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
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const formattedUser = await formatUser(session?.user || null);
        setUser(formattedUser);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      const formattedUser = await formatUser(session?.user || null);
      setUser(formattedUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
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
      
      toast({
        title: "Welcome to Souvenir Shelf!",
        description: "Your account has been created. Please check your email for verification.",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/collection',
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google sign in failed",
        description: error.message || "An error occurred during Google sign in.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const instagramSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin + '/collection',
          scopes: 'instagram_basic,instagram_content_publish',
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Social sign in error:', error);
      toast({
        title: "Social sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
