
import React, { useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import { Souvenir } from '../../types/souvenir';

interface SouvenirCardProps {
  souvenir: Souvenir;
  onClick: () => void;
}

const SouvenirCard: React.FC<SouvenirCardProps> = ({ souvenir, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.log(`Image failed to load for souvenir: ${souvenir.name}`, souvenir.images);
    setImageError(true);
  };

  return (
    <div
      onClick={onClick}
      className="space-y-2 cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {souvenir.images && souvenir.images.length > 0 && !imageError ? (
          <img
            src={souvenir.images[0]}
            alt={souvenir.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <Grid3X3 className="w-6 h-6 text-gray-400" />
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
