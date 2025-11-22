import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterDebug from './FilterDebug';

// Mock FilterContext
const mockUseFilters = jest.fn();

jest.mock('@/contexts/FilterContext', () => ({
  useFilters: () => mockUseFilters(),
}));

describe('FilterDebug Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render default filters', () => {
    mockUseFilters.mockReturnValue({
      neighborhood: 'Todos os Bairros',
      category: 'Todas as categorias',
    });

    render(<FilterDebug />);
    
    expect(screen.getByText('Todos os Bairros')).toBeInTheDocument();
    expect(screen.getByText('Todas as categorias')).toBeInTheDocument();
  });

  it('should highlight active filters', () => {
    mockUseFilters.mockReturnValue({
      neighborhood: 'Centro',
      category: 'Saúde',
    });

    render(<FilterDebug />);
    
    const neighborhoodText = screen.getByText('Centro');
    expect(neighborhoodText).toHaveClass('text-yellow-400');
    
    const categoryText = screen.getByText('Saúde');
    expect(categoryText).toHaveClass('text-yellow-400');
  });
});
