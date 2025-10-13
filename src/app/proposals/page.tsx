import CommunityProposals from '@/components/CommunityProposals';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function PropostasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16">
        <div className="p-6">
          <CommunityProposals />
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: 'Propostas da Comunidade - Cidadão Ativo',
  description: 'Compartilhe suas ideias para melhorar o bairro',
};
