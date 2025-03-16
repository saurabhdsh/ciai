import React from 'react';
import { Sparkles, Zap, BrainCircuit, Bot, Cpu } from 'lucide-react';

const AIAnalysisButton = ({ onClick, className = '', variant = 'default' }) => {
  // Modern AI icon for all variants
  const aiIcon = <Cpu className="h-3 w-3" />;
  
  // Different button variants for visual variety
  const variants = {
    default: {
      base: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
      icon: aiIcon
    },
    modern: {
      base: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
      icon: aiIcon
    },
    neon: {
      base: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600',
      icon: aiIcon
    },
    minimal: {
      base: 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600',
      icon: aiIcon
    }
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <button
      onClick={onClick}
      className={`
        group relative inline-flex items-center px-2 py-1 
        ${selectedVariant.base}
        text-white text-xs font-medium 
        rounded-md shadow-sm 
        transition-all duration-200 transform hover:scale-105 
        focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-400 focus:ring-opacity-50
        overflow-hidden
        ${className}
      `}
    >
      <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
      <span className="relative flex items-center">
        {selectedVariant.icon}
        <span className="relative ml-1">AI</span>
      </span>
    </button>
  );
};

export default AIAnalysisButton; 