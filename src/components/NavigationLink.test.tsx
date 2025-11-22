import React from 'react';
import { render, screen } from '@testing-library/react';
import NavigationLink from './NavigationLink';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('NavigationLink Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render link with children', () => {
    require('next/navigation').usePathname.mockReturnValue('/other');
    render(<NavigationLink href="/test">Test Link</NavigationLink>);
    
    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should highlight active link', () => {
    require('next/navigation').usePathname.mockReturnValue('/test');
    render(<NavigationLink href="/test">Test Link</NavigationLink>);
    
    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveClass('bg-blue-100');
    expect(link).toHaveClass('text-blue-700');
  });

  it('should render inactive link', () => {
    require('next/navigation').usePathname.mockReturnValue('/other');
    render(<NavigationLink href="/test">Test Link</NavigationLink>);
    
    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).not.toHaveClass('bg-blue-100');
    expect(link).toHaveClass('text-gray-700');
  });
});
