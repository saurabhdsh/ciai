import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Server, 
  GitPullRequest, 
  TrendingUp,
  Search,
  AlertTriangle,
  Calendar,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  BarChart2,
  PieChart,
  Layers,
  Filter,
  Clock,
  Briefcase,
  FolderKanban,
  ChevronDown,
  Zap
} from 'lucide-react';

const AILanding = () => {
  const [selectedSources, setSelectedSources] = useState([]);
  const [projectKey, setProjectKey] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [workspaceSelections, setWorkspaceSelections] = useState({});
  const [projectSelections, setProjectSelections] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data for workspaces and projects
  const mockData = {
    Rally: {
      workspaces: [
        { id: 'rally-ws-1', name: 'Enterprise Services' },
        { id: 'rally-ws-2', name: 'Digital Banking' },
        { id: 'rally-ws-3', name: 'Core Systems' }
      ],
      projects: {
        'rally-ws-1': [
          { id: 'rally-proj-1', name: 'API Gateway' },
          { id: 'rally-proj-2', name: 'Authentication Service' },
          { id: 'rally-proj-3', name: 'Data Lake Integration' }
        ],
        'rally-ws-2': [
          { id: 'rally-proj-4', name: 'Mobile Banking App' },
          { id: 'rally-proj-5', name: 'Online Banking Portal' },
          { id: 'rally-proj-6', name: 'Payment Processing' }
        ],
        'rally-ws-3': [
          { id: 'rally-proj-7', name: 'Account Management' },
          { id: 'rally-proj-8', name: 'Transaction Processing' },
          { id: 'rally-proj-9', name: 'Reporting Engine' }
        ]
      }
    },
    Jira: {
      workspaces: [
        { id: 'jira-ws-1', name: 'Technology Division' },
        { id: 'jira-ws-2', name: 'Product Development' },
        { id: 'jira-ws-3', name: 'Infrastructure Team' }
      ],
      projects: {
        'jira-ws-1': [
          { id: 'TECH', name: 'Technology Initiatives' },
          { id: 'SEC', name: 'Security Compliance' },
          { id: 'ARCH', name: 'Architecture Modernization' }
        ],
        'jira-ws-2': [
          { id: 'PROD', name: 'Product Roadmap' },
          { id: 'UX', name: 'User Experience' },
          { id: 'FEAT', name: 'Feature Development' }
        ],
        'jira-ws-3': [
          { id: 'INFRA', name: 'Infrastructure' },
          { id: 'CLOUD', name: 'Cloud Migration' },
          { id: 'DEVOPS', name: 'DevOps Pipeline' }
        ]
      }
    },
    ServiceNow: {
      workspaces: [
        { id: 'sn-ws-1', name: 'IT Service Management' },
        { id: 'sn-ws-2', name: 'Operations' },
        { id: 'sn-ws-3', name: 'Customer Support' }
      ],
      projects: {
        'sn-ws-1': [
          { id: 'ITSM-1', name: 'Incident Management' },
          { id: 'ITSM-2', name: 'Change Management' },
          { id: 'ITSM-3', name: 'Problem Management' }
        ],
        'sn-ws-2': [
          { id: 'OPS-1', name: 'Monitoring & Alerts' },
          { id: 'OPS-2', name: 'System Health' },
          { id: 'OPS-3', name: 'Performance Metrics' }
        ],
        'sn-ws-3': [
          { id: 'SUP-1', name: 'Ticket Management' },
          { id: 'SUP-2', name: 'Knowledge Base' },
          { id: 'SUP-3', name: 'Customer Feedback' }
        ]
      }
    }
  };

  // Add animation variants
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
        // Remove workspace and project selections for this source
        const newWorkspaceSelections = { ...workspaceSelections };
        const newProjectSelections = { ...projectSelections };
        delete newWorkspaceSelections[source];
        delete newProjectSelections[source];
        setWorkspaceSelections(newWorkspaceSelections);
        setProjectSelections(newProjectSelections);
        
        return prev.filter(s => s !== source);
      } 
      // Otherwise add it
      return [...prev, source];
    });
  };

  const handleContinue = () => {
    if (selectedSources.length > 0) {
      // Skip directly to project key entry
      setCurrentStep(2);
      
      // Simulate loading workspaces
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleWorkspaceChange = (source, workspaceId) => {
    setWorkspaceSelections(prev => ({
      ...prev,
      [source]: workspaceId
    }));
    
    // Reset project selection for this source when workspace changes
    setProjectSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[source];
      return newSelections;
    });
  };

  const handleProjectChange = (source, projectId) => {
    setProjectSelections(prev => ({
      ...prev,
      [source]: projectId
    }));
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    
    // Check if all selected sources have workspace and project selections
    const isComplete = selectedSources.every(source => 
      workspaceSelections[source] && projectSelections[source]
    );
    
    if (isComplete) {
      // Prepare data to pass to the next page
      const sourceConfigurations = selectedSources.map(source => ({
        source,
        workspaceId: workspaceSelections[source],
        workspaceName: mockData[source].workspaces.find(ws => ws.id === workspaceSelections[source])?.name,
        projectId: projectSelections[source],
        projectName: mockData[source].projects[workspaceSelections[source]]?.find(
          proj => proj.id === projectSelections[source]
        )?.name
      }));
      
      // In a real app, this would connect to the selected data sources
      setTimeout(() => {
        navigate('/failure-trends', { 
          state: { 
            selectedSources,
            sourceConfigurations
          } 
        });
      }, 800);
    }
  };

  // Function to check if a data source is selected
  const isSourceSelected = (source) => {
    return selectedSources.includes(source);
  };

  // Check if all required selections are made
  const isFormComplete = () => {
    return selectedSources.every(source => 
      workspaceSelections[source] && projectSelections[source]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
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
                  CrashInsight AI
              </h1>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 mx-auto mb-4 rounded-full"></div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Intelligent crash analysis and pattern recognition across multiple data sources
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <Layers className="mr-2 h-6 w-6 text-yellow-500" />
                Select Data Sources
                <span className="ml-2 text-sm text-yellow-500 font-normal">(Select multiple)</span>
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
        );
      
      case 2:
        return (
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex items-center mb-8" variants={itemVariants}>
              <button 
                onClick={() => setCurrentStep(1)}
                className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4 flex items-center"
              >
                <ArrowRight className="h-5 w-5 transform rotate-180 mr-1" />
                Back
              </button>
              <div className="flex items-center">
                <Zap className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  CrashInsight AI Configuration
              </h2>
            </div>
            </motion.div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading workspaces and projects...</p>
                  </div>
            ) : (
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
                variants={itemVariants}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Briefcase className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Workspace & Project Selection
                  </h3>
                </div>
                
                <form onSubmit={handleProjectSubmit} className="space-y-8">
                  {selectedSources.map(source => (
                    <div key={source} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                          source === 'Rally' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                          source === 'Jira' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {source === 'Rally' ? <GitPullRequest className="h-4 w-4" /> :
                           source === 'Jira' ? <Server className="h-4 w-4" /> :
                           <Database className="h-4 w-4" />}
                  </div>
                        {source} Configuration
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Workspace
                    </label>
                          <div className="relative">
                            <select
                              value={workspaceSelections[source] || ''}
                              onChange={(e) => handleWorkspaceChange(source, e.target.value)}
                              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none"
                      required
                            >
                              <option value="" disabled>Select Workspace</option>
                              {mockData[source].workspaces.map(workspace => (
                                <option key={workspace.id} value={workspace.id}>
                                  {workspace.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
                          </div>
                  </div>
                        
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project
                    </label>
                          <div className="relative">
                            <select
                              value={projectSelections[source] || ''}
                              onChange={(e) => handleProjectChange(source, e.target.value)}
                              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none"
                              disabled={!workspaceSelections[source]}
                      required
                            >
                              <option value="" disabled>
                                {workspaceSelections[source] ? 'Select Project' : 'Select Workspace First'}
                              </option>
                              {workspaceSelections[source] && mockData[source].projects[workspaceSelections[source]]?.map(project => (
                                <option key={project.id} value={project.id}>
                                  {project.name} ({project.id})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
                  </div>
                </div>
                </div>
            </div>
                  ))}
                  
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!isFormComplete()}
                      className={`px-8 py-3 rounded-full font-medium text-white shadow-lg flex items-center ${
                        isFormComplete()
                          ? 'bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 hover:from-yellow-600 hover:via-red-600 hover:to-purple-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Start Analysis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.button>
                  </div>
                  
                  <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-400 mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      CrashInsight AI Configuration Summary
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <div className="space-y-3">
                        {selectedSources.map(source => {
                          const workspace = workspaceSelections[source] 
                            ? mockData[source].workspaces.find(ws => ws.id === workspaceSelections[source])?.name
                            : 'Not selected';
                            
                          const project = (workspaceSelections[source] && projectSelections[source])
                            ? mockData[source].projects[workspaceSelections[source]]?.find(
                                proj => proj.id === projectSelections[source]
                              )?.name
                            : 'Not selected';
                            
                          return (
                            <div key={source} className="flex flex-col p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                              <span className="font-medium flex items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                  source === 'Rally' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                  source === 'Jira' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  {source === 'Rally' ? <GitPullRequest className="h-3 w-3" /> :
                                   source === 'Jira' ? <Server className="h-3 w-3" /> :
                                   <Database className="h-3 w-3" />}
            </div>
                                {source}
                              </span>
                              <span className="ml-7 text-gray-600 dark:text-gray-400">Workspace: <span className="text-gray-800 dark:text-gray-200">{workspace}</span></span>
                              <span className="ml-7 text-gray-600 dark:text-gray-400">Project: <span className="text-gray-800 dark:text-gray-200">{project}</span></span>
          </div>
        );
                        })}
            </div>
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <p>Date range selection is available in each analysis tab.</p>
              </div>
            </div>
          </div>
                </form>
              </motion.div>
            )}
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {renderStep()}
        
        <motion.div 
          className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>CrashInsight AI &copy; {new Date().getFullYear()} | Intelligent Crash Analysis Platform</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AILanding; 