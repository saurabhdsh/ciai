import React from 'react';

const EnvDebugger = () => {
  // Get all environment variables that start with REACT_APP_
  const envVars = Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((obj, key) => {
      // Mask API keys for security
      if (key.includes('API_KEY')) {
        const value = process.env[key];
        obj[key] = value ? 
          `${value.substring(0, 8)}...${value.substring(value.length - 4)}` : 
          'Not set';
      } else {
        obj[key] = process.env[key];
      }
      return obj;
    }, {});

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Environment Variables:</h3>
      <pre className="text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-auto max-h-32">
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  );
};

export default EnvDebugger; 