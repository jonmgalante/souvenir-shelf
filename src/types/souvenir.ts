
export type Location = {
  country: string;
  city: string;
  address?: string;
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
