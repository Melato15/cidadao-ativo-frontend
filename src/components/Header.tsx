'use client';

import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    // Verifica se o usuário está logado (se existe token no localStorage)
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // Verifica o status de login ao carregar
    checkLoginStatus();

    // Adiciona listener para mudanças no localStorage (login/logout em outras abas)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Verifica periodicamente o status (para detectar mudanças na mesma aba)
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <a href="/home" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-xl md:text-2xl">👥</span>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Cidadão Ativo</h1>
          </a>
        </div>

        {/* Search Bar */}
        {/* <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar projetos..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div> */}

        {/* Auth Buttons - Exibidos dependendo do estado de login */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <a href="/login" className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-blue-600 font-medium hover:text-blue-700 transition-colors">
              Entrar
            </a>
            <a href="/register" className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Cadastrar
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;