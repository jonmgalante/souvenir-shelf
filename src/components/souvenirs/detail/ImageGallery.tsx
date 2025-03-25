
import React, { useState, useEffect } from 'react';
import { Map, ArrowLeft } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  // Reset image errors when images change
  useEffect(() => {
    setImageErrors({});
    setCurrentImageIndex(0);
  }, [images]);
  
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
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const validImages = images.filter((_, index) => !imageErrors[index]);
  const hasValidImages = validImages.length > 0;
  
  return (
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
  );
};

export default ImageGallery;
