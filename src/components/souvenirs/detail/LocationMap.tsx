
import React, { useEffect, useState } from 'react';
import { Map } from 'lucide-react';
import { Location } from '../../../types/souvenir';

interface LocationMapProps {
  location: Location;
  name: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ location, name }) => {
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  
  // Generate the Mapbox Static Map URL
  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;
      
      // Construct the Mapbox Static Map URL
      const mapboxToken = 'pk.eyJ1Ijoiam9ubWdhbGFudGUiLCJhIjoiY204a3ltMHh1MHhwczJxcG8yZXRqaDgxZiJ9.mN_EYyrVSLoOB5Pojc_FWQ';
      const style = 'mapbox/light-v11'; // Using the light-v11 style
      const pin = `pin-s-circle+555555(${longitude},${latitude})`; // Gray pin at the souvenir's coordinates
      const center = `${longitude},${latitude},13`; // Center coordinates with zoom level 13
      const size = '600x300@2x'; // 600x300 image with 2x resolution
      
      const url = `https://api.mapbox.com/styles/v1/${style}/static/${pin}/${center}/${size}?access_token=${mapboxToken}`;
      setMapImageUrl(url);
    }
  }, [location]);
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Location</h2>
      <div className="h-[300px] bg-muted rounded-lg overflow-hidden relative">
        {mapImageUrl ? (
          <img 
            src={mapImageUrl} 
            alt={`Map of ${location.city}, ${location.country}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Map className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
          <p className="text-sm">{location.city}, {location.country}</p>
          <p className="text-xs opacity-80">Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
