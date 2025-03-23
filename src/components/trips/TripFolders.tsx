import React from 'react';
import { useSouvenirs } from '../../context/souvenir';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { CalendarIcon, MapPinIcon, PlusIcon } from 'lucide-react';
import { formatDateRange } from '../../lib/utils';

const TripFolders: React.FC = () => {
  const { trips, loading } = useSouvenirs();
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">Your Trips</h1>
          <p className="text-muted-foreground text-sm">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} saved
          </p>
        </div>
        <Button onClick={() => navigate('/add-trip')} size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Trip
        </Button>
      </div>
      
      {trips.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">You haven't created any trips yet.</p>
          <Button onClick={() => navigate('/add-trip')} variant="outline">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create your first trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map(trip => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/trip/${trip.id}`)}>
              {trip.coverImage && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={trip.coverImage} 
                    alt={trip.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className={trip.coverImage ? 'pt-3 pb-2' : ''}>
                <CardTitle className="text-lg">{trip.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </div>
                {trip.destination && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                    {trip.destination}
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground pt-0">
                {trip.souvenirCount || 0} souvenirs
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripFolders;
