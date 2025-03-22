
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

export type Location = {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
};

export type Souvenir = {
  id: string;
  userId: string;
  name: string;
  images: string[];
  location: Location;
  dateAcquired: string;
  categories: string[];
  notes: string;
  tripId?: string;
};

export type Trip = {
  id: string;
  userId: string;
  name: string;
  dateRange: {
    start: string;
    end: string;
  };
  coverImage?: string;
};

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

// Convert database souvenir to our Souvenir type
const mapDbSouvenirToSouvenir = (dbSouvenir: any): Souvenir => {
  return {
    id: dbSouvenir.id,
    userId: dbSouvenir.user_id,
    name: dbSouvenir.name,
    images: dbSouvenir.images || [],
    location: {
      country: dbSouvenir.country,
      city: dbSouvenir.city,
      latitude: dbSouvenir.latitude,
      longitude: dbSouvenir.longitude,
    },
    dateAcquired: dbSouvenir.date_acquired,
    categories: dbSouvenir.categories || [],
    notes: dbSouvenir.notes || '',
    tripId: dbSouvenir.trip_id,
  };
};

// Convert database trip to our Trip type
const mapDbTripToTrip = (dbTrip: any): Trip => {
  return {
    id: dbTrip.id,
    userId: dbTrip.user_id,
    name: dbTrip.name,
    dateRange: {
      start: dbTrip.start_date,
      end: dbTrip.end_date,
    },
    coverImage: dbTrip.cover_image,
  };
};

// Fallback mock data to use when not authenticated
const mockSouvenirs: Souvenir[] = [
  {
    id: '1',
    userId: '123',
    name: 'Hand-painted Ceramic Bowl',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c038a0458?q=80&w=1000&auto=format&fit=crop',
    ],
    location: {
      country: 'Italy',
      city: 'Florence',
      latitude: 43.7696,
      longitude: 11.2558,
    },
    dateAcquired: '2023-06-15',
    categories: ['Ceramics', 'Kitchenware'],
    notes: 'Bought from a small family shop in Florence. The owner mentioned this design has been in their family for generations.',
  },
  {
    id: '2',
    userId: '123',
    name: 'Wooden Carved Elephant',
    images: [
      'https://images.unsplash.com/photo-1544219111-d5f87538ec10?q=80&w=1000&auto=format&fit=crop',
    ],
    location: {
      country: 'Thailand',
      city: 'Chiang Mai',
      latitude: 18.7883,
      longitude: 98.9853,
    },
    dateAcquired: '2022-11-20',
    categories: ['Sculpture', 'Wood'],
    notes: 'Hand-carved by a local artisan at the night market. He told me elephants symbolize good luck and wisdom.',
    tripId: '1',
  },
  {
    id: '3',
    userId: '123',
    name: 'Vintage Travel Poster',
    images: [
      'https://images.unsplash.com/photo-1546930722-a1292ed9dee8?q=80&w=1000&auto=format&fit=crop',
    ],
    location: {
      country: 'France',
      city: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    dateAcquired: '2023-03-08',
    categories: ['Art', 'Vintage'],
    notes: 'Found in a small antique shop near Montmartre. I love the retro design and vibrant colors.',
  },
  {
    id: '4',
    userId: '123',
    name: 'Hand-woven Textile',
    images: [
      'https://images.unsplash.com/photo-1603912699214-92627f304eb6?q=80&w=1000&auto=format&fit=crop',
    ],
    location: {
      country: 'Peru',
      city: 'Cusco',
      latitude: -13.5319,
      longitude: -71.9675,
    },
    dateAcquired: '2022-08-12',
    categories: ['Textiles', 'Handmade'],
    notes: 'Purchased from a women\'s weaving cooperative in the Sacred Valley. The colors are all natural dyes from local plants.',
    tripId: '2',
  },
];

const mockTrips: Trip[] = [
  {
    id: '1',
    userId: '123',
    name: 'Southeast Asia Tour',
    dateRange: {
      start: '2022-11-01',
      end: '2022-12-10',
    },
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    userId: '123',
    name: 'South America Adventure',
    dateRange: {
      start: '2022-07-20',
      end: '2022-08-25',
    },
    coverImage: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1000&auto=format&fit=crop',
  },
];

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
        // Use mock data when not authenticated
        setSouvenirs(mockSouvenirs);
        setTrips(mockTrips);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch souvenirs
        const { data: dbSouvenirs, error: souvenirError } = await supabase
          .from('souvenirs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (souvenirError) throw souvenirError;
        
        // Fetch trips
        const { data: dbTrips, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .order('start_date', { ascending: false });
        
        if (tripError) throw tripError;
        
        // Map database data to our types
        setSouvenirs(dbSouvenirs.map(mapDbSouvenirToSouvenir));
        setTrips(dbTrips.map(mapDbTripToTrip));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Failed to load data",
          description: "Please try again later",
          variant: "destructive",
        });
        
        // Use mock data as fallback
        setSouvenirs(mockSouvenirs);
        setTrips(mockTrips);
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
      return;
    }
    
    try {
      // Prepare data for database
      const dbSouvenir = {
        user_id: user.id,
        name: souvenir.name,
        images: souvenir.images,
        country: souvenir.location.country,
        city: souvenir.location.city,
        latitude: souvenir.location.latitude,
        longitude: souvenir.location.longitude,
        date_acquired: souvenir.dateAcquired,
        categories: souvenir.categories,
        notes: souvenir.notes,
        trip_id: souvenir.tripId,
      };
      
      const { data, error } = await supabase
        .from('souvenirs')
        .insert(dbSouvenir)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add new souvenir to state
      setSouvenirs(prev => [mapDbSouvenirToSouvenir(data), ...prev]);
      
      toast({
        title: "Souvenir added",
        description: "Your souvenir has been saved successfully",
      });
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
      // Prepare data for database
      const dbUpdates: any = {};
      
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.images) dbUpdates.images = updates.images;
      if (updates.location) {
        dbUpdates.country = updates.location.country;
        dbUpdates.city = updates.location.city;
        dbUpdates.latitude = updates.location.latitude;
        dbUpdates.longitude = updates.location.longitude;
      }
      if (updates.dateAcquired) dbUpdates.date_acquired = updates.dateAcquired;
      if (updates.categories) dbUpdates.categories = updates.categories;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if ('tripId' in updates) dbUpdates.trip_id = updates.tripId;
      
      dbUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('souvenirs')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update souvenir in state
      setSouvenirs(prev => 
        prev.map(souvenir => 
          souvenir.id === id ? mapDbSouvenirToSouvenir(data) : souvenir
        )
      );
      
      toast({
        title: "Souvenir updated",
        description: "Your changes have been saved",
      });
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
      const { error } = await supabase
        .from('souvenirs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove souvenir from state
      setSouvenirs(prev => prev.filter(souvenir => souvenir.id !== id));
      
      toast({
        title: "Souvenir deleted",
        description: "The souvenir has been removed from your collection",
      });
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
      // Prepare data for database
      const dbTrip = {
        user_id: user.id,
        name: trip.name,
        start_date: trip.dateRange.start,
        end_date: trip.dateRange.end,
        cover_image: trip.coverImage,
      };
      
      const { data, error } = await supabase
        .from('trips')
        .insert(dbTrip)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add new trip to state
      setTrips(prev => [mapDbTripToTrip(data), ...prev]);
      
      toast({
        title: "Trip added",
        description: "Your trip has been saved successfully",
      });
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
      // Prepare data for database
      const dbUpdates: any = {};
      
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.dateRange) {
        if (updates.dateRange.start) dbUpdates.start_date = updates.dateRange.start;
        if (updates.dateRange.end) dbUpdates.end_date = updates.dateRange.end;
      }
      if ('coverImage' in updates) dbUpdates.cover_image = updates.coverImage;
      
      dbUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('trips')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update trip in state
      setTrips(prev => 
        prev.map(trip => 
          trip.id === id ? mapDbTripToTrip(data) : trip
        )
      );
      
      toast({
        title: "Trip updated",
        description: "Your changes have been saved",
      });
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
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove trip from state
      setTrips(prev => prev.filter(trip => trip.id !== id));
      
      toast({
        title: "Trip deleted",
        description: "The trip has been removed from your collection",
      });
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
