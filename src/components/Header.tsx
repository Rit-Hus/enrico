
import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onLogoClick: string
  onAgentClick: string
}

const Header: React.FC<NavbarProps> = ({ onLogoClick, onAgentClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link className="flex items-center" href={onLogoClick}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
              Robin
            </h1>
          </Link>

          {/* Nav Links & Action */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">About</a>
            <Link href={onAgentClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Build with AI
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-6 shadow-xl transition-colors">
          <Link 
            href={onAgentClick}
            className="w-full flex items-center justify-center gap-3 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl"
          >
            <Sparkles className="w-5 h-5" />
            Build with AI
          </Link>
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link href={onLogoClick} className="text-gray-600 dark:text-gray-300 font-medium">Home</Link>
            <a href="#about" className="text-gray-600 dark:text-gray-300 font-medium">About</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
