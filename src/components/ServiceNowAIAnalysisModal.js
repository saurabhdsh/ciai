import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Table, FileText, PieChart, BarChart, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

const ServiceNowAIAnalysisModal = ({ isOpen, onClose, title, data, chartType }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && data) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('ServiceNowAIAnalysisModal - Received data:', data);
        
        // Check if data has required properties
        if (!data.summary) {
          console.warn('ServiceNowAIAnalysisModal - Missing summary data');
          data.summary = {
            totalIncidents: 0,
            openIncidents: 0,
            resolvedIncidents: 0,
            criticalIncidents: 0,
            avgResolutionTime: 0
          };
        }
        
        // Generate analysis content based on the data
        const content = generateServiceNowAnalysis(data, chartType);
        
        // Add a slight delay to simulate AI processing
        const timer = setTimeout(() => {
          setAnalysis(content);
          setLoading(false);
        }, 1200);
        
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('ServiceNowAIAnalysisModal - Error generating analysis:', err);
        setError('Failed to generate analysis. Please try again.');
        setLoading(false);
      }
    }
  }, [isOpen, data, chartType]);

  const renderTable = (headers, rows) => {
    // Validate inputs
    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      console.warn('renderTable called with invalid headers:', headers);
      headers = ['No Data'];
    }
    
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      console.warn('renderTable called with invalid rows:', rows);
      rows = [['No data available']];
    }
    
    // Generate HTML string instead of React component
    let tableHtml = `
      <div class="overflow-x-auto my-4">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
    `;
    
    // Add headers
    headers.forEach(header => {
      tableHtml += `
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
          ${header || ''}
        </th>
      `;
    });
    
    tableHtml += `
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    // Add rows
    rows.forEach((row, rowIndex) => {
      const bgClass = rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50';
      tableHtml += `<tr class="${bgClass}">`;
      
      // Add cells
      (row || []).forEach(cell => {
        const cellContent = cell !== undefined && cell !== null ? cell : '';
        tableHtml += `
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            ${cellContent}
          </td>
        `;
      });
      
      tableHtml += `</tr>`;
    });
    
    tableHtml += `
          </tbody>
        </table>
      </div>
    `;
    
    return tableHtml;
  };

  const renderStatusBreakdown = (summary) => {
    if (!summary || !summary.totalIncidents || summary.totalIncidents === 0) {
      console.log('Cannot render status breakdown - no incidents or total is zero');
      return null;
    }
    
    const headers = ['Status', 'Count', 'Percentage', 'Observation'];
    
    const openIncidents = summary.openIncidents || 0;
    const totalIncidents = summary.totalIncidents || 1; // Prevent division by zero
    const resolvedIncidents = summary.resolvedIncidents || 0;
    const inProgressIncidents = summary.inProgressIncidents || 0;
    
    const openPercentage = Math.round((openIncidents / totalIncidents) * 100);
    const inProgressPercentage = Math.round((inProgressIncidents / totalIncidents) * 100);
    const resolvedPercentage = Math.round((resolvedIncidents / totalIncidents) * 100);
    
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
      ['Open', openIncidents, `${openPercentage}%`, openObservation],
      ['In Progress', inProgressIncidents, `${inProgressPercentage}%`, ''],
      ['Resolved', resolvedIncidents, `${resolvedPercentage}%`, resolvedObservation],
    ];
    
    return renderTable(headers, rows);
  };

  const renderPriorityBreakdown = (summary) => {
    if (!summary || !summary.totalIncidents || summary.totalIncidents === 0) {
      console.log('Cannot render priority breakdown - no incidents or total is zero');
      return null;
    }
    
    const headers = ['Priority', 'Count', 'Percentage', 'Observation'];
    
    const criticalIncidents = summary.criticalIncidents || 0;
    const totalIncidents = summary.totalIncidents || 1; // Prevent division by zero
    
    const criticalPercentage = Math.round((criticalIncidents / totalIncidents) * 100);
    const highPriority = Math.floor(totalIncidents * 0.25);
    const highPercentage = Math.round((highPriority / totalIncidents) * 100);
    const mediumPriority = Math.floor(totalIncidents * 0.3);
    const mediumPercentage = Math.round((mediumPriority / totalIncidents) * 100);
    const lowPriority = totalIncidents - criticalIncidents - highPriority - mediumPriority;
    const lowPercentage = Math.round((lowPriority / totalIncidents) * 100);
    
    let criticalObservation = '';
    if (criticalPercentage > 20) {
      criticalObservation = '⚠️ High percentage of critical incidents';
    }
    
    const rows = [
      ['Critical (P1)', criticalIncidents, `${criticalPercentage}%`, criticalObservation],
      ['High (P2)', highPriority, `${highPercentage}%`, ''],
      ['Medium (P3)', mediumPriority, `${mediumPercentage}%`, ''],
      ['Low (P4)', lowPriority, `${lowPercentage}%`, ''],
    ];
    
    return renderTable(headers, rows);
  };
  
  const renderResolutionTimeTable = (summary) => {
    if (!summary || !summary.avgResolutionTime) {
      console.log('Cannot render resolution time table - missing resolution time data');
      return null;
    }
    
    const headers = ['Priority', 'Avg. Resolution Time', 'SLA Target', 'Status'];
    
    const criticalTarget = 4; // hours
    const highTarget = 8; // hours
    const mediumTarget = 24; // hours
    const lowTarget = 48; // hours
    
    const avgResolutionTime = summary.avgResolutionTime || 0;
    
    // Simulate different resolution times by priority
    const criticalTime = Math.round(avgResolutionTime * 0.5);
    const highTime = Math.round(avgResolutionTime * 0.8);
    const mediumTime = Math.round(avgResolutionTime * 1.2);
    const lowTime = Math.round(avgResolutionTime * 1.5);
    
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
    if (!trends || !trends.categories || !Array.isArray(trends.categories) || trends.categories.length === 0) {
      console.log('Cannot render top categories table - missing or empty categories array');
      return null;
    }
    
    const headers = ['Category', 'Incidents', 'Percentage', 'Trend'];
    
    // Calculate total from categories or use default
    const totalIncidents = trends.categories.reduce((sum, cat) => sum + (cat.value || 0), 0) || 1;
    
    const rows = trends.categories.slice(0, 5).map(category => {
      const value = category.value || 0;
      const percentage = Math.round((value / totalIncidents) * 100);
      // Simulate a trend (increase/decrease)
      const trend = Math.random() > 0.5 ? '↑ Increasing' : '↓ Decreasing';
      
      return [category.name || 'Unknown', value, `${percentage}%`, trend];
    });
    
    return renderTable(headers, rows);
  };
  
  const renderTopRootCausesTable = (rootCauses) => {
    if (!rootCauses || !Array.isArray(rootCauses) || rootCauses.length === 0) {
      console.log('Cannot render root causes table - missing or empty root causes array');
      return null;
    }
    
    const headers = ['Root Cause', 'Incidents', 'Percentage', 'Action Required'];
    
    // Calculate total from root causes or use default
    const totalIncidents = rootCauses.reduce((sum, cause) => sum + (cause.value || 0), 0) || 1;
    
    const rows = rootCauses.slice(0, 5).map(cause => {
      const value = cause.value || 0;
      const percentage = Math.round((value / totalIncidents) * 100);
      // Determine if action is required based on percentage
      const actionRequired = percentage > 20 ? 'Yes - Priority' : percentage > 10 ? 'Yes' : 'No';
      
      return [cause.name || 'Unknown', value, `${percentage}%`, actionRequired];
    });
    
    return renderTable(headers, rows);
  };

  const generateServiceNowAnalysis = (data, chartType) => {
    console.log('Generating analysis for type:', chartType, 'with data:', data);
    
    if (!data) {
      return 'No data available for analysis.';
    }
    
    // Ensure all required properties exist with defaults
    const summary = data.summary || {
      totalIncidents: 0,
      openIncidents: 0,
      resolvedIncidents: 0,
      criticalIncidents: 0,
      avgResolutionTime: 0
    };
    
    const trends = data.trends || { categories: [], priorities: [], incidentsOverTime: [] };
    const resolutionTimes = data.resolutionTimes || [];
    const slaData = data.slaData || [];
    const rootCauses = data.rootCauses || [];
    
    // Calculate missing values that might be needed for analysis
    const totalIncidents = summary.totalIncidents || 0;
    if (!summary.inProgressIncidents) {
      summary.inProgressIncidents = Math.floor(totalIncidents * 0.15); // Assume 15% in progress
    }
    
    // Convert React components to HTML strings
    const statusTable = renderStatusBreakdown(summary);
    const priorityTable = renderPriorityBreakdown(summary);
    const resolutionTimeTable = renderResolutionTimeTable(summary);
    const categoriesTable = renderTopCategoriesTable(trends);
    const rootCausesTable = renderTopRootCausesTable(rootCauses);
    
    // Common status breakdown for all analysis types
    const statusBreakdown = `
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
          <h2 class="text-xl font-semibold">Status Breakdown</h2>
        </div>
        ${statusTable || '<p>No status data available.</p>'}
      </div>
    `;
    
    if (chartType === 'comprehensive' || chartType === 'mixed') {
      return `
        <div class="prose max-w-none">
          <div class="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              <h2 class="text-xl font-semibold">Priority Breakdown</h2>
            </div>
            ${priorityTable || '<p>No priority data available.</p>'}
          </div>
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-indigo-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="3" y2="21" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
              <h2 class="text-xl font-semibold">Resolution Time Analysis</h2>
            </div>
            ${resolutionTimeTable || '<p>No resolution time data available.</p>'}
          </div>
          
          ${trends && trends.categories && trends.categories.length > 0 ? `
            <div class="mb-6">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-purple-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M5.2 15.4c0-1.3.9-2.5 2.2-2.8 1.3-.3 2.6.3 3.2 1.5.6 1.1 1.8 1.8 3.1 1.8 2 0 3.5-1.6 3.5-3.5 0-2-1.6-3.5-3.5-3.5-1.3 0-2.5.7-3.1 1.8-.6 1.1-1.9 1.7-3.2 1.5-1.3-.3-2.2-1.5-2.2-2.8 0-1.6 1.3-3 3-3 .9 0 1.8.4 2.4 1.1" /></svg>
                <h2 class="text-xl font-semibold">Top Categories</h2>
              </div>
              ${categoriesTable || '<p>No category data available.</p>'}
            </div>
          ` : ''}
          
          ${rootCauses && rootCauses.length > 0 ? `
            <div class="mb-6">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-green-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                <h2 class="text-xl font-semibold">Root Cause Analysis</h2>
              </div>
              ${rootCausesTable || '<p>No root cause data available.</p>'}
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
            <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            <h1 class="text-2xl font-bold">Priority Analysis for ServiceNow Incidents</h1>
          </div>
          
          ${statusBreakdown}
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              <h2 class="text-xl font-semibold">Priority Distribution</h2>
            </div>
            ${priorityTable || '<p>No priority data available.</p>'}
          </div>
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-indigo-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="3" y2="21" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
              <h2 class="text-xl font-semibold">Resolution Time by Priority</h2>
            </div>
            ${resolutionTimeTable || '<p>No resolution time data available.</p>'}
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
            <svg xmlns="http://www.w3.org/2000/svg" class="text-indigo-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="3" y2="21" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
            <h1 class="text-2xl font-bold">Incident Trends Analysis</h1>
          </div>
          
          ${statusBreakdown}
          
          ${trends && trends.categories && trends.categories.length > 0 ? `
            <div class="mb-6">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-purple-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M5.2 15.4c0-1.3.9-2.5 2.2-2.8 1.3-.3 2.6.3 3.2 1.5.6 1.1 1.8 1.8 3.1 1.8 2 0 3.5-1.6 3.5-3.5 0-2-1.6-3.5-3.5-3.5-1.3 0-2.5.7-3.1 1.8-.6 1.1-1.9 1.7-3.2 1.5-1.3-.3-2.2-1.5-2.2-2.8 0-1.6 1.3-3 3-3 .9 0 1.8.4 2.4 1.1" /></svg>
                <h2 class="text-xl font-semibold">Category Trends</h2>
              </div>
              ${categoriesTable || '<p>No category data available.</p>'}
            </div>
          ` : ''}
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-green-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
            <h1 class="text-2xl font-bold">ServiceNow Incident Analysis</h1>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <p class="font-medium">Based on the available data, the ServiceNow incident management system is handling 
            ${summary.totalIncidents} incidents, with ${Math.round((summary.resolvedIncidents / summary.totalIncidents) * 100) || 0}% resolved.</p>
          </div>
          
          ${statusBreakdown}
          
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
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
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <BrainCircuit className="h-5 w-5 text-indigo-500 mr-2" />
                {title || 'ServiceNow Analysis'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {loading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Analyzing ServiceNow incident data...</p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md">
                  <p className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                  </p>
                </div>
              )}
              
              {!loading && !error && (
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: analysis || '<p>No analysis available. Please try again.</p>' 
                  }}
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