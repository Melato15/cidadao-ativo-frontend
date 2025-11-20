import React from 'react';

interface Project {
  id: number | string;
  title: string;
  description: string;
  neighborhood: string;
  councilMember: string;
  votes: number;
  rejections: number;
}

interface ProjectCardProps {
  project: Project;
  onVote?: (projectId: string | number, type: 'up' | 'down') => void;
  userVote?: 'up' | 'down' | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onVote, userVote }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with Neighborhood */}
      <div className="flex items-center justify-end mb-4">
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
          <button 
            onClick={() => onVote && onVote(project.id, 'up')}
            className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              userVote === 'up' 
                ? 'bg-green-700 text-white' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            disabled={!onVote}
          >
            <span>👍</span>
            <span>Apoiar</span>
          </button>
          <button 
            onClick={() => onVote && onVote(project.id, 'down')}
            className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              userVote === 'down' 
                ? 'bg-red-700 text-white' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            disabled={!onVote}
          >
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