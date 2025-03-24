
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from './utils';
import { AuthUser } from './types';

export const useAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  return {
    signIn,
    signUp,
    signOut,
    googleSignIn,
    instagramSignIn
  };
};
