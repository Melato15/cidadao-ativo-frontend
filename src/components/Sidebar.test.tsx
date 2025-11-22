import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock FilterContext
const mockSetNeighborhood = jest.fn();
const mockSetCategory = jest.fn();
const mockResetFilters = jest.fn();

jest.mock('@/contexts/FilterContext', () => ({
  useFilters: () => ({
    neighborhood: 'Todos os Bairros',
    category: 'Todas as categorias',
    setNeighborhood: mockSetNeighborhood,
    setCategory: mockSetCategory,
    resetFilters: mockResetFilters,
  }),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('next/navigation').usePathname.mockReturnValue('/home');
  });

  it('should render menu items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Propostas da Comunidade')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Denúncias')).toBeInTheDocument();
  });

  it('should highlight active menu item', () => {
    require('next/navigation').usePathname.mockReturnValue('/home');
    render(<Sidebar />);
    
    const homeLink = screen.getByText('Início').closest('a');
    expect(homeLink).toHaveClass('bg-blue-50');
    expect(homeLink).toHaveClass('text-blue-700');
    
    const proposalsLink = screen.getByText('Propostas da Comunidade').closest('a');
    expect(proposalsLink).not.toHaveClass('bg-blue-50');
  });

  it('should render filters', () => {
    render(<Sidebar />);
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Bairro')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
  });

  it('should call setNeighborhood when neighborhood filter changes', () => {
    render(<Sidebar />);
    
    const neighborhoodSelect = screen.getByLabelText('Bairro');
    fireEvent.change(neighborhoodSelect, { target: { value: 'Centro' } });
    
    expect(mockSetNeighborhood).toHaveBeenCalledWith('Centro');
  });

  it('should call setCategory when category filter changes', () => {
    render(<Sidebar />);
    
    const categorySelect = screen.getByLabelText('Categoria');
    fireEvent.change(categorySelect, { target: { value: 'Saúde' } });
    
    expect(mockSetCategory).toHaveBeenCalledWith('Saúde');
  });

  it('should show clear filters button when filters are active', () => {
    // Override mock for this test
    jest.spyOn(require('@/contexts/FilterContext'), 'useFilters').mockReturnValue({
      neighborhood: 'Centro',
      category: 'Todas as categorias',
      setNeighborhood: mockSetNeighborhood,
      setCategory: mockSetCategory,
      resetFilters: mockResetFilters,
    });

    render(<Sidebar />);
    expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
  });

  it('should call resetFilters when clear button is clicked', () => {
    // Override mock for this test
    jest.spyOn(require('@/contexts/FilterContext'), 'useFilters').mockReturnValue({
      neighborhood: 'Centro',
      category: 'Todas as categorias',
      setNeighborhood: mockSetNeighborhood,
      setCategory: mockSetCategory,
      resetFilters: mockResetFilters,
    });

    render(<Sidebar />);
    
    const clearButton = screen.getByText('Limpar Filtros');
    fireEvent.click(clearButton);
    
    expect(mockResetFilters).toHaveBeenCalled();
  });

  it('should call onClose when close button is clicked (mobile)', () => {
    const onClose = jest.fn();
    render(<Sidebar isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Fechar menu');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });
});
