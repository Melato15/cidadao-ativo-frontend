'use client';

import React, { useState, useEffect } from 'react';
import DashboardStats from '@/components/DashboardStats';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import { projectsApi, Project, CreateProjectDto, votesApi, Vote } from '@/utils/api';
import { useFilters } from '@/contexts/FilterContext';

export default function Home() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  const { neighborhood: globalNeighborhood } = useFilters();

	const loadProjects = async () => {
		try {
			setIsLoading(true);
			setError('');
			const data = await projectsApi.getAll();
			setProjects(data);
			
			// Carregar votos do usuário se estiver logado
			const token = localStorage.getItem('access_token');
			if (token) {
				await loadUserVotes(token);
			}
		} catch (err: any) {
			setError(err.message || 'Erro ao carregar projetos');
		} finally {
			setIsLoading(false);
		}
	};

	const loadUserVotes = async (token: string) => {
		try {
			const votes = await votesApi.getMyVotes(token);
			const votesMap: Record<string, 'up' | 'down'> = {};
			votes.forEach((vote: Vote) => {
				votesMap[vote.projectId] = vote.type;
			});
			setUserVotes(votesMap);
		} catch (err) {
			// Ignorar erros ao carregar votos (usuário pode não ter votado ainda)
			console.error('Erro ao carregar votos:', err);
		}
	};

	useEffect(() => {
		loadProjects();
	}, []);

	const handleCreateProject = async (data: CreateProjectDto) => {
		const token = localStorage.getItem('access_token');
		if (!token) {
			throw new Error('Você precisa estar logado para criar um projeto');
		}

		await projectsApi.create(data, token);
		await loadProjects(); // Recarrega a lista de projetos
	};

	const handleVote = async (projectId: string | number, type: 'up' | 'down') => {
		const token = localStorage.getItem('access_token');
		if (!token) {
			setError('Você precisa estar logado para votar');
			return;
		}

		try {
			setError('');
			await votesApi.vote(String(projectId), { type }, token);
			
			// Atualizar o voto local
			setUserVotes(prev => ({ ...prev, [projectId]: type }));
			
			// Recarregar projetos para atualizar contadores
			await loadProjects();
		} catch (err: any) {
			setError(err.message || 'Erro ao votar');
		}
	};

	// Mapeia os projetos para o formato esperado pelo ProjectCard
	const mappedProjects = projects
    .filter(project => globalNeighborhood === 'Todos os Bairros' || project.neighborhood === globalNeighborhood)
    .map((project) => ({
		id: project.id,
		title: project.title,
		description: project.description,
		neighborhood: project.neighborhood,
		councilMember: project.author?.name || 'Autor desconhecido',
		votes: project.votesFor,
		rejections: project.votesAgainst,
	}));

	// Calcula estatísticas
	const stats = {
		totalVotes: projects.reduce((acc, p) => acc + p.votesFor + p.votesAgainst, 0),
		participationRate: projects.length > 0 ? Math.round((projects.filter((p) => p.votesFor > 0 || p.votesAgainst > 0).length / projects.length) * 100) : 0,
	};

	return (
		<div className="max-w-7xl mx-auto">
			{/* Page Title */}
			<div className="mb-6 md:mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
							Projetos em Destaque
						</h1>
						<p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
							Acompanhe e participe dos projetos em desenvolvimento na sua
							cidade
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="w-full sm:w-auto px-4 py-2.5 md:px-6 md:py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 md:h-5 md:w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
						Novo Projeto
					</button>
				</div>
			</div>

			{/* Dashboard Stats */}
			<DashboardStats stats={stats} />

			{/* Error Message */}
			{error && (
				<div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
					{error}
				</div>
			)}

			{/* Projects Grid */}
			<div className="space-y-4 md:space-y-6">
				<h2 className="text-lg md:text-xl font-semibold text-gray-900">
					Projetos Recentes
				</h2>

				{isLoading ? (
					<div className="text-center py-12">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
						<p className="mt-4 text-sm md:text-base text-gray-600">Carregando projetos...</p>
					</div>
				) : mappedProjects.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 rounded-lg">
						<p className="text-base md:text-lg text-gray-600">
							Nenhum projeto encontrado.
						</p>
						<p className="text-sm md:text-base text-gray-500 mt-2">
							Seja o primeiro a criar um projeto!
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
						{mappedProjects.map((project) => (
							<ProjectCard 
								key={project.id} 
								project={project}
								onVote={handleVote}
								userVote={userVotes[project.id] || null}
							/>
						))}
					</div>
				)}
			</div>

			{/* Create Project Modal */}
			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreateProject}
			/>
		</div>
	);
}