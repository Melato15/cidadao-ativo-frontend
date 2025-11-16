'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  neighborhood: string;
  category: string;
  status: string;
  setNeighborhood: (value: string) => void;
  setCategory: (value: string) => void;
  setStatus: (value: string) => void;
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
  const [status, setStatus] = useState<string>('Todos os status');

  const resetFilters = () => {
    setNeighborhood('Todos os Bairros');
    setCategory('Todas as categorias');
    setStatus('Todos os status');
  };

  return (
    <FilterContext.Provider
      value={{
        neighborhood,
        category,
        status,
        setNeighborhood,
        setCategory,
        setStatus,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
