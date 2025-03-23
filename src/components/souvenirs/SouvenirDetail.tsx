
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../../context/souvenir';
import { Map, Calendar, ArrowLeft, Tag, Share2, Edit, MapPin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { Location } from '../../types/souvenir';

const SouvenirDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSouvenirById, deleteSouvenir, updateSouvenir } = useSouvenirs();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const souvenir = getSouvenirById(id || '');
  
  // Using useEffect to reset image errors when souvenir changes - moved this before the early return
  useEffect(() => {
    // Reset image errors when souvenir changes
    setImageErrors({});
    setCurrentImageIndex(0);
  }, [id]);
  
  if (!souvenir) {
    return (
      <div className="souvenir-container flex items-center justify-center min-h-screen">
        <p>Souvenir not found.</p>
      </div>
    );
  }
  
  const { name, images, location, dateAcquired, categories, notes } = souvenir;
  
  const handleImageError = (index: number) => {
    console.log(`Image at index ${index} failed to load for souvenir: ${name}`, images);
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
    
    // If the current image failed and there are other images, try the next one
    if (index === currentImageIndex && images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  
  // Initialize edit form state with current values
  const openEditDialog = () => {
    setEditName(name);
    setEditNotes(notes || '');
    setEditCategories([...categories]);
    setIsEditDialogOpen(true);
  };
  
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
  
  const handleUpdateSouvenir = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim()) return;
    
    try {
      setIsSubmitting(true);
      await updateSouvenir(id || '', {
        name: editName,
        notes: editNotes,
        categories: editCategories.length > 0 ? editCategories : ['Other'],
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating souvenir:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCategoryToggle = (category: string) => {
    setEditCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const formattedDate = format(new Date(dateAcquired), 'MMMM d, yyyy');
  
  // Available categories
  const allCategories = [
    'Handcrafted', 'Food', 'Clothing', 'Art', 'Jewelry', 
    'Antique', 'Technology', 'Book', 'Toy', 'Decoration', 'Other'
  ];
  
  const validImages = images.filter((_, index) => !imageErrors[index]);
  const hasValidImages = validImages.length > 0;
  
  return (
    <div className="souvenir-container pb-20 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex space-x-2">
          <button
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Share souvenir"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={openEditDialog}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Edit souvenir"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-destructive"
            aria-label="Delete souvenir"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="relative aspect-square bg-muted rounded-xl overflow-hidden mb-6">
        {hasValidImages ? (
          <img
            src={images[currentImageIndex]}
            alt={name}
            className="w-full h-full object-cover animate-fade-in"
            onError={() => handleImageError(currentImageIndex)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Map className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mt-2">No image available</p>
          </div>
        )}
        
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors rotate-180"
              aria-label="Next image"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              {validImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Souvenir Details */}
      <h1 className="text-3xl font-serif font-medium mb-2">{name}</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location.city}, {location.country}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
          >
            <Tag className="h-3 w-3 mr-1 opacity-70" />
            {category}
          </span>
        ))}
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">The Story</h2>
        <p className="text-muted-foreground whitespace-pre-line">{notes}</p>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">Location</h2>
        <div className="h-40 bg-muted rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Map className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
            <p className="text-sm">{location.city}, {location.country}</p>
            <p className="text-xs opacity-80">Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}</p>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Souvenir</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this souvenir? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Souvenir</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdateSouvenir} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Souvenir name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      editCategories.includes(category)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-notes" className="block text-sm font-medium">
                Notes
              </label>
              <textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                placeholder="Any special memories or details?"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !editName.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SouvenirDetail;
