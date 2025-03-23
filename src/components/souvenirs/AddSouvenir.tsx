import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../../context/souvenir';
import { Location } from '../../types/souvenir';
import { Map, Calendar, ChevronDown, Save, MapPin } from 'lucide-react';
import { format } from 'date-fns';

// Custom Hook
import { useImageUpload } from '../../hooks/useImageUpload';

// Components
import ImageUpload from './ImageUpload';
import LocationInput from './LocationInput';
import CategorySelection from './CategorySelection';
import DateSelection from './DateSelection';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

const AddSouvenir: React.FC = () => {
  const navigate = useNavigate();
  const { addSouvenir, loading } = useSouvenirs();
  
  // Use custom hook for image handling
  const { imageUrls, imageFiles, images, handleImageChange, removeImage } = useImageUpload();
  
  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState<Location>({
    country: '',
    city: '',
    latitude: 0,
    longitude: 0
  });
  const [date, setDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // UI state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleLocationSelect = (newLocation: Location) => {
    setLocation(newLocation);
    setShowLocationModal(false);
  };

  const searchLocation = async (city: string, country: string) => {
    if (!city || !country) return;
    
    try {
      const query = `${city}, ${country}`;
      const mapboxToken = 'pk.eyJ1Ijoiam9ubWdhbGFudGUiLCJhIjoiY204a3ltMHh1MHhwczJxcG8yZXRqaDgxZiJ9.mN_EYyrVSLoOB5Pojc_FWQ';
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}`
      );
      
      if (!response.ok) throw new Error('Geocoding request failed');
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        
        return {
          city,
          country,
          latitude,
          longitude
        };
      }
      
      throw new Error('Location not found');
    } catch (error) {
      console.error('Error searching location:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Error",
        description: "Please provide a name for your souvenir",
        variant: "destructive",
      });
      return;
    }
    
    if (!location.country || !location.city) {
      toast({
        title: "Error",
        description: "Please set a location for your souvenir",
        variant: "destructive",
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Error",
        description: "Please set the date when you acquired this souvenir",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      let locationWithCoords = location;
      
      if (location.latitude === 0 && location.longitude === 0) {
        const coords = await searchLocation(location.city, location.country);
        if (coords) {
          locationWithCoords = coords;
        } else {
          toast({
            title: "Warning",
            description: "Could not find exact coordinates for the location. Approximate coordinates will be used.",
          });
        }
      }
      
      await addSouvenir({
        name,
        location: locationWithCoords,
        dateAcquired: date.toISOString(),
        categories: selectedCategories.length > 0 ? selectedCategories : ['Other'],
        notes,
        images
      });
      
      toast({
        title: "Success",
        description: "Souvenir added to your collection",
      });
      
      navigate('/collection');
    } catch (error: any) {
      console.error('Error adding souvenir:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add souvenir",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const renderLocationModal = () => {
    if (!showLocationModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Set Location</h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={location.country}
                  onChange={(e) => setLocation(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="e.g. France"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={location.city}
                  onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="e.g. Paris"
                />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-gray-500">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Coordinates will be automatically added
                </div>
                
                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLocationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      if (!location.country || !location.city) {
                        toast({
                          title: "Error",
                          description: "Please enter both city and country",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      try {
                        const coords = await searchLocation(location.city, location.country);
                        if (coords) {
                          handleLocationSelect(coords);
                        } else {
                          handleLocationSelect({
                            ...location,
                            latitude: 0,
                            longitude: 0
                          });
                          
                          toast({
                            title: "Warning",
                            description: "Could not find exact coordinates for this location",
                          });
                        }
                      } catch (error) {
                        console.error("Error getting coordinates:", error);
                        handleLocationSelect({
                          ...location,
                          latitude: 0,
                          longitude: 0
                        });
                      }
                    }}
                    disabled={!location.country || !location.city}
                  >
                    Set Location
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-md mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Add Souvenir</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground"
        >
          Cancel
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Souvenir Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="What did you bring back?"
          />
        </div>
        
        <ImageUpload 
          imageUrls={imageUrls} 
          handleImageChange={handleImageChange} 
          removeImage={removeImage} 
        />
        
        <LocationInput 
          location={location}
          setLocation={setLocation}
          showLocationModal={showLocationModal}
          setShowLocationModal={setShowLocationModal}
        />
        
        <DateSelection 
          date={date}
          setShowDatePicker={setShowDatePicker}
          showDatePicker={showDatePicker}
        />
        
        <CategorySelection 
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
        />
        
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="Any special memories or details?"
          />
        </div>
        
        <div className="sticky bottom-20 pt-4 pb-2 bg-background">
          <Button
            type="submit"
            className="w-full py-6 text-lg flex items-center justify-center gap-2"
            disabled={submitting}
          >
            <Save size={20} />
            {submitting ? 'Adding...' : 'Add to Collection'}
          </Button>
        </div>
      </form>
      
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Pick a Date</h2>
            </div>
            
            <CalendarComponent
              mode="single"
              selected={date || undefined}
              onSelect={(date) => {
                setDate(date);
                setShowDatePicker(false);
              }}
              className="rounded-none"
            />
            
            <div className="p-4 border-t flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDatePicker(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {renderLocationModal()}
    </div>
  );
};

export default AddSouvenir;
