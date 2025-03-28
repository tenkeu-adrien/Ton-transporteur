// components/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative flex flex-col items-center">
        {/* Cercle principal animé */}
        <div className="w-16 h-16 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
        
        {/* Petits cercles satellites */}
        <div className="absolute w-24 h-24">
          <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse top-0 left-1/2 -translate-x-1/2"></div>
          <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse bottom-0 left-1/2 -translate-x-1/2 animate-delay-200"></div>
          <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse left-0 top-1/2 -translate-y-1/2 animate-delay-400"></div>
          <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse right-0 top-1/2 -translate-y-1/2 animate-delay-600"></div>
        </div>

        {/* Texte */}
        <div className="mt-4 text-white text-lg font-semibold animate-pulse">
          Chargement...
        </div>

        {/* Effet de vague en bas */}
        <div className="absolute -bottom-10 w-20 h-2 bg-green-500 rounded-full opacity-30 animate-bounce blur-md"></div>
      </div>
    </div>
  );
};

export default Loader;