import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  RefreshCw, 
  Download, 
  Filter, 
  ChevronDown, 
  Clock,
  Share2,
  Database,
  Zap
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Predefined date ranges
  const dateRanges = [
    { id: '7', label: 'Last 7 days' },
    { id: '30', label: 'Last 30 days' },
    { id: '90', label: 'Last 90 days' },
    { id: 'all', label: 'All time' }
  ];

  const handleDateRangeSelect = (e) => {
    onDateRangeChange(e);
    setShowDatePicker(false);
  };

  const availableSources = sources.map(source => {
    let color = 'gray';
    if (source.toLowerCase().includes('rally')) color = 'blue';
    if (source.toLowerCase().includes('jira')) color = 'purple';
    if (source.toLowerCase().includes('servicenow')) color = 'green';
    
    return {
      id: source,
      name: source,
      color
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <Zap className="h-7 w-7 text-yellow-500 mr-2" />
            <div>
              <h1 className="text-xl font-bold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-yellow-400 dark:to-yellow-600">{title || "CrashInsight AI"}</h1>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {/* Data Source Selector */}
            <div className="relative">
              <button
                className="flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <Database className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Sources
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2" />
              </button>
              
              {showDatePicker && (
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
                  
                  <div className="p-3">
                    {sources.map(source => (
                      <div key={source} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`source-${source}`}
                          checked={selectedSources.includes(source)}
                          onChange={() => onSourceChange(source)}
                          className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`source-${source}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {source}
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
            
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
          
          {dateRange && (
            <div className="flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {dateRange === 'all' ? 'All time' : 
                 dateRange === '7' ? 'Last 7 days' :
                 dateRange === '30' ? 'Last 30 days' :
                 dateRange === '90' ? 'Last 90 days' : 
                 `Last ${dateRange} days`}
              </span>
            </div>
          )}
          
          {selectedSources.length > 0 && (
            <div className="flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-xs">
              <Database className="h-3 w-3 mr-1" />
              <span>{selectedSources.length} Data Source{selectedSources.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader; 