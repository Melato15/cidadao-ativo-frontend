'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ href, children, className = '' }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
        ${isActive 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
        }
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;
