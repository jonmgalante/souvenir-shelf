
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs, Souvenir } from '../../context/SouvenirContext';
import { MapPin, ChevronRight } from 'lucide-react';

const MapView: React.FC = () => {
  const { souvenirs, loading } = useSouvenirs();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // Group souvenirs by location
  const souvenirsByLocation = souvenirs.reduce<Record<string, Souvenir[]>>((acc, souvenir) => {
    const locationKey = `${souvenir.location.city}, ${souvenir.location.country}`;
    
    if (!acc[locationKey]) {
      acc[locationKey] = [];
    }
    
    acc[locationKey].push(souvenir);
    return acc;
  }, {});
  
  // Get unique locations
  const locations = Object.keys(souvenirsByLocation).sort();
  
  // Handle location click
  const handleLocationClick = (location: string) => {
    setSelectedLocation(location === selectedLocation ? null : location);
  };
  
  return (
    <div className="souvenir-container animate-fade-in">
      <h1 className="page-title">Souvenir Map</h1>
      
      {/* Map Placeholder - In a real app, this would be a map component */}
      <div className="relative h-60 bg-muted rounded-lg overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">Map visualization would go here</p>
        </div>
        
        {/* Location Pins */}
        {!loading && locations.map((location, index) => {
          // In a real implementation, we'd use the actual lat/long
          // For now, we'll just place pins somewhat randomly
          const top = 20 + (index * 30) % 140;
          const left = 20 + (index * 40) % 280;
          
          return (
            <button
              key={location}
              style={{ top: `${top}px`, left: `${left}px` }}
              className={`absolute p-1 transform -translate-x-1/2 -translate-y-1/2 group ${
                selectedLocation === location ? 'z-20' : 'z-10'
              }`}
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex flex-col items-center">
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center
                  ${selectedLocation === location 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'}
                `}>
                  <MapPin className="h-3 w-3" />
                </div>
                
                {selectedLocation === location && (
                  <div className="absolute top-6 bg-white rounded-md shadow-lg p-2 w-max max-w-[200px] animate-scale-in">
                    <p className="text-xs font-medium">{location}</p>
                    <p className="text-xs text-muted-foreground">
                      {souvenirsByLocation[location].length} souvenir(s)
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Locations List */}
      <div>
        <h2 className="text-xl font-serif font-medium mb-4">Locations</h2>
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : locations.length > 0 ? (
          <div className="space-y-2">
            {locations.map((location) => (
              <div
                key={location}
                className={`
                  rounded-lg overflow-hidden border transition-colors
                  ${selectedLocation === location 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted bg-background'}
                `}
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3"
                  onClick={() => handleLocationClick(location)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{location}</p>
                      <p className="text-sm text-muted-foreground">
                        {souvenirsByLocation[location].length} souvenir(s)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform ${
                    selectedLocation === location ? 'rotate-90' : ''
                  }`} />
                </button>
                
                {selectedLocation === location && (
                  <div className="px-4 pb-3 pt-1 animate-slide-down">
                    <div className="pl-8 border-l border-dashed border-primary/30">
                      {souvenirsByLocation[location].map((souvenir) => (
                        <button
                          key={souvenir.id}
                          className="w-full flex items-center py-2 hover:bg-secondary/50 rounded-md px-2 -ml-2 transition-colors"
                          onClick={() => navigate(`/souvenir/${souvenir.id}`)}
                        >
                          <div 
                            className="w-10 h-10 rounded-md overflow-hidden bg-muted mr-3"
                            style={{
                              backgroundImage: `url(${souvenir.images[0]})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                          <div className="text-left">
                            <p className="font-medium line-clamp-1">{souvenir.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(souvenir.dateAcquired).toLocaleDateString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No souvenirs have been added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
