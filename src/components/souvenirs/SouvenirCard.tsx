
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
      className="space-y-2 cursor-pointer hover:opacity-90 transition-opacity"
    >
      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={souvenir.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <Grid3X3 className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">No image</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium text-sm">{souvenir.name}</h3>
        <p className="text-xs text-gray-600">{souvenir.location.city}, {souvenir.location.country}</p>
      </div>
    </div>
  );
};

export default SouvenirCard;
