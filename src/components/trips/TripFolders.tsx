import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs, Trip } from '../../context/souvenir';
import { FolderPlus, Calendar, Plus, X, Upload, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useImageUploadWithCrop } from '../../hooks/useImageUploadWithCrop';
import { Button } from '../ui/button';
import ImageUploadWithCrop from '../souvenirs/ImageUploadWithCrop';

const TripFolders: React.FC = () => {
  const { trips, souvenirs, addTrip } = useSouvenirs();
  const navigate = useNavigate();
  
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { 
    imageUrls, 
    handleImageChange, 
    removeImage,
    showCropper,
    setShowCropper,
    imageToEdit,
    setImageToEdit,
    currentEditIndex,
    setCurrentEditIndex,
    handleCropComplete,
    images
  } = useImageUploadWithCrop();
  
  const getSouvenirCount = (tripId: string) => {
    return souvenirs.filter(s => s.tripId === tripId).length;
  };
  
  const handleAddTrip = async () => {
    if (!newTripName.trim() || !startDate || !endDate) {
      return;
    }
    
    const coverImage = images.length > 0 
      ? images[0] 
      : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop';
    
    console.log("Adding trip with coverImage:", coverImage.substring(0, 50) + "...");
    
    await addTrip({
      name: newTripName.trim(),
      dateRange: {
        start: startDate,
        end: endDate,
      },
      coverImage: coverImage,
    });
    
    setNewTripName('');
    setStartDate('');
    setEndDate('');
    setShowAddTrip(false);
    if (images.length > 0) {
      removeImage(0);
    }
  };
  
  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToEdit(null);
    setCurrentEditIndex(null);
  };
  
  const handleEditImage = (index: number) => {
    setImageToEdit(imageUrls[index]);
    setCurrentEditIndex(index);
    setShowCropper(true);
  };
  
  return (
    <div className="souvenir-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Trips</h1>
        <button
          onClick={() => setShowAddTrip(!showAddTrip)}
          className={`p-2 rounded-full transition-colors ${
            showAddTrip ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          {showAddTrip ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>
      
      {showAddTrip && (
        <div className="mb-6 bg-secondary/50 p-4 rounded-lg animate-scale-in">
          <h2 className="text-lg font-medium mb-3">New Trip</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="tripName" className="block text-sm font-medium mb-1">Trip Name</label>
              <input
                id="tripName"
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="e.g., Japan 2024"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <div className="border border-dashed border-input p-4 rounded-lg">
              <ImageUploadWithCrop
                imageUrls={imageUrls}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
                showCropper={showCropper}
                imageToEdit={imageToEdit}
                onCropCancel={handleCropCancel}
                onCropComplete={handleCropComplete}
                onEditImage={handleEditImage}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddTrip}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <span>Create Trip</span>
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            souvenirCount={getSouvenirCount(trip.id)}
            onClick={() => navigate(`/trip/${trip.id}`)}
          />
        ))}
        
        {trips.length === 0 && !showAddTrip && (
          <div className="col-span-full text-center py-12">
            <FolderPlus className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No trip folders yet.</p>
            <button
              onClick={() => setShowAddTrip(true)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Trip</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface TripCardProps {
  trip: Trip;
  souvenirCount: number;
  onClick: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, souvenirCount, onClick }) => {
  const startDate = new Date(trip.dateRange.start);
  const endDate = new Date(trip.dateRange.end);
  const [imageError, setImageError] = useState(false);
  
  const formattedDateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  
  const handleImageError = () => {
    console.error("Failed to load trip image:", trip.coverImage);
    setImageError(true);
  };
  
  const isValidImage = trip.coverImage && typeof trip.coverImage === 'string' && trip.coverImage.trim() !== '';
  
  return (
    <div
      onClick={onClick}
      className="rounded-xl overflow-hidden border border-muted bg-card hover:shadow-md transition-shadow cursor-pointer"
    >
      <div
        className="aspect-video bg-muted relative"
        style={
          !imageError && isValidImage
            ? {
                backgroundImage: `url(${trip.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}
        }
      >
        {(imageError || !isValidImage) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        
        {isValidImage && (
          <img 
            src={trip.coverImage} 
            alt="" 
            className="hidden" 
            onError={handleImageError}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
          <h3 className="text-xl font-serif font-medium line-clamp-1">{trip.name}</h3>
          <div className="flex items-center text-sm opacity-90 mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formattedDateRange}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          {souvenirCount} {souvenirCount === 1 ? 'souvenir' : 'souvenirs'}
        </p>
      </div>
    </div>
  );
};

export default TripFolders;
