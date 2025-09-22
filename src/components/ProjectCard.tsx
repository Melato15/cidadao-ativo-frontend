import React from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'Em Votação' | 'Em Análise' | 'Aprovado' | 'Rejeitado' | 'Em Execução' | 'Concluído';
  neighborhood: string;
  councilMember: string;
  votes: number;
  rejections: number;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Em Votação':
        return 'bg-blue-100 text-blue-800';
      case 'Em Análise':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      case 'Em Execução':
        return 'bg-purple-100 text-purple-800';
      case 'Concluído':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with Status and Neighborhood */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
        <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
          {project.neighborhood}
        </span>
      </div>

      {/* Project Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>

      {/* Project Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

      {/* Council Member */}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Vereador responsável:</span> {project.councilMember}
      </p>

      {/* Action Buttons and Counters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
            <span>👍</span>
            <span>Apoiar</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
            <span>👎</span>
            <span>Rejeitar</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Vote Counters */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="flex items-center space-x-1 text-green-600">
              <span>👍</span>
              <span className="font-medium">{project.votes}</span>
            </span>
            <span className="flex items-center space-x-1 text-red-600">
              <span>👎</span>
              <span className="font-medium">{project.rejections}</span>
            </span>
          </div>

          {/* Report Flag */}
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <span className="text-lg">🚩</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;