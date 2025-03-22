
import React, { createContext, useState, useContext, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulating auth state change
  useEffect(() => {
    // This would normally be a Firebase or other auth service listener
    const storedUser = localStorage.getItem('souvenirUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock authentication functions
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This would be a real auth service call
      const mockUser = { id: '123', email, name: 'Demo User' };
      setUser(mockUser);
      localStorage.setItem('souvenirUser', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // This would be a real auth service call
      const mockUser = { id: '123', email, name };
      setUser(mockUser);
      localStorage.setItem('souvenirUser', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // This would be a real auth service call
      setUser(null);
      localStorage.removeItem('souvenirUser');
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      // This would be a real auth service call
      const mockUser = { 
        id: '456', 
        email: 'google@example.com', 
        name: 'Google User',
        photoUrl: 'https://via.placeholder.com/150'
      };
      setUser(mockUser);
      localStorage.setItem('souvenirUser', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    googleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
