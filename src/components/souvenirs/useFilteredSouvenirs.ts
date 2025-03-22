
import { useState, useEffect } from 'react';
import { Souvenir } from '../../context/souvenir';
import { FilterOptions } from './types';

export function useFilteredSouvenirs(souvenirs: Souvenir[]) {
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

  return {
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
  };
}
