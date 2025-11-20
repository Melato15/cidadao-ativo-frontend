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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
      {/* Header with Neighborhood */}
      <div className="flex items-center justify-end mb-3 md:mb-4">
        <span className="text-xs md:text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
          {project.neighborhood}
        </span>
      </div>

      {/* Project Title */}
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">{project.title}</h3>

      {/* Project Description */}
      <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-3">{project.description}</p>

      {/* Council Member */}
      <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
        <span className="font-medium">Vereador responsável:</span> {project.councilMember}
      </p>

      {/* Action Buttons and Counters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onVote && onVote(project.id, 'up')}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
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
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
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

        <div className="flex items-center justify-between">
          {/* Vote Counters */}
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <span>👍</span>
              <span className="font-medium">{project.votes}</span>
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <span>👎</span>
              <span className="font-medium">{project.rejections}</span>
            </span>
          </div>

          {/* Report Flag */}
          <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <span className="text-base md:text-lg">🚩</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;