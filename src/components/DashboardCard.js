import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Maximize2, RefreshCw } from 'lucide-react';

function DashboardCard({ 
  title, 
  subtitle, 
  children, 
  isLoading = false, 
  className = '', 
  icon = null,
  accentColor = 'blue',
  onRefresh = null,
  headerAction = null
}) {
  // Define color variants based on accentColor
  const colorVariants = {
    blue: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      headerBg: 'from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent',
      borderAccent: 'border-blue-200 dark:border-blue-800/50',
      loadingBorder: 'border-blue-500'
    },
    purple: {
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      headerBg: 'from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent',
      borderAccent: 'border-purple-200 dark:border-purple-800/50',
      loadingBorder: 'border-purple-500'
    },
    green: {
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      headerBg: 'from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent',
      borderAccent: 'border-green-200 dark:border-green-800/50',
      loadingBorder: 'border-green-500'
    },
    amber: {
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      headerBg: 'from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent',
      borderAccent: 'border-amber-200 dark:border-amber-800/50',
      loadingBorder: 'border-amber-500'
    },
    red: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      headerBg: 'from-red-50 to-transparent dark:from-red-900/20 dark:to-transparent',
      borderAccent: 'border-red-200 dark:border-red-800/50',
      loadingBorder: 'border-red-500'
    },
    indigo: {
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      headerBg: 'from-indigo-50 to-transparent dark:from-indigo-900/20 dark:to-transparent',
      borderAccent: 'border-indigo-200 dark:border-indigo-800/50',
      loadingBorder: 'border-indigo-500'
    },
    yellow: {
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      headerBg: 'from-yellow-50 to-transparent dark:from-yellow-900/20 dark:to-transparent',
      borderAccent: 'border-yellow-200 dark:border-yellow-800/50',
      loadingBorder: 'border-yellow-500'
    }
  };

  const colors = colorVariants[accentColor] || colorVariants.yellow;

  return (
    <motion.div 
      whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border ${colors.borderAccent} shadow-md overflow-hidden ${className}`}
    >
      <div className={`bg-gradient-to-b ${colors.headerBg} px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700`}>
        <div className="flex items-center">
          {icon && (
            <div className={`${colors.iconBg} ${colors.iconColor} rounded-lg p-2 mr-3`}>
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {headerAction && (
            <div className="mr-1">
              {headerAction}
            </div>
          )}
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? colors.iconColor + ' animate-spin' : 'text-gray-500 dark:text-gray-400'}`} />
            </button>
          )}
          <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${colors.loadingBorder} mb-4`}></div>
            <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
          </div>
        ) : (
          <div>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DashboardCard; 