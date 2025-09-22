import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">👥</span>
          <h1 className="text-xl font-bold text-gray-800">Cidadão Ativo</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
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
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
            <a href="/login" className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Entrar
            </a>
          <a href="/register" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Cadastrar
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;