
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Souvenir } from '../types/souvenir';
import { mapDbSouvenirToSouvenir } from '../utils/dataMappers';

export const fetchSouvenirs = async () => {
  const { data, error } = await supabase
    .from('souvenirs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching souvenirs:', error);
    throw error;
  }
  
  return data.map(mapDbSouvenirToSouvenir);
};

export const addSouvenir = async (userId: string, souvenir: Omit<Souvenir, 'id' | 'userId'>) => {
  // Prepare data for database
  const dbSouvenir = {
    user_id: userId,
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
  
  console.log('Saving souvenir to database:', dbSouvenir);
  
  const { data, error } = await supabase
    .from('souvenirs')
    .insert(dbSouvenir)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding souvenir:', error);
    toast({
      title: "Failed to save souvenir",
      description: error.message || "Please try again",
      variant: "destructive",
    });
    throw error;
  }
  
  console.log('Souvenir saved successfully:', data);
  
  toast({
    title: "Souvenir added",
    description: "Your souvenir has been saved successfully",
  });
  
  return mapDbSouvenirToSouvenir(data);
};

export const updateSouvenir = async (id: string, updates: Partial<Souvenir>) => {
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
  
  if (error) {
    console.error('Error updating souvenir:', error);
    toast({
      title: "Failed to update souvenir",
      description: error.message || "Please try again",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Souvenir updated",
    description: "Your changes have been saved",
  });
  
  return mapDbSouvenirToSouvenir(data);
};

export const deleteSouvenir = async (id: string) => {
  try {
    console.log('Deleting souvenir with ID:', id);
    
    const { error } = await supabase
      .from('souvenirs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting souvenir:', error);
      toast({
        title: "Failed to delete souvenir",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
    
    console.log('Souvenir deleted successfully');
    
    toast({
      title: "Souvenir deleted",
      description: "The souvenir has been removed from your collection",
    });
    
    return true;
  } catch (error) {
    console.error('Exception in deleteSouvenir:', error);
    toast({
      title: "Failed to delete souvenir",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive",
    });
    throw error;
  }
};
