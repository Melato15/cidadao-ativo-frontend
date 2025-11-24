'use client';
import React, { useState } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { NEIGHBORHOODS } from '@/utils/neighborhoods';

// Tipos para denúncias
interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  status: 'Nova' | 'Em Análise' | 'Investigando' | 'Resolvida' | 'Arquivada';
  reporter: {
    name: string;
    phone?: string;
    email?: string;
    anonymous: boolean;
  };
  location: {
    neighborhood: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  dateReported: string;
  dateUpdated: string;
  assignedTo?: string;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    date: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    title: '',
    description: '',
    category: 'Infraestrutura',
    priority: 'Média',
    status: 'Nova',
    reporter: {
      name: '',
      anonymous: false
    },
    location: {
      neighborhood: '',
      address: ''
    },
    comments: []
  });

  const { neighborhood: globalNeighborhood } = useFilters();

  // Filtrar denúncias
  const filteredReports = reports.filter(report => {
    const neighborhoodMatch = globalNeighborhood === 'Todos os Bairros' || report.location.neighborhood === globalNeighborhood;
    return (
      neighborhoodMatch &&
      (filterStatus === '' || report.status === filterStatus) &&
      (filterCategory === '' || report.category === filterCategory) &&
      (filterPriority === '' || report.priority === filterPriority)
    );
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
      case 'Nova': return 'bg-blue-100 text-blue-800';
      case 'Em Análise': return 'bg-yellow-100 text-yellow-800';
      case 'Investigando': return 'bg-purple-100 text-purple-800';
      case 'Resolvida': return 'bg-green-100 text-green-800';
      case 'Arquivada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Atualizar status da denúncia
  const updateReportStatus = (reportId: string, newStatus: Report['status']) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: newStatus, dateUpdated: new Date().toISOString().split('T')[0] }
        : report
    ));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus, dateUpdated: new Date().toISOString().split('T')[0] });
    }
  };

  // Adicionar comentário
  const addComment = (reportId: string) => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      author: 'Administrador',
      content: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, comments: [...report.comments, comment], dateUpdated: new Date().toISOString().split('T')[0] }
        : report
    ));

    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ 
        ...selectedReport, 
        comments: [...selectedReport.comments, comment],
        dateUpdated: new Date().toISOString().split('T')[0]
      });
    }

    setNewComment('');
  };

  // Adicionar nova denúncia
  const handleAddReport = () => {
    if (!newReport.title || !newReport.description || !newReport.location?.neighborhood || !newReport.location?.address) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      title: newReport.title,
      description: newReport.description,
      category: newReport.category || 'Infraestrutura',
      priority: newReport.priority || 'Média',
      status: 'Nova',
      reporter: {
        name: newReport.reporter?.name || '',
        phone: newReport.reporter?.phone,
        email: newReport.reporter?.email,
        anonymous: newReport.reporter?.anonymous || false
      },
      location: {
        neighborhood: newReport.location?.neighborhood || '',
        address: newReport.location?.address || '',
        coordinates: newReport.location?.coordinates
      },
      dateReported: new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
      comments: []
    };

    setReports([...reports, report]);
    setShowAddModal(false);
    setNewReport({
      title: '',
      description: '',
      category: 'Infraestrutura',
      priority: 'Média',
      status: 'Nova',
      reporter: {
        name: '',
        anonymous: false
      },
      location: {
        neighborhood: '',
        address: ''
      },
      comments: []
    });
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
              <p className="text-sm font-medium text-gray-500">Novas</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'Nova').length}
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
              <p className="text-sm font-medium text-gray-500">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => ['Em Análise', 'Investigando'].includes(r.status)).length}
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
              <p className="text-sm font-medium text-gray-500">Resolvidas</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'Resolvida').length}
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
                {reports.filter(r => ['Alta', 'Urgente'].includes(r.priority)).length}
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
              <option value="Nova">Nova</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Investigando">Investigando</option>
              <option value="Resolvida">Resolvida</option>
              <option value="Arquivada">Arquivada</option>
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
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Segurança">Segurança</option>
              <option value="Meio Ambiente">Meio Ambiente</option>
              <option value="Perturbação do Sossego">Perturbação do Sossego</option>
              <option value="Saúde">Saúde</option>
              <option value="Transporte">Transporte</option>
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
              {filteredReports.map((report) => (
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
                      <p className="text-sm text-gray-500 mt-1">{report.location.neighborhood} - {report.location.address}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Reportado em {new Date(report.dateReported).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{report.description}</p>
                </div>
              ))}
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
                    <p className="text-sm text-gray-900">{selectedReport.category}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Prioridade</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedReport.priority)}`}>
                      {selectedReport.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Status Atual</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Atualizar Status</p>
                  <select 
                    value={selectedReport.status}
                    onChange={(e) => updateReportStatus(selectedReport.id, e.target.value as Report['status'])}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nova">Nova</option>
                    <option value="Em Análise">Em Análise</option>
                    <option value="Investigando">Investigando</option>
                    <option value="Resolvida">Resolvida</option>
                    <option value="Arquivada">Arquivada</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Localização</p>
                  <p className="text-sm text-gray-900">{selectedReport.location.neighborhood}</p>
                  <p className="text-sm text-gray-600">{selectedReport.location.address}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Denunciante</p>
                  <p className="text-sm text-gray-900">
                    {selectedReport.reporter.anonymous ? 'Anônimo' : selectedReport.reporter.name}
                  </p>
                  {!selectedReport.reporter.anonymous && selectedReport.reporter.phone && (
                    <p className="text-sm text-gray-600">{selectedReport.reporter.phone}</p>
                  )}
                </div>

                {selectedReport.assignedTo && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Responsável</p>
                    <p className="text-sm text-gray-900">{selectedReport.assignedTo}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-gray-500">Histórico</p>
                  <div className="space-y-2 mt-2">
                    {selectedReport.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-medium text-gray-700">{comment.author}</p>
                          <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Adicionar Comentário</p>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Digite seu comentário..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <button
                    onClick={() => addComment(selectedReport.id)}
                    disabled={!newComment.trim()}
                    className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Adicionar Comentário
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
                  value={newReport.title || ''}
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
                  value={newReport.description || ''}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Descreva o problema em detalhes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={newReport.category || 'Infraestrutura'}
                    onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Meio Ambiente">Meio Ambiente</option>
                    <option value="Perturbação do Sossego">Perturbação do Sossego</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Transporte">Transporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={newReport.priority || 'Média'}
                    onChange={(e) => setNewReport({ ...newReport, priority: e.target.value as Report['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newReport.location?.neighborhood || ''}
                    onChange={(e) => setNewReport({ 
                      ...newReport, 
                      location: { ...newReport.location!, neighborhood: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um bairro</option>
                    {NEIGHBORHOODS.map(bairro => (
                        <option key={bairro} value={bairro}>{bairro}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newReport.location?.address || ''}
                    onChange={(e) => setNewReport({ 
                      ...newReport, 
                      location: { ...newReport.location!, address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Rua das Flores, 123"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newReport.reporter?.anonymous || false}
                    onChange={(e) => setNewReport({
                      ...newReport,
                      reporter: { ...newReport.reporter!, anonymous: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Denúncia anônima</span>
                </label>
              </div>

              {!newReport.reporter?.anonymous && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Denunciante</label>
                    <input
                      type="text"
                      value={newReport.reporter?.name || ''}
                      onChange={(e) => setNewReport({
                        ...newReport,
                        reporter: { ...newReport.reporter!, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <input
                        type="tel"
                        value={newReport.reporter?.phone || ''}
                        onChange={(e) => setNewReport({
                          ...newReport,
                          reporter: { ...newReport.reporter!, phone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                      <input
                        type="email"
                        value={newReport.reporter?.email || ''}
                        onChange={(e) => setNewReport({
                          ...newReport,
                          reporter: { ...newReport.reporter!, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddReport}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Cadastrar Denúncia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;