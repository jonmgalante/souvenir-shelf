import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs, Souvenir } from '../../context/SouvenirContext';
import { Filter, Search, Grid3X3, Plus } from 'lucide-react';
import { Button } from '../ui/button';

type FilterOptions = {
  country: string;
  year: string;
  category: string;
  searchTerm: string;
};

const SouvenirGrid: React.FC = () => {
  const { souvenirs, loading } = useSouvenirs();
  const navigate = useNavigate();
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    country: '',
    year: '',
    category: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique countries, years, and categories for filters
  const countries = [...new Set(souvenirs.map(s => s.location.country))].sort();
  const years = [...new Set(souvenirs.map(s => new Date(s.dateAcquired).getFullYear().toString()))].sort((a, b) => b.localeCompare(a));
  const categories = [...new Set(souvenirs.flatMap(s => s.categories))].sort();

  // Apply filters
  useEffect(() => {
    let result = [...souvenirs];
    
    if (filters.country) {
      result = result.filter(s => s.location.country === filters.country);
    }
    
    if (filters.year) {
      result = result.filter(s => {
        const year = new Date(s.dateAcquired).getFullYear().toString();
        return year === filters.year;
      });
    }
    
    if (filters.category) {
      result = result.filter(s => s.categories.includes(filters.category));
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.notes.toLowerCase().includes(term) ||
        s.location.country.toLowerCase().includes(term) ||
        s.location.city.toLowerCase().includes(term)
      );
    }
    
    setFilteredSouvenirs(result);
  }, [souvenirs, filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      country: '',
      year: '',
      category: '',
      searchTerm: '',
    });
  };

  const hasActiveFilters = () => {
    return filters.country !== '' || 
           filters.year !== '' || 
           filters.category !== '' || 
           filters.searchTerm !== '';
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">My Collection</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="py-1.5 px-3 pr-8 text-sm border rounded-md focus:outline-none"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-1.5 border rounded-md"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 mb-6 rounded-none border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country-filter" className="block text-xs font-medium mb-1">
                Country
              </label>
              <select
                id="country-filter"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year-filter" className="block text-xs font-medium mb-1">
                Year
              </label>
              <select
                id="year-filter"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="block text-xs font-medium mb-1">
                Category
              </label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-black hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Grid of Souvenirs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-gray-100 animate-pulse"></div>
              <div className="h-4 bg-gray-100 animate-pulse"></div>
              <div className="h-3 bg-gray-100 animate-pulse w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredSouvenirs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredSouvenirs.map((souvenir) => (
            <div
              key={souvenir.id}
              onClick={() => navigate(`/souvenir/${souvenir.id}`)}
              className="space-y-2 cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {souvenir.images && souvenir.images.length > 0 ? (
                  <img
                    src={souvenir.images[0]}
                    alt={souvenir.name}
                    className="w-full h-full object-cover"
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
          ))}
        </div>
      ) : souvenirs.length === 0 && !hasActiveFilters() ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No souvenirs found. Try changing your filters.</p>
        </div>
      )}
    </div>
  );
};

export default SouvenirGrid;
