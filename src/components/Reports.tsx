'use client';
import React, { useState } from 'react';

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

// Dados mock para demonstração
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Buraco na pista prejudica trânsito',
    description: 'Há um buraco grande na Rua das Flores que está causando acidentes e danificando veículos.',
    category: 'Infraestrutura',
    priority: 'Alta',
    status: 'Em Análise',
    reporter: {
      name: 'João Silva',
      phone: '(47) 99999-1234',
      email: 'joao@email.com',
      anonymous: false
    },
    location: {
      neighborhood: 'Centro',
      address: 'Rua das Flores, 123'
    },
    dateReported: '2024-09-20',
    dateUpdated: '2024-09-22',
    assignedTo: 'Maria Santos - Secretaria de Obras',
    comments: [
      {
        id: '1',
        author: 'Maria Santos',
        content: 'Denúncia recebida. Enviando equipe para avaliação.',
        date: '2024-09-21'
      }
    ]
  },
  {
    id: '2',
    title: 'Lixo acumulado em terreno baldio',
    description: 'Terreno abandonado acumulando lixo e atraindo pragas urbanas.',
    category: 'Meio Ambiente',
    priority: 'Média',
    status: 'Nova',
    reporter: {
      name: 'Anônimo',
      anonymous: true
    },
    location: {
      neighborhood: 'Boa Vista',
      address: 'Rua dos Pássaros, próximo ao número 456'
    },
    dateReported: '2024-09-25',
    dateUpdated: '2024-09-25',
    comments: []
  },
  {
    id: '3',
    title: 'Problemas na iluminação pública',
    description: 'Várias lâmpadas queimadas na praça, deixando o local perigoso à noite.',
    category: 'Segurança',
    priority: 'Alta',
    status: 'Resolvida',
    reporter: {
      name: 'Ana Costa',
      phone: '(47) 98888-5678',
      anonymous: false
    },
    location: {
      neighborhood: 'Floresta',
      address: 'Praça da Liberdade'
    },
    dateReported: '2024-09-15',
    dateUpdated: '2024-09-20',
    assignedTo: 'Carlos Lima - Secretaria de Serviços Urbanos',
    comments: [
      {
        id: '1',
        author: 'Carlos Lima',
        content: 'Problema identificado. Solicitando troca das lâmpadas.',
        date: '2024-09-16'
      },
      {
        id: '2',
        author: 'Carlos Lima',
        content: 'Serviço concluído. Todas as lâmpadas foram substituídas.',
        date: '2024-09-20'
      }
    ]
  },
  {
    id: '4',
    title: 'Ruído excessivo de construção',
    description: 'Obra funcionando fora do horário permitido, causando perturbação.',
    category: 'Perturbação do Sossego',
    priority: 'Baixa',
    status: 'Investigando',
    reporter: {
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      anonymous: false
    },
    location: {
      neighborhood: 'América',
      address: 'Rua das Pedras, 789'
    },
    dateReported: '2024-09-23',
    dateUpdated: '2024-09-24',
    assignedTo: 'Lucas Pereira - Fiscalização',
    comments: [
      {
        id: '1',
        author: 'Lucas Pereira',
        content: 'Investigando os horários de funcionamento da obra.',
        date: '2024-09-24'
      }
    ]
  }
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');

  // Filtrar denúncias
  const filteredReports = reports.filter(report => {
    return (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Denúncias</h1>
        <p className="text-gray-600">Sistema de acompanhamento e resolução de denúncias da comunidade</p>
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
    </div>
  );
};

export default Reports;