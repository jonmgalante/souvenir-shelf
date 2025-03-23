
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Location } from '../../types/souvenir';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface LocationInputProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  showLocationModal: boolean;
  setShowLocationModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LocationInput: React.FC<LocationInputProps> = ({
  location,
  setLocation,
  showLocationModal,
  setShowLocationModal
}) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  // Get user's current location using Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      return;
    }

    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get city and country from coordinates
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
          );
          
          if (!response.ok) throw new Error("Geocoding request failed");
          
          const data = await response.json();
          
          // Extract city and country from response
          let city = "";
          let country = "";
          
          if (data.features && data.features.length > 0) {
            // Extract place info from the features
            for (const feature of data.features) {
              if (feature.place_type.includes('country')) {
                country = feature.text;
              } else if (
                feature.place_type.includes('place') || 
                feature.place_type.includes('locality') ||
                feature.place_type.includes('region')
              ) {
                city = feature.text;
              }
            }
          }
          
          // Update location with coordinates and place names
          setLocation({
            latitude,
            longitude,
            city: city || "Unknown location",
            country: country || "Unknown country"
          });

          toast({
            title: "Location detected",
            description: `${city}, ${country}`,
          });
        } catch (error) {
          console.error("Error getting location:", error);
          toast({
            title: "Location detection failed",
            description: "Please enter your location manually",
            variant: "destructive"
          });
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGettingLocation(false);
        
        let errorMessage = "Unable to get your location";
        if (error.code === 1) errorMessage = "Location permission denied";
        if (error.code === 2) errorMessage = "Location unavailable";
        if (error.code === 3) errorMessage = "Location request timed out";
        
        toast({
          title: "Geolocation error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Mapbox token for reverse geocoding
  const mapboxToken = 'pk.eyJ1Ijoiam9ubWdhbGFudGUiLCJhIjoiY204a3ltMHh1MHhwczJxcG8yZXRqaDgxZiJ9.mN_EYyrVSLoOB5Pojc_FWQ';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Location</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="flex items-center gap-1 text-sm"
          >
            {gettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span>Current Location</span>
          </Button>
          
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1 text-sm"
          >
            <MapPin className="h-4 w-4" />
            <span>Set Manually</span>
          </Button>
        </div>
      </div>
      
      {location.country ? (
        <div className="p-3 bg-gray-50 rounded-lg flex flex-col">
          <span className="font-medium">{location.city}</span>
          <span className="text-sm text-gray-600">{location.country}</span>
          <span className="text-xs text-gray-400 mt-1">
            Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </span>
        </div>
      ) : (
        <div
          onClick={() => setShowLocationModal(true)}
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
        >
          <MapPin className="h-6 w-6 text-gray-400 mb-1" />
          <p className="text-sm text-gray-500">Add location information</p>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
