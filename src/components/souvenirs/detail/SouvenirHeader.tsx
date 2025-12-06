import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Edit, Trash2, MapPin, Calendar, Briefcase, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '../../../types/trip';
import { Location } from '../../../types/souvenir';

interface SouvenirHeaderProps {
  name: string;
  location: Location;
  dateAcquired: string | null;
  categories: string[];
  associatedTrip: Trip | null;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const SouvenirHeader: React.FC<SouvenirHeaderProps> = ({
  name,
  location,
  dateAcquired,
  categories,
  associatedTrip,
  onEditClick,
  onDeleteClick
}) => {
  const navigate = useNavigate();

  const formattedDate = dateAcquired
    ? format(new Date(dateAcquired), 'MMMM d, yyyy')
    : 'Date unknown';
  
  return (
    <>
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
            onClick={onEditClick}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Edit souvenir"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDeleteClick}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-destructive"
            aria-label="Delete souvenir"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
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
        
        {/* Display associated trip name if it exists */}
        {associatedTrip && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 mr-1" />
            <span 
              className="hover:underline cursor-pointer"
              onClick={() => navigate(`/trip/${associatedTrip.id}`)}
            >
              {associatedTrip.name}
            </span>
          </div>
        )}
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
    </>
  );
};

export default SouvenirHeader;