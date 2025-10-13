'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
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
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Filtros
          </h3>
          
          {/* Bairro Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Todas as categorias</option>
              <option>Infraestrutura</option>
              <option>Segurança</option>
              <option>Saúde</option>
              <option>Educação</option>
              <option>Meio Ambiente</option>
              <option>Transporte</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Todos os status</option>
              <option>Em Votação</option>
              <option>Em Análise</option>
              <option>Aprovado</option>
              <option>Rejeitado</option>
              <option>Em Execução</option>
              <option>Concluído</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;