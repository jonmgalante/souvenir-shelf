
import React, { useState, useEffect } from 'react';
import { Grid3X3 } from 'lucide-react';
import { Souvenir } from '../../types/souvenir';

interface SouvenirCardProps {
  souvenir: Souvenir;
  onClick: () => void;
}

const SouvenirCard: React.FC<SouvenirCardProps> = ({ souvenir, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  
  useEffect(() => {
    // Reset error state when souvenir changes
    setImageError(false);
    
    // Set image source
    if (souvenir.images && souvenir.images.length > 0) {
      setImageSrc(souvenir.images[0]);
    } else {
      setImageSrc(null);
    }
  }, [souvenir]);
  
  const handleImageError = () => {
    console.log(`Image failed to load for souvenir: ${souvenir.name}`, souvenir.images);
    setImageError(true);
  };

  return (
    <div
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      className={`space-y-2 active:opacity-70 transition-opacity duration-150 ${
        isPressed ? 'scale-95' : 'scale-100'
      } transition-transform touch-manipulation`}
    >
      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={souvenir.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <Grid3X3 className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">No image</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium text-sm leading-tight">{souvenir.name}</h3>
        <p className="text-xs text-gray-600 truncate">{souvenir.location.city}, {souvenir.location.country}</p>
      </div>
    </div>
  );
};

export default SouvenirCard;
