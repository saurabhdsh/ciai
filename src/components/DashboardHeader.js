import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  RefreshCw, 
  Download, 
  Filter, 
  ChevronDown, 
  Clock,
  Share2,
  Database,
  Zap,
  Check
} from 'lucide-react';
import DataSourceSelector from './DataSourceSelector';

const DashboardHeader = ({ 
  title, 
  description,
  sources = ['Rally', 'Jira', 'ServiceNow'],
  selectedSources = [],
  onSourceChange,
  dateRange = '30',
  onDateRangeChange,
  onRefresh,
  onExport,
  isLoading = false,
  children
}) => {
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  
  // Predefined date ranges - keeping this for reference but not using it in the UI
  const dateRanges = [
    { id: '7', label: 'Last 7 days' },
    { id: '30', label: 'Last 30 days' },
    { id: '90', label: 'Last 90 days' },
    { id: 'all', label: 'All time' }
  ];

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.source-selector')) {
      setShowSourceSelector(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <Zap className="h-7 w-7 text-yellow-500 mr-2" />
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-600">{title || "ImpactFix AI"}</h1>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {/* Data Source Selector */}
            <div className="relative source-selector">
              <button
                className="flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowSourceSelector(!showSourceSelector)}
              >
                <Database className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedSources.length === 0 
                    ? 'Select Sources' 
                    : `${selectedSources.length} Source${selectedSources.length !== 1 ? 's' : ''}`}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 transition-transform ${showSourceSelector ? 'transform rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showSourceSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <Database className="h-4 w-4 mr-1.5" />
                        Data Sources
                      </h3>
                    </div>
                    
                    <div className="p-3 space-y-2">
                      {sources.map(source => (
                        <div 
                          key={source}
                          onClick={() => onSourceChange(source)}
                          className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                            selectedSources.includes(source)
                              ? 'bg-yellow-50 dark:bg-yellow-900/30'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center mr-2 ${
                            selectedSources.includes(source)
                              ? 'bg-yellow-500'
                              : 'border border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedSources.includes(source) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{source}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Date Range Selector - Removed */}
            
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className={`p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            
            {onExport && (
              <button
                onClick={onExport}
                className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                title="Export data"
              >
                <Download className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}

            {children}
          </div>
        </div>
      </div>
      
      {/* Active filters display */}
      {(selectedSources.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Filter className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium">Active Filters:</span>
          </div>
          
          {/* Date Range Filter - Removed */}
          
          {selectedSources.map(source => (
            <div 
              key={source}
              className="flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-xs"
            >
              <Database className="h-3 w-3 mr-1" />
              <span>{source}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader; 