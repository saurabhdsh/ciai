import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, 
  AlertTriangle, 
  AlertOctagon, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart
} from 'lucide-react';
import { loadFailuresData, calculateMetrics } from '../services/failureService';
import { parseCSVString } from '../utils/csvUtils';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalDefects: { value: 0, label: 'Total Defects', description: 'All reported issues across systems' },
    majorIssues: { value: 0, label: 'Major Issues', description: 'High priority and severity issues' },
    serviceNowIncidents: { value: 0, label: 'ServiceNow Incidents', description: 'Incidents reported in ServiceNow' },
    criticalBugs: { value: 0, label: 'Critical Bugs', description: 'Critical severity defects' }
  });

  // Load and calculate metrics
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch('/data/failures.csv');
        const csvText = await response.text();
        const failuresData = parseCSVString(csvText);
        
        if (failuresData && failuresData.length > 0) {
          const calculatedMetrics = calculateMetrics(failuresData);
          
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

  const MetricCard = ({ title, value, icon: Icon, trend, color }) => (
    <motion.div
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
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
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart className="h-6 w-6 mr-2 text-blue-500" />
          System Metrics Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Real-time overview of system health and incidents
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Defects"
          value={metrics.totalDefects.value}
          icon={Bug}
          trend="down"
          color="bg-blue-500"
        />
        <MetricCard
          title="Major Issues"
          value={metrics.majorIssues.value}
          icon={AlertTriangle}
          trend="up"
          color="bg-yellow-500"
        />
        <MetricCard
          title="ServiceNow Incidents"
          value={metrics.serviceNowIncidents.value}
          icon={AlertOctagon}
          trend="down"
          color="bg-purple-500"
        />
        <MetricCard
          title="Critical Bugs"
          value={metrics.criticalBugs.value}
          icon={Zap}
          trend="up"
          color="bg-red-500"
        />
      </div>
    </div>
  );
};

export default MetricsDashboard; 