'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

// Dados mock para demonstração
const monthlyProposalsData = [
  { month: 'Jan', propostas: 12, aprovadas: 8 },
  { month: 'Fev', propostas: 19, aprovadas: 14 },
  { month: 'Mar', propostas: 15, aprovadas: 11 },
  { month: 'Abr', propostas: 22, aprovadas: 16 },
  { month: 'Mai', propostas: 18, aprovadas: 13 },
  { month: 'Jun', propostas: 25, aprovadas: 20 }
];

const categoryData = [
  { category: 'Infraestrutura', count: 35 },
  { category: 'Segurança', count: 28 },
  { category: 'Saúde', count: 22 },
  { category: 'Educação', count: 18 },
  { category: 'Meio Ambiente', count: 15 },
  { category: 'Transporte', count: 12 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Dashboard: React.FC = () => {
  const totalProposals = categoryData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-sm md:text-base text-gray-600">Visão geral das propostas da comunidade</p>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Gráfico de Barras - Propostas por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:col-span-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Propostas por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Linha - Tendência Mensal */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Tendência Mensal de Propostas
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyProposalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="propostas" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Total de Propostas"
            />
            <Line 
              type="monotone" 
              dataKey="aprovadas" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Propostas Aprovadas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela de Propostas Pendentes */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Propostas Pendentes de Análise
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bairro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Votos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Reforma da Praça Central
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Infraestrutura
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Centro
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15/09/2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  127 votos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-4">Aprovar</button>
                  <button className="text-red-600 hover:text-red-900">Rejeitar</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Ampliação do Posto de Saúde
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Saúde
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Boa Vista
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  12/09/2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  89 votos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Analisar</button>
                  <button className="text-green-600 hover:text-green-900 mr-4">Aprovar</button>
                  <button className="text-red-600 hover:text-red-900">Rejeitar</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Instalação de Câmeras de Segurança
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Segurança
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Floresta
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10/09/2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  156 votos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Analisar</button>
                  <button className="text-green-600 hover:text-green-900 mr-4">Aprovar</button>
                  <button className="text-red-600 hover:text-red-900">Rejeitar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-2">Total de Propostas</h4>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{totalProposals}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Todas as propostas submetidas</p>
        </div>
        
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Tempo Médio de Análise</h4>
          <p className="text-3xl font-bold text-orange-600">7 dias</p>
          <p className="text-sm text-gray-500 mt-1">Média de aprovação</p>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;