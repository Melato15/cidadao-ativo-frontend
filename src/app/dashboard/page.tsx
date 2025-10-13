import React from 'react';
import Dashboard from '../../components/Dashboard';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16">
        <div className="p-6">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;