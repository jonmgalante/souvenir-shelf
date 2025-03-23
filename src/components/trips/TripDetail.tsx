
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSouvenirs, Trip, Souvenir } from '../../context/souvenir';
import { ArrowLeft, Calendar, Map } from 'lucide-react';
import { format } from 'date-fns';
import { SouvenirCard } from '../souvenirs/SouvenirCard';

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, souvenirs, loading } = useSouvenirs();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [tripSouvenirs, setTripSouvenirs] = useState<Souvenir[]>([]);
  
  useEffect(() => {
    if (!loading && trips.length > 0 && id) {
      const foundTrip = trips.find(t => t.id === id);
      setTrip(foundTrip);
      
      if (foundTrip) {
        const filteredSouvenirs = souvenirs.filter(s => s.tripId === id);
        setTripSouvenirs(filteredSouvenirs);
      }
    }
  }, [id, trips, souvenirs, loading]);
  
  if (loading) {
    return (
      <div className="souvenir-container animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate('/trips')} className="p-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="w-full h-64 bg-muted animate-pulse rounded-lg mb-6"></div>
      </div>
    );
  }
  
  if (!trip) {
    return (
      <div className="souvenir-container animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate('/trips')} className="p-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="page-title">Trip not found</h1>
        </div>
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">The trip you're looking for doesn't exist or was deleted.</p>
          <button 
            onClick={() => navigate('/trips')} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Return to Trips
          </button>
        </div>
      </div>
    );
  }
  
  const startDate = new Date(trip.dateRange.start);
  const endDate = new Date(trip.dateRange.end);
  const formattedDateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  
  return (
    <div className="souvenir-container animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/trips')} className="p-2 hover:bg-secondary rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title">{trip.name}</h1>
      </div>
      
      <div 
        className="w-full h-48 md:h-64 lg:h-80 rounded-lg bg-muted mb-6 relative overflow-hidden"
        style={{
          backgroundImage: `url(${trip.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formattedDateRange}</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-medium mb-4">Souvenirs from this trip</h2>
      
      {tripSouvenirs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tripSouvenirs.map(souvenir => (
            <SouvenirCard 
              key={souvenir.id} 
              souvenir={souvenir} 
              onClick={() => navigate(`/souvenir/${souvenir.id}`)} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No souvenirs have been added to this trip yet.</p>
          <button 
            onClick={() => navigate('/add')} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Add Your First Souvenir
          </button>
        </div>
      )}
    </div>
  );
};

export default TripDetail;
