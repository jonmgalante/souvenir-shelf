
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../../context/souvenir';

// Component imports
import ImageGallery from './detail/ImageGallery';
import SouvenirHeader from './detail/SouvenirHeader';
import LocationMap from './detail/LocationMap';
import EditSouvenirDialog from './detail/EditSouvenirDialog';
import DeleteSouvenirDialog from './detail/DeleteSouvenirDialog';

const SouvenirDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSouvenirById, deleteSouvenir, updateSouvenir, trips } = useSouvenirs();
  
  // UI state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the souvenir data
  const souvenir = getSouvenirById(id || '');
  
  // Find associated trip
  const associatedTrip = souvenir?.tripId ? trips.find(trip => trip.id === souvenir.tripId) : null;
  
  if (!souvenir) {
    return (
      <div className="souvenir-container flex items-center justify-center min-h-screen">
        <p>Souvenir not found.</p>
      </div>
    );
  }
  
  const { name, images, location, dateAcquired, categories, notes } = souvenir;
  
  // Handle deletion
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      console.log('Delete confirmation handler triggered for ID:', id);
      
      if (!id) {
        console.error('Cannot delete: souvenir ID is undefined');
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        return;
      }
      
      await deleteSouvenir(id);
      console.log('Delete successful, navigating to collection page');
      navigate('/collection');
    } catch (error) {
      console.error('Error in handleDeleteConfirm:', error);
      setIsDeleting(false);
    }
  };
  
  // Handle update
  const handleUpdateSouvenir = async (name: string, notes: string, categories: string[]) => {
    if (!name.trim()) return;
    
    try {
      setIsSubmitting(true);
      await updateSouvenir(id || '', {
        name,
        notes,
        categories: categories.length > 0 ? categories : ['Other'],
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating souvenir:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="souvenir-container pb-20 animate-fade-in">
      {/* Header and metadata */}
      <SouvenirHeader 
        name={name}
        location={location}
        dateAcquired={dateAcquired}
        categories={categories}
        associatedTrip={associatedTrip}
        onEditClick={() => setIsEditDialogOpen(true)}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      
      {/* Image Gallery */}
      <ImageGallery images={images} name={name} />
      
      {/* Story section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">The Story</h2>
        <p className="text-muted-foreground whitespace-pre-line">{notes}</p>
      </div>
      
      {/* Location Map */}
      <LocationMap location={location} name={name} />
      
      {/* Dialogs */}
      <DeleteSouvenirDialog 
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
      
      <EditSouvenirDialog 
        name={name}
        notes={notes}
        categories={categories}
        isOpen={isEditDialogOpen}
        isSubmitting={isSubmitting}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateSouvenir}
      />
    </div>
  );
};

export default SouvenirDetail;
