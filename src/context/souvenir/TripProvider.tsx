// src/context/souvenir/TripProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "@/components/ui/use-toast";
import { Trip } from "../../types/trip";
import { mockTrips } from "../../data/mockData";
import {
  loadTrips,
  addTripAction,
  updateTripAction,
  deleteTripAction,
} from "./souvenirActions";

type TripProviderProps = {
  children: ReactNode;
  onReady?: (data: {
    trips: Trip[];
    loading: boolean;
    addTrip: (trip: Omit<Trip, "id" | "userId">) => Promise<void>;
    updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
    deleteTrip: (id: string) => Promise<void>;
  }) => void;
};

export const TripProvider: React.FC<TripProviderProps> = ({ children, onReady }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!user) {
        // Use mock data if dev & no user
        if (process.env.NODE_ENV === "development") {
          setTrips(mockTrips);
        } else {
          setTrips([]);
        }
        setLoading(false);
        return;
      }

      try {
        const fetchedTrips = await loadTrips(user.id);
        setTrips(fetchedTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Failed to load trips",
          description: "Please try again later",
          variant: "destructive",
        });

        if (process.env.NODE_ENV === "development") {
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

  const addTrip = async (trip: Omit<Trip, "id" | "userId">) => {
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
      setTrips((prev) => [newTrip, ...prev]);
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
      setTrips((prev) =>
        prev.map((trip) => (trip.id === id ? updatedTrip : trip))
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
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Whenever trips/ loading changes, call onReady so a parent can merge this data
  useEffect(() => {
    if (onReady) {
      onReady({
        trips,
        loading,
        addTrip,
        updateTrip,
        deleteTrip,
      });
    }
  }, [trips, loading, onReady]);

  return <>{children}</>;
};

export default TripProvider;