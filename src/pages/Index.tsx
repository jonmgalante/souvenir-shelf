
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Grid3X3 } from 'lucide-react';
import { useSouvenirs } from '../context/SouvenirContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { souvenirs } = useSouvenirs();
  
  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">Souvenir Shelf</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="py-1.5 px-3 pr-8 text-sm border rounded-md focus:outline-none"
            />
          </div>
          <button className="p-1.5 border rounded-md">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate('/add')}
            className="p-1.5 bg-black text-white rounded-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>
      
      {/* Subtitle */}
      <p className="text-lg mb-8 font-serif">A personal museum from a life well-traveled</p>
      
      {/* Navigation */}
      <nav className="mb-8">
        <ul className="flex space-x-6 border-b">
          <li className="pb-2 border-b-2 border-black font-medium text-sm">Story</li>
          <li className="pb-2 text-sm text-gray-600 hover:text-black">Collections</li>
          <li className="pb-2 text-sm text-gray-600 hover:text-black">Trips</li>
        </ul>
      </nav>
      
      {/* Souvenirs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {souvenirs.map((souvenir) => (
          <div key={souvenir.id} className="space-y-2" onClick={() => navigate(`/souvenir/${souvenir.id}`)}>
            <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-none overflow-hidden">
              <Grid3X3 className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{souvenir.name}</h3>
              <p className="text-xs text-gray-600">{souvenir.location.city}, {souvenir.location.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
