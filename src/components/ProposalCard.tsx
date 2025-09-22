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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with Category and Neighborhood */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
            proposal.category
          )}`}
        >
          {proposal.category}
        </span>
        <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
          {proposal.neighborhood}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {proposal.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {proposal.description}
      </p>

      {/* Footer with Author and Date */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {proposal.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{proposal.author}</p>
            <p className="text-xs text-gray-500">Proposta criada</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(proposal.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ProposalCard;