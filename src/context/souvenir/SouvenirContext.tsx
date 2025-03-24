
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/use-toast';
import { Souvenir } from '../../types/souvenir';
import { Trip } from '../../types/trip';
import { mockSouvenirs, mockTrips } from '../../data/mockData';
import { SouvenirContextType } from './types';
import {
  loadSouvenirs,
  loadTrips,
  addSouvenirAction,
  updateSouvenirAction,
  deleteSouvenirAction,
  addTripAction,
  updateTripAction,
  deleteTripAction
} from './souvenirActions';

export const SouvenirContext = createContext<SouvenirContextType | undefined>(undefined);

export const SouvenirProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from Supabase when authenticated
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (!user) {
        // Only use mock data when in development and not authenticated
        if (process.env.NODE_ENV === 'development') {
          setSouvenirs(mockSouvenirs);
          setTrips(mockTrips);
        } else {
          setSouvenirs([]);
          setTrips([]);
        }
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching data for user:', user.id);
        // Fetch souvenirs and trips
        const [fetchedSouvenirs, fetchedTrips] = await Promise.all([
          loadSouvenirs(user.id),
          loadTrips(user.id)
        ]);
        
        setSouvenirs(fetchedSouvenirs);
        setTrips(fetchedTrips);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Failed to load data",
          description: "Please try again later",
          variant: "destructive",
        });
        
        // Use mock data as fallback only in development
        if (process.env.NODE_ENV === 'development') {
          setSouvenirs(mockSouvenirs);
          setTrips(mockTrips);
        } else {
          setSouvenirs([]);
          setTrips([]);
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

  const addTrip = async (trip: Omit<Trip, 'id' | 'userId'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add trips",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newTrip = await addTripAction(user.id, trip);
      // Add new trip to state
      setTrips(prev => [newTrip, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update trips",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedTrip = await updateTripAction(id, updates);
      // Update trip in state
      setTrips(prev => 
        prev.map(trip => 
          trip.id === id ? updatedTrip : trip
        )
      );
    } catch (error) {
      throw error;
    }
  };

  const deleteTrip = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete trips",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await deleteTripAction(id);
      // Remove trip from state
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const value = {
    souvenirs,
    trips,
    loading,
    addSouvenir,
    updateSouvenir,
    deleteSouvenir,
    getSouvenirById,
    addTrip,
    updateTrip,
    deleteTrip,
  };

  return <SouvenirContext.Provider value={value}>{children}</SouvenirContext.Provider>;
};
