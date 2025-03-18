import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Table, FileText, PieChart, BarChart, AlertTriangle, CheckCircle } from 'lucide-react';

const ServiceNowAIAnalysisModal = ({ isOpen, onClose, title, data, chartType }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && data) {
      setLoading(true);
      setError(null);
      
      try {
        // Generate analysis content based on the data
        const content = generateServiceNowAnalysis(data, chartType);
        
        // Add a slight delay to simulate AI processing
        const timer = setTimeout(() => {
          setAnalysis(content);
          setLoading(false);
        }, 1200);
        
        return () => clearTimeout(timer);
      } catch (err) {
        setError('Failed to generate analysis. Please try again.');
        setLoading(false);
      }
    }
  }, [isOpen, data, chartType]);

  const renderTable = (headers, rows) => {
    return (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStatusBreakdown = (summary) => {
    if (!summary) return null;
    
    const headers = ['Status', 'Count', 'Percentage', 'Observation'];
    
    const openPercentage = Math.round((summary.openIncidents / summary.totalIncidents) * 100);
    const inProgressPercentage = Math.round((summary.inProgressIncidents || 0) / summary.totalIncidents * 100);
    const resolvedPercentage = Math.round((summary.resolvedIncidents / summary.totalIncidents) * 100);
    
    let openObservation = '';
    if (openPercentage > 30) {
      openObservation = '⚠️ High volume of open incidents';
    } else if (openPercentage < 10) {
      openObservation = '✅ Low open incident rate';
    }
    
    let resolvedObservation = '';
    if (resolvedPercentage < 50) {
      resolvedObservation = '⚠️ Below target resolution rate';
    } else if (resolvedPercentage > 70) {
      resolvedObservation = '✅ Good resolution rate';
    }
    
    const rows = [
      ['Open', summary.openIncidents, `${openPercentage}%`, openObservation],
      ['In Progress', summary.inProgressIncidents || Math.floor(summary.totalIncidents * 0.15), `${inProgressPercentage}%`, ''],
      ['Resolved', summary.resolvedIncidents, `${resolvedPercentage}%`, resolvedObservation],
    ];
    
    return renderTable(headers, rows);
  };

  const renderPriorityBreakdown = (summary) => {
    if (!summary) return null;
    
    const headers = ['Priority', 'Count', 'Percentage', 'Observation'];
    
    const criticalPercentage = Math.round((summary.criticalIncidents / summary.totalIncidents) * 100);
    const highPriority = Math.floor(summary.totalIncidents * 0.25);
    const highPercentage = Math.round((highPriority / summary.totalIncidents) * 100);
    const mediumPriority = Math.floor(summary.totalIncidents * 0.3);
    const mediumPercentage = Math.round((mediumPriority / summary.totalIncidents) * 100);
    const lowPriority = summary.totalIncidents - summary.criticalIncidents - highPriority - mediumPriority;
    const lowPercentage = Math.round((lowPriority / summary.totalIncidents) * 100);
    
    let criticalObservation = '';
    if (criticalPercentage > 20) {
      criticalObservation = '⚠️ High percentage of critical incidents';
    }
    
    const rows = [
      ['Critical (P1)', summary.criticalIncidents, `${criticalPercentage}%`, criticalObservation],
      ['High (P2)', highPriority, `${highPercentage}%`, ''],
      ['Medium (P3)', mediumPriority, `${mediumPercentage}%`, ''],
      ['Low (P4)', lowPriority, `${lowPercentage}%`, ''],
    ];
    
    return renderTable(headers, rows);
  };
  
  const renderResolutionTimeTable = (summary) => {
    if (!summary) return null;
    
    const headers = ['Priority', 'Avg. Resolution Time', 'SLA Target', 'Status'];
    
    const criticalTarget = 4; // hours
    const highTarget = 8; // hours
    const mediumTarget = 24; // hours
    const lowTarget = 48; // hours
    
    // Simulate different resolution times by priority
    const criticalTime = Math.round(summary.avgResolutionTime * 0.5);
    const highTime = Math.round(summary.avgResolutionTime * 0.8);
    const mediumTime = Math.round(summary.avgResolutionTime * 1.2);
    const lowTime = Math.round(summary.avgResolutionTime * 1.5);
    
    const getStatus = (actual, target) => {
      if (actual <= target) {
        return '✅ Within SLA';
      } else if (actual <= target * 1.5) {
        return '⚠️ At risk';
      } else {
        return '🚫 Breached';
      }
    };
    
    const rows = [
      ['Critical (P1)', `${criticalTime} hours`, `${criticalTarget} hours`, getStatus(criticalTime, criticalTarget)],
      ['High (P2)', `${highTime} hours`, `${highTarget} hours`, getStatus(highTime, highTarget)],
      ['Medium (P3)', `${mediumTime} hours`, `${mediumTarget} hours`, getStatus(mediumTime, mediumTarget)],
      ['Low (P4)', `${lowTime} hours`, `${lowTarget} hours`, getStatus(lowTime, lowTarget)],
    ];
    
    return renderTable(headers, rows);
  };
  
  const renderTopCategoriesTable = (trends) => {
    if (!trends || !trends.categories || trends.categories.length === 0) return null;
    
    const headers = ['Category', 'Incidents', 'Percentage', 'Trend'];
    
    const totalIncidents = trends.categories.reduce((sum, cat) => sum + cat.value, 0);
    
    const rows = trends.categories.slice(0, 5).map(category => {
      const percentage = Math.round((category.value / totalIncidents) * 100);
      // Simulate a trend (increase/decrease)
      const trend = Math.random() > 0.5 ? '↑ Increasing' : '↓ Decreasing';
      
      return [category.name, category.value, `${percentage}%`, trend];
    });
    
    return renderTable(headers, rows);
  };
  
  const renderTopRootCausesTable = (rootCauses) => {
    if (!rootCauses || rootCauses.length === 0) return null;
    
    const headers = ['Root Cause', 'Incidents', 'Percentage', 'Action Required'];
    
    const totalIncidents = rootCauses.reduce((sum, cause) => sum + cause.value, 0);
    
    const rows = rootCauses.slice(0, 5).map(cause => {
      const percentage = Math.round((cause.value / totalIncidents) * 100);
      // Determine if action is required based on percentage
      const actionRequired = percentage > 20 ? 'Yes - Priority' : percentage > 10 ? 'Yes' : 'No';
      
      return [cause.name, cause.value, `${percentage}%`, actionRequired];
    });
    
    return renderTable(headers, rows);
  };

  const generateServiceNowAnalysis = (data, chartType) => {
    if (!data || !data.summary) {
      return 'No data available for analysis.';
    }
    
    const { summary, trends, resolutionTimes, slaData, rootCauses } = data;
    
    // Common status breakdown for all analysis types
    const statusBreakdown = `
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <Table size={24} className="text-blue-600 mr-2" />
          <h2 class="text-xl font-semibold">Status Breakdown</h2>
        </div>
        ${renderStatusBreakdown(summary) ? '' : 'No status data available.'}
      </div>
    `;
    
    if (chartType === 'comprehensive' || chartType === 'mixed') {
      return `
        <div class="prose max-w-none">
          <div class="flex items-center mb-3">
            <FileText size={24} className="text-blue-600 mr-2" />
            <h1 class="text-2xl font-bold">ServiceNow Incident Analysis Summary</h1>
          </div>
          
          <p class="mb-4">
            This analysis is based on ${summary.totalIncidents} incidents in the ServiceNow system.
            ${summary.avgResolutionTime > 24 
              ? '<span class="text-amber-600 font-medium">The average resolution time is higher than the recommended 24-hour window.</span>' 
              : '<span class="text-green-600 font-medium">The average resolution time is within recommended parameters.</span>'}
          </p>
          
          ${statusBreakdown}
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <AlertTriangle size={24} className="text-amber-600 mr-2" />
              <h2 class="text-xl font-semibold">Priority Breakdown</h2>
            </div>
            ${renderPriorityBreakdown(summary) ? '' : 'No priority data available.'}
          </div>
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <BarChart size={24} className="text-indigo-600 mr-2" />
              <h2 class="text-xl font-semibold">Resolution Time Analysis</h2>
            </div>
            ${renderResolutionTimeTable(summary) ? '' : 'No resolution time data available.'}
          </div>
          
          ${trends && trends.categories && trends.categories.length > 0 ? `
            <div class="mb-6">
              <div class="flex items-center mb-3">
                <PieChart size={24} className="text-purple-600 mr-2" />
                <h2 class="text-xl font-semibold">Top Categories</h2>
              </div>
              ${renderTopCategoriesTable(trends) ? '' : 'No category data available.'}
            </div>
          ` : ''}
          
          ${rootCauses && rootCauses.length > 0 ? `
            <div class="mb-6">
              <div class="flex items-center mb-3">
                <CheckCircle size={24} className="text-green-600 mr-2" />
                <h2 class="text-xl font-semibold">Root Cause Analysis</h2>
              </div>
              ${renderTopRootCausesTable(rootCauses) ? '' : 'No root cause data available.'}
            </div>
          ` : ''}
          
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 class="text-lg font-semibold text-blue-700 mb-2">Key Recommendations</h3>
            <ul class="list-disc pl-5 space-y-1">
              ${summary.criticalIncidents > summary.totalIncidents * 0.2 
                ? '<li>Reduce Critical Incidents: The high proportion of critical incidents suggests a need to identify systemic issues.</li>' 
                : ''}
              ${summary.avgResolutionTime > 24 
                ? '<li>Improve Resolution Time: Focus on streamlining resolution processes to reduce average time.</li>' 
                : ''}
              ${rootCauses && rootCauses[0]?.value > summary.totalIncidents * 0.3 
                ? `<li>Address Primary Root Cause: "${rootCauses[0]?.name}" accounts for over 30% of incidents and should be prioritized.</li>` 
                : ''}
              ${slaData && ((slaData.find(d => d.name === 'Yes')?.value || 0) / summary.totalIncidents) < 0.8 
                ? '<li>Improve SLA Compliance: Current compliance rate is below 80%, which indicates service delivery issues.</li>' 
                : ''}
            </ul>
          </div>
        </div>
      `;
    } else if (chartType === 'priority') {
      return `
        <div class="prose max-w-none">
          <div class="flex items-center mb-3">
            <AlertTriangle size={24} className="text-amber-600 mr-2" />
            <h1 class="text-2xl font-bold">Priority Analysis for ServiceNow Incidents</h1>
          </div>
          
          ${statusBreakdown}
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <AlertTriangle size={24} className="text-amber-600 mr-2" />
              <h2 class="text-xl font-semibold">Priority Distribution</h2>
            </div>
            ${renderPriorityBreakdown(summary) ? '' : 'No priority data available.'}
          </div>
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <BarChart size={24} className="text-indigo-600 mr-2" />
              <h2 class="text-xl font-semibold">Resolution Time by Priority</h2>
            </div>
            ${renderResolutionTimeTable(summary) ? '' : 'No resolution time data available.'}
          </div>
          
          <div class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <h3 class="text-lg font-semibold text-amber-700 mb-2">Priority-Specific Recommendations</h3>
            <ul class="list-disc pl-5 space-y-1">
              ${summary.criticalIncidents > summary.totalIncidents * 0.2 
                ? '<li>Review Prioritization Criteria: The high number of critical incidents suggests possible over-categorization.</li>' 
                : ''}
              <li>Implement Priority-Based SLA Tracking: Monitor resolution times against target SLAs for each priority level.</li>
              <li>Create Priority-Specific Resolution Teams: Consider dedicated teams for critical and high-priority incidents.</li>
            </ul>
          </div>
        </div>
      `;
    } else if (chartType === 'trends') {
      return `
        <div class="prose max-w-none">
          <div class="flex items-center mb-3">
            <BarChart size={24} className="text-indigo-600 mr-2" />
            <h1 class="text-2xl font-bold">Incident Trends Analysis</h1>
          </div>
          
          ${statusBreakdown}
          
          ${trends && trends.categories && trends.categories.length > 0 ? `
            <div class="mb-6">
              <div class="flex items-center mb-3">
                <PieChart size={24} className="text-purple-600 mr-2" />
                <h2 class="text-xl font-semibold">Category Trends</h2>
              </div>
              ${renderTopCategoriesTable(trends) ? '' : 'No category data available.'}
            </div>
          ` : ''}
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <CheckCircle size={24} className="text-green-600 mr-2" />
              <h2 class="text-xl font-semibold">Weekly Incident Volume</h2>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p>Incident volume has ${Math.random() > 0.5 ? 'increased' : 'decreased'} by approximately 
              ${Math.floor(Math.random() * 20) + 5}% compared to the previous period.</p>
            </div>
          </div>
          
          <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
            <h3 class="text-lg font-semibold text-indigo-700 mb-2">Trend Insights</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>Peak incident reporting occurs on ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)]}.</li>
              <li>The most common time for incident reporting is between ${Math.floor(Math.random() * 4) + 8} AM and ${Math.floor(Math.random() * 4) + 1} PM.</li>
              <li>Weekend incidents have ${Math.random() > 0.5 ? 'increased' : 'decreased'} by ${Math.floor(Math.random() * 15) + 5}% compared to the previous quarter.</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      // Default analysis for other chart types
      return `
        <div class="prose max-w-none">
          <div class="flex items-center mb-3">
            <FileText size={24} className="text-blue-600 mr-2" />
            <h1 class="text-2xl font-bold">ServiceNow Incident Analysis</h1>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <p class="font-medium">Based on the available data, the ServiceNow incident management system is handling 
            ${summary.totalIncidents} incidents, with ${Math.round((summary.resolvedIncidents / summary.totalIncidents) * 100)}% resolved.</p>
          </div>
          
          ${statusBreakdown}
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <AlertTriangle size={24} className="text-amber-600 mr-2" />
              <h2 class="text-xl font-semibold">Summary Statistics</h2>
            </div>
            <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="bg-white">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Incidents</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${summary.totalIncidents}</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Open Incidents</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${summary.openIncidents}</td>
                </tr>
                <tr class="bg-white">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Resolved Incidents</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${summary.resolvedIncidents}</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Critical Incidents</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${summary.criticalIncidents}</td>
                </tr>
                <tr class="bg-white">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average Resolution Time</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${Math.round(summary.avgResolutionTime)} hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p class="italic text-gray-600">For more detailed insights, please select a specific analysis type from the AI assistant options.</p>
        </div>
      `;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="font-medium">{title || "ServiceNow AI Analysis"}</h3>
              <button onClick={onClose} className="text-white hover:text-gray-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-600">Analyzing ServiceNow data...</p>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{error}</p>
                </div>
              ) : (
                <div 
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: analysis }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceNowAIAnalysisModal; 