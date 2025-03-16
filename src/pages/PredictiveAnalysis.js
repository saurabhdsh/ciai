import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import ChartComponent from '../components/ChartComponent';
import DashboardCard from '../components/DashboardCard';
import { fetchCSVData, getSummaryStats } from '../services/csvService';

// Sample data for demonstration - we'll keep this for now as the CSV doesn't have predictive data
const sampleData = {
  failurePrediction: {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Historical Failures',
        data: [15, 18, 14, 17, 16, 19],
        borderColor: '#0071e3',
        backgroundColor: 'rgba(0, 113, 227, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Predicted Failures',
        data: [null, null, null, 20, 23, 25],
        borderColor: '#ff9500',
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: true,
      },
    ],
  },
  componentRisk: {
    labels: ['Component A', 'Component B', 'Component C', 'Component D', 'Component E'],
    datasets: [
      {
        label: 'Failure Probability (%)',
        data: [15, 45, 28, 12, 35],
        backgroundColor: [
          'rgba(76, 217, 100, 0.7)',
          'rgba(255, 59, 48, 0.7)',
          'rgba(255, 149, 0, 0.7)',
          'rgba(76, 217, 100, 0.7)',
          'rgba(255, 149, 0, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  },
  timeToFailure: {
    labels: ['Component B', 'Component E', 'Component C'],
    datasets: [
      {
        label: 'Estimated Days to Failure',
        data: [12, 28, 45],
        backgroundColor: [
          'rgba(255, 59, 48, 0.7)',
          'rgba(255, 149, 0, 0.7)',
          'rgba(255, 204, 0, 0.7)',
        ],
        borderRadius: 6,
      },
    ],
  },
};

function PredictiveAnalysis() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Load the CSV data when the component mounts
    loadCSVData();
  }, []);

  const loadCSVData = async () => {
    try {
      setIsLoading(true);
      const csvData = await fetchCSVData();
      setData(csvData);
      
      // Process the data
      const stats = getSummaryStats(csvData);
      setStats(stats);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading CSV data:', err);
      setError('Failed to load data. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-semibold">Predictive Analysis</h1>
          <p className="text-secondary mt-2">
            AI-powered predictions to anticipate failures before they occur
          </p>
        </div>
        <button 
          className="apple-button-secondary flex items-center"
          onClick={loadCSVData}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </motion.div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-secondary">Loading data and generating insights...</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-8">
          {/* High Risk Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-background rounded-lg border border-error p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm">High Risk Component</p>
                  <h3 className="text-xl font-semibold mt-1">Component B</h3>
                </div>
                <div className="p-3 rounded-full bg-error/10">
                  <AlertTriangle className="h-5 w-5 text-error" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-secondary mr-1" />
                  <span className="text-secondary">Predicted Failure:</span>
                  <span className="ml-1 font-medium">July 23, 2023</span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <Clock className="h-4 w-4 text-secondary mr-1" />
                  <span className="text-secondary">Time to Failure:</span>
                  <span className="ml-1 font-medium text-error">12 days</span>
                </div>
                <div className="mt-3 w-full bg-tertiary rounded-full h-2">
                  <div className="bg-error h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span>Failure Probability</span>
                  <span className="font-medium">45%</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-background rounded-lg border border-warning p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm">Medium Risk Component</p>
                  <h3 className="text-xl font-semibold mt-1">Component E</h3>
                </div>
                <div className="p-3 rounded-full bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-secondary mr-1" />
                  <span className="text-secondary">Predicted Failure:</span>
                  <span className="ml-1 font-medium">August 8, 2023</span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <Clock className="h-4 w-4 text-secondary mr-1" />
                  <span className="text-secondary">Time to Failure:</span>
                  <span className="ml-1 font-medium text-warning">28 days</span>
                </div>
                <div className="mt-3 w-full bg-tertiary rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span>Failure Probability</span>
                  <span className="font-medium">35%</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-background rounded-lg border border-warning p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm">Medium Risk Component</p>
                  <h3 className="text-xl font-semibold mt-1">Component C</h3>
                </div>
                <div className="p-3 rounded-full bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-secondary mr-1" />
                  <span className="text-secondary">Predicted Failure:</span>
                  <span className="ml-1 font-medium">August 25, 2023</span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <Clock className="h-4 w-4 text-secondary mr-1" />
                  <span className="text-secondary">Time to Failure:</span>
                  <span className="ml-1 font-medium text-warning">45 days</span>
                </div>
                <div className="mt-3 w-full bg-tertiary rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span>Failure Probability</span>
                  <span className="font-medium">28%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Failure Prediction"
              subtitle="Historical and predicted failures over time"
              isLoading={isLoading}
            >
              <ChartComponent
                type="line"
                data={sampleData.failurePrediction}
                height={300}
              />
            </DashboardCard>

            <DashboardCard
              title="Component Risk Assessment"
              subtitle="Failure probability by component"
              isLoading={isLoading}
            >
              <ChartComponent
                type="bar"
                data={sampleData.componentRisk}
                height={300}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Probability (%)'
                      }
                    }
                  }
                }}
              />
            </DashboardCard>
          </div>

          <DashboardCard
            title="Estimated Time to Failure"
            subtitle="Days until predicted failure for high-risk components"
            isLoading={isLoading}
          >
            <ChartComponent
              type="bar"
              data={sampleData.timeToFailure}
              height={300}
              options={{
                indexAxis: 'y',
                scales: {
                  x: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Days'
                    }
                  }
                }
              }}
            />
          </DashboardCard>

          {/* Predictive Insights */}
          <DashboardCard
            title="AI-Generated Predictive Insights"
            subtitle="Automatically generated predictions and recommendations"
            className="bg-gradient-to-br from-background to-tertiary"
          >
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-medium">Failure Pattern Detection</h4>
                <p className="text-secondary mt-2">
                  The AI model has detected a cyclical pattern in Component B failures, 
                  with increased probability during summer months. This suggests a 
                  correlation with higher operating temperatures.
                </p>
              </div>
              
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-medium">Root Cause Analysis</h4>
                <p className="text-secondary mt-2">
                  Based on historical data patterns, the predicted failure of Component B 
                  is likely due to bearing wear (78% confidence). Vibration patterns match 
                  those of previous failures with this root cause.
                </p>
              </div>
              
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-medium">Preventive Action Recommendation</h4>
                <p className="text-secondary mt-2">
                  To prevent the imminent failure of Component B, schedule replacement 
                  within 7 days. For Component E, implementing enhanced cooling could 
                  extend its lifespan by an estimated 45 days.
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* Maintenance Schedule */}
          <DashboardCard
            title="Recommended Maintenance Schedule"
            subtitle="AI-optimized maintenance plan based on predictive analysis"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Component</th>
                    <th className="text-left py-3 px-4">Action</th>
                    <th className="text-left py-3 px-4">Deadline</th>
                    <th className="text-left py-3 px-4">Priority</th>
                    <th className="text-left py-3 px-4">Estimated Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Component B</td>
                    <td className="py-3 px-4">Replace</td>
                    <td className="py-3 px-4">Within 7 days</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-error/10 text-error">High</span>
                    </td>
                    <td className="py-3 px-4">Prevent 4 hours downtime</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Component E</td>
                    <td className="py-3 px-4">Enhance cooling</td>
                    <td className="py-3 px-4">Within 14 days</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">Medium</span>
                    </td>
                    <td className="py-3 px-4">Extend lifespan by 45 days</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Component C</td>
                    <td className="py-3 px-4">Inspect and lubricate</td>
                    <td className="py-3 px-4">Within 21 days</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">Medium</span>
                    </td>
                    <td className="py-3 px-4">Extend lifespan by 30 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">All Components</td>
                    <td className="py-3 px-4">Comprehensive review</td>
                    <td className="py-3 px-4">Quarterly</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-success/10 text-success">Low</span>
                    </td>
                    <td className="py-3 px-4">Reduce failure rate by 15%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      )}
    </div>
  );
}

export default PredictiveAnalysis; 