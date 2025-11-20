import CommunityProposals from '@/components/CommunityProposals';
import MainLayout from '@/components/MainLayout';

export default function PropostasPage() {
  return (
    <MainLayout>
      <CommunityProposals />
    </MainLayout>
  );
}

export const metadata = {
  title: 'Propostas da Comunidade - Cidadão Ativo',
  description: 'Compartilhe suas ideias para melhorar o bairro',
};
