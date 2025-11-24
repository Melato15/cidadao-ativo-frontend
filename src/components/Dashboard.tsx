'use client';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { communityProposalsApi, ProposalStatsCategory, ProposalStatsMonthly } from '../utils/api';

const Dashboard: React.FC = () => {
  const [categoryData, setCategoryData] = useState<ProposalStatsCategory[]>([]);
  const [monthlyProposalsData, setMonthlyProposalsData] = useState<ProposalStatsMonthly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, monthly] = await Promise.all([
          communityProposalsApi.getStatsByCategory(),
          communityProposalsApi.getStatsMonthly()
        ]);
        setCategoryData(categories);
        setMonthlyProposalsData(monthly);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProposals = categoryData.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return <div className="p-6 text-center">Carregando dados do dashboard...</div>;
  }

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

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-2">Total de Propostas</h4>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{totalProposals}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Todas as propostas submetidas</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;