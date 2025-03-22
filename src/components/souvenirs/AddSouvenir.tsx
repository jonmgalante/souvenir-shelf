
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs, useSouvenirContext, Location, Trip } from '../../context/SouvenirContext';
import { Map, Calendar, Camera, X, ChevronDown, Check, MapPin } from 'lucide-react';
import { format, parse } from 'date-fns';

// Predefined categories
const predefinedCategories = [
  'Art', 'Ceramics', 'Clothing', 'Craft', 'Edible', 'Fabric', 'Jewelry',
  'Kitchenware', 'Magnet', 'Ornament', 'Postcard', 'Sculpture', 'Textile',
  'Vintage', 'Wood', 'Glass', 'Metal', 'Handmade', 'Local', 'Traditional'
];

const AddSouvenir: React.FC = () => {
  const navigate = useNavigate();
  const { addSouvenir, trips } = useSouvenirs();
  
  // Form state
  const [name, setName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>({
    country: '',
    city: '',
    latitude: 0,
    longitude: 0,
  });
  const [dateAcquired, setDateAcquired] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [tripId, setTripId] = useState<string | undefined>(undefined);
  
  // UI state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, imageUrl]);
      
      // In a real app, we'd upload to a server and get back URLs
      // For now, we'll just use the object URLs as placeholders
      // Normally you'd do:
      // uploadToServer(file).then(url => setImages(prev => [...prev, url]));
      
      // For our mock, we'll use placeholder URLs
      setImages(prev => [...prev, 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1000&auto=format&fit=crop']);
    });
  };
  
  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const addCustomCategory = () => {
    if (customCategory.trim() && !selectedCategories.includes(customCategory.trim())) {
      setSelectedCategories(prev => [...prev, customCategory.trim()]);
      setCustomCategory('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert('Please add at least one image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addSouvenir({
        name,
        images,
        location,
        dateAcquired,
        categories: selectedCategories,
        notes,
        tripId,
      });
      
      navigate('/collection');
    } catch (error) {
      console.error('Error adding souvenir:', error);
      setIsSubmitting(false);
    }
  };
  
  // Mock getting current location
  const getCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    // For now, we'll use a mock
    setLocation({
      country: 'Japan',
      city: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
    });
  };
  
  return (
    <div className="souvenir-container pb-20 animate-fade-in">
      <h1 className="page-title">Add Souvenir</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Photos</label>
          <div className="grid grid-cols-3 gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            <label className="aspect-square rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Camera className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="What is this souvenir called?"
          />
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <div className="flex mb-2">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="inline-flex items-center px-3 py-2 text-xs rounded-lg border border-input bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Use Current Location
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <input
                type="text"
                value={location.country}
                onChange={(e) => setLocation({ ...location, country: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Country"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="City"
                required
              />
            </div>
          </div>
          <div className="h-32 bg-muted rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Map className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </div>
        </div>
        
        {/* Date Acquired */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">Date Acquired</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              id="date"
              type="date"
              value={dateAcquired}
              onChange={(e) => setDateAcquired(e.target.value)}
              className="w-full pl-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
        </div>
        
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium mb-2">Categories</label>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span>{selectedCategories.length ? `${selectedCategories.length} selected` : 'Select categories'}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-input bg-background shadow-lg">
                <div className="max-h-60 overflow-auto p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {predefinedCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                          selectedCategories.includes(category)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <span>{category}</span>
                        {selectedCategories.includes(category) && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="flex-1 rounded-l-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Add custom category"
                      />
                      <button
                        type="button"
                        onClick={addCustomCategory}
                        className="inline-flex items-center px-3 py-2 rounded-r-md bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 border-t flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(false)}
                    className="px-3 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="ml-1 p-0.5 rounded-full hover:bg-muted/30"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Trip */}
        {trips.length > 0 && (
          <div>
            <label htmlFor="trip" className="block text-sm font-medium mb-2">Trip (Optional)</label>
            <select
              id="trip"
              value={tripId || ''}
              onChange={(e) => setTripId(e.target.value || undefined)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">None</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Tell the story behind this souvenir..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          {isSubmitting ? 'Saving...' : 'Save Souvenir'}
        </button>
      </form>
    </div>
  );
};

export default AddSouvenir;
