
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs, Souvenir } from '../../context/SouvenirContext';
import { Filter, Search } from 'lucide-react';

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

  return (
    <div className="souvenir-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">My Collection</h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Toggle filters"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search your collection..."
            className="w-full pl-10 py-2 rounded-lg border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
        </div>
        
        {showFilters && (
          <div className="bg-secondary/50 p-4 rounded-lg animate-scale-in">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                className="text-sm text-primary hover:underline"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Grid of Souvenirs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : filteredSouvenirs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSouvenirs.map((souvenir) => (
            <div
              key={souvenir.id}
              onClick={() => navigate(`/souvenir/${souvenir.id}`)}
              className="group cursor-pointer animate-scale-in"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
                <img
                  src={souvenir.images[0]}
                  alt={souvenir.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div className="text-white">
                    <h3 className="font-medium line-clamp-1">{souvenir.name}</h3>
                    <p className="text-xs opacity-90">{souvenir.location.city}, {souvenir.location.country}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No souvenirs found. Try changing your filters.</p>
        </div>
      )}
    </div>
  );
};

export default SouvenirGrid;
