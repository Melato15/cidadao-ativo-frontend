'use client';

import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { formatCPF, unformatCPF, isValidCPF, isEmpty } from '../utils/validation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FormData {
  cpf: string;
  password: string;
}

interface FormErrors {
  cpf: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cpf: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    cpf: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    
    // Clear CPF error when user starts typing
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, password: e.target.value }));
    
    // Clear password error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { cpf: '', password: '' };
    let isValid = true;

    // Validate CPF
    if (isEmpty(formData.cpf)) {
      newErrors.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (!isValidCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
      isValid = false;
    }

    // Validate password
    if (isEmpty(formData.password)) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        cpf: unformatCPF(formData.cpf),
        password: formData.password
      };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Store the token in localStorage
        localStorage.setItem('access_token', data.access_token);
        
        // Navigate to home page
        window.location.href = '/home';
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert(errorData.description || 'Erro ao fazer login. Verifique suas credenciais.');
      }
            
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">👥</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cidadão Ativo
            </h1>
            <h2 className="text-xl text-gray-500">
              Acesse sua conta
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate role="form" aria-label="Login form">
            <Input
              id="cpf"
              label="CPF"
              type="text"
              value={formData.cpf}
              onChange={handleCPFChange}
              error={errors.cpf}
              placeholder="000.000.000-00"
              maxLength={14}
              autoComplete="username"
              required
            />

            <Input
              id="password"
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              error={errors.password}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Entrar
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem conta?{' '}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition-colors duration-200"
                onClick={() => {
                  // Here you would navigate to the registration page
                  window.location.href = '/register';
                }}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;