import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  BrainCircuit, 
  Bug, 
  AlertOctagon, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  TrendingUp,
  ChartBar,
  Calendar,
  Clock,
  Target,
  Activity,
  LineChart,
  BarChart,
  PieChart,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { loadFailuresData, getRecentFailures, calculateMetrics } from '../services/failureService';
import { parseCSVString } from '../utils/csvUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RootCauseAnalysis = () => {
  const [metrics, setMetrics] = useState({
    totalDefects: { value: 0, label: 'Total Defects', description: 'All reported issues across systems' },
    majorIssues: { value: 0, label: 'Major Issues', description: 'High priority and severity issues' },
    serviceNowIncidents: { value: 0, label: 'ServiceNow Incidents', description: 'Incidents reported in ServiceNow' },
    criticalBugs: { value: 0, label: 'Critical Bugs', description: 'Critical severity defects' }
  });

  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Load and calculate metrics
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch('/data/failures.csv');
        const csvText = await response.text();
        const failuresData = parseCSVString(csvText);
        
        if (failuresData && failuresData.length > 0) {
          const recentFailures = getRecentFailures(failuresData, { days: 30 });
          const calculatedMetrics = calculateMetrics(recentFailures);
          
          setMetrics({
            totalDefects: {
              value: calculatedMetrics.totalDefects || 0,
              label: 'Total Defects',
              description: 'All reported issues across systems'
            },
            majorIssues: {
              value: calculatedMetrics.majorIssues || 0,
              label: 'Major Issues',
              description: 'High priority and severity issues'
            },
            serviceNowIncidents: {
              value: calculatedMetrics.serviceNowIncidents || 0,
              label: 'ServiceNow Incidents',
              description: 'Incidents reported in ServiceNow'
            },
            criticalBugs: {
              value: calculatedMetrics.criticalBugs || 0,
              label: 'Critical Bugs',
              description: 'Critical severity defects'
            }
          });
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    };

    loadMetrics();
  }, []);

  const generateDetailedAnalysis = (metric) => {
    // Base structure for analysis
    const analysis = {
      summary: {
        trend: 'Increasing',
        change: '+15%',
        impactLevel: 'High'
      },
      distribution: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: []
        }]
      },
      timeline: {
        labels: generateTimelineLabels(),
        datasets: [{
          label: metric,
          data: generateTimelineData(),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      rootCauses: [],
      recommendations: [],
      riskAssessment: {
        level: 'High',
        factors: []
      }
    };

    // Customize analysis based on metric
    switch (metric.toLowerCase()) {
      case 'major issues':
        analysis.summary = {
          trend: 'Increasing',
          change: '+8%',
          impactLevel: 'High'
        };
        analysis.distribution = {
          labels: ['Performance', 'Security', 'Functionality', 'Data Integrity', 'Compliance'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              'rgba(239, 68, 68, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(139, 92, 246, 0.7)'
            ]
          }]
        };
        analysis.rootCauses = [
          'Performance bottlenecks in critical workflows',
          'Security vulnerabilities in authentication',
          'Data processing inefficiencies'
        ];
        analysis.recommendations = [
          'Implement performance optimization plan',
          'Conduct security audit and penetration testing',
          'Optimize database queries and caching'
        ];
        analysis.riskAssessment.factors = [
          'Customer satisfaction impact',
          'Revenue loss potential',
          'Compliance risks'
        ];
        break;

      case 'servicenow incidents':
        analysis.summary = {
          trend: 'Decreasing',
          change: '-12%',
          impactLevel: 'Medium'
        };
        analysis.distribution = {
          labels: ['System Outages', 'Access Issues', 'Network', 'Application', 'Infrastructure'],
          datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
              'rgba(239, 68, 68, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(139, 92, 246, 0.7)'
            ]
          }]
        };
        analysis.rootCauses = [
          'Infrastructure capacity limitations',
          'Authentication service disruptions',
          'Network connectivity issues'
        ];
        analysis.recommendations = [
          'Implement automated monitoring and alerts',
          'Enhance network resilience and redundancy',
          'Upgrade infrastructure capacity'
        ];
        analysis.riskAssessment.factors = [
          'System availability',
          'Business continuity',
          'Service level agreements'
        ];
        break;

      case 'critical bugs':
        analysis.summary = {
          trend: 'Increasing',
          change: '+25%',
          impactLevel: 'Critical'
        };
        analysis.distribution = {
          labels: ['Security', 'Data Loss', 'System Crash', 'Performance', 'Authentication'],
          datasets: [{
            data: [40, 25, 15, 12, 8],
            backgroundColor: [
              'rgba(239, 68, 68, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(139, 92, 246, 0.7)'
            ]
          }]
        };
        analysis.rootCauses = [
          'Security vulnerabilities in core modules',
          'Data corruption during processing',
          'Memory leaks in critical components'
        ];
        analysis.recommendations = [
          'Immediate security patches deployment',
          'Implement data integrity checks',
          'Memory management optimization'
        ];
        analysis.riskAssessment.factors = [
          'Data security',
          'Customer trust',
          'Regulatory compliance'
        ];
        break;

      default:
        analysis.distribution = {
          labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
          datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
              'rgba(239, 68, 68, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(139, 92, 246, 0.7)'
            ]
          }]
        };
    }

    return analysis;
  };

  // Helper function to generate timeline labels
  const generateTimelineLabels = () => {
    const labels = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
  };

  // Helper function to generate timeline data
  const generateTimelineData = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 10);
  };

  const handleMetricSelect = (type) => {
    setSelectedMetric(type);
    setAnalysis(generateDetailedAnalysis(type));
  };

  const MetricCard = ({ id, title, value, type, icon: Icon, trend, color, isSelected }) => (
    <motion.button
      layoutId={`card-${id}`}
      onClick={() => handleMetricSelect(type)}
      className={`w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-200 p-6 ${
        isSelected 
          ? 'border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50' 
          : 'border-gray-200 dark:border-gray-700 hover:border-yellow-500'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className={trend === 'up' ? 'text-red-500' : 'text-green-500'}>
            {trend === 'up' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </motion.button>
  );

  const AnalysisSection = ({ title, children, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center mb-4">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 mr-3">
          <Icon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  // Add these chart option constants
  const distributionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Failure Distribution by Category'
      }
    },
  };

  const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historical Data and Predictions'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Failures'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time Period'
        }
      }
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <BrainCircuit className="h-6 w-6 mr-2 text-yellow-500" />
            AI-Powered Root Cause Analysis
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a metric for detailed AI analysis and predictive insights
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          id="defects"
          title="Total Defects"
          value={metrics.totalDefects.value}
          type="totalDefects"
          icon={Bug}
          trend="down"
          color="bg-blue-500"
          isSelected={selectedMetric === 'totalDefects'}
        />
        <MetricCard
          id="major"
          title="Major Issues"
          value={metrics.majorIssues.value}
          type="majorIssues"
          icon={AlertTriangle}
          trend="up"
          color="bg-yellow-500"
          isSelected={selectedMetric === 'majorIssues'}
        />
        <MetricCard
          id="incidents"
          title="ServiceNow Incidents"
          value={metrics.serviceNowIncidents.value}
          type="serviceNowIncidents"
          icon={AlertOctagon}
          trend="down"
          color="bg-purple-500"
          isSelected={selectedMetric === 'serviceNowIncidents'}
        />
        <MetricCard
          id="critical"
          title="Critical Bugs"
          value={metrics.criticalBugs.value}
          type="criticalBugs"
          icon={Zap}
          trend="up"
          color="bg-red-500"
          isSelected={selectedMetric === 'criticalBugs'}
        />
      </div>

      {/* Analysis Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Analyzing data with AI...</p>
          </motion.div>
        ) : analysis ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Summary Section */}
            <AnalysisSection title="Analysis Summary" icon={BrainCircuit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Current</span>
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.summary.trend}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Change</span>
                    {analysis.summary.change}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.summary.impactLevel}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Forecast</span>
                    <Target className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.forecast.nextMonth}
                  </div>
                </div>
              </div>
            </AnalysisSection>

            {/* Distribution Chart */}
            <AnalysisSection title="Distribution Analysis" icon={PieChart}>
              <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <Pie
                  data={{
                    labels: analysis.distribution.labels,
                    datasets: analysis.distribution.datasets,
                  }}
                  options={distributionChartOptions}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {analysis.distribution.labels.map((category, index) => (
                  <div key={category} className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {category}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {analysis.distribution.datasets[0].data[index]}%
                    </div>
                  </div>
                ))}
              </div>
            </AnalysisSection>

            {/* Root Causes */}
            <AnalysisSection title="Root Cause Analysis" icon={Activity}>
              <div className="space-y-4">
                {analysis.rootCauses.map((cause, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{cause}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnalysisSection>

            {/* Forecast & Predictions */}
            <AnalysisSection title="AI Predictions & Forecast" icon={LineChart}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <Line
                      data={{
                        labels: analysis.timeline.labels,
                        datasets: analysis.timeline.datasets,
                      }}
                      options={timelineChartOptions}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-900/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">
                        Confidence Score
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {analysis.forecast.confidence}%
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200 dark:bg-green-900">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.forecast.confidence}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-green-500 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Contributing Factors
                    </h4>
                    <ul className="space-y-2">
                      {analysis.forecast.factors.map((factor, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnalysisSection>

            {/* Recommendations */}
            <AnalysisSection title="AI Recommendations" icon={Sparkles}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-900/30">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{rec}</h4>
                  </div>
                ))}
              </div>
            </AnalysisSection>

            {/* Risk Assessment */}
            <AnalysisSection title="Risk Assessment" icon={AlertCircle}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`md:col-span-1 rounded-lg p-4 ${
                  analysis.riskAssessment.level === 'High' ? 'bg-red-50 dark:bg-red-900/20' :
                  analysis.riskAssessment.level === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                  'bg-green-50 dark:bg-green-900/20'
                }`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Risk</div>
                    <div className={`text-2xl font-bold ${
                      analysis.riskAssessment.level === 'High' ? 'text-red-600 dark:text-red-400' :
                      analysis.riskAssessment.level === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {analysis.riskAssessment.level}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.riskAssessment.factors.map((factor, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{factor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnalysisSection>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
          >
            <BrainCircuit className="h-12 w-12 mb-4 text-yellow-500" />
            <p>Select a metric above for detailed AI analysis</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RootCauseAnalysis; 