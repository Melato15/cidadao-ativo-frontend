'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  neighborhood: string;
  category: string;
  setNeighborhood: (value: string) => void;
  setCategory: (value: string) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [neighborhood, setNeighborhood] = useState<string>('Todos os Bairros');
  const [category, setCategory] = useState<string>('Todas as categorias');

  const resetFilters = () => {
    setNeighborhood('Todos os Bairros');
    setCategory('Todas as categorias');
  };

  return (
    <FilterContext.Provider
      value={{
        neighborhood,
        category,
        setNeighborhood,
        setCategory,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
