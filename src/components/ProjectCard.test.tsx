import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from './ProjectCard';

describe('ProjectCard Component', () => {
  const mockProject = {
    id: 1,
    title: 'Test Project',
    description: 'Test Description',
    neighborhood: 'Centro',
    councilMember: 'Vereador Teste',
    votes: 10,
    rejections: 2,
  };

  it('should render project details', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Centro')).toBeInTheDocument();
    expect(screen.getByText('Vereador Teste')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call onVote when support button is clicked', () => {
    const onVote = jest.fn();
    render(<ProjectCard project={mockProject} onVote={onVote} />);
    
    const supportButton = screen.getByText('Apoiar');
    fireEvent.click(supportButton);
    
    expect(onVote).toHaveBeenCalledWith(1, 'up');
  });

  it('should call onVote when reject button is clicked', () => {
    const onVote = jest.fn();
    render(<ProjectCard project={mockProject} onVote={onVote} />);
    
    const rejectButton = screen.getByText('Rejeitar');
    fireEvent.click(rejectButton);
    
    expect(onVote).toHaveBeenCalledWith(1, 'down');
  });

  it('should highlight user vote', () => {
    render(<ProjectCard project={mockProject} userVote="up" onVote={jest.fn()} />);
    
    const supportButton = screen.getByText('Apoiar').closest('button');
    expect(supportButton).toHaveClass('bg-green-700');
    
    const rejectButton = screen.getByText('Rejeitar').closest('button');
    expect(rejectButton).toHaveClass('bg-red-600');
  });
});
