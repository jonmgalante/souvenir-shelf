
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '../types/trip';
import { mapDbTripToTrip } from '../utils/dataMappers';

export const fetchTrips = async () => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: false });
  
  if (error) throw error;
  
  return data.map(mapDbTripToTrip);
};

export const addTrip = async (userId: string, trip: Omit<Trip, 'id' | 'userId'>) => {
  // Prepare data for database
  const dbTrip = {
    user_id: userId,
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
  
  toast({
    title: "Trip added",
    description: "Your trip has been saved successfully",
  });
  
  return mapDbTripToTrip(data);
};

export const updateTrip = async (id: string, updates: Partial<Trip>) => {
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
  
  toast({
    title: "Trip updated",
    description: "Your changes have been saved",
  });
  
  return mapDbTripToTrip(data);
};

export const deleteTrip = async (id: string) => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  toast({
    title: "Trip deleted",
    description: "The trip has been removed from your collection",
  });
};
