'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useFilters } from '@/contexts/FilterContext';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { neighborhood, category, setNeighborhood, setCategory, resetFilters } = useFilters();
  
  const menuItems = [
    { icon: '🏠', label: 'Início', url: '/home' },
    { icon: '📄', label: 'Propostas da Comunidade', url: '/proposals' },
    { icon: '📊', label: 'Dashboard', url: '/dashboard' },
    { icon: '🚩', label: 'Denúncias', url: '/reports' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg z-40 overflow-y-auto">
      <div className="p-4">
        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.url
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Filtros
            </h3>
            {(neighborhood !== 'Todos os Bairros' || category !== 'Todas as categorias') && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Ativos
              </span>
            )}
          </div>
          
          {/* Bairro Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <select 
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Todos os Bairros</option>
              <option>Adhemar Garcia</option>
              <option>América</option>
              <option>Anita Garibaldi</option>
              <option>Atiradores</option>
              <option>Aventureiro</option>
              <option>Boa Vista</option>
              <option>Boehmerwald</option>
              <option>Bom Retiro</option>
              <option>Bucarein</option>
              <option>Centro</option>
              <option>Comasa</option>
              <option>Costa e Silva</option>
              <option>Dona Francisca</option>
              <option>Espinheiros</option>
              <option>Fátima</option>
              <option>Floresta</option>
              <option>Glória</option>
              <option>Guanabara</option>
              <option>Iririú</option>
              <option>Itaum</option>
              <option>Itinga</option>
              <option>Jardim Iririú</option>
              <option>Jardim Paraíso</option>
              <option>Jardim Sofia</option>
              <option>Jarivatuba</option>
              <option>João Costa</option>
              <option>Morro do Meio</option>
              <option>Nova Brasília</option>
              <option>Paranaguamirim</option>
              <option>Parque Guarani</option>
              <option>Petrópolis</option>
              <option>Pirabeiraba</option>
              <option>Profipo</option>
              <option>Rio Bonito</option>
              <option>Saguaçu</option>
              <option>Santa Catarina</option>
              <option>Santo Antônio</option>
              <option>São Marcos</option>
              <option>Ulysses Guimarães</option>
              <option>Vila Cubatão</option>
              <option>Vila Nova</option>
              <option>Zona Industrial Norte</option>
              <option>Zona Industrial Tupy</option>
            </select>
          </div>

          {/* Categoria Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Todas as categorias</option>
              <option>Infraestrutura</option>
              <option>Meio Ambiente</option>
              <option>Segurança</option>
              <option>Educação</option>
              <option>Saúde</option>
              <option>Cultura</option>
              <option>Transporte</option>
              <option>Outros</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(neighborhood !== 'Todos os Bairros' || category !== 'Todas as categorias') && (
            <button
              onClick={resetFilters}
              className="w-full mt-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar Filtros
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;