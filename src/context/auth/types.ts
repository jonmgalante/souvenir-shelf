
import { User } from '@supabase/supabase-js';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<any>;
};
