import React from 'react';

interface CommunityProposal {
  id: number;
  title: string;
  description: string;
  author: string;
  neighborhood: string;
  createdAt: string;
  category: 'Infraestrutura' | 'Meio Ambiente' | 'Segurança' | 'Educação' | 'Saúde' | 'Cultura' | 'Transporte' | 'Outros';
}

interface ProposalCardProps {
  proposal: CommunityProposal;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Infraestrutura':
        return 'bg-orange-100 text-orange-800';
      case 'Meio Ambiente':
        return 'bg-green-100 text-green-800';
      case 'Segurança':
        return 'bg-red-100 text-red-800';
      case 'Educação':
        return 'bg-blue-100 text-blue-800';
      case 'Saúde':
        return 'bg-pink-100 text-pink-800';
      case 'Cultura':
        return 'bg-purple-100 text-purple-800';
      case 'Transporte':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
      {/* Header with Category and Neighborhood */}
      <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 md:px-2.5 rounded-full text-xs font-medium ${getCategoryColor(
            proposal.category
          )}`}
        >
          {proposal.category}
        </span>
        <span className="text-xs md:text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded truncate">
          {proposal.neighborhood}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
        {proposal.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-3">
        {proposal.description}
      </p>

      {/* Footer with Author and Date */}
      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100 gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs md:text-sm font-medium">
              {proposal.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{proposal.author}</p>
            <p className="text-xs text-gray-500">Proposta criada</p>
          </div>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formatDate(proposal.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ProposalCard;