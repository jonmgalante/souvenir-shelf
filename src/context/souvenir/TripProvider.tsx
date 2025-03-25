
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/use-toast';
import { Trip } from '../../types/trip';
import { mockTrips } from '../../data/mockData';
import {
  loadTrips,
  addTripAction,
  updateTripAction,
  deleteTripAction
} from './souvenirActions';

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load trips from Supabase when authenticated
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (!user) {
        // Only use mock data when in development and not authenticated
        if (process.env.NODE_ENV === 'development') {
          setTrips(mockTrips);
        } else {
          setTrips([]);
        }
        setLoading(false);
        return;
      }
      
      try {
        // Fetch trips
        const fetchedTrips = await loadTrips(user.id);
        setTrips(fetchedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        toast({
          title: "Failed to load trips",
          description: "Please try again later",
          variant: "destructive",
        });
        
        // Use mock data as fallback only in development
        if (process.env.NODE_ENV === 'development') {
          setTrips(mockTrips);
        } else {
          setTrips([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

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

  return {
    trips,
    loading,
    addTrip,
    updateTrip,
    deleteTrip
  };
};
