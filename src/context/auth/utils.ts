
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from './types';

export const formatUser = async (supabaseUser: User | null): Promise<AuthUser | null> => {
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
