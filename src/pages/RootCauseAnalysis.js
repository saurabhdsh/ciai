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
    totalDefects: 0,
    majorIssues: 0,
    serviceNowIncidents: 0,
    criticalBugs: 0
  });

  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Load and calculate metrics
  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const failuresData = await loadFailuresData();
      if (failuresData) {
        const recentFailures = getRecentFailures(failuresData, { days: 30 });
        const calculatedMetrics = calculateMetrics(recentFailures);
        
        setMetrics({
          totalDefects: calculatedMetrics.totalDefects || 245,
          majorIssues: calculatedMetrics.majorIssues || 78,
          serviceNowIncidents: calculatedMetrics.serviceNowIncidents || 156,
          criticalBugs: calculatedMetrics.criticalBugs || 32
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
      setMetrics({
        totalDefects: 245,
        majorIssues: 78,
        serviceNowIncidents: 156,
        criticalBugs: 32
      });
    }
  };

  const generateDetailedAnalysis = (type) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const analyses = {
        totalDefects: {
          title: "Total Defects Analysis",
          summary: {
            trend: "Decreasing",
            percentageChange: "-12%",
            impactLevel: "Medium"
          },
          distribution: {
            categories: ["UI/UX", "Backend", "Integration", "Database", "Security"],
            values: [35, 25, 20, 15, 5]
          },
          rootCauses: [
            { cause: "Input Validation", percentage: 35, impact: "High", trend: "decreasing" },
            { cause: "Error Handling", percentage: 25, impact: "Medium", trend: "stable" },
            { cause: "Configuration Issues", percentage: 20, impact: "Medium", trend: "decreasing" },
            { cause: "Database Queries", percentage: 20, impact: "High", trend: "improving" }
          ],
          forecast: {
            nextMonth: 225,
            confidence: 85,
            trend: "improving",
            factors: [
              "Recent implementation of automated testing",
              "Enhanced code review process",
              "Developer training program effectiveness"
            ]
          },
          recommendations: [
            {
              title: "Expand Test Coverage",
              description: "Increase unit test coverage to 85% across all modules",
              impact: "High",
              effort: "Medium",
              timeframe: "4 weeks"
            },
            {
              title: "Code Quality Gates",
              description: "Implement stricter quality gates in CI/CD pipeline",
              impact: "High",
              effort: "Low",
              timeframe: "2 weeks"
            },
            {
              title: "Documentation Update",
              description: "Refresh technical documentation and API specs",
              impact: "Medium",
              effort: "Medium",
              timeframe: "3 weeks"
            }
          ],
          timeline: {
            past: [
              { month: "Jan", value: 289 },
              { month: "Feb", value: 278 },
              { month: "Mar", value: 245 }
            ],
            forecast: [
              { month: "Apr", value: 225 },
              { month: "May", value: 210 },
              { month: "Jun", value: 200 }
            ]
          },
          riskAssessment: {
            overall: "Medium",
            factors: [
              { name: "Code Quality", level: "Medium" },
              { name: "Testing Coverage", level: "Improving" },
              { name: "Technical Debt", level: "Medium" }
            ]
          }
        },
        majorIssues: {
          title: "Major Issues Analysis",
          summary: {
            trend: "Critical Attention",
            percentageChange: "+28%",
            impactLevel: "High"
          },
          distribution: {
            categories: ["System Outages", "Data Loss", "Performance", "Security", "Integration"],
            values: [35, 25, 20, 15, 5]
          },
          rootCauses: [
            { cause: "Infrastructure Scaling", percentage: 35, impact: "Critical", trend: "increasing" },
            { cause: "Database Performance", percentage: 25, impact: "High", trend: "increasing" },
            { cause: "Memory Leaks", percentage: 20, impact: "High", trend: "stable" },
            { cause: "API Timeouts", percentage: 20, impact: "High", trend: "increasing" }
          ],
          forecast: {
            nextMonth: 98,
            confidence: 92,
            trend: "requires immediate action",
            factors: [
              "Increasing user load on systems",
              "Database scaling limitations",
              "Memory management issues"
            ]
          },
          recommendations: [
            {
              title: "Infrastructure Scale-Up",
              description: "Implement auto-scaling for critical services",
              impact: "Critical",
              effort: "High",
              timeframe: "1 week"
            },
            {
              title: "Database Optimization",
              description: "Optimize high-impact database queries and implement caching",
              impact: "High",
              effort: "High",
              timeframe: "2 weeks"
            },
            {
              title: "Memory Profiling",
              description: "Conduct thorough memory profiling and optimization",
              impact: "High",
              effort: "Medium",
              timeframe: "1 week"
            }
          ],
          timeline: {
            past: [
              { month: "Jan", value: 65 },
              { month: "Feb", value: 82 },
              { month: "Mar", value: 91 }
            ],
            forecast: [
              { month: "Apr", value: 98 },
              { month: "May", value: 105 },
              { month: "Jun", value: 112 }
            ]
          },
          riskAssessment: {
            overall: "Critical",
            factors: [
              { name: "System Stability", level: "Critical" },
              { name: "Performance Impact", level: "High" },
              { name: "Business Continuity", level: "High" }
            ]
          }
        },
        serviceNowIncidents: {
          title: "ServiceNow Incidents Analysis",
          summary: {
            trend: "Needs Attention",
            percentageChange: "+15%",
            impactLevel: "Medium"
          },
          distribution: {
            categories: ["Access Management", "Network", "Hardware", "Software", "Security"],
            values: [30, 25, 20, 15, 10]
          },
          rootCauses: [
            { cause: "Access Control Issues", percentage: 30, impact: "Medium", trend: "increasing" },
            { cause: "Network Latency", percentage: 25, impact: "High", trend: "stable" },
            { cause: "Hardware Failures", percentage: 20, impact: "Medium", trend: "stable" },
            { cause: "Software Updates", percentage: 15, impact: "Low", trend: "decreasing" }
          ],
          forecast: {
            nextMonth: 165,
            confidence: 88,
            trend: "stabilizing",
            factors: [
              "New access management system rollout",
              "Network infrastructure upgrades",
              "Preventive maintenance schedule"
            ]
          },
          recommendations: [
            {
              title: "Access Management Automation",
              description: "Implement automated access provisioning system",
              impact: "High",
              effort: "Medium",
              timeframe: "3 weeks"
            },
            {
              title: "Network Monitoring",
              description: "Deploy advanced network monitoring tools",
              impact: "Medium",
              effort: "Low",
              timeframe: "2 weeks"
            },
            {
              title: "Hardware Refresh",
              description: "Accelerate hardware replacement program",
              impact: "Medium",
              effort: "High",
              timeframe: "6 weeks"
            }
          ],
          timeline: {
            past: [
              { month: "Jan", value: 142 },
              { month: "Feb", value: 156 },
              { month: "Mar", value: 160 }
            ],
            forecast: [
              { month: "Apr", value: 165 },
              { month: "May", value: 168 },
              { month: "Jun", value: 170 }
            ]
          },
          riskAssessment: {
            overall: "Medium",
            factors: [
              { name: "Service Availability", level: "Medium" },
              { name: "User Productivity", level: "Medium" },
              { name: "Resource Utilization", level: "High" }
            ]
          }
        },
        criticalBugs: {
          title: "Critical Bugs Analysis",
          summary: {
            trend: "Severe Alert",
            percentageChange: "+45%",
            impactLevel: "Critical"
          },
          distribution: {
            categories: ["Data Corruption", "Security Breach", "Payment Processing", "User Authentication", "Core Services"],
            values: [35, 30, 20, 10, 5]
          },
          rootCauses: [
            { cause: "Data Integrity Violations", percentage: 35, impact: "Critical", trend: "increasing" },
            { cause: "Security Vulnerabilities", percentage: 30, impact: "Critical", trend: "increasing" },
            { cause: "Payment Gateway Failures", percentage: 20, impact: "Critical", trend: "stable" },
            { cause: "Authentication Bypass", percentage: 15, impact: "Critical", trend: "increasing" }
          ],
          forecast: {
            nextMonth: 52,
            confidence: 95,
            trend: "severe escalation",
            factors: [
              "Recent security breaches",
              "Legacy system vulnerabilities",
              "Third-party integration issues"
            ]
          },
          recommendations: [
            {
              title: "Emergency Security Audit",
              description: "Conduct immediate security vulnerability assessment",
              impact: "Critical",
              effort: "High",
              timeframe: "48 hours"
            },
            {
              title: "Data Integrity Checks",
              description: "Implement real-time data validation and monitoring",
              impact: "Critical",
              effort: "High",
              timeframe: "72 hours"
            },
            {
              title: "Payment System Upgrade",
              description: "Upgrade payment processing infrastructure",
              impact: "Critical",
              effort: "Critical",
              timeframe: "1 week"
            }
          ],
          timeline: {
            past: [
              { month: "Jan", value: 28 },
              { month: "Feb", value: 35 },
              { month: "Mar", value: 45 }
            ],
            forecast: [
              { month: "Apr", value: 52 },
              { month: "May", value: 58 },
              { month: "Jun", value: 63 }
            ]
          },
          riskAssessment: {
            overall: "Severe",
            factors: [
              { name: "Data Security", level: "Critical" },
              { name: "Financial Impact", level: "Severe" },
              { name: "Reputation Risk", level: "Critical" }
            ]
          }
        }
      };

      setAnalysis(analyses[type]);
      setIsLoading(false);
    }, 1500);
  };

  const handleMetricSelect = (type) => {
    setSelectedMetric(type);
    generateDetailedAnalysis(type);
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
          value={metrics.totalDefects}
          type="totalDefects"
          icon={Bug}
          trend="down"
          color="bg-blue-500"
          isSelected={selectedMetric === 'totalDefects'}
        />
        <MetricCard
          id="major"
          title="Major Issues"
          value={metrics.majorIssues}
          type="majorIssues"
          icon={AlertTriangle}
          trend="up"
          color="bg-yellow-500"
          isSelected={selectedMetric === 'majorIssues'}
        />
        <MetricCard
          id="incidents"
          title="ServiceNow Incidents"
          value={metrics.serviceNowIncidents}
          type="serviceNowIncidents"
          icon={AlertOctagon}
          trend="down"
          color="bg-purple-500"
          isSelected={selectedMetric === 'serviceNowIncidents'}
        />
        <MetricCard
          id="critical"
          title="Critical Bugs"
          value={metrics.criticalBugs}
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
                    {analysis.summary.percentageChange}
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
                    labels: analysis.distribution.categories,
                    datasets: [
                      {
                        data: analysis.distribution.values,
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)', // Blue
                          'rgba(16, 185, 129, 0.8)', // Green
                          'rgba(245, 158, 11, 0.8)', // Yellow
                          'rgba(239, 68, 68, 0.8)',  // Red
                          'rgba(139, 92, 246, 0.8)', // Purple
                        ],
                        borderColor: [
                          'rgba(59, 130, 246, 1)',
                          'rgba(16, 185, 129, 1)',
                          'rgba(245, 158, 11, 1)',
                          'rgba(239, 68, 68, 1)',
                          'rgba(139, 92, 246, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={distributionChartOptions}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {analysis.distribution.categories.map((category, index) => (
                  <div key={category} className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {category}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {analysis.distribution.values[index]}%
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
                        <span className="font-medium text-gray-900 dark:text-white">{cause.cause}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          cause.impact === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {cause.impact}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        cause.trend === 'increasing' ? 'text-red-500' :
                        cause.trend === 'decreasing' ? 'text-green-500' :
                        'text-gray-500'
                      }`}>
                        {cause.trend === 'increasing' ? <ArrowUpRight className="h-4 w-4" /> :
                         cause.trend === 'decreasing' ? <ArrowDownRight className="h-4 w-4" /> :
                         <Activity className="h-4 w-4" />}
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cause.percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-yellow-500 rounded"
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {cause.percentage}% of cases
                      </span>
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
                        labels: [
                          ...analysis.timeline.past.map(item => item.month),
                          ...analysis.timeline.forecast.map(item => item.month)
                        ],
                        datasets: [
                          {
                            label: 'Historical Data',
                            data: analysis.timeline.past.map(item => item.value),
                            borderColor: 'rgba(59, 130, 246, 1)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                          },
                          {
                            label: 'Forecast',
                            data: [
                              ...Array(analysis.timeline.past.length).fill(null),
                              ...analysis.timeline.forecast.map(item => item.value)
                            ],
                            borderColor: 'rgba(245, 158, 11, 1)',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderDash: [5, 5],
                            fill: true,
                            tension: 0.4,
                          }
                        ],
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
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{rec.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.impact === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        Impact: {rec.impact}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{rec.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AnalysisSection>

            {/* Risk Assessment */}
            <AnalysisSection title="Risk Assessment" icon={AlertCircle}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`md:col-span-1 rounded-lg p-4 ${
                  analysis.riskAssessment.overall === 'High' ? 'bg-red-50 dark:bg-red-900/20' :
                  analysis.riskAssessment.overall === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                  'bg-green-50 dark:bg-green-900/20'
                }`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Risk</div>
                    <div className={`text-2xl font-bold ${
                      analysis.riskAssessment.overall === 'High' ? 'text-red-600 dark:text-red-400' :
                      analysis.riskAssessment.overall === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {analysis.riskAssessment.overall}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.riskAssessment.factors.map((factor, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{factor.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          factor.level === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          factor.level === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {factor.level}
                        </span>
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