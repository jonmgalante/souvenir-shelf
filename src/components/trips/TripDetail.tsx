import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSouvenirs, Trip, Souvenir } from '../../context/souvenir';
import { ArrowLeft, Calendar, Map, Plus, List, Upload, X, Camera, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import SouvenirCard from '../souvenirs/SouvenirCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../ui/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { useImageUploadWithCrop } from '../../hooks/useImageUploadWithCrop';
import ImageCropper from '../common/ImageCropper';

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, souvenirs, loading, updateSouvenir, updateTrip } = useSouvenirs();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [tripSouvenirs, setTripSouvenirs] = useState<Souvenir[]>([]);
  const [otherSouvenirs, setOtherSouvenirs] = useState<Souvenir[]>([]);
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingToTrip, setIsAddingToTrip] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  
  const { 
    imageUrls, 
    handleImageChange, 
    removeImage,
    showCropper,
    setShowCropper,
    imageToEdit,
    setImageToEdit,
    handleCropComplete
  } = useImageUploadWithCrop();
  
  useEffect(() => {
    if (!loading && trips.length > 0 && id) {
      const foundTrip = trips.find(t => t.id === id);
      setTrip(foundTrip);
      
      if (foundTrip) {
        const filteredSouvenirs = souvenirs.filter(s => s.tripId === id);
        setTripSouvenirs(filteredSouvenirs);
        
        const availableSouvenirs = souvenirs.filter(s => !s.tripId || s.tripId !== id);
        setOtherSouvenirs(availableSouvenirs);
      }
    }
  }, [id, trips, souvenirs, loading]);
  
  const addExistingSouvenir = async (souvenir: Souvenir) => {
    try {
      setIsAddingToTrip(true);
      
      console.log(`Adding souvenir ${souvenir.id} to trip ${id}`);
      await updateSouvenir(souvenir.id, { tripId: id });
      
      toast({
        title: "Souvenir added to trip",
        description: `${souvenir.name} has been added to this trip.`,
      });
      
      setTripSouvenirs(prev => [...prev, {...souvenir, tripId: id}]);
      setOtherSouvenirs(prev => prev.filter(s => s.id !== souvenir.id));
      
      setIsAddExistingOpen(false);
    } catch (error) {
      console.error('Error adding existing souvenir to trip:', error);
      toast({
        title: "Error adding souvenir",
        description: "There was a problem adding the souvenir to this trip.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToTrip(false);
    }
  };
  
  const handleUpdateTripPhoto = async () => {
    if (!trip || !id || imageUrls.length === 0) return;
    
    try {
      setIsUpdatingPhoto(true);
      
      await updateTrip(id, { coverImage: imageUrls[0] });
      
      setTrip({...trip, coverImage: imageUrls[0]});
      
      toast({
        title: "Trip photo updated",
        description: "Your trip photo has been updated successfully.",
      });
      
      setIsPhotoDialogOpen(false);
      
    } catch (error) {
      console.error('Error updating trip photo:', error);
      toast({
        title: "Error updating photo",
        description: "There was a problem updating the trip photo.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPhoto(false);
    }
  };
  
  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToEdit(null);
  };
  
  const handleCreateNew = () => {
    navigate(`/add?tripId=${id}`);
  };
  
  const filteredSouvenirs = searchQuery
    ? otherSouvenirs.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : otherSouvenirs;
  
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
    <div className="souvenir-container animate-fade-in pb-24">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/trips')} className="p-2 hover:bg-secondary rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title">{trip.name}</h1>
      </div>
      
      <div 
        className="w-full h-48 md:h-64 lg:h-80 rounded-lg bg-muted mb-6 relative overflow-hidden cursor-pointer group"
        style={{
          backgroundImage: `url(${trip?.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => setIsPhotoDialogOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formattedDateRange}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/80 text-black p-2 rounded-full">
            <Pencil className="h-6 w-6" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Souvenirs from this trip</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddExistingOpen(true)}
            disabled={otherSouvenirs.length === 0}
          >
            <List className="mr-2 h-4 w-4" />
            Add Existing
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleCreateNew}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>
      
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
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAddExistingOpen(true)}
              disabled={otherSouvenirs.length === 0}
            >
              <List className="mr-2 h-4 w-4" />
              Add Existing
            </Button>
            <Button 
              variant="default" 
              onClick={handleCreateNew}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>
      )}
      
      <Dialog open={isAddExistingOpen} onOpenChange={setIsAddExistingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add existing souvenir to trip</DialogTitle>
            <DialogDescription>
              Select a souvenir from your collection to add to this trip.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <Input
              id="search"
              placeholder="Search souvenirs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            
            {filteredSouvenirs.length > 0 ? (
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-2">
                  {filteredSouvenirs.map(souvenir => (
                    <div 
                      key={souvenir.id}
                      className="flex items-center p-2 rounded-lg border border-input hover:bg-accent cursor-pointer"
                      onClick={() => !isAddingToTrip && addExistingSouvenir(souvenir)}
                    >
                      <div 
                        className="w-16 h-16 rounded-md bg-secondary mr-3 bg-cover bg-center"
                        style={{
                          backgroundImage: souvenir.images && souvenir.images.length > 0
                            ? `url(${souvenir.images[0]})`
                            : 'none'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{souvenir.name}</h3>
                        <p className="text-sm text-muted-foreground">{souvenir.location.city}, {souvenir.location.country}</p>
                      </div>
                      {isAddingToTrip && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {otherSouvenirs.length === 0 
                    ? "You don't have any other souvenirs to add"
                    : "No souvenirs match your search"}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change trip photo</DialogTitle>
            <DialogDescription>
              Upload a new cover image for your trip.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="border border-dashed border-input p-4 rounded-lg">
              {imageUrls.length > 0 ? (
                <div className="relative w-full aspect-video">
                  <img 
                    src={imageUrls[0]} 
                    alt="New trip cover" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        setImageToEdit(imageUrls[0]);
                        setShowCropper(true);
                      }}
                      className="p-1.5 rounded-full bg-black/60 text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(0)}
                      className="p-1.5 rounded-full bg-black/60 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 bg-muted/40 rounded-lg">
                  <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload a new cover image</p>
                  <div className="mt-4">
                    <label 
                      htmlFor="trip-cover" 
                      className="cursor-pointer px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select Photo
                      <input
                        id="trip-cover"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  removeImage(0);
                  setIsPhotoDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                disabled={imageUrls.length === 0 || isUpdatingPhoto}
                onClick={handleUpdateTripPhoto}
              >
                {isUpdatingPhoto ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                    Updating...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </Button>
            </div>
          </div>
          
          {imageToEdit && (
            <ImageCropper
              imageUrl={imageToEdit}
              aspectRatio={16/9}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
              open={showCropper}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetail;
