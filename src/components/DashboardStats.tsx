import React from 'react';

interface StatsData {
  totalVotes: number;
  activeProjects: number;
  participationRate: number;
}

interface DashboardStatsProps {
  stats: StatsData;
}

interface StatCard {
  id: string;
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  bgColor: string;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards: StatCard[] = [
    {
      id: 'total-votes',
      title: 'Total de Votos',
      value: stats.totalVotes.toLocaleString(),
      icon: '✓',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'active-projects',
      title: 'Projetos Ativos',
      value: stats.activeProjects.toString(),
      icon: '📋',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'participation-rate',
      title: 'Participação',
      value: `${stats.participationRate}%`,
      icon: '👥',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" role="region" aria-label="Estatísticas do dashboard">
      {statCards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          role="article"
          aria-labelledby={`${card.id}-title`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${card.bgColor} rounded-lg p-3`} aria-hidden="true">
              <span className={`text-2xl ${card.iconColor}`}>{card.icon}</span>
            </div>
            <div className="ml-4 flex-1">
              <p 
                id={`${card.id}-title`}
                className="text-sm font-medium text-gray-500 uppercase tracking-wide"
              >
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900" aria-label={`${card.title}: ${card.value}`}>
                {card.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;