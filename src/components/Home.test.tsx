import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';
import { projectsApi, votesApi } from '../utils/api';

// Mock components
jest.mock('./DashboardStats', () => () => <div data-testid="dashboard-stats">Stats</div>);
jest.mock('./ProjectCard', () => ({ project, onVote }: any) => (
  <div data-testid="project-card">
    {project.title}
    <button onClick={() => onVote(project.id, 'up')}>Vote Up</button>
  </div>
));
jest.mock('./CreateProjectModal', () => ({ isOpen, onClose, onSubmit }: any) => (
  isOpen ? (
    <div data-testid="create-project-modal">
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSubmit({ title: 'New Project' })}>Submit</button>
    </div>
  ) : null
));

// Mock API
jest.mock('../utils/api', () => ({
  projectsApi: {
    getAll: jest.fn(),
    create: jest.fn(),
  },
  votesApi: {
    getMyVotes: jest.fn(),
    vote: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should render loading state initially', async () => {
    (projectsApi.getAll as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<Home />);
    expect(screen.getByText('Carregando projetos...')).toBeInTheDocument();
  });

  it('should render projects after loading', async () => {
    const mockProjects = [
      { id: 1, title: 'Project 1', votesFor: 10, votesAgainst: 2 },
      { id: 2, title: 'Project 2', votesFor: 5, votesAgainst: 1 },
    ];
    (projectsApi.getAll as jest.Mock).mockResolvedValue(mockProjects);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });
  });

  it('should handle create project', async () => {
    (projectsApi.getAll as jest.Mock).mockResolvedValue([]);
    localStorageMock.setItem('access_token', 'token');

    render(<Home />);

    await waitFor(() => expect(screen.queryByText('Carregando projetos...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('Novo Projeto'));
    expect(screen.getByTestId('create-project-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(projectsApi.create).toHaveBeenCalledWith({ title: 'New Project' }, 'token');
      expect(projectsApi.getAll).toHaveBeenCalledTimes(2); // Initial + after create
    });
  });

  it('should handle voting', async () => {
    const mockProjects = [{ id: 1, title: 'Project 1', votesFor: 0, votesAgainst: 0 }];
    (projectsApi.getAll as jest.Mock).mockResolvedValue(mockProjects);
    localStorageMock.setItem('access_token', 'token');
    (votesApi.getMyVotes as jest.Mock).mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => expect(screen.getByText('Project 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Vote Up'));

    await waitFor(() => {
      expect(votesApi.vote).toHaveBeenCalledWith('1', { type: 'up' }, 'token');
      expect(projectsApi.getAll).toHaveBeenCalledTimes(2); // Initial + after vote
    });
  });

  it('should show error if voting without login', async () => {
    const mockProjects = [{ id: 1, title: 'Project 1', votesFor: 0, votesAgainst: 0 }];
    (projectsApi.getAll as jest.Mock).mockResolvedValue(mockProjects);
    // No token

    render(<Home />);

    await waitFor(() => expect(screen.getByText('Project 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Vote Up'));

    await waitFor(() => {
      expect(screen.getByText('Você precisa estar logado para votar')).toBeInTheDocument();
    });
  });
});
