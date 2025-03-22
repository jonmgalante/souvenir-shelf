
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { FilterOptions } from './types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFilterChange, 
  showFilters, 
  setShowFilters 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-medium">My Collection</h1>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="py-1.5 px-3 pr-8 text-sm border rounded-md focus:outline-none"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
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
  );
};

export default FilterBar;
