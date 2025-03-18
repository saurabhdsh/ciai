import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  Moon, 
  Sun, 
  ChevronDown, 
  Settings, 
  Database, 
  Filter,
  Home,
  LogOut,
  Zap,
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  ServerCrash
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/failure-trends', icon: Home },
  { name: 'Failure Trends', href: '/failure-trends', icon: TrendingUp },
  { name: 'ServiceNow Trends', href: '/servicenow-trends', icon: ServerCrash }
];

function Layout({ children, toggleDarkMode, darkMode, onLogout, userInfo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dataSourcesOpen, setDataSourcesOpen] = useState(false);
  const [quickAnalysisOpen, setQuickAnalysisOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock data sources - in a real app, this would come from context or state
  const dataSources = [
    { id: 1, name: 'Rally', connected: true },
    { id: 2, name: 'Jira', connected: true },
    { id: 3, name: 'ServiceNow', connected: false }
  ];

  // Mock metrics data - in a real app, this would come from your data service
  const quickMetrics = {
    totalIncidents: 156,
    criticalIncidents: 23,
    resolvedToday: 12,
    avgResolutionTime: "4.5 hours",
    trend: "down",
    changePercent: 8.3
  };

  // Animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: "-100%",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    onLogout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      {/* Header with modern navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="ml-2 text-base font-semibold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-yellow-400 dark:to-yellow-500">ImpactFix AI</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center ${
                      isActive 
                        ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <item.icon className={`mr-1 h-3.5 w-3.5 ${isActive ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              {/* Data Sources Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-200"
                  onClick={() => setDataSourcesOpen(!dataSourcesOpen)}
                >
                  <Database className="mr-1 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  Data Sources
                  <ChevronDown className="ml-1 h-3 w-3 text-gray-500 dark:text-gray-400" />
                </button>
                
                <AnimatePresence>
                  {dataSourcesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      onBlur={() => setDataSourcesOpen(false)}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Connected Sources
                        </div>
                        {dataSources.map(source => (
                          <div 
                            key={source.id}
                            className="px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{source.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              source.connected 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {source.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setDataSourcesOpen(false);
                              navigate('/');
                            }}
                          >
                            Manage Data Sources
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Quick Analysis Button */}
              <div className="relative">
                <button
                  className="flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-200"
                  onClick={() => setQuickAnalysisOpen(!quickAnalysisOpen)}
                >
                  <Activity className="mr-1 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  Quick Analysis
                  <ChevronDown className="ml-1 h-3 w-3 text-gray-500 dark:text-gray-400" />
                </button>
                
                <AnimatePresence>
                  {quickAnalysisOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <LineChart className="h-4 w-4 mr-1.5 text-yellow-500" />
                          Today's Overview
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                              <div className="text-xs text-gray-500 dark:text-gray-400">Total Incidents</div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">{quickMetrics.totalIncidents}</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                              <div className="text-xs text-red-600 dark:text-red-400">Critical</div>
                              <div className="text-lg font-semibold text-red-700 dark:text-red-300">{quickMetrics.criticalIncidents}</div>
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs text-green-600 dark:text-green-400">Resolved Today</div>
                                <div className="text-lg font-semibold text-green-700 dark:text-green-300">{quickMetrics.resolvedToday}</div>
                              </div>
                              <div className="flex items-center text-sm">
                                {quickMetrics.trend === 'down' ? (
                                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`ml-1 ${quickMetrics.trend === 'down' ? 'text-green-500' : 'text-red-500'}`}>
                                  {quickMetrics.changePercent}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <div className="text-xs text-blue-600 dark:text-blue-400">Avg. Resolution Time</div>
                            <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">{quickMetrics.avgResolutionTime}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Theme Toggle */}
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-200"
                onClick={toggleDarkMode}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-700" />
                )}
              </button>
              
              {/* User Menu */}
              <div className="relative ml-2">
                <button
                  className="flex items-center"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-medium text-xs">
                    {userInfo?.initials}
                  </div>
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      onBlur={() => setUserMenuOpen(false)}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{userInfo?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo?.email}</p>
                        </div>
                        <a
                          href="#settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          role="menuitem"
                        >
                          <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          Settings
                        </a>
                        <a
                          href="#"
                          onClick={handleSignOut}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          role="menuitem"
                        >
                          <LogOut className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          Sign out
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="ml-2 font-semibold text-base whitespace-nowrap text-gray-900 dark:text-white">ImpactFix AI</span>
                </div>
                <button
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          isActive 
                            ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data Sources
                  </div>
                  {dataSources.map(source => (
                    <div 
                      key={source.id}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-300">{source.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        source.connected 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {source.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  ))}
                  <button
                    className="mt-2 w-full flex items-center px-3 py-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Manage Data Sources
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout; 