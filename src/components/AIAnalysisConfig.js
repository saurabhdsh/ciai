import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Zap, 
  AlertTriangle, 
  Search,
  Lightbulb,
  Cpu
} from 'lucide-react';

const AIAnalysisConfig = ({ onSubmit, onCancel }) => {
  const [analysisType, setAnalysisType] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [timeRange, setTimeRange] = useState('last30days');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [aiFeatures, setAiFeatures] = useState({
    rootCauseDetection: true,
    anomalyDetection: true,
    predictiveAnalysis: false,
    sentimentAnalysis: false,
    patternRecognition: true
  });
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [maxInsights, setMaxInsights] = useState(5);

  const handleAIFeatureToggle = (feature) => {
    setAiFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the configuration object
    const config = {
      analysisType,
      dataSource,
      timeRange: timeRange === 'custom' ? customRange : timeRange,
      aiFeatures,
      advancedSettings: advancedOptions ? {
        confidenceThreshold,
        maxInsights
      } : null
    };
    
    // Pass the configuration to the parent component
    if (onSubmit) {
      onSubmit(config);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-2xl w-full"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">AI Analysis Configuration</h2>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Analysis Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Analysis Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAnalysisType('trend')}
                  className={`p-4 border rounded-lg flex flex-col items-center text-center transition-colors ${
                    analysisType === 'trend'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <LineChart className="h-6 w-6 mb-2" />
                  <span className="font-medium">Trend Analysis</span>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Identify patterns over time</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setAnalysisType('rootCause')}
                  className={`p-4 border rounded-lg flex flex-col items-center text-center transition-colors ${
                    analysisType === 'rootCause'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Search className="h-6 w-6 mb-2" />
                  <span className="font-medium">Root Cause</span>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Find underlying issues</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setAnalysisType('predictive')}
                  className={`p-4 border rounded-lg flex flex-col items-center text-center transition-colors ${
                    analysisType === 'predictive'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Zap className="h-6 w-6 mb-2" />
                  <span className="font-medium">Predictive</span>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Forecast future failures</span>
                </button>
              </div>
            </div>
            
            {/* Data Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Source
              </label>
              <select
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                required
              >
                <option value="">Select a data source</option>
                <option value="rally">Rally</option>
                <option value="jira">Jira</option>
                <option value="servicenow">ServiceNow</option>
                <option value="csv">CSV Upload</option>
                <option value="all">All Connected Sources</option>
              </select>
            </div>
            
            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Range
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setTimeRange('last7days')}
                  className={`p-2 border rounded-lg text-center transition-colors ${
                    timeRange === 'last7days'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Last 7 Days
                </button>
                
                <button
                  type="button"
                  onClick={() => setTimeRange('last30days')}
                  className={`p-2 border rounded-lg text-center transition-colors ${
                    timeRange === 'last30days'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Last 30 Days
                </button>
                
                <button
                  type="button"
                  onClick={() => setTimeRange('last90days')}
                  className={`p-2 border rounded-lg text-center transition-colors ${
                    timeRange === 'last90days'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Last 90 Days
                </button>
                
                <button
                  type="button"
                  onClick={() => setTimeRange('custom')}
                  className={`p-2 border rounded-lg text-center transition-colors ${
                    timeRange === 'custom'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Custom Range
                </button>
              </div>
              
              {timeRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customRange.start}
                      onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      required={timeRange === 'custom'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customRange.end}
                      onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      required={timeRange === 'custom'}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* AI Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Features
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Search className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Root Cause Detection</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Automatically identify underlying causes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={aiFeatures.rootCauseDetection}
                      onChange={() => handleAIFeatureToggle('rootCauseDetection')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Anomaly Detection</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Identify unusual patterns in your data</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={aiFeatures.anomalyDetection}
                      onChange={() => handleAIFeatureToggle('anomalyDetection')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Predictive Analysis</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Forecast future failures and trends</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={aiFeatures.predictiveAnalysis}
                      onChange={() => handleAIFeatureToggle('predictiveAnalysis')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Pattern Recognition</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Identify recurring patterns in failures</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={aiFeatures.patternRecognition}
                      onChange={() => handleAIFeatureToggle('patternRecognition')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Advanced Options */}
            <div>
              <button
                type="button"
                onClick={() => setAdvancedOptions(!advancedOptions)}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                <Cpu className="h-4 w-4 mr-1" />
                {advancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
              
              {advancedOptions && (
                <div className="mt-3 space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      AI Confidence Threshold ({confidenceThreshold}%)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      step="5"
                      value={confidenceThreshold}
                      onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>More Results</span>
                      <span>Higher Accuracy</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Maximum Insights to Generate
                    </label>
                    <select
                      value={maxInsights}
                      onChange={(e) => setMaxInsights(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                      <option value="3">3 insights</option>
                      <option value="5">5 insights</option>
                      <option value="10">10 insights</option>
                      <option value="15">15 insights</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!analysisType || !dataSource || !timeRange || (timeRange === 'custom' && (!customRange.start || !customRange.end))}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles className="h-5 w-5" />
                <span>Generate AI Analysis</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AIAnalysisConfig; 