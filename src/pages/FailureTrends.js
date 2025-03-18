import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  BarChart2, 
  PieChart, 
  Activity,
  AlertCircle,
  CheckCircle,
  Database,
  FileText,
  Users,
  Zap,
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { 
  Gauge, 
  ChartsTooltip, 
  ChartContainer,
  ScatterChart
} from '@mui/x-charts';

import ChartComponent from '../components/ChartComponent';
import DashboardCard from '../components/DashboardCard';
import DashboardHeader from '../components/DashboardHeader';
import DataSourceSelector from '../components/DataSourceSelector';
import AIAnalysisButton from '../components/AIAnalysisButton';
import AIAnalysisModal from '../components/AIAnalysisModal';
import AIFloatingButton from '../components/AIFloatingButton';
import MetricCard from '../components/MetricCard';

import { 
  parseCSVString, 
  fetchCSVData, 
  analyzeFailureTrends, 
  analyzeDefectTypes, 
  analyzeDefectStatus, 
  analyzeFailuresByLOB, 
  analyzeSeverityDistribution,
  analyzePriorityDistribution,
  getSourceStats,
  getSummaryStats
} from '../services/csvService';
import { 
  loadFailuresData,
  calculateFailureTrendMetrics,
  calculateSeverityBySource,
  calculatePriorityBySource,
  getSourceMetrics,
  getRecentFailures
} from '../services/failureService';

// Animation variants
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

const FailureTrendsChart = ({ data }) => {
  if (!data || !data.datasets || !data.labels) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">No failure trend data available</p>
      </div>
    );
  }

  // Get color based on severity
  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': 'bg-red-600',
      'High': 'bg-orange-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-blue-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Month labels */}
          <div className="flex text-sm text-gray-600 dark:text-gray-400 mb-6 pl-24">
            {Array.from(new Set(data.labels.map(date => {
              const [month] = date.split(' ');
              return month;
            }))).map((month, i) => (
              <div key={i} className="flex-1 text-center">{month}</div>
            ))}
          </div>
          
          {/* Failure dots grid */}
          {data.datasets.map((dataset, datasetIndex) => (
            <div key={datasetIndex} className="mb-8">
              {/* Severity label */}
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dataset.label.split(' ')[0]}
                </div>
                {/* Dots */}
                <div className="flex flex-1">
                  {dataset.data.map((value, index) => (
                    <div key={index} className="flex-1 flex items-center justify-center">
                      {Array.from({ length: value }).map((_, dotIndex) => (
                        <div
                          key={dotIndex}
                          className={`w-2 h-2 mx-0.5 rounded-full ${getSeverityColor(dataset.label.split(' ')[0])}`}
                          title={`${dataset.label}: ${value} failures on ${data.labels[index]}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-8">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Total Failures: {data.datasets.reduce((sum, dataset) => 
          sum + dataset.data.reduce((a, b) => a + b, 0), 0
        )}
      </div>
    </div>
  );
};

function FailureTrends({ darkMode }) {
  const location = useLocation();
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [defectTypeData, setDefectTypeData] = useState(null);
  const [defectStatusData, setDefectStatusData] = useState(null);
  const [lobData, setLobData] = useState(null);
  const [severityData, setSeverityData] = useState({});
  const [priorityData, setPriorityData] = useState({});
  const [recentFailures, setRecentFailures] = useState([]);
  const [aiInsights, setAIInsights] = useState([]);
  const [sourceStats, setSourceStats] = useState([]);
  const [selectedSources, setSelectedSources] = useState(['rally', 'jira', 'servicenow']);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  });
  const [stats, setStats] = useState({
    totalFailures: 0,
    criticalFailures: 0,
    resolvedFailures: 0,
    avgResolutionTime: 0
  });
  const [sourceConfigurations] = useState([
    { source: 'Rally', workspaceName: 'Enterprise', projectName: 'Banking Platform' },
    { source: 'Jira', workspaceName: 'Finance Team', projectName: 'Payment Processing' },
    { source: 'ServiceNow', workspaceName: 'IT Operations', projectName: 'Insurance Claims' }
  ]);

  // Add state for AI Analysis Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalTitle, setAiModalTitle] = useState('');
  const [aiModalData, setAiModalData] = useState(null);
  const [aiModalChartType, setAiModalChartType] = useState('');

  // Add debugging useEffect
  useEffect(() => {
    if (csvData) {
      console.log('CSV data loaded in component:', csvData.length, 'records');
      if (csvData.length > 0) {
        console.log('First record:', csvData[0]);
        console.log('Available fields:', Object.keys(csvData[0]));
      }
    }
  }, [csvData]);
  
  // Update the trend data debugging useEffect
  useEffect(() => {
    console.log('Trend data updated:', trendData);
    
    // If trend data is null after analysis, create empty chart data
    if (!trendData && !loading) {
      console.log('Setting empty trend data as fallback');
      setTrendData({
        labels: [],
        datasets: [{
        label: 'Failures',
          data: [],
          borderColor: 'rgba(59, 130, 246, 0.8)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 2,
        tension: 0.4,
        fill: true,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      });
    }
  }, [trendData, loading]);

  // Update the useEffect for data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get the base URL for the current environment
        const baseUrl = process.env.PUBLIC_URL || '';
        
        // Try to fetch the data with different possible paths
        let response;
        const possiblePaths = [
          `${baseUrl}/data/failures.csv`,
          '/data/failures.csv',
          './data/failures.csv',
          '/ReactFailure/data/failures.csv'
        ];

        for (const path of possiblePaths) {
          try {
            console.log('Trying to fetch from:', path);
            response = await fetch(path);
            if (response.ok) {
              console.log('Successfully fetched from:', path);
              break;
            }
          } catch (err) {
            console.log('Failed to fetch from:', path);
          }
        }

        if (!response || !response.ok) {
          throw new Error('Failed to fetch data from all possible paths');
        }

        const csvText = await response.text();
        console.log('CSV data length:', csvText.length);
        
        const failuresData = parseCSVString(csvText);
        
        if (failuresData && failuresData.length > 0) {
          console.log('Successfully parsed CSV data:', failuresData.length, 'records');
          console.log('Sample record:', failuresData[0]);
          
          // Set the CSV data first
          setCsvData(failuresData);
          
          // Prepare and set trend data first
          const trendChartData = analyzeFailureTrends(failuresData);
          console.log('Setting trend data:', trendChartData);
          setTrendData(trendChartData);

          // Update recent failures
          const recentFailuresData = getRecentFailures(failuresData, 10);
          console.log('Recent failures:', recentFailuresData.length);
          setRecentFailures(recentFailuresData);

          // Calculate basic stats
          const totalFailures = failuresData.length;
          const criticalFailures = failuresData.filter(f => 
            (f.Severity || '').toLowerCase() === 'critical'
          ).length;
          const resolvedFailures = failuresData.filter(f => 
            (f.Status || '').toLowerCase() === 'resolved'
          ).length;
          
          // Calculate average resolution time
          const resolvedWithDates = failuresData.filter(f => 
            (f.Status || '').toLowerCase() === 'resolved' && 
            f.Date && 
            f['Resolved Date']
          );
          
          let avgResolutionTime = 0;
          if (resolvedWithDates.length > 0) {
            const totalDays = resolvedWithDates.reduce((sum, f) => {
              const start = new Date(f.Date);
              const end = new Date(f['Resolved Date']);
              return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            }, 0);
            avgResolutionTime = Math.round(totalDays / resolvedWithDates.length);
          }

          // Update stats
          setStats({
            totalFailures,
            criticalFailures,
            resolvedFailures,
            avgResolutionTime
          });

          // Update other chart data
          const defectTypeChartData = analyzeDefectTypes(failuresData);
          setDefectTypeData(defectTypeChartData);

          const defectStatusChartData = analyzeDefectStatus(failuresData);
          setDefectStatusData(defectStatusChartData);

          const lobChartData = analyzeFailuresByLOB(failuresData);
          setLobData(lobChartData);

          const severityChartData = analyzeSeverityDistribution(failuresData);
          setSeverityData(severityChartData);

          const priorityChartData = analyzePriorityDistribution(failuresData);
          setPriorityData(priorityChartData);

          const sourceStatsData = getSourceStats(failuresData);
          setSourceStats(sourceStatsData);

          setError(null);
        } else {
          throw new Error('No valid data found in CSV');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Re-analyze data when selected sources change
  useEffect(() => {
    if (csvData) {
      analyzeData();
    }
  }, [selectedSources, dateRange]);

  const analyzeData = (data = csvData) => {
    if (!data) return;
    
    try {
      // Filter data by selected sources
      const filteredData = data.filter(item => {
        const itemSource = (item.source || item.Source || '').toLowerCase();
        return selectedSources.length === 0 || 
               selectedSources.some(source => itemSource.includes(source.toLowerCase()));
      });
      
      // Analyze failure trends over time
      const trends = analyzeFailureTrends(filteredData);
      setTrendData(trends);
      
      // Analyze defect types
      const defectTypes = analyzeDefectTypes(filteredData);
      setDefectTypeData(defectTypes);
        
        // Analyze defect status
      const defectStatus = analyzeDefectStatus(filteredData);
      setDefectStatusData(defectStatus);
        
        // Analyze failures by LOB
      const lobAnalysis = analyzeFailuresByLOB(filteredData);
      setLobData(lobAnalysis);
        
        // Analyze severity distribution
      const severityAnalysis = analyzeSeverityDistribution(filteredData);
      setSeverityData(severityAnalysis);
        
        // Analyze priority distribution
      const priorityAnalysis = analyzePriorityDistribution(filteredData);
      setPriorityData(priorityAnalysis);
      
      // Get recent failures
      const recent = getRecentFailures(filteredData, { limit: 5 });
      setRecentFailures(recent);
      
      // Get source-specific stats
      const sourceStatsData = getSourceStats(data);
      setSourceStats(sourceStatsData);
      
      // Calculate stats using the updated getSummaryStats function
      const summaryStats = getSummaryStats(filteredData);
        setStats(summaryStats);
        
    } catch (err) {
      console.error('Error analyzing data:', err);
      setError('Failed to analyze data. Please try again later.');
    }
  };

  const calculateStats = (data) => {
    if (!data || !Array.isArray(data)) return;
    
    try {
      // Filter data based on selected sources and date range
      const filteredData = data.filter(item => {
        const itemSource = (item.source || item.Source || '').toLowerCase();
        const matchesSource = selectedSources.some(source => 
          itemSource.includes(source.toLowerCase())
        );
        
        const itemDate = new Date(item.date || item.Date || item.executionDate || '');
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        
        return matchesSource && itemDate >= startDate && itemDate <= endDate;
      });
      
      // Use the getSummaryStats function to calculate statistics
      const summaryStats = getSummaryStats(filteredData);
      setStats(summaryStats);
    } catch (err) {
      console.error('Error calculating stats:', err);
    }
  };

  const handleDateRangeChange = (e) => {
    const days = e.target.value;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - parseInt(days));
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  const handleSourceChange = (source) => {
    setSelectedSources(prev => {
      const sourceId = source.toLowerCase();
      if (prev.includes(sourceId)) {
        return prev.filter(s => s !== sourceId);
        } else {
        return [...prev, sourceId];
      }
    });
  };

  // Handle data export
  const handleExport = () => {
    if (!csvData) return;
    
    // Filter data based on selected sources and date range
    const filteredData = csvData.filter(item => {
      const itemSource = (item.source || item.Source || '').toLowerCase();
      const itemDate = new Date(item.date || item.Date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      return (selectedSources.length === 0 || selectedSources.some(source => itemSource.includes(source.toLowerCase()))) &&
             itemDate >= startDate && itemDate <= endDate;
    });
    
    // Convert data to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `failure-data-${dateRange.start}-to-${dateRange.end}.csv`;
    link.click();
  };

  const getFormattedStats = () => {
    const { totalFailures, criticalFailures, resolvedFailures, avgResolutionTime } = stats;
    
    // Calculate percentages
    const criticalPercentage = totalFailures > 0 
      ? ((criticalFailures / totalFailures) * 100).toFixed(1) 
      : 0;
    
    const resolvedPercentage = totalFailures > 0 
      ? ((resolvedFailures / totalFailures) * 100).toFixed(1) 
      : 0;
    
    // Calculate trend for total failures (comparing to previous period)
    // In a real app, this would compare to previous time period
    const totalFailuresTrend = totalFailures > 100 ? 'up' : 'down';
    const totalFailuresChange = totalFailuresTrend === 'up' ? '+12.5%' : '-8.3%';
    
    return {
      totalFailures: {
        value: totalFailures,
        subtext: `${totalFailuresChange} from previous period`,
        label: 'Total Failures',
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'blue',
        trend: totalFailuresTrend
      },
      criticalFailures: {
        value: criticalFailures,
        subtext: `${criticalPercentage}% of total`,
        label: 'Critical Failures',
        icon: <AlertTriangle className="h-5 w-5" />,
        color: 'red',
        trend: criticalPercentage > 20 ? 'up' : 'down'
      },
      resolvedFailures: {
        value: resolvedFailures,
        subtext: `${resolvedPercentage}% of total`,
        label: 'Resolved Failures',
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'green',
        trend: resolvedPercentage > 50 ? 'up' : 'down'
      },
      avgResolutionTime: {
        value: avgResolutionTime,
        subtext: 'days on average',
        label: 'Resolution Time',
        icon: <Clock className="h-5 w-5" />,
        color: 'amber',
        trend: avgResolutionTime < 5 ? 'down' : 'up'
      }
    };
  };

  // Format the stats for display
  const formattedStats = getFormattedStats();

  // Function to open AI Analysis Modal
  const openAiAnalysisModal = (title, data, chartType) => {
    // Ensure we have valid data before opening the modal
    if (!data) {
      console.error('No data provided for AI analysis');
      return;
    }
    
    // For Failure Trends Over Time, ensure we have the right format
    if (title === 'Failure Trends Over Time' && chartType === 'line') {
      // Make sure we have a complete dataset with labels and data points
      if (!data.labels || !data.datasets || data.datasets.length === 0) {
        console.error('Invalid trend data format for AI analysis');
        return;
      }
      
      // Add additional context for better analysis
      const enhancedData = {
        ...data,
        dateRange: dateRange,
        selectedSources: selectedSources,
        // Add trend information
        trendInfo: data.datasets.map(dataset => {
          const values = dataset.data;
          const label = dataset.label;
          const lastValue = values[values.length - 1];
          const prevValue = values[values.length - 2] || 0;
          const trend = lastValue > prevValue ? 'increasing' : 'decreasing';
          const percentChange = prevValue ? Math.abs(Math.round((lastValue - prevValue) / prevValue * 100)) : 0;
          
          return {
            source: label,
            trend,
            percentChange,
            average: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
          };
        })
      };
      
      setAiModalData(enhancedData);
        } else {
      setAiModalData(data);
    }
    
    setAiModalTitle(title);
    setAiModalChartType(chartType);
    setAiModalOpen(true);
  };

  // Create a function to prepare recent failures data for AI analysis
  const prepareRecentFailuresData = (failures) => {
    return {
      labels: failures.map(f => f.title || f.id || 'Untitled'),
      datasets: [
        {
          label: 'Recent Failures',
          data: failures.map((_, index) => failures.length - index), // Just for visualization
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
        }
      ],
      rawData: failures // Include the raw data for better analysis
    };
  };

  // Create a function to prepare source comparison data for AI analysis
  const prepareSourceComparisonData = (sourceStats, dataType) => {
    const filteredSources = Object.entries(sourceStats)
      .filter(([source]) => selectedSources.some(s => source.toLowerCase().includes(s.toLowerCase())));
    
    let labels, datasets;
    
    if (dataType === 'severity') {
      labels = ['Critical', 'High', 'Medium', 'Low'];
      datasets = filteredSources.map(([source, data]) => ({
        label: source,
        data: [data.critical, data.high, data.medium, data.low],
      }));
    } else if (dataType === 'priority') {
      labels = ['P1', 'P2', 'P3', 'P4'];
      datasets = filteredSources.map(([source, data]) => ({
        label: source,
        data: [data.p1, data.p2, data.p3, data.p4],
      }));
    }
    
    return { labels, datasets, rawData: sourceStats };
  };

  // Replace createMockTrendData with prepareTrendData
  const prepareTrendData = () => {
    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      console.log('No CSV data available for trend analysis');
      return null;
    }

    console.log('Preparing trend data from', csvData.length, 'records');

    // Get date range for the last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    // Create a map of dates
    const dateMap = {};
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }

    // Count failures by date
    csvData.forEach(failure => {
      try {
        const date = new Date(failure.Date || failure.date);
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split('T')[0];
          if (dateStr in dateMap) {
            dateMap[dateStr]++;
          }
        }
      } catch (error) {
        console.error('Error processing date for failure:', failure);
      }
    });

    // Sort dates and prepare chart data
    const sortedDates = Object.keys(dateMap).sort();
    
    const chartData = {
      labels: sortedDates,
            datasets: [{
        label: 'Failures',
        data: sortedDates.map(date => dateMap[date]),
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };

    console.log('Generated trend chart data:', chartData);
    return chartData;
  };

  // Update the chart data preparation functions
  const prepareSeverityChartData = () => {
    if (!csvData || csvData.length === 0) return null;

    // Count failures by severity for each source
    const sourceData = {};
    csvData.forEach(failure => {
      const source = failure.Source || 'Unknown';
      const severity = failure.Severity || 'Unknown';
      
      if (!sourceData[source]) {
        sourceData[source] = {
          Critical: 0,
          High: 0,
          Medium: 0,
          Low: 0
        };
      }
      sourceData[source][severity]++;
    });

    // Prepare data for chart
    const labels = Object.keys(sourceData);
    const datasets = [
      {
        label: 'Critical',
        data: labels.map(source => sourceData[source].Critical),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // red
      },
      {
        label: 'High',
        data: labels.map(source => sourceData[source].High),
        backgroundColor: 'rgba(245, 158, 11, 0.7)', // orange
      },
      {
        label: 'Medium',
        data: labels.map(source => sourceData[source].Medium),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
      },
      {
        label: 'Low',
        data: labels.map(source => sourceData[source].Low),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // green
      }
    ];

    return { labels, datasets };
  };

  const preparePriorityChartData = () => {
    if (!csvData || csvData.length === 0) return null;

    // Count failures by priority for each source
    const sourceData = {};
    csvData.forEach(failure => {
      const source = failure.Source || 'Unknown';
      const priority = failure.Priority || 'Unknown';
      
      if (!sourceData[source]) {
        sourceData[source] = {
          P1: 0,
          P2: 0,
          P3: 0,
          P4: 0
        };
      }
      sourceData[source][priority]++;
    });

    // Prepare data for chart
    const labels = Object.keys(sourceData);
    const datasets = [
      {
        label: 'P1',
        data: labels.map(source => sourceData[source].P1),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // red
      },
      {
        label: 'P2',
        data: labels.map(source => sourceData[source].P2),
        backgroundColor: 'rgba(245, 158, 11, 0.7)', // orange
      },
      {
        label: 'P3',
        data: labels.map(source => sourceData[source].P3),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
      },
      {
        label: 'P4',
        data: labels.map(source => sourceData[source].P4),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // green
      }
    ];

    return { labels, datasets };
  };

  const prepareDefectTypeData = () => {
    if (!csvData || csvData.length === 0) return null;

    const defectTypes = {};
    csvData.forEach(failure => {
      const type = failure['Defect Type'] || 'Unknown';
      defectTypes[type] = (defectTypes[type] || 0) + 1;
    });

    const sortedTypes = Object.entries(defectTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedTypes.map(([type]) => type),
            datasets: [{
        label: 'Defect Types',
        data: sortedTypes.map(([,count]) => count),
              backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ]
      }]
    };
  };

  const prepareDefectStatusData = () => {
    if (!csvData || csvData.length === 0) return null;

    const statusCounts = {
      Open: 0,
      'In Progress': 0,
      Resolved: 0
    };

    csvData.forEach(failure => {
      const status = failure.Status || 'Unknown';
      if (status in statusCounts) {
        statusCounts[status]++;
      }
    });

    return {
      labels: Object.keys(statusCounts),
            datasets: [{
        data: Object.values(statusCounts),
              backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ]
      }]
    };
  };

  const prepareLOBData = () => {
    if (!csvData || csvData.length === 0) return null;

    const lobCounts = {};
    csvData.forEach(failure => {
      const lob = failure.LOB || 'Unknown';
      lobCounts[lob] = (lobCounts[lob] || 0) + 1;
    });

    const sortedLOBs = Object.entries(lobCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      labels: sortedLOBs.map(([lob]) => lob),
      datasets: [{
        label: 'Failures by LOB',
        data: sortedLOBs.map(([,count]) => count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ]
      }]
    };
  };

  // Update the Recent Failures section
  const getRecentFailuresData = () => {
    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      console.log('No CSV data available for recent failures');
      return [];
    }

    // Create a copy of the data for sorting
    const sortedData = [...csvData].sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return dateB - dateA;
    });

    // Take the 10 most recent failures
    const recentData = sortedData.slice(0, 10).map(failure => ({
      id: failure.ID,
      title: failure.Title,
      description: failure.Description,
      date: failure.Date,
      severity: failure.Severity,
      status: failure.Status,
      source: failure.Source
    }));

    console.log('Recent failures data:', recentData);
    return recentData;
  };

  // Add refreshData function
  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/failures.csv');
      const csvText = await response.text();
      const failuresData = parseCSVString(csvText);
      
      if (failuresData && failuresData.length > 0) {
        const trendMetrics = calculateFailureTrendMetrics(failuresData);
        const severityData = calculateSeverityBySource(failuresData);
        const priorityData = calculatePriorityBySource(failuresData);
        const sourceMetrics = getSourceMetrics(failuresData);
        const recentFailures = getRecentFailures(failuresData, { days: 30, limit: 10 });

        setStats({
          totalFailures: trendMetrics.totalFailures,
          criticalFailures: trendMetrics.criticalFailures,
          resolvedFailures: trendMetrics.resolvedFailures,
          avgResolutionTime: trendMetrics.averageResolutionTime
        });

        setSourceStats(sourceMetrics);
        setSeverityData(severityData);
        setPriorityData(priorityData);
        setRecentFailures(recentFailures);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        title="ImpactFix AI" 
        description="Failure Trends Dashboard"
        sources={['Rally', 'Jira', 'ServiceNow']}
        selectedSources={selectedSources.map(s => s.charAt(0).toUpperCase() + s.slice(1))}
        onSourceChange={handleSourceChange}
        dateRange="30"
        onDateRangeChange={handleDateRangeChange}
        onRefresh={refreshData}
        onExport={handleExport}
        isLoading={loading}
      >
        <div className="ml-4">
          <AIFloatingButton 
            allData={{
              stats,
              trendData,
              defectTypeData,
              defectStatusData,
              lobData,
              severityData,
              priorityData,
              recentFailures
            }}
            selectedSources={selectedSources}
            dateRange={dateRange}
            position="fixed-top"
          />
        </div>
      </DashboardHeader>
      
      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiModalTitle}
        data={aiModalData}
        chartType={aiModalChartType}
        selectedSources={selectedSources}
        dateRange={dateRange}
      />
      
      {/* Floating AI Assistant Button */}
      <AIFloatingButton 
        allData={{
          stats,
          trendData,
          defectTypeData,
          defectStatusData,
          lobData,
          severityData,
          priorityData,
          recentFailures
        }}
        selectedSources={selectedSources}
        dateRange={dateRange}
        position="floating"
      />
      
      <div className="space-y-6">
      {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

        {/* Source Configuration Section */}
        {sourceConfigurations.length > 0 && (
      <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Database className="h-5 w-5 mr-2 text-yellow-500" />
              Connected Data Sources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sourceConfigurations.map((config, index) => {
                // Only show configured sources that are selected
                const isSelected = selectedSources.some(s => 
                  config.source.toLowerCase().includes(s.toLowerCase())
                );
                
                if (!isSelected) return null;
                
                // Get stats for this source
                const stats = sourceStats[config.source] || {
                  total: 0,
                  open: 0,
                  inProgress: 0,
                  resolved: 0
                };
                
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        config.source === 'Rally' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        config.source === 'Jira' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {config.source === 'Rally' ? <TrendingUp className="h-4 w-4" /> :
                         config.source === 'Jira' ? <AlertTriangle className="h-4 w-4" /> :
                         <Database className="h-4 w-4" />}
              </div>
        <div>
                        <div className="font-medium text-gray-800 dark:text-white">{config.source}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {config.projectName} ({config.workspaceName})
            </div>
              </div>
            </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                        <div className="font-semibold text-gray-800 dark:text-white">{stats.total}</div>
              </div>
                      <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="text-sm text-red-500 dark:text-red-400">Open</div>
                        <div className="font-semibold text-red-700 dark:text-red-300">{stats.open}</div>
            </div>
                      <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <div className="text-sm text-yellow-500 dark:text-yellow-400">In Progress</div>
                        <div className="font-semibold text-yellow-700 dark:text-yellow-300">{stats.inProgress}</div>
              </div>
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-sm text-green-500 dark:text-green-400">Resolved</div>
                        <div className="font-semibold text-green-700 dark:text-green-300">{stats.resolved}</div>
            </div>
          </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Connected Data Sources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sourceStats && Object.entries(sourceStats).map(([sourceName, source]) => {
            // Only show configured sources that are selected
            const isSelected = selectedSources.some(s => 
              sourceName.toLowerCase().includes(s.toLowerCase())
            );
            
            if (!isSelected) return null;
            
            return (
              <div key={sourceName} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sourceName}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (source.open + source.inProgress) > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {(source.open + source.inProgress) > 0 ? `${source.open + source.inProgress} Pending` : 'All Resolved'}
              </div>
            </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{source.total}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Issues</div>
              </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{source.critical}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Critical</div>
            </div>
              </div>
                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Resolution Rate: {Math.round((source.resolved / source.total) * 100)}%
            </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                      <div
                        className="bg-green-500 rounded"
                        style={{ width: `${(source.resolved / source.total) * 100}%` }}
                      />
              </div>
            </div>
                </div>
              </div>
            );
          })}
          </div>

        {/* Stats Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(formattedStats).map(([key, stat]) => (
            <DashboardCard
              key={key}
              title={stat.label}
              icon={stat.icon}
              accentColor={stat.color}
              isLoading={loading}
              className="h-full"
            >
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  {stat.subtext && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.subtext}
                    </div>
                  )}
                </div>
                {stat.trend && (
                  <div className={`flex items-center ${
                    stat.trend === 'up' 
                      ? stat.color === 'green' ? 'text-green-500' : 'text-red-500' 
                      : stat.color === 'green' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5" />
                    )}
                  </div>
                )}
              </div>
            </DashboardCard>
          ))}
        </motion.div>
        
        {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Failure Trends Analysis"
              subtitle={`Analyzing failure patterns across ${selectedSources.join(', ')}`}
              isLoading={loading}
              headerAction={
                <AIAnalysisButton 
                  onClick={() => openAiAnalysisModal('Failure Trends Analysis', trendData, 'line')} 
                  variant="default"
                />
              }
            >
              {trendData ? (
                <FailureTrendsChart data={trendData} />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 dark:text-gray-400">No failure trend data available</p>
                </div>
              )}
            </DashboardCard>

            <DashboardCard
            title="Defect Types Distribution"
            subtitle={`Top defect categories across ${selectedSources.join(', ')} sources`}
            isLoading={loading}
            headerAction={
              defectTypeData ? (
                <AIAnalysisButton 
                  onClick={() => openAiAnalysisModal('Defect Types Distribution', defectTypeData, 'bar')} 
                  variant="default"
                />
              ) : null
            }
            >
            {defectTypeData ? (
              <div className="space-y-4">
                <ChartComponent
                  type="bar"
                  data={defectTypeData}
                  height={300}
                />
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md border border-indigo-100 dark:border-indigo-800/30">
                  <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-300 flex items-center">
                    <BrainCircuit className="h-4 w-4 mr-1" />
                    Key Insights
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2 mt-0.5">
                        <Activity className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {defectTypeData?.labels[0] || 'Data'} issues represent the highest category ({Math.max(...(defectTypeData?.datasets[0]?.data || [0]))}% of total)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2 mt-0.5">
                        <TrendingUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Focus areas for improvement: {defectTypeData?.labels.slice(0, 2).join(', ')}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                No defect type data available
              </div>
              )}
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Defect Status"
              subtitle={`Current status distribution across ${selectedSources.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`}
              isLoading={loading}
              headerAction={
                defectStatusData ? (
                  <AIAnalysisButton 
                    onClick={() => openAiAnalysisModal('Defect Status', defectStatusData, 'doughnut')} 
                    variant="default"
                  />
                ) : null
              }
            >
              {defectStatusData ? (
                <div className="space-y-4">
                <ChartComponent
                  type="doughnut"
                  data={defectStatusData}
                  height={300}
                />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                      <div className="text-sm text-blue-700 dark:text-blue-400">Open</div>
                      <div className="font-semibold text-blue-800 dark:text-blue-300">
                        {defectStatusData?.datasets[0]?.data[0] || 0}%
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-center">
                      <div className="text-sm text-yellow-700 dark:text-yellow-400">In Progress</div>
                      <div className="font-semibold text-yellow-800 dark:text-yellow-300">
                        {defectStatusData?.datasets[0]?.data[1] || 0}%
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
                      <div className="text-sm text-green-700 dark:text-green-400">Resolved</div>
                      <div className="font-semibold text-green-800 dark:text-green-300">
                        {defectStatusData?.datasets[0]?.data[2] || 0}%
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                  No status data available
                </div>
              )}
            </DashboardCard>

            <DashboardCard
              title="Failures by Line of Business"
              subtitle="Distribution across business domains"
              isLoading={loading}
              headerAction={
                lobData ? (
                  <AIAnalysisButton 
                    onClick={() => openAiAnalysisModal('Failures by Line of Business', lobData, 'bar')} 
                    variant="default"
                  />
                ) : null
              }
            >
              {lobData ? (
                <div className="space-y-4">
                <ChartComponent
                  type="bar"
                  data={lobData}
                  height={300}
                />
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-100 dark:border-amber-800/30">
                    <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center">
                      <BrainCircuit className="h-4 w-4 mr-1" />
                      Business Impact Analysis
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-2 mt-0.5">
                          <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {lobData?.labels[0] || 'Banking'} has the highest failure rate ({Math.max(...(lobData?.datasets[0]?.data || [0]))})
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-2 mt-0.5">
                          <Users className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Recommend focused QA resources for {lobData?.labels.slice(0, 2).join(' and ')} teams
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                  No LOB data available
                </div>
              )}
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Severity Distribution"
              subtitle="Breakdown of failures by severity level"
              isLoading={loading}
              headerAction={
                severityData && Object.keys(severityData).length > 0 ? (
                  <AIAnalysisButton 
                    onClick={() => openAiAnalysisModal('Severity Distribution', severityData, 'pie')} 
                    variant="default"
                  />
                ) : null
              }
            >
              {severityData && Object.keys(severityData).length > 0 ? (
                <div className="space-y-4">
                <ChartComponent
                  type="pie"
                  data={severityData}
                  height={300}
                />
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800/30">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Critical Issues Analysis
                    </h4>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {severityData?.datasets?.[0]?.data?.[0] > 20 ? 
                        `High percentage (${severityData.datasets[0].data[0]}%) of Critical issues requires immediate attention` : 
                        `Critical issues (${severityData.datasets[0].data[0] || 0}%) are within acceptable range`}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Critical: {severityData?.datasets?.[0]?.data?.[0] || 0}%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          High: {severityData?.datasets?.[0]?.data?.[1] || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                  No severity data available
                </div>
              )}
            </DashboardCard>

            <DashboardCard
              title="Priority Distribution"
              subtitle="Breakdown of failures by priority level"
              isLoading={loading}
              headerAction={
                priorityData?.datasets?.length > 0 ? (
                  <AIAnalysisButton 
                    onClick={() => openAiAnalysisModal('Priority Distribution', priorityData, 'pie')} 
                    variant="default"
                  />
                ) : null
              }
            >
              {priorityData?.datasets?.length > 0 ? (
                <div className="space-y-4">
                <ChartComponent
                    type="pie"
                  data={priorityData}
                  height={300}
                />
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md border border-purple-100 dark:border-purple-800/30">
                    <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center">
                      <BrainCircuit className="h-4 w-4 mr-1" />
                      Priority Insights
                    </h4>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {(priorityData?.datasets?.[0]?.data?.[0] || 0) > 30 ? 
                        `High percentage (${priorityData.datasets[0].data[0]}%) of P1 issues indicates potential resource constraints` : 
                        `P1 issues (${priorityData?.datasets?.[0]?.data?.[0] || 0}%) are being managed effectively`}
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {selectedSources.map((source, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            source.toLowerCase() === 'rally' ? 'bg-blue-500' :
                            source.toLowerCase() === 'jira' ? 'bg-purple-500' :
                            'bg-green-500'
                          } mr-2`}></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {source.charAt(0).toUpperCase() + source.slice(1)}: {Math.round(100/selectedSources.length)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                  No priority data available
                </div>
              )}
            </DashboardCard>
          </div>

        {/* Bottom Row - Recent Failures and AI Insights */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 gap-6"
        >
          {/* Recent Failures */}
            <DashboardCard
            title="Recent Failures Analysis"
            subtitle="Latest reported issues and their impact"
            icon={<AlertCircle className="h-5 w-5" />}
            accentColor="indigo"
            isLoading={loading}
            onRefresh={refreshData}
            headerAction={
              recentFailures && recentFailures.length > 0 ? (
                <AIAnalysisButton 
                  onClick={() => openAiAnalysisModal(
                    'Recent Failures Analysis', 
                    prepareRecentFailuresData(recentFailures), 
                    'list'
                  )} 
                  variant="default"
                />
              ) : null
            }
          >
            {recentFailures && recentFailures.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {recentFailures.slice(0, 6).map((failure, index) => (
                    <div 
                      key={index}
                      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-blue-500 opacity-75"></div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {failure.title || failure.id || 'Untitled Failure'}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {failure.description || 'No description available'}
                            </p>
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                              (failure.severity || '').toLowerCase() === 'critical' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                                : (failure.severity || '').toLowerCase() === 'high'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                : (failure.severity || '').toLowerCase() === 'medium'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {failure.severity || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{failure.date ? new Date(failure.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Unknown date'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              (failure.status || '').toLowerCase() === 'resolved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : (failure.status || '').toLowerCase() === 'in progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {failure.status || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                            <Database className="h-3.5 w-3.5 mr-1" />
                            {failure.source || 'Unknown Source'}
                          </span>
                          {failure.priority && (
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              Priority: {failure.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recentFailures.length > 6 && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                    >
                      View All Failures
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>No recent failures found</p>
                <p className="text-sm mt-1">All systems are running smoothly</p>
              </div>
            )}
          </DashboardCard>
        </motion.div>
        
        {/* Add Source Comparison Charts */}
        {!loading && selectedSources.length > 1 && (
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Source Comparison - Severity */}
            <DashboardCard
              title="Severity by Source"
              subtitle="Comparison of severity levels across data sources"
              icon={<AlertCircle className="h-5 w-5" />}
              accentColor="red"
              isLoading={loading}
              onRefresh={refreshData}
              headerAction={
                sourceStats && Object.keys(sourceStats).length > 0 ? (
                  <AIAnalysisButton 
                    onClick={() => openAiAnalysisModal(
                      'Severity by Source Analysis', 
                      prepareSourceComparisonData(sourceStats, 'severity'), 
                      'bar'
                    )} 
                    variant="default"
                  />
                ) : null
              }
            >
              {sourceStats && Object.keys(sourceStats).length > 0 && (
                <div className="h-80">
              <ChartComponent
                type="bar"
                    data={prepareSeverityChartData()}
                options={{
                  scales: {
                    x: {
                          stacked: false
                    },
                    y: {
                          stacked: false,
                          beginAtZero: true
                    }
                  }
                }}
              />
            </div>
              )}
          </DashboardCard>

            {/* Source Comparison - Priority */}
          <DashboardCard
              title="Priority by Source"
              subtitle="Comparison of priority levels across data sources"
              icon={<AlertTriangle className="h-5 w-5" />}
              accentColor="amber"
              isLoading={loading}
              onRefresh={refreshData}
              headerAction={
                sourceStats && Object.keys(sourceStats).length > 0 ? (
                  <AIAnalysisButton 
                    onClick={() => openAiAnalysisModal(
                      'Priority by Source Analysis', 
                      prepareSourceComparisonData(sourceStats, 'priority'), 
                      'bar'
                    )} 
                    variant="default"
                  />
                ) : null
              }
            >
              {sourceStats && Object.keys(sourceStats).length > 0 && (
                <div className="h-80">
                  <ChartComponent
                    type="bar"
                    data={preparePriorityChartData()}
                    height={300}
                    options={{
                      scales: {
                        x: {
                          stacked: false
                        },
                        y: {
                          stacked: false,
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                  </div>
              )}
          </DashboardCard>
          </motion.div>
      )}
      </div>
    </div>
  );
}

export default FailureTrends; 