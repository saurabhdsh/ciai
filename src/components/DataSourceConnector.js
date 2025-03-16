import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Server, GitPullRequest, X, Check, Loader } from 'lucide-react';

const DataSourceConnector = ({ onConnect, onCancel }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [credentials, setCredentials] = useState({
    url: '',
    username: '',
    apiKey: '',
    project: ''
  });
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const handleSourceSelect = (source) => {
    setSelectedSource(source);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConnect = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!credentials.url || !credentials.username || !credentials.apiKey) {
      setError('Please fill in all required fields');
      return;
    }
    
    setConnecting(true);
    setError(null);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      
      // Simulate successful connection (in a real app, this would be an actual API call)
      if (Math.random() > 0.2) { // 80% success rate for demo
        setConnected(true);
        
        // Notify parent component
        if (onConnect) {
          onConnect({
            source: selectedSource,
            credentials,
            timestamp: new Date().toISOString()
          });
        }
        
        // Reset form after successful connection
        setTimeout(() => {
          setSelectedSource(null);
          setCredentials({
            url: '',
            username: '',
            apiKey: '',
            project: ''
          });
          setConnected(false);
        }, 2000);
      } else {
        // Simulate connection error
        setError(`Failed to connect to ${selectedSource}. Please check your credentials and try again.`);
      }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-md w-full"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Connect Data Source</h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {!selectedSource ? (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Select a data source to connect to:
            </p>
            
            <button
              onClick={() => handleSourceSelect('Rally')}
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <GitPullRequest className="h-6 w-6 text-blue-500" />
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-800 dark:text-white">Rally</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect to Rally for agile project management data</p>
              </div>
            </button>
            
            <button
              onClick={() => handleSourceSelect('Jira')}
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Server className="h-6 w-6 text-purple-500" />
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-800 dark:text-white">Jira</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect to Jira for issue tracking and project management</p>
              </div>
            </button>
            
            <button
              onClick={() => handleSourceSelect('ServiceNow')}
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Database className="h-6 w-6 text-green-500" />
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-800 dark:text-white">ServiceNow</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect to ServiceNow for IT service management</p>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleConnect}>
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                {selectedSource === 'Rally' && <GitPullRequest className="h-6 w-6 text-blue-500" />}
                {selectedSource === 'Jira' && <Server className="h-6 w-6 text-purple-500" />}
                {selectedSource === 'ServiceNow' && <Database className="h-6 w-6 text-green-500" />}
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Connect to {selectedSource}</h3>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
              >
                ← Back to source selection
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {selectedSource} URL
                </label>
                <input
                  type="text"
                  name="url"
                  value={credentials.url}
                  onChange={handleInputChange}
                  placeholder={`https://${selectedSource.toLowerCase()}.example.com`}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="your-username"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Key / Password
                </label>
                <input
                  type="password"
                  name="apiKey"
                  value={credentials.apiKey}
                  onChange={handleInputChange}
                  placeholder="••••••••••••••••"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project / Workspace
                </label>
                <input
                  type="text"
                  name="project"
                  value={credentials.project}
                  onChange={handleInputChange}
                  placeholder="project-name"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Optional: Specify a project to limit data scope
                </p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={connecting || connected}
                  className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                    connected
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  {connecting ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : connected ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Connected!</span>
                    </>
                  ) : (
                    <span>Connect</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default DataSourceConnector; 