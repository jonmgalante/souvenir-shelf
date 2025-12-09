import React from 'react';
import { useSouvenirs } from '../../context/souvenir';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { formatDateRange } from '../../lib/utils';

const TripFolders: React.FC = () => {
    const { trips, loading, souvenirs } = useSouvenirs();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-[calc(100vh-80px)]">
        <p>Loading trips...</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">Your Trips</h1>
          <p className="text-muted-foreground text-sm">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} saved
          </p>
        </div>
        <Button onClick={() => navigate('/trips/new')} size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Trip
        </Button>
      </div>
      
      {/* Empty state */}
      {trips.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">
            You haven't created any trips yet.
          </p>
          <Button onClick={() => navigate('/trips/new')} variant="outline">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create your first trip
          </Button>
        </div>
      ) : (
        /* Trip cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => {
              const souvenirCount = souvenirs.filter(
              (souvenir) => souvenir.tripId === trip.id
            ).length;
            const souvenirLabel =
              souvenirCount === 1 ? 'souvenir' : 'souvenirs';

            return (
              <Card
                key={trip.id}
                className="overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/trip/${trip.id}`)}
              >
                {/* Hero image with overlay text if there's a cover image */}
                {trip.coverImage ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
    <img
      src={trip.coverImage}
      alt={trip.name}
      className="w-full h-full object-cover brightness-110"
    />
    {/* Text overlay with bottom gradient */}
    <div className="absolute inset-x-0 bottom-0 p-3 text-white bg-gradient-to-t from-black/40 via-black/20 to-transparent">
  <h2 className="text-base font-semibold leading-snug">
    {trip.name}
  </h2>
  <div className="mt-1 flex items-center text-xs text-white/90">
    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
    <span>
      {formatDateRange(trip.dateRange.start, trip.dateRange.end)}
    </span>
  </div>
  <p className="mt-1 text-xs text-white/80">
    {souvenirCount} {souvenirLabel}
  </p>
</div>
                  </div>
                ) : (
                  /* Fallback layout when there is no cover image */
                  <div className="p-4 space-y-2">
                    <h2 className="text-base font-semibold">{trip.name}</h2>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {formatDateRange(trip.dateRange.start, trip.dateRange.end)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {souvenirCount} {souvenirLabel}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TripFolders;