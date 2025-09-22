'use client';

import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';

interface AddProposalFormData {
  title: string;
  description: string;
  author: string;
  neighborhood: string;
  category: 'Infraestrutura' | 'Meio Ambiente' | 'Segurança' | 'Educação' | 'Saúde' | 'Cultura' | 'Transporte' | 'Outros';
}

interface AddProposalProps {
  onSubmit: (proposal: Omit<AddProposalFormData, 'author'>) => void;
  onCancel: () => void;
}

const AddProposal: React.FC<AddProposalProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<AddProposalFormData>({
    title: '',
    description: '',
    author: '',
    neighborhood: '',
    category: 'Outros'
  });

  const [errors, setErrors] = useState<Partial<AddProposalFormData>>({});

  const neighborhoods = [
    'Centro',
    'Zona Norte',
    'Zona Sul',
    'Zona Leste',
    'Zona Oeste',
    'Vila Nova',
    'Jardim das Flores',
    'Bela Vista',
    'Industrial',
    'Outros'
  ];

  const categories = [
    'Infraestrutura',
    'Meio Ambiente',
    'Segurança',
    'Educação',
    'Saúde',
    'Cultura',
    'Transporte',
    'Outros'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<AddProposalFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Título deve ter pelo menos 5 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Descrição deve ter pelo menos 20 caracteres';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Nome do autor é obrigatório';
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { author, ...proposalData } = formData;
      onSubmit(proposalData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        author: '',
        neighborhood: '',
        category: 'Outros'
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof AddProposalFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Nova Proposta da Comunidade
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="proposal-title"
          label="Título da Proposta"
          type="text"
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          placeholder="Ex: Criação de uma nova praça no bairro"
          maxLength={100}
        />

        <div className="w-full">
          <label htmlFor="proposal-description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição Detalhada
          </label>
          <textarea
            id="proposal-description"
            value={formData.description}
            onChange={handleInputChange('description')}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200 resize-vertical
              ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
            rows={4}
            placeholder="Descreva sua proposta em detalhes, incluindo benefícios para a comunidade e possível localização..."
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 caracteres
          </p>
        </div>

        <Input
          id="proposal-author"
          label="Seu Nome"
          type="text"
          value={formData.author}
          onChange={handleInputChange('author')}
          error={errors.author}
          placeholder="Digite seu nome completo"
        />

        <div className="w-full">
          <label htmlFor="proposal-neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
            Bairro
          </label>
          <select
            id="proposal-neighborhood"
            value={formData.neighborhood}
            onChange={handleInputChange('neighborhood')}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${errors.neighborhood ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
          >
            <option value="">Selecione um bairro</option>
            {neighborhoods.map(neighborhood => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
          {errors.neighborhood && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.neighborhood}
            </p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="proposal-category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="proposal-category"
            value={formData.category}
            onChange={handleInputChange('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            Publicar Proposta
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProposal;