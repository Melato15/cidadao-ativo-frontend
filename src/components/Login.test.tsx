import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

// Mock fetch
global.fetch = jest.fn();

// Mock window.location with setter
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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock alert
global.alert = jest.fn();

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    localStorageMock.setItem.mockClear();
    (global.alert as jest.Mock).mockClear();
    mockLocation.href = '';
  });

  describe('Rendering', () => {
    it('should render login form', () => {
      render(<Login />);
      
      expect(screen.getByText('Cidadão Ativo')).toBeInTheDocument();
      expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    });

    it('should render CPF input', () => {
      render(<Login />);
      
      expect(screen.getByLabelText('CPF')).toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<Login />);
      
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<Login />);
      
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('should render registration link', () => {
      render(<Login />);
      
      expect(screen.getByText('Não tem conta?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cadastre-se/i })).toBeInTheDocument();
    });

    it('should render with proper placeholders', () => {
      render(<Login />);
      
      expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when CPF is empty on submit', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('CPF é obrigatório')).toBeInTheDocument();
      });
    });

    it('should show error when password is empty on submit', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
      });
    });

    it('should show error for invalid CPF', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      await user.type(cpfInput, '12345678900');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('CPF inválido')).toBeInTheDocument();
      });
    });

    it('should clear CPF error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      // Submit to show error
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('CPF é obrigatório')).toBeInTheDocument();
      });
      
      // Type to clear error
      const cpfInput = screen.getByLabelText('CPF');
      await user.type(cpfInput, '1');
      
      await waitFor(() => {
        expect(screen.queryByText('CPF é obrigatório')).not.toBeInTheDocument();
      });
    });

    it('should clear password error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      // Submit to show error
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
      });
      
      // Type to clear error
      const passwordInput = screen.getByLabelText('Senha');
      await user.type(passwordInput, 'p');
      
      await waitFor(() => {
        expect(screen.queryByText('Senha é obrigatória')).not.toBeInTheDocument();
      });
    });
  });

  describe('CPF Formatting', () => {
    it('should format CPF as user types', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF') as HTMLInputElement;
      await user.type(cpfInput, '13271936986');
      
      expect(cpfInput.value).toBe('132.719.369-86');
    });

    it('should handle partial CPF formatting', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF') as HTMLInputElement;
      await user.type(cpfInput, '123456');
      
      expect(cpfInput.value).toBe('123.456');
    });

    it('should limit CPF to 14 characters (formatted)', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF') as HTMLInputElement;
      await user.type(cpfInput, '132719369861234567890');
      
      expect(cpfInput.value.length).toBeLessThanOrEqual(14);
    });
  });

  describe('Form Submission', () => {
    it('should call API with correct data on valid submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'test-token-123' }),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cpf: '13271936986',
              password: 'password123',
            }),
          })
        );
      });
    });

    it('should unformat CPF before sending to API', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'test-token' }),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      // Type formatted CPF
      await user.type(cpfInput, '132.719.369-86');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const callArg = (global.fetch as jest.Mock).mock.calls[0][1].body;
        const body = JSON.parse(callArg);
        expect(body.cpf).toBe('13271936986'); // Unformatted
      });
    });

    it('should store token in localStorage on successful login', async () => {
      const user = userEvent.setup();
      const mockToken = 'test-token-123';
      
      // Create a spy on localStorage.setItem
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: mockToken }),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      // Submit the form
      await user.click(submitButton);
      
      // Wait for API call to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      }, { timeout: 3000 });
      
      // Verify localStorage was called with correct arguments
      expect(setItemSpy).toHaveBeenCalledWith('access_token', mockToken);
      
      // Clean up
      setItemSpy.mockRestore();
    });

    it('should redirect to home page on successful login', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'test-token' }),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockLocation.href).toBe('/home');
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ access_token: 'test-token' }),
        }), 100))
      );
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      // Should show loading text
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ access_token: 'test-token' }),
        }), 100))
      );
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      // Button should be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show alert on login failure', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ description: 'Credenciais inválidas' }),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'wrongpassword');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Credenciais inválidas');
      });
    });

    it('should show default error message when description is missing', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          'Erro ao fazer login. Verifique suas credenciais.'
        );
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          'Erro ao conectar com o servidor. Tente novamente.'
        );
      });
    });

    it('should stop loading state after error', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalled();
      });
      
      // Loading should stop
      await waitFor(() => {
        expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page when clicking sign up link', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const signUpButton = screen.getByRole('button', { name: /cadastre-se/i });
      await user.click(signUpButton);
      
      expect(mockLocation.href).toBe('/register');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<Login />);
      
      const form = screen.getByRole('form', { name: /login form/i });
      expect(form).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      expect(cpfInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it('should have autocomplete attributes', () => {
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      expect(cpfInput).toHaveAttribute('autoComplete', 'username');
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    });

    it('should prevent browser validation with noValidate', () => {
      const { container } = render(<Login />);
      
      const form = container.querySelector('form');
      expect(form).toHaveAttribute('noValidate');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid form submissions', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ access_token: 'test-token' }),
            });
          }, 100);
        })
      );
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      // Try to submit multiple times rapidly
      const clickPromise1 = user.click(submitButton);
      const clickPromise2 = user.click(submitButton);
      const clickPromise3 = user.click(submitButton);
      
      await Promise.all([clickPromise1, clickPromise2, clickPromise3]);
      
      // Wait for any pending operations
      await waitFor(() => {
        // The button should be disabled after first click, so only one fetch should happen
        expect(global.fetch).toHaveBeenCalledTimes(1);
      }, { timeout: 2000 });
    });

    it('should handle empty spaces in password', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'test-token' }),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, '   ');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      // Should show password required error
      await waitFor(() => {
        expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
      });
    });

    it('should handle special characters in password', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'test-token' }),
      });
      
      render(<Login />);
      
      const cpfInput = screen.getByLabelText('CPF');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(cpfInput, '13271936986');
      await user.type(passwordInput, '!@#$%^&*()');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify({
              cpf: '13271936986',
              password: '!@#$%^&*()',
            }),
          })
        );
      });
    });
  });
});
