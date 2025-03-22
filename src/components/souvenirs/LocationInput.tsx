
import React from 'react';
import { MapPin } from 'lucide-react';
import { Location } from '../../types/souvenir';

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Location</h2>
        <button
          type="button"
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          <MapPin className="h-4 w-4" />
          <span>Set Location</span>
        </button>
      </div>
      
      {location.country ? (
        <div className="p-3 bg-gray-50 rounded-lg flex flex-col">
          <span className="font-medium">{location.city}</span>
          <span className="text-sm text-gray-600">{location.country}</span>
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
