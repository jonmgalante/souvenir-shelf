
import React from 'react';
import { FilterOptions } from './types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  resetFilters: () => void;
  countries: string[];
  years: string[];
  categories: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFilterChange, 
  resetFilters,
  countries,
  years,
  categories 
}) => {
  return (
    <div className="bg-gray-50 p-4 mb-6 rounded-none border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="country-filter" className="block text-xs font-medium mb-1">
            Country
          </label>
          <select
            id="country-filter"
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
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
            onChange={(e) => onFilterChange('year', e.target.value)}
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
            onChange={(e) => onFilterChange('category', e.target.value)}
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
  );
};

export default FilterPanel;
