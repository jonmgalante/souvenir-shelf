
import React, { createContext, useState, useContext, useEffect } from 'react';

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

// Mock data
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
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load mock data
  useEffect(() => {
    const storedSouvenirs = localStorage.getItem('souvenirs');
    const storedTrips = localStorage.getItem('trips');
    
    setSouvenirs(storedSouvenirs ? JSON.parse(storedSouvenirs) : mockSouvenirs);
    setTrips(storedTrips ? JSON.parse(storedTrips) : mockTrips);
    
    setLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('souvenirs', JSON.stringify(souvenirs));
      localStorage.setItem('trips', JSON.stringify(trips));
    }
  }, [souvenirs, trips, loading]);

  const addSouvenir = async (souvenir: Omit<Souvenir, 'id' | 'userId'>) => {
    const newSouvenir: Souvenir = {
      ...souvenir,
      id: Date.now().toString(),
      userId: '123', // In a real app, this would be the current user's ID
    };
    
    setSouvenirs([...souvenirs, newSouvenir]);
  };

  const updateSouvenir = async (id: string, updates: Partial<Souvenir>) => {
    setSouvenirs(
      souvenirs.map((souvenir) =>
        souvenir.id === id ? { ...souvenir, ...updates } : souvenir
      )
    );
  };

  const deleteSouvenir = async (id: string) => {
    setSouvenirs(souvenirs.filter((souvenir) => souvenir.id !== id));
  };

  const getSouvenirById = (id: string) => {
    return souvenirs.find((souvenir) => souvenir.id === id);
  };

  const addTrip = async (trip: Omit<Trip, 'id' | 'userId'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      userId: '123', // In a real app, this would be the current user's ID
    };
    
    setTrips([...trips, newTrip]);
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    setTrips(
      trips.map((trip) =>
        trip.id === id ? { ...trip, ...updates } : trip
      )
    );
  };

  const deleteTrip = async (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id));
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
