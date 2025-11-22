import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainLayout from './MainLayout';

// Mock Header and Sidebar
jest.mock('./Header', () => ({ onMenuClick }: { onMenuClick: () => void }) => (
  <div data-testid="header">
    <button onClick={onMenuClick}>Menu</button>
  </div>
));

jest.mock('./Sidebar', () => ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <div data-testid="sidebar" data-isopen={isOpen}>
    <button onClick={onClose}>Close</button>
  </div>
));

describe('MainLayout Component', () => {
  it('should render children', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should toggle sidebar', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-isopen', 'false');
    
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);
    
    expect(sidebar).toHaveAttribute('data-isopen', 'true');
  });

  it('should close sidebar when overlay is clicked', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    
    // Open sidebar first
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);
    
    const overlay = container.querySelector('.fixed.inset-0.bg-black');
    expect(overlay).toBeInTheDocument();
    
    if (overlay) {
      fireEvent.click(overlay);
      expect(screen.getByTestId('sidebar')).toHaveAttribute('data-isopen', 'false');
    }
  });
});
