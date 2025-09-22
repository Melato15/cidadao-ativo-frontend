'use client';

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import ProjectCard from '@/components/ProjectCard';
import CommunityProposals from '@/components/CommunityProposals';

// Mock data for projects
const mockProjects = [
	{
		id: 1,
		title: 'Revitalização da Praça Central',
		description:
			'Projeto para revitalização completa da Praça Central com nova iluminação, paisagismo e equipamentos de lazer para todas as idades.',
		status: 'Em Votação' as const,
		neighborhood: 'Centro',
		councilMember: 'Maria Silva',
		votes: 245,
		rejections: 32,
	},
	{
		id: 2,
		title: 'Ciclovia da Avenida Principal',
		description:
			'Construção de ciclovia segura ao longo da Avenida Principal para promover o transporte sustentável e a mobilidade urbana.',
		status: 'Em Análise' as const,
		neighborhood: 'Zona Norte',
		councilMember: 'João Santos',
		votes: 189,
		rejections: 45,
	},
	{
		id: 3,
		title: 'Centro Comunitário do Bairro',
		description:
			'Criação de um centro comunitário com biblioteca, sala de informática e espaços para atividades culturais e educacionais.',
		status: 'Aprovado' as const,
		neighborhood: 'Zona Sul',
		councilMember: 'Ana Costa',
		votes: 312,
		rejections: 18,
	},
];

// Mock stats data
const mockStats = {
	totalVotes: 1247,
	activeProjects: 15,
	participationRate: 68,
};

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<Sidebar />

			{/* Main Content */}
			<main className="ml-64 pt-16 p-6">
				<div className="max-w-7xl mx-auto">
					{/* Page Title */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900" style={{ marginTop: '2.5rem' }}>
							Projetos em Destaque
						</h1>
						<p className="text-gray-600 mt-2">
							Acompanhe e participe dos projetos em desenvolvimento na sua
							cidade
						</p>
					</div>

					{/* Dashboard Stats */}
					<DashboardStats stats={mockStats} />

					{/* Projects Grid */}
					<div className="space-y-6">
						<h2 className="text-xl font-semibold text-gray-900">
							Projetos Recentes
						</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{mockProjects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					</div>

					{/* Load More Button */}
					<div className="mt-8 text-center">
						<button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
							Carregar Mais Projetos
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}