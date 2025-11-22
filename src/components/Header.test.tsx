import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from './Header';

// Mock window.location
const mockLocation = {
  href: '',
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
};
delete (window as any).location;
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
  configurable: true,
});

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockLocation.href = '';
  });

  it('should render logo and title', () => {
    render(<Header />);
    expect(screen.getByText('Cidadão Ativo')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  it('should render login and register buttons when not logged in', () => {
    render(<Header />);
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
    expect(screen.queryByText('Sair')).not.toBeInTheDocument();
  });

  it('should render logout button when logged in', () => {
    localStorage.setItem('access_token', 'fake-token');
    render(<Header />);
    expect(screen.getByText('Sair')).toBeInTheDocument();
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument();
    expect(screen.queryByText('Cadastrar')).not.toBeInTheDocument();
  });

  it('should handle logout', () => {
    localStorage.setItem('access_token', 'fake-token');
    render(<Header />);
    
    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(mockLocation.href).toBe('/login');
  });

  it('should call onMenuClick when menu button is clicked', () => {
    const onMenuClick = jest.fn();
    render(<Header onMenuClick={onMenuClick} />);
    
    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});
