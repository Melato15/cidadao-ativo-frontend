import React from 'react';
import Reports from '../../components/Reports';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const ReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16">
        <div className="p-6">
          <Reports />
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;