import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  currentPage: string;
  onHomeClick: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage, onHomeClick }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={onHomeClick}
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">{currentPage}</span>
    </nav>
  );
};

export default Breadcrumb;