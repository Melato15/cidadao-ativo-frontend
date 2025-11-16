'use client';
import React, { useState, useEffect } from 'react';
import { reportsApi, Report as ApiReport, CreateReportDto } from '../utils/api';
import { useFilters } from '@/contexts/FilterContext';

// Mapeamento de categorias
const categoryMap: { [key: string]: ApiReport['category'] } = {
  'Infraestrutura': 'infrastructure',
  'Educação': 'education',
  'Saúde': 'health',
  'Segurança': 'security',
  'Meio Ambiente': 'environment',
  'Cultura': 'culture',
  'Esportes': 'sports',
  'Transporte': 'transportation',
  'Outro': 'other'
};

const categoryMapReverse: { [key in ApiReport['category']]: string } = {
  'infrastructure': 'Infraestrutura',
  'education': 'Educação',
  'health': 'Saúde',
  'security': 'Segurança',
  'environment': 'Meio Ambiente',
  'culture': 'Cultura',
  'sports': 'Esportes',
  'transportation': 'Transporte',
  'other': 'Outro'
};

// Mapeamento de prioridades
const priorityMap: { [key: string]: ApiReport['priority'] } = {
  'Baixa': 'low',
  'Média': 'medium',
  'Alta': 'high',
  'Urgente': 'urgent'
};

const priorityMapReverse: { [key in ApiReport['priority']]: string } = {
  'low': 'Baixa',
  'medium': 'Média',
  'high': 'Alta',
  'urgent': 'Urgente'
};

// Mapeamento de status
const statusMap: { [key: string]: ApiReport['status'] } = {
  'Rascunho': 'draft',
  'Ativa': 'active',
  'Em Votação': 'voting',
  'Aprovada': 'approved',
  'Rejeitada': 'rejected',
  'Implementada': 'implemented'
};

const statusMapReverse: { [key in ApiReport['status']]: string } = {
  'draft': 'Rascunho',
  'active': 'Ativa',
  'voting': 'Em Votação',
  'approved': 'Aprovada',
  'rejected': 'Rejeitada',
  'implemented': 'Implementada'
};

const ReportsIntegrated: React.FC = () => {
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ApiReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Obter filtros do contexto da sidebar
  const { neighborhood: globalNeighborhood, category: globalCategory, status: globalStatus } = useFilters();

  // Debug: Log dos filtros quando mudarem
  useEffect(() => {
    console.log('Filtros da Sidebar (Reports):', {
      globalNeighborhood,
      globalCategory,
      globalStatus
    });
  }, [globalNeighborhood, globalCategory, globalStatus]);
  
  const [newReport, setNewReport] = useState<{
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    location: string;
  }>({
    title: '',
    description: '',
    category: 'Infraestrutura',
    priority: 'Média',
    status: 'Ativa',
    location: ''
  });

  // Carregar denúncias ao montar o componente
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reportsApi.getAll();
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar denúncias');
      console.error('Erro ao carregar denúncias:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar denúncias
  const filteredReports = reports.filter(report => {
    // Filtros locais da página
    const matchStatus = filterStatus === '' || statusMapReverse[report.status] === filterStatus;
    const matchCategory = filterCategory === '' || categoryMapReverse[report.category] === filterCategory;
    const matchPriority = filterPriority === '' || priorityMapReverse[report.priority] === filterPriority;
    
    // Filtros globais da sidebar
    const sidebarCategoryMatch = globalCategory === 'Todas as categorias' || categoryMapReverse[report.category] === globalCategory;
    const sidebarStatusMatch = globalStatus === 'Todos os status' || statusMapReverse[report.status] === globalStatus;
    const sidebarNeighborhoodMatch = globalNeighborhood === 'Todos os Bairros' || report.location === globalNeighborhood;
    
    // Debug (remover depois)
    if (globalCategory !== 'Todas as categorias' || globalStatus !== 'Todos os status' || globalNeighborhood !== 'Todos os Bairros') {
      console.log('Filtrando denúncia:', report.title, {
        matchStatus,
        matchCategory,
        matchPriority,
        sidebarCategoryMatch,
        sidebarStatusMatch,
        sidebarNeighborhoodMatch,
        reportCategory: categoryMapReverse[report.category],
        globalCategory,
        reportStatus: statusMapReverse[report.status],
        globalStatus,
        reportLocation: report.location,
        globalNeighborhood
      });
    }
    
    return matchStatus && matchCategory && matchPriority && sidebarCategoryMatch && sidebarStatusMatch && sidebarNeighborhoodMatch;
  });

  // Obter cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgente': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-orange-100 text-orange-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rascunho': return 'bg-gray-100 text-gray-800';
      case 'Ativa': return 'bg-blue-100 text-blue-800';
      case 'Em Votação': return 'bg-yellow-100 text-yellow-800';
      case 'Aprovada': return 'bg-green-100 text-green-800';
      case 'Rejeitada': return 'bg-red-100 text-red-800';
      case 'Implementada': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Atualizar status da denúncia
  const updateReportStatus = async (reportId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Você precisa estar logado para atualizar o status');
        return;
      }

      const statusKey = statusMap[newStatus];
      await reportsApi.update(reportId, { status: statusKey }, token);
      
      // Recarregar denúncias
      await loadReports();
      
      // Atualizar denúncia selecionada
      const updated = reports.find(r => r.id === reportId);
      if (updated) {
        setSelectedReport(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status');
    }
  };

  // Adicionar nova denúncia
  const handleAddReport = async () => {
    if (!newReport.title || !newReport.description || !newReport.location) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Você precisa estar logado para criar uma denúncia');
        return;
      }

      setLoading(true);
      
      const reportData: CreateReportDto = {
        title: newReport.title,
        description: newReport.description,
        category: categoryMap[newReport.category],
        status: statusMap[newReport.status],
        priority: priorityMap[newReport.priority],
        location: newReport.location
      };

      await reportsApi.create(reportData, token);
      
      // Recarregar lista
      await loadReports();
      
      // Resetar formulário e fechar modal
      setShowAddModal(false);
      setNewReport({
        title: '',
        description: '',
        category: 'Infraestrutura',
        priority: 'Média',
        status: 'Ativa',
        location: ''
      });
      
      alert('Denúncia criada com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao criar denúncia');
    } finally {
      setLoading(false);
    }
  };

  // Deletar denúncia
  const handleDeleteReport = async (reportId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta denúncia?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Você precisa estar logado para deletar uma denúncia');
        return;
      }

      await reportsApi.delete(reportId, token);
      await loadReports();
      setSelectedReport(null);
      alert('Denúncia excluída com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir denúncia');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Denúncias</h1>
            <p className="text-gray-600">Sistema de acompanhamento e resolução de denúncias da comunidade</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nova Denúncia</span>
          </button>
        </div>
      </div>

      {/* Mensagens de erro/loading */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={loadReports} className="ml-4 underline">Tentar novamente</button>
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-600">Carregando...</div>
      )}

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🆕</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Em Votação</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'voting').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aprovadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🚨</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alta Prioridade</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.priority === 'high' || r.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="Rascunho">Rascunho</option>
              <option value="Ativa">Ativa</option>
              <option value="Em Votação">Em Votação</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Rejeitada">Rejeitada</option>
              <option value="Implementada">Implementada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as categorias</option>
              {Object.keys(categoryMap).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as prioridades</option>
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Denúncias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Lista de Denúncias ({filteredReports.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredReports.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Nenhuma denúncia encontrada
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div 
                    key={report.id}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedReport?.id === report.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                        {report.location && (
                          <p className="text-sm text-gray-500 mt-1">{report.location}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Criado em {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                        {report.author && (
                          <p className="text-xs text-gray-400">
                            Por: {report.author.name}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(statusMapReverse[report.status])}`}>
                          {statusMapReverse[report.status]}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priorityMapReverse[report.priority])}`}>
                          {priorityMapReverse[report.priority]}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{report.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes da Denúncia</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{selectedReport.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Categoria</p>
                    <p className="text-sm text-gray-900">{categoryMapReverse[selectedReport.category]}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Prioridade</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priorityMapReverse[selectedReport.priority])}`}>
                      {priorityMapReverse[selectedReport.priority]}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Status Atual</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(statusMapReverse[selectedReport.status])}`}>
                      {statusMapReverse[selectedReport.status]}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Atualizar Status</p>
                  <select 
                    value={statusMapReverse[selectedReport.status]}
                    onChange={(e) => updateReportStatus(selectedReport.id, e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Em Votação">Em Votação</option>
                    <option value="Aprovada">Aprovada</option>
                    <option value="Rejeitada">Rejeitada</option>
                    <option value="Implementada">Implementada</option>
                  </select>
                </div>

                {selectedReport.location && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Localização</p>
                    <p className="text-sm text-gray-900">{selectedReport.location}</p>
                  </div>
                )}

                {selectedReport.author && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Autor</p>
                    <p className="text-sm text-gray-900">{selectedReport.author.name}</p>
                    <p className="text-sm text-gray-600">{selectedReport.author.email}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-gray-500">Criado em</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedReport.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Última atualização</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedReport.updatedAt).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleDeleteReport(selectedReport.id)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                  >
                    Excluir Denúncia
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center text-gray-500">
                <p>Selecione uma denúncia para ver os detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Adicionar Denúncia */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Nova Denúncia</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Buraco na pista"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Descreva o problema em detalhes..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={newReport.category}
                    onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(categoryMap).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={newReport.priority}
                    onChange={(e) => setNewReport({ ...newReport, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newReport.status}
                    onChange={(e) => setNewReport({ ...newReport, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Em Votação">Em Votação</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localização <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Rua das Flores, 123, Centro"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddReport}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Cadastrar Denúncia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsIntegrated;
