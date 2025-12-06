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
  setShowLocationModal,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Location</h2>

      {location.country ? (
        // When a location is already set, show a summary card that can be tapped to edit
        <div
          className="p-3 bg-gray-50 rounded-lg flex flex-col cursor-pointer"
          onClick={() => setShowLocationModal(true)}
        >
          <span className="font-medium">{location.city}</span>
          <span className="text-sm text-gray-600">{location.country}</span>
          {location.address && (
            <span className="text-sm text-gray-500 mt-1">
              {location.address}
            </span>
          )}
        </div>
      ) : (
        // Empty state: dashed box used to open the modal and set location
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