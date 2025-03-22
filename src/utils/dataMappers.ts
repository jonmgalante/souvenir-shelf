
import { Souvenir } from "../types/souvenir";
import { Trip } from "../types/trip";

// Convert database souvenir to our Souvenir type
export const mapDbSouvenirToSouvenir = (dbSouvenir: any): Souvenir => {
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
export const mapDbTripToTrip = (dbTrip: any): Trip => {
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
