
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../../context/souvenir';
import FilterBar from './FilterBar';
import FilterPanel from './FilterPanel';
import SouvenirCard from './SouvenirCard';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import { useFilteredSouvenirs } from './useFilteredSouvenirs';

const SouvenirGrid: React.FC = () => {
  const { souvenirs, loading } = useSouvenirs();
  const navigate = useNavigate();
  
  const {
    filteredSouvenirs,
    filters,
    handleFilterChange,
    resetFilters,
    hasActiveFilters,
    showFilters,
    setShowFilters,
    countries,
    years,
    categories
  } = useFilteredSouvenirs(souvenirs);

  // Get count of unique countries from all souvenirs (not just filtered ones)
  const uniqueCountriesCount = new Set(souvenirs.map(s => s.location.country)).size;

  console.log('Rendering SouvenirGrid with souvenirs:', souvenirs.length);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium">Your Collection</h1>
          <p className="text-muted-foreground text-sm">
            Memories from {uniqueCountriesCount} {uniqueCountriesCount === 1 ? 'country' : 'countries'} around the world
          </p>
        </div>
        
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>
      
      {/* Filters */}
      {showFilters && (
        <FilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          resetFilters={resetFilters}
          countries={countries}
          years={years}
          categories={categories}
        />
      )}
      
      {/* Grid of Souvenirs */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredSouvenirs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredSouvenirs.map((souvenir) => (
            <SouvenirCard
              key={souvenir.id}
              souvenir={souvenir}
              onClick={() => navigate(`/souvenir/${souvenir.id}`)}
            />
          ))}
        </div>
      ) : souvenirs.length === 0 && !hasActiveFilters() ? (
        <EmptyState />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No souvenirs found. Try changing your filters.</p>
        </div>
      )}
    </div>
  );
};

export default SouvenirGrid;
