
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 bg-white/50 dark:bg-gray-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
           <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Robin
            </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2026 Robin. Helping entrepreneurs build their dreams.
          </p>
          <div className="flex gap-8 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
