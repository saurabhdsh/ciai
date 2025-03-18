import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Database, 
  Server, 
  GitPullRequest, 
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

const DataSourceSelection = ({ onDataSourceSelected }) => {
  const [selectedSources, setSelectedSources] = useState([]);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const handleSourceToggle = (source) => {
    setSelectedSources(prev => {
      // If source is already selected, remove it
      if (prev.includes(source)) {
        return prev.filter(s => s !== source);
      } 
      // Otherwise add it
      return [...prev, source];
    });
  };

  const handleContinue = () => {
    if (selectedSources.length > 0) {
      // Save selected sources to localStorage
      localStorage.setItem('selectedSources', JSON.stringify(selectedSources));
      
      // Call the callback to update the app state
      onDataSourceSelected();
      
      // Navigate to the AI landing page
      navigate('/ai-landing');
    }
  };

  // Function to check if a data source is selected
  const isSourceSelected = (source) => {
    return selectedSources.includes(source);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-10 w-10 text-yellow-500 mr-2" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 dark:from-yellow-400 dark:via-red-400 dark:to-purple-400">
                Select Data Sources
              </h1>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the data sources you want to analyze
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className="ml-2 text-sm text-yellow-500 font-normal">(Select at least one)</span>
            </h2>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
                  isSourceSelected('Rally') 
                    ? 'ring-4 ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' 
                    : 'bg-white dark:bg-gray-800 hover:shadow-xl'
                }`}
                onClick={() => handleSourceToggle('Rally')}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mr-4">
                      <GitPullRequest className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Rally</h3>
                    {isSourceSelected('Rally') && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Connect to Rally for defect tracking and project management data
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
                  isSourceSelected('Jira') 
                    ? 'ring-4 ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' 
                    : 'bg-white dark:bg-gray-800 hover:shadow-xl'
                }`}
                onClick={() => handleSourceToggle('Jira')}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4">
                      <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Jira</h3>
                    {isSourceSelected('Jira') && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Import Jira issues and sprint data for comprehensive analysis
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
                  isSourceSelected('ServiceNow') 
                    ? 'ring-4 ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' 
                    : 'bg-white dark:bg-gray-800 hover:shadow-xl'
                }`}
                onClick={() => handleSourceToggle('ServiceNow')}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3 mr-4">
                      <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">ServiceNow</h3>
                    {isSourceSelected('ServiceNow') && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Access incident and problem records from ServiceNow
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: selectedSources.length > 0 ? 1 : 0,
                y: selectedSources.length > 0 ? 0 : 10
              }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                disabled={selectedSources.length === 0}
                className={`px-8 py-3 rounded-full font-medium text-white shadow-lg flex items-center ${
                  selectedSources.length > 0
                    ? 'bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 hover:from-yellow-600 hover:via-red-600 hover:to-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
            
            {selectedSources.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
              >
                Selected sources: {selectedSources.join(', ')}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>ImpactFix AI &copy; {new Date().getFullYear()} | Intelligent Failure Analysis Platform</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DataSourceSelection; 