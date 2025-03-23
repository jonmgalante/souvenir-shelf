
import { Souvenir } from '../types/souvenir';
import { Trip } from '../types/trip';

// Note: This function assumes the DB columns match the expected format
export const mapDbSouvenirToSouvenir = (dbSouvenir: any): Souvenir => {
  return {
    id: dbSouvenir.id,
    userId: dbSouvenir.user_id,
    name: dbSouvenir.name,
    location: {
      country: dbSouvenir.country,
      city: dbSouvenir.city,
      address: dbSouvenir.address || '',
      latitude: dbSouvenir.latitude,
      longitude: dbSouvenir.longitude
    },
    dateAcquired: dbSouvenir.date_acquired,
    categories: dbSouvenir.categories || [],
    images: dbSouvenir.images || [],
    notes: dbSouvenir.notes || '',
    tripId: dbSouvenir.trip_id
  };
};

export const mapDbTripToTrip = (dbTrip: any): Trip => {
  return {
    id: dbTrip.id,
    userId: dbTrip.user_id,
    name: dbTrip.name,
    dateRange: {
      start: dbTrip.start_date,
      end: dbTrip.end_date
    },
    coverImage: dbTrip.cover_image || ''
  };
};
