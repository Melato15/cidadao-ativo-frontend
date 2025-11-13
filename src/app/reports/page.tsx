import React from 'react';
import ReportsIntegrated from '../../components/ReportsIntegrated';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const ReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16">
        <div className="p-6">
          <ReportsIntegrated />
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;