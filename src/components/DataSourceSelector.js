import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Check, Filter, X } from 'lucide-react';

const DataSourceSelector = ({ 
  selectedSources = [], 
  onSourcesChange,
  availableSources = [
    { id: 'rally', name: 'Rally', color: 'blue' },
    { id: 'jira', name: 'Jira', color: 'purple' },
    { id: 'servicenow', name: 'ServiceNow', color: 'green' }
  ],
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSource = (sourceId) => {
    if (selectedSources.includes(sourceId)) {
      onSourcesChange(selectedSources.filter(id => id !== sourceId));
    } else {
      onSourcesChange([...selectedSources, sourceId]);
    }
  };

  const filteredSources = availableSources.filter(source => 
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceColor = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        hover: 'hover:bg-green-50 dark:hover:bg-green-900/20'
      },
      amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/20'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        hover: 'hover:bg-red-50 dark:hover:bg-red-900/20'
      },
      gray: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-700',
        hover: 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }
    };
    
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <Database className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedSources.length === 0 
              ? 'Select Data Sources' 
              : `${selectedSources.length} Source${selectedSources.length > 1 ? 's' : ''} Selected`}
          </span>
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2" />
        </button>
        
        {selectedSources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSources.map(sourceId => {
              const source = availableSources.find(s => s.id === sourceId);
              if (!source) return null;
              
              const colors = getSourceColor(source.color);
              
              return (
                <div 
                  key={source.id}
                  className={`flex items-center px-2 py-1 rounded-md ${colors.bg} ${colors.text} border ${colors.border} text-sm`}
                >
                  <span>{source.name}</span>
                  <button 
                    onClick={() => toggleSource(source.id)}
                    className="ml-1 p-0.5 rounded-full hover:bg-white/20 dark:hover:bg-black/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            
            {selectedSources.length > 0 && (
              <button
                onClick={() => onSourcesChange([])}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search data sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Filter className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredSources.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                No data sources found
              </div>
            ) : (
              filteredSources.map(source => {
                const isSelected = selectedSources.includes(source.id);
                const colors = getSourceColor(source.color);
                
                return (
                  <div
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${isSelected ? colors.bg : ''} ${colors.hover}`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center mr-2 ${isSelected ? colors.text : 'border border-gray-300 dark:border-gray-600'}`}>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{source.name}</span>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              onClick={() => onSourcesChange([])}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all
            </button>
            <button
              onClick={() => onSourcesChange(availableSources.map(s => s.id))}
              className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Select all
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataSourceSelector; 