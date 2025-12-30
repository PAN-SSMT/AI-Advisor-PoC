import React from 'react';

interface AppNavigationProps {
  currentApp: 'NOVA' | 'REMAS';
}

const AppNavigation: React.FC<AppNavigationProps> = ({ currentApp }) => {
  // Adjust these paths based on your deployment setup
  const novaPath = '../cloud-security-ai-advisor (6)/index.html';
  const remasPath = '../remas/index.html';

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <a
        href={novaPath}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentApp === 'NOVA'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        NOVA
      </a>
      <a
        href={remasPath}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentApp === 'REMAS'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        REMAS
      </a>
    </div>
  );
};

export default AppNavigation;
