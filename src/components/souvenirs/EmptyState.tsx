
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Plus } from 'lucide-react';
import { Button } from '../ui/button';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Grid3X3 className="w-6 h-6 text-gray-400" />
      </div>
      <h2 className="text-xl font-medium mb-2">No souvenirs yet</h2>
      <p className="text-gray-600 max-w-md mb-6">
        Start building your personal museum by adding your first souvenir from your travels.
      </p>
      <Button 
        onClick={() => navigate('/add')}
        className="px-4 py-2 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add your first souvenir
      </Button>
    </div>
  );
};

export default EmptyState;
