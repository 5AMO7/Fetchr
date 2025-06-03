import { createContext, useContext, useState } from 'react';

// Create a context for filters
const FilterContext = createContext();

// Custom hook to use the filter context
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

// Provider component
export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    industries: [],
    locations: [],
    employeeCount: [],
    companyName: '',
    socialMedia: {}
  });

  // Update a specific filter category
  const updateFilter = (category, values) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: values
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      industries: [],
      locations: [],
      employeeCount: [],
      companyName: '',
      socialMedia: {}
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.industries.length > 0 || 
      filters.locations.length > 0 || 
      filters.employeeCount.length > 0 ||
      filters.companyName.trim() !== '' ||
      Object.keys(filters.socialMedia).length > 0
    );
  };

  return (
    <FilterContext.Provider value={{ 
      filters, 
      updateFilter, 
      clearAllFilters,
      hasActiveFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export default FilterContext; 