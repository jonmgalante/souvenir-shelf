import React from 'react';
import { Trip } from '../../context/souvenir';

interface TripInputProps {
  trips: Trip[];
  selectedTripId: string | null;
  onChange: (tripId: string | null) => void;
}

const TripInput: React.FC<TripInputProps> = ({
  trips,
  selectedTripId,
  onChange,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value;
    onChange(value || null);
  };

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Trip (optional)</h2>

      <select
        value={selectedTripId || ''}
        onChange={handleChange}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">No trip</option>
        {trips.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.name}
          </option>
        ))}
      </select>

      {selectedTrip && (
        <p className="text-xs text-gray-500">
          This souvenir will appear under{' '}
          <span className="font-medium">{selectedTrip.name}</span>.
        </p>
      )}
    </div>
  );
};

export default TripInput;