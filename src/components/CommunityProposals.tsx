'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import ProposalCard from '@/components/ProposalCard';
import AddProposal from '@/components/AddProposal';
import { useFilters } from '@/contexts/FilterContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface CommunityProposal {
  id: number;
  title: string;
  description: string;
  author: string;
  neighborhood: string;
  createdAt: string;
  category: 'Infraestrutura' | 'Meio Ambiente' | 'Segurança' | 'Educação' | 'Saúde' | 'Cultura' | 'Transporte' | 'Outros';
}

const CommunityProposals: React.FC = () => {
  const [proposals, setProposals] = useState<CommunityProposal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  
  // Obter filtros do contexto
  const { neighborhood: globalNeighborhood, category: globalCategory } = useFilters();

  // Debug: Log dos filtros quando mudarem
  useEffect(() => {
    console.log('Filtros da Sidebar:', {
      globalNeighborhood,
      globalCategory
    });
  }, [globalNeighborhood, globalCategory]);

  // Carregar propostas do backend ao montar o componente
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/community-proposals`);
        if (response.ok) {
          const data = await response.json();
          const mappedProposals: CommunityProposal[] = data.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            category: mapCategoryToFrontend(project.category),
            neighborhood: project.neighborhood,
            author: project.author?.name || 'Usuário',
            createdAt: new Date(project.createdAt).toISOString().split('T')[0]
          }));
          setProposals(mappedProposals);
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Função auxiliar para mapear categorias do backend para o frontend
  const mapCategoryToFrontend = (category: string): CommunityProposal['category'] => {
    const categoryMap: Record<string, CommunityProposal['category']> = {
      'infrastructure': 'Infraestrutura',
      'environment': 'Meio Ambiente',
      'security': 'Segurança',
      'education': 'Educação',
      'health': 'Saúde',
      'culture': 'Cultura',
      'transportation': 'Transporte',
      'other': 'Outros'
    };
    return categoryMap[category] || 'Outros';
  };

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

  const handleAddProposal = async (newProposalData: Omit<CommunityProposal, 'id' | 'author' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Você precisa estar logado para criar uma proposta');
        return;
      }

      // Mapeia a categoria do frontend para o backend
      const categoryMap: Record<string, string> = {
        'Infraestrutura': 'infrastructure',
        'Meio Ambiente': 'environment',
        'Segurança': 'security',
        'Educação': 'education',
        'Saúde': 'health',
        'Cultura': 'culture',
        'Transporte': 'transportation',
        'Outros': 'other'
      };

      const response = await fetch(`${API_BASE_URL}/community-proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newProposalData.title,
          description: newProposalData.description,
          category: categoryMap[newProposalData.category],
          neighborhood: newProposalData.neighborhood,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newProposal: CommunityProposal = {
          id: data.id,
          title: data.title,
          description: data.description,
          category: newProposalData.category,
          neighborhood: data.neighborhood,
          author: data.author?.name || 'Usuário',
          createdAt: new Date(data.createdAt).toISOString().split('T')[0]
        };
        setProposals(prev => [newProposal, ...prev]);
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erro ao criar proposta');
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Erro ao conectar com o servidor');
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    // Filtros da sidebar (globais)
    const sidebarCategoryMatch = globalCategory === 'Todas as categorias' || proposal.category === globalCategory;
    const sidebarNeighborhoodMatch = globalNeighborhood === 'Todos os Bairros' || proposal.neighborhood === globalNeighborhood;
    
    // Filtros locais da página
    const categoryMatch = filterCategory === 'Todas' || proposal.category === filterCategory;
    const neighborhoodMatch = filterNeighborhood === 'Todos' || proposal.neighborhood === filterNeighborhood;
    
    // Debug (remover depois)
    if (globalCategory !== 'Todas as categorias' || globalNeighborhood !== 'Todos os Bairros') {
      console.log('Filtrando proposta:', proposal.title, {
        sidebarCategoryMatch,
        sidebarNeighborhoodMatch,
        categoryMatch,
        neighborhoodMatch,
        proposalCategory: proposal.category,
        globalCategory,
        proposalNeighborhood: proposal.neighborhood,
        globalNeighborhood
      });
    }
    
    return sidebarCategoryMatch && sidebarNeighborhoodMatch && categoryMatch && neighborhoodMatch;
  });

  const getStats = () => {
    const totalProposals = proposals.length;
    const categoriesCount = proposals.reduce((acc, proposal) => {
      acc[proposal.category] = (acc[proposal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoriesCount).length > 0
      ? Object.entries(categoriesCount).reduce((a, b) => 
          categoriesCount[a[0]] > categoriesCount[b[0]] ? a : b
        )[0]
      : 'Nenhuma';

    return { totalProposals, topCategory };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Breadcrumb/Navigation */}
      <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Início
        </Link>
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">Propostas da Comunidade</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Propostas da Comunidade</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Compartilhe suas ideias para melhorar o bairro
          </p>
        </div>
        {!showAddForm && (
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Proposta
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-blue-50 rounded-lg p-3 md:p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-blue-900">Total de Propostas</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.totalProposals}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 md:p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-green-900">Categoria Mais Popular</p>
              <p className="text-base md:text-lg font-bold text-green-600">{stats.topCategory}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 md:p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-purple-900">Bairros Ativos</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">
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

      {/* Filters
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
      </div> */}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProposals.map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 md:p-8 text-center">
          <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-sm md:text-base text-gray-600">
            Tente ajustar os filtros ou seja o primeiro a criar uma proposta!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityProposals;