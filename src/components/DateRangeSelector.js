import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { getDateRangeOptions } from '../services/csvService';

const DateRangeSelector = ({ 
  onDateRangeChange, 
  initialRange = '30',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  
  const dateRangeOptions = getDateRangeOptions();
  
  useEffect(() => {
    // Set default dates for custom range
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setCustomStartDate(formatDateForInput(thirtyDaysAgo));
    setCustomEndDate(formatDateForInput(today));
  }, []);
  
  useEffect(() => {
    if (selectedRange === 'custom') {
      setShowCustomRange(true);
      if (customStartDate && customEndDate) {
        onDateRangeChange({
          type: 'custom',
          startDate: customStartDate,
          endDate: customEndDate
        });
      }
    } else {
      setShowCustomRange(false);
      onDateRangeChange({
        type: 'days',
        days: parseInt(selectedRange, 10)
      });
    }
  }, [selectedRange, customStartDate, customEndDate, onDateRangeChange]);
  
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const handleRangeSelect = (rangeId) => {
    setSelectedRange(rangeId);
    setIsOpen(false);
  };
  
  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange({
        type: 'custom',
        startDate: customStartDate,
        endDate: customEndDate
      });
    }
  };
  
  const getSelectedRangeName = () => {
    const option = dateRangeOptions.find(opt => opt.id === selectedRange);
    return option ? option.name : 'Select Date Range';
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getSelectedRangeName()}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {dateRangeOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleRangeSelect(option.id)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedRange === option.id 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showCustomRange && (
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => {
                setCustomStartDate(e.target.value);
                handleCustomDateChange();
              }}
              className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => {
                setCustomEndDate(e.target.value);
                handleCustomDateChange();
              }}
              className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector; 