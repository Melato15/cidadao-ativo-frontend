import CommunityProposals from '@/components/CommunityProposals';

export default function PropostasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityProposals />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Propostas da Comunidade - Cidadão Ativo',
  description: 'Compartilhe suas ideias para melhorar o bairro',
};
