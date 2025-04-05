
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from './utils';
import { AuthUser } from './types';
import { toast } from '@/components/ui/use-toast';

// Get the current domain for OAuth redirects
const getRedirectUrl = () => {
  return `${window.location.origin}/collection`;
};

export const useAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        const formattedUser = await formatUser(data.user);
        setUser(formattedUser);
      }
      
      return data;
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
      const { data, error } = await supabase.auth.signUp({ 
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
      
      if (data.user) {
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account",
        });
      }
      
      return data;
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
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const redirectUrl = getRedirectUrl();
      console.log('Google sign-in redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
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

  return {
    signIn,
    signUp,
    signOut,
    googleSignIn
  };
};
