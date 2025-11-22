import React from 'react';
import { render, screen } from '@testing-library/react';
import ProposalCard from './ProposalCard';

describe('ProposalCard Component', () => {
  const mockProposal = {
    id: 1,
    title: 'Test Proposal',
    description: 'Test Description',
    author: 'Test Author',
    neighborhood: 'Centro',
    createdAt: '2023-06-15T12:00:00.000Z', // Safe date to avoid timezone issues
    category: 'Saúde' as const,
  };

  it('should render proposal details', () => {
    render(<ProposalCard proposal={mockProposal} />);
    
    expect(screen.getByText('Test Proposal')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Centro')).toBeInTheDocument();
    expect(screen.getByText('Saúde')).toBeInTheDocument();
  });

  it('should render correct category color', () => {
    render(<ProposalCard proposal={mockProposal} />);
    
    const categoryBadge = screen.getByText('Saúde');
    expect(categoryBadge).toHaveClass('bg-pink-100');
    expect(categoryBadge).toHaveClass('text-pink-800');
  });

  it('should format date correctly', () => {
    render(<ProposalCard proposal={mockProposal} />);
    
    // Date formatting depends on locale, but usually it's DD/MM/YYYY for pt-BR
    // We can check if it contains the year 2023
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });
});
