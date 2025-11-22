import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardStats from './DashboardStats';

describe('DashboardStats Component', () => {
  const mockStats = {
    totalVotes: 1234,
    participationRate: 75,
  };

  it('should render stats correctly', () => {
    render(<DashboardStats stats={mockStats} />);
    
    expect(screen.getByText('Total de Votos')).toBeInTheDocument();
    // Use regex to match 1,234 or 1.234 depending on locale
    expect(screen.getByText(/1[.,]234/)).toBeInTheDocument();
    
    expect(screen.getByText('Participação')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<DashboardStats stats={mockStats} />);
    
    expect(screen.getByRole('region', { name: 'Estatísticas do dashboard' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
