
import { Souvenir } from '../../types/souvenir';
import { Trip } from '../../types/trip';

export type SouvenirContextType = {
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
