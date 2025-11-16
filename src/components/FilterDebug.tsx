'use client';

import React from 'react';
import { useFilters } from '@/contexts/FilterContext';

/**
 * Componente de debug para visualizar os filtros ativos
 * Adicione este componente em qualquer página para ver os filtros em tempo real
 */
const FilterDebug: React.FC = () => {
  const { neighborhood, category, status } = useFilters();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs z-50 max-w-xs">
      <div className="font-bold mb-2 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        Filtros Ativos (Debug)
      </div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Bairro:</span>{' '}
          <span className={neighborhood !== 'Todos os Bairros' ? 'text-yellow-400 font-semibold' : ''}>
            {neighborhood}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Categoria:</span>{' '}
          <span className={category !== 'Todas as categorias' ? 'text-yellow-400 font-semibold' : ''}>
            {category}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Status:</span>{' '}
          <span className={status !== 'Todos os status' ? 'text-yellow-400 font-semibold' : ''}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterDebug;
