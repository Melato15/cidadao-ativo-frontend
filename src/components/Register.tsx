'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from './Input';
import Button from './Button';
import { 
  formatCPF, 
  isValidCPF, 
  isEmpty, 
  passwordsMatch, 
  isValidPassword, 
  isValidBirthDate, 
  isValidFullName 
} from '../utils/validation';

interface FormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  cpf?: string;
  birthDate?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    cpf: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;

    // Apply CPF mask
    if (field === 'cpf') {
      value = formatCPF(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate full name
    if (isEmpty(formData.fullName)) {
      newErrors.fullName = 'Nome completo é obrigatório';
    } else if (!isValidFullName(formData.fullName)) {
      newErrors.fullName = 'Digite seu nome completo (nome e sobrenome)';
    }

    // Validate CPF
    if (isEmpty(formData.cpf)) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!isValidCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // Validate birth date
    if (isEmpty(formData.birthDate)) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else if (!isValidBirthDate(formData.birthDate)) {
      newErrors.birthDate = 'Data inválida ou idade menor que 16 anos';
    }

    // Validate password
    if (isEmpty(formData.password)) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validate confirm password
    if (isEmpty(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrate with NestJS backend API
      console.log('Form data to send:', {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, '') // Send CPF without mask
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Cadastro realizado com sucesso!');
      
      // Reset form
      setFormData({
        fullName: '',
        cpf: '',
        birthDate: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">👥</div>
            <h1 className="text-2xl font-bold text-gray-900">Cidadão Ativo</h1>
            <h2 className="mt-4 text-xl text-gray-700">Crie sua conta</h2>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="fullName"
              label="Nome completo"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              error={errors.fullName}
              placeholder="Digite seu nome completo"
              autoComplete="name"
            />

            <Input
              id="cpf"
              label="CPF"
              type="text"
              value={formData.cpf}
              onChange={handleInputChange('cpf')}
              error={errors.cpf}
              placeholder="000.000.000-00"
              maxLength={14}
              autoComplete="off"
            />

            <Input
              id="birthDate"
              label="Data de nascimento"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange('birthDate')}
              error={errors.birthDate}
              autoComplete="bday"
            />

            <Input
              id="password"
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              placeholder="Digite sua senha (mínimo 6 caracteres)"
              autoComplete="new-password"
            />

            <Input
              id="confirmPassword"
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Digite sua senha novamente"
              autoComplete="new-password"
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="success"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Clique aqui 
            </Link>
            {''} se já possui uma conta
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;