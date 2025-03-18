import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend, color = 'bg-blue-500' }) => {
  const trendColor = trend === 'up' 
    ? color === 'bg-green-500' ? 'text-green-500' : 'text-red-500'
    : color === 'bg-green-500' ? 'text-red-500' : 'text-green-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {Icon && (
            <div className={`p-2 rounded-lg ${color.replace('bg-', 'bg-opacity-10 ')} mr-3`}>
              <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center ${trendColor}`}>
            {trend === 'up' ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownRight className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
};

export default MetricCard; 