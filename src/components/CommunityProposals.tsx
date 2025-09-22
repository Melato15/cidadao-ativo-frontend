'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import ProposalCard from '@/components/ProposalCard';
import AddProposal from '@/components/AddProposal';

interface CommunityProposal {
  id: number;
  title: string;
  description: string;
  author: string;
  neighborhood: string;
  createdAt: string;
  category: 'Infraestrutura' | 'Meio Ambiente' | 'Segurança' | 'Educação' | 'Saúde' | 'Cultura' | 'Transporte' | 'Outros';
}

// Mock data for community proposals
const mockProposals: CommunityProposal[] = [
  {
    id: 1,
    title: 'Parquinho Infantil na Praça da Vila',
    description: 'Proposta para instalação de um parquinho infantil na Praça da Vila Nova, com brinquedos seguros e área cercada para proteção das crianças. A comunidade tem muitas famílias jovens e sentimos falta de um espaço dedicado aos pequenos.',
    author: 'Marina Santos',
    neighborhood: 'Vila Nova',
    createdAt: '2024-03-15',
    category: 'Infraestrutura'
  },
  {
    id: 2,
    title: 'Horta Comunitária no Jardim das Flores',
    description: 'Criação de uma horta comunitária no terreno baldio da Rua das Acácias. O projeto incluiria canteiros suspensos, sistema de irrigação e compostagem, promovendo a alimentação saudável e o convívio social entre os moradores.',
    author: 'Carlos Oliveira',
    neighborhood: 'Jardim das Flores',
    createdAt: '2024-03-12',
    category: 'Meio Ambiente'
  },
  {
    id: 3,
    title: 'Melhor Iluminação na Rua Principal',
    description: 'A Rua Principal do bairro Centro está com várias lâmpadas queimadas, criando pontos escuros que comprometem a segurança dos pedestres, especialmente à noite. Solicitamos a manutenção e melhoria da iluminação pública.',
    author: 'Ana Paula Silva',
    neighborhood: 'Centro',
    createdAt: '2024-03-10',
    category: 'Segurança'
  },
  {
    id: 4,
    title: 'Aulas de Informática para Idosos',
    description: 'Proposta para criação de um programa de aulas básicas de informática voltado para a terceira idade, utilizando o espaço do centro comunitário. O objetivo é promover a inclusão digital e melhorar a qualidade de vida dos idosos.',
    author: 'Roberto Ferreira',
    neighborhood: 'Zona Sul',
    createdAt: '2024-03-08',
    category: 'Educação'
  },
  {
    id: 5,
    title: 'Festival Cultural Mensal',
    description: 'Organização de um festival cultural mensal na praça central, com apresentações de música local, dança, teatro e exposição de artesanato. O evento fortaleceria a cultura local e proporcionaria entretenimento gratuito para toda a família.',
    author: 'Lucia Pereira',
    neighborhood: 'Centro',
    createdAt: '2024-03-05',
    category: 'Cultura'
  }
];

const CommunityProposals: React.FC = () => {
  const [proposals, setProposals] = useState<CommunityProposal[]>(mockProposals);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('Todos');

  const categories = [
    'Todas',
    'Infraestrutura',
    'Meio Ambiente',
    'Segurança',
    'Educação',
    'Saúde',
    'Cultura',
    'Transporte',
    'Outros'
  ];

  const neighborhoods = [
    'Todos',
    'Centro',
    'Zona Norte',
    'Zona Sul',
    'Zona Leste',
    'Zona Oeste',
    'Vila Nova',
    'Jardim das Flores',
    'Bela Vista',
    'Industrial'
  ];

  const handleAddProposal = (newProposalData: Omit<CommunityProposal, 'id' | 'author' | 'createdAt'>) => {
    const newProposal: CommunityProposal = {
      ...newProposalData,
      id: proposals.length + 1,
      author: 'Usuário Atual', // Em uma aplicação real, isso viria do contexto de autenticação
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProposals(prev => [newProposal, ...prev]);
    setShowAddForm(false);
  };

  const filteredProposals = proposals.filter(proposal => {
    const categoryMatch = filterCategory === 'Todas' || proposal.category === filterCategory;
    const neighborhoodMatch = filterNeighborhood === 'Todos' || proposal.neighborhood === filterNeighborhood;
    return categoryMatch && neighborhoodMatch;
  });

  const getStats = () => {
    const totalProposals = proposals.length;
    const categoriesCount = proposals.reduce((acc, proposal) => {
      acc[proposal.category] = (acc[proposal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoriesCount).reduce((a, b) => 
      categoriesCount[a[0]] > categoriesCount[b[0]] ? a : b
    )[0];

    return { totalProposals, topCategory };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Breadcrumb/Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Início
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">Propostas da Comunidade</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Propostas da Comunidade</h2>
          <p className="text-gray-600 mt-1">
            Compartilhe suas ideias para melhorar o bairro
          </p>
        </div>
        {!showAddForm && (
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Proposta
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-900">Total de Propostas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalProposals}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-900">Categoria Mais Popular</p>
              <p className="text-lg font-bold text-green-600">{stats.topCategory}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-900">Bairros Ativos</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(proposals.map(p => p.neighborhood)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Proposal Form */}
      {showAddForm && (
        <AddProposal
          onSubmit={handleAddProposal}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="neighborhood-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <select
              id="neighborhood-filter"
              value={filterNeighborhood}
              onChange={(e) => setFilterNeighborhood(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {neighborhoods.map(neighborhood => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {filteredProposals.length} de {proposals.length} propostas
        </p>
        {(filterCategory !== 'Todas' || filterNeighborhood !== 'Todos') && (
          <button
            onClick={() => {
              setFilterCategory('Todas');
              setFilterNeighborhood('Todos');
            }}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Proposals Grid */}
      {filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou seja o primeiro a criar uma proposta!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityProposals;