
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/use-toast';
import { Souvenir } from '../../types/souvenir';
import { mockSouvenirs } from '../../data/mockData';
import { SouvenirContextType } from './types';
import {
  loadSouvenirs,
  addSouvenirAction,
  updateSouvenirAction,
  deleteSouvenirAction
} from './souvenirActions';

export const SouvenirContext = createContext<SouvenirContextType | undefined>(undefined);

export const SouvenirProvider = ({ children, tripsContext }: { children: React.ReactNode, tripsContext: any }) => {
  const { user } = useAuth();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load souvenirs from Supabase when authenticated
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (!user) {
        // Only use mock data when in development and not authenticated
        if (process.env.NODE_ENV === 'development') {
          setSouvenirs(mockSouvenirs);
        } else {
          setSouvenirs([]);
        }
        setLoading(false);
        return;
      }
      
      try {
        // Fetch souvenirs
        const fetchedSouvenirs = await loadSouvenirs(user.id);
        setSouvenirs(fetchedSouvenirs);
      } catch (error) {
        console.error('Error fetching souvenirs:', error);
        toast({
          title: "Failed to load souvenirs",
          description: "Please try again later",
          variant: "destructive",
        });
        
        // Use mock data as fallback only in development
        if (process.env.NODE_ENV === 'development') {
          setSouvenirs(mockSouvenirs);
        } else {
          setSouvenirs([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const addSouvenir = async (souvenir: Omit<Souvenir, 'id' | 'userId'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add souvenirs",
        variant: "destructive",
      });
      return Promise.reject(new Error("Authentication required"));
    }
    
    try {
      const newSouvenir = await addSouvenirAction(user.id, souvenir);
      // Add new souvenir to state
      setSouvenirs(prev => [newSouvenir, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const updateSouvenir = async (id: string, updates: Partial<Souvenir>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update souvenirs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedSouvenir = await updateSouvenirAction(id, updates);
      // Update souvenir in state
      setSouvenirs(prev => 
        prev.map(souvenir => 
          souvenir.id === id ? updatedSouvenir : souvenir
        )
      );
    } catch (error) {
      throw error;
    }
  };

  const deleteSouvenir = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete souvenirs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await deleteSouvenirAction(id);
      // Remove souvenir from state
      setSouvenirs(prev => prev.filter(souvenir => souvenir.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const getSouvenirById = (id: string) => {
    return souvenirs.find((souvenir) => souvenir.id === id);
  };

  return {
    souvenirs,
    loading,
    addSouvenir,
    updateSouvenir,
    deleteSouvenir,
    getSouvenirById,
  };
};
