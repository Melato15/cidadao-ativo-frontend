import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import * as validation from '../utils/validation';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock validation utils
jest.mock('../utils/validation', () => ({
  formatCPF: jest.fn((val) => val),
  isValidCPF: jest.fn(() => true),
  isEmpty: jest.fn((val) => !val),
  passwordsMatch: jest.fn((p1, p2) => p1 === p2),
  isValidPassword: jest.fn(() => true),
  isValidBirthDate: jest.fn(() => true),
  isValidFullName: jest.fn(() => true),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock window.alert
window.alert = jest.fn();

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
    (validation.formatCPF as jest.Mock).mockImplementation((val) => val);
    (validation.isValidCPF as jest.Mock).mockReturnValue(true);
    (validation.isEmpty as jest.Mock).mockImplementation((val) => !val);
    (validation.passwordsMatch as jest.Mock).mockImplementation((p1, p2) => p1 === p2);
    (validation.isValidPassword as jest.Mock).mockReturnValue(true);
    (validation.isValidBirthDate as jest.Mock).mockReturnValue(true);
    (validation.isValidFullName as jest.Mock).mockReturnValue(true);
  });

  it('should render registration form', () => {
    render(<Register />);
    
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('should validate empty fields', async () => {
    // Mock isEmpty to return true for empty strings
    (validation.isEmpty as jest.Mock).mockReturnValue(true);

    render(<Register />);
    
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    
    expect(await screen.findByText('Nome completo é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('CPF é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Data de nascimento é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Confirmação de senha é obrigatória')).toBeInTheDocument();
  });

  it('should validate password mismatch', async () => {
    (validation.isEmpty as jest.Mock).mockReturnValue(false);
    (validation.passwordsMatch as jest.Mock).mockReturnValue(false);

    render(<Register />);
    
    fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar senha/i), { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    
    expect(await screen.findByText('As senhas não coincidem')).toBeInTheDocument();
  });

  it('should submit form successfully', async () => {
    (validation.isEmpty as jest.Mock).mockReturnValue(false);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Test User' }),
    });

    render(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123.456.789-00' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar senha/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"name":"Test User"'),
        })
      );
    });
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Cadastro realizado com sucesso'));
      expect(window.location.href).toBe('/login');
    });
  });

  it('should handle registration error', async () => {
    (validation.isEmpty as jest.Mock).mockReturnValue(false);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'CPF já cadastrado' }),
    });

    render(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123.456.789-00' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar senha/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('CPF já cadastrado');
    });
  });
});
