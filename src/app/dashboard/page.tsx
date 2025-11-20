import React from 'react';
import Dashboard from '../../components/Dashboard';
import MainLayout from '../../components/MainLayout';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default DashboardPage;