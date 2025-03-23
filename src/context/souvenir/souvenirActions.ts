import { Souvenir } from '../../types/souvenir';
import { Trip } from '../../types/trip';
import { toast } from '@/components/ui/use-toast';
import { 
  fetchSouvenirs, 
  addSouvenir as addSouvenirService, 
  updateSouvenir as updateSouvenirService,
  deleteSouvenir as deleteSouvenirService
} from '../../services/souvenirService';
import {
  fetchTrips,
  addTrip as addTripService,
  updateTrip as updateTripService,
  deleteTrip as deleteTripService
} from '../../services/tripService';

export const loadSouvenirs = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error("User ID is required to load souvenirs");
  }
  
  try {
    return await fetchSouvenirs();
  } catch (error: any) {
    console.error('Error fetching souvenirs:', error);
    toast({
      title: "Failed to load souvenirs",
      description: error.message || "Please try again later",
      variant: "destructive",
    });
    throw error;
  }
};

export const loadTrips = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error("User ID is required to load trips");
  }
  
  try {
    return await fetchTrips();
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    toast({
      title: "Failed to load trips",
      description: error.message || "Please try again later",
      variant: "destructive",
    });
    throw error;
  }
};

export const addSouvenirAction = async (userId: string, souvenir: Omit<Souvenir, 'id' | 'userId'>) => {
  try {
    return await addSouvenirService(userId, souvenir);
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

export const updateSouvenirAction = async (id: string, updates: Partial<Souvenir>) => {
  try {
    return await updateSouvenirService(id, updates);
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

export const deleteSouvenirAction = async (id: string) => {
  try {
    console.log('Deleting souvenir action started for ID:', id);
    
    // Call the service to delete the souvenir
    await deleteSouvenirService(id);
    
    console.log('Delete service completed successfully, returning ID:', id);
    
    // Add a success toast
    toast({
      title: "Souvenir deleted",
      description: "The souvenir has been successfully removed",
    });
    
    return id;
  } catch (error: any) {
    console.error('Error in deleteSouvenirAction:', error);
    
    // Show error toast
    toast({
      title: "Failed to delete souvenir",
      description: error.message || "Please try again",
      variant: "destructive",
    });
    
    throw error;
  }
};

export const addTripAction = async (userId: string, trip: Omit<Trip, 'id' | 'userId'>) => {
  try {
    return await addTripService(userId, trip);
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

export const updateTripAction = async (id: string, updates: Partial<Trip>) => {
  try {
    return await updateTripService(id, updates);
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

export const deleteTripAction = async (id: string) => {
  try {
    await deleteTripService(id);
    return id;
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
