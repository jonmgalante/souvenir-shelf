
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../../context/SouvenirContext';
import { Map, Calendar, ArrowLeft, Tag, Share2, Edit, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const SouvenirDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSouvenirById } = useSouvenirs();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const souvenir = getSouvenirById(id || '');
  
  if (!souvenir) {
    return (
      <div className="souvenir-container flex items-center justify-center min-h-screen">
        <p>Souvenir not found.</p>
      </div>
    );
  }
  
  const { name, images, location, dateAcquired, categories, notes } = souvenir;
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const formattedDate = format(new Date(dateAcquired), 'MMMM d, yyyy');
  
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
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Edit souvenir"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="relative aspect-square bg-muted rounded-xl overflow-hidden mb-6">
        <img
          src={images[currentImageIndex]}
          alt={name}
          className="w-full h-full object-cover animate-fade-in"
        />
        
        {images.length > 1 && (
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
              {images.map((_, index) => (
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
    </div>
  );
};

export default SouvenirDetail;
