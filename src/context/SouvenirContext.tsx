
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Souvenir } from '../types/souvenir';
import { Trip } from '../types/trip';
import { mockSouvenirs, mockTrips } from '../data/mockData';
import { 
  fetchSouvenirs, 
  addSouvenir as addSouvenirService, 
  updateSouvenir as updateSouvenirService,
  deleteSouvenir as deleteSouvenirService
} from '../services/souvenirService';
import {
  fetchTrips,
  addTrip as addTripService,
  updateTrip as updateTripService,
  deleteTrip as deleteTripService
} from '../services/tripService';

type SouvenirContextType = {
  souvenirs: Souvenir[];
  trips: Trip[];
  loading: boolean;
  addSouvenir: (souvenir: Omit<Souvenir, 'id' | 'userId'>) => Promise<void>;
  updateSouvenir: (id: string, updates: Partial<Souvenir>) => Promise<void>;
  deleteSouvenir: (id: string) => Promise<void>;
  getSouvenirById: (id: string) => Souvenir | undefined;
  addTrip: (trip: Omit<Trip, 'id' | 'userId'>) => Promise<void>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
};

const SouvenirContext = createContext<SouvenirContextType | undefined>(undefined);

export const useSouvenirs = () => {
  const context = useContext(SouvenirContext);
  if (context === undefined) {
    throw new Error('useSouvenirs must be used within a SouvenirProvider');
  }
  return context;
};

export { type Souvenir, type Trip };

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
          fetchSouvenirs(),
          fetchTrips()
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
      const newSouvenir = await addSouvenirService(user.id, souvenir);
      // Add new souvenir to state
      setSouvenirs(prev => [newSouvenir, ...prev]);
    } catch (error: any) {
      console.error('Error adding souvenir:', error);
      toast({
        title: "Failed to add souvenir",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
      const updatedSouvenir = await updateSouvenirService(id, updates);
      // Update souvenir in state
      setSouvenirs(prev => 
        prev.map(souvenir => 
          souvenir.id === id ? updatedSouvenir : souvenir
        )
      );
    } catch (error: any) {
      console.error('Error updating souvenir:', error);
      toast({
        title: "Failed to update souvenir",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
      await deleteSouvenirService(id);
      // Remove souvenir from state
      setSouvenirs(prev => prev.filter(souvenir => souvenir.id !== id));
    } catch (error: any) {
      console.error('Error deleting souvenir:', error);
      toast({
        title: "Failed to delete souvenir",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
      const newTrip = await addTripService(user.id, trip);
      // Add new trip to state
      setTrips(prev => [newTrip, ...prev]);
    } catch (error: any) {
      console.error('Error adding trip:', error);
      toast({
        title: "Failed to add trip",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
      const updatedTrip = await updateTripService(id, updates);
      // Update trip in state
      setTrips(prev => 
        prev.map(trip => 
          trip.id === id ? updatedTrip : trip
        )
      );
    } catch (error: any) {
      console.error('Error updating trip:', error);
      toast({
        title: "Failed to update trip",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
      await deleteTripService(id);
      // Remove trip from state
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Failed to delete trip",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
