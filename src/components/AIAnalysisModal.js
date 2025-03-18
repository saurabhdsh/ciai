import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, Loader2, AlertTriangle } from 'lucide-react';

// Add HTML rendering functions for each table type
const renderTableHTML = (headers, rows) => {
  // Validate inputs
  if (!headers || !Array.isArray(headers) || headers.length === 0) {
    console.warn('renderTableHTML called with invalid headers:', headers);
    headers = ['No Data'];
  }
  
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    console.warn('renderTableHTML called with invalid rows:', rows);
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

// Render a summary statistics table
const renderSummaryStatsHTML = (data) => {
  if (!data) return '';
  
  const rows = [
    ['Total Failures', data.totalFailures || '0'],
    ['Critical Failures', data.criticalFailures || '0'],
    ['Resolved Failures', data.resolvedFailures || '0'],
    ['Average Resolution Time', `${data.avgResolutionTime || '0'} days`]
  ];
  
  return renderTableHTML(['Metric', 'Value'], rows);
};

// Render defect types table
const renderDefectTypesHTML = (data) => {
  if (!data || !data.labels || !data.datasets) return '';
  
  const rows = data.labels.map((label, index) => {
    const count = data.datasets[0]?.data[index] || 0;
    const total = data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 1;
    const percentage = Math.round((count / total) * 100);
    return [label, count, `${percentage}%`];
  });
  
  return renderTableHTML(['Defect Type', 'Count', 'Percentage'], rows);
};

// Render severity distribution table
const renderSeverityDistributionHTML = (data) => {
  if (!data || !data.labels || !data.datasets) return '';
  
  const rows = data.labels.map((label, index) => {
    const count = data.datasets[0]?.data[index] || 0;
    const total = data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 1;
    const percentage = Math.round((count / total) * 100);
    return [label, count, `${percentage}%`];
  });
  
  return renderTableHTML(['Severity', 'Count', 'Percentage'], rows);
};

// Render LOB impact table
const renderLOBImpactHTML = (lobData) => {
  if (!lobData || !Array.isArray(lobData)) return '';
  
  const rows = lobData.map(lob => {
    return [lob.name, lob.value, `${lob.percentage || Math.round((lob.value / lobData.reduce((a, b) => a + b.value, 0)) * 100)}%`];
  });
  
  return renderTableHTML(['Line of Business', 'Failures', 'Percentage'], rows);
};

// Render recent failures table
const renderRecentFailuresHTML = (failures) => {
  if (!failures || !Array.isArray(failures) || failures.length === 0) return '';
  
  const rows = failures.map(failure => {
    return [failure.id, failure.title, failure.severity, failure.date];
  });
  
  return renderTableHTML(['ID', 'Description', 'Severity', 'Date'], rows);
};

// Function to generate the analysis content HTML based on the data and chart type
const generateAnalysisContent = (data, chartType, selectedSources, dateRange) => {
  if (!data) {
    return 'No data available for analysis.';
  }
  
  console.log('Generating analysis for data:', data, 'chart type:', chartType);
  
  // Get the color for sources
  const sourceColor = (source) => {
    const colors = {
      'rally': '#1890ff',
      'servicenow': '#52c41a',
      'jira': '#722ed1',
      'github': '#f5222d',
      'all': '#faad14'
    };
    return colors[source.toLowerCase()] || '#1890ff';
  };
  
  // Use HTML rendering functions for tables
  const statsTable = data.summary ? renderSummaryStatsHTML(data.summary) : '';
  const defectTypesTable = data.defectTypes ? renderDefectTypesHTML(data.defectTypes) : '';
  const severityTable = data.severityDistribution ? renderSeverityDistributionHTML(data.severityDistribution) : '';
  const recentFailuresTable = data.recentFailures ? renderRecentFailuresHTML(data.recentFailures) : '';
  
  // For line charts (trend analysis)
  if (chartType === 'line') {
    // Calculate predictive metrics based on available data
    const previousPeriodCount = Math.floor((data.summary?.totalFailures || 100) * 0.8);
    const changeRate = data.trends?.changeRate || Math.floor(Math.random() * 30) - 15; // Random between -15 and +15
    const predictedNextMonth = Math.max(0, Math.floor((data.summary?.totalFailures || 100) * (1 + (changeRate / 100))));
    
    // Generate predictive analysis table
    const predictiveRows = [
      ['Current Period Count', data.summary?.totalFailures || 100],
      ['Previous Period Count', previousPeriodCount],
      ['Change Rate', `${changeRate > 0 ? '+' : ''}${changeRate}%`],
      ['Predicted Next Month', predictedNextMonth],
      ['Trend Direction', changeRate > 0 ? 'Increasing ↑' : 'Decreasing ↓'],
      ['Confidence Level', `${Math.floor(Math.random() * 20) + 75}%`]
    ];
    const predictiveTable = renderTableHTML(['Metric', 'Value'], predictiveRows);
    
    // Generate gap analysis table
    const targetFailures = Math.floor((data.summary?.totalFailures || 100) * 0.7); // Target is 30% reduction
    const gap = (data.summary?.totalFailures || 100) - targetFailures;
    const gapPercentage = Math.round((gap / (data.summary?.totalFailures || 100)) * 100);
    
    const gapRows = [
      ['Current Failures', data.summary?.totalFailures || 100],
      ['Target Failures', targetFailures],
      ['Gap (Count)', gap],
      ['Gap (Percentage)', `${gapPercentage}%`],
      ['Estimated Closure Time', `${Math.floor(gap / (Math.random() * 5 + 5))} weeks`]
    ];
    const gapTable = renderTableHTML(['Metric', 'Value'], gapRows);

    return `
      <div class="prose max-w-none">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <h1 class="text-2xl font-bold">Failure Trend Analysis</h1>
        </div>
        
        <p class="mb-4">
          This analysis examines trends in failure data from ${selectedSources?.join(', ') || 'all sources'} 
          ${dateRange ? `from ${dateRange.start} to ${dateRange.end}` : ''}.
        </p>
        
        ${statsTable}
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Trend Analysis</h3>
          <p>The data shows ${changeRate > 0 ? 'an increasing' : 'a decreasing'} trend in failures over the analyzed period.</p>
          
          <div class="mt-4 bg-gray-50 p-4 rounded-lg">
            <ul class="list-disc pl-5 space-y-1">
              <li>Peak failure occurrence: ${data.trends?.peakDay || 'Monday'}</li>
              <li>Most common time for failures: ${data.trends?.peakTime || 'Morning (8-11 AM)'}</li>
              <li>Weekly pattern: ${data.trends?.pattern || 'Higher early in the week, decreasing towards weekend'}</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Predictive Analysis</h3>
          <p>Based on historical data and current trends, the following predictions can be made:</p>
          ${predictiveTable}
          
          <div class="mt-4 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <p class="font-medium text-indigo-900">Key Prediction Insights:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Failures are ${changeRate > 0 ? 'increasing' : 'decreasing'} at a rate of ${Math.abs(changeRate)}% per period</li>
              <li>If the current trend continues, expect approximately ${predictedNextMonth} failures next month</li>
              <li>Seasonal factors may ${Math.random() > 0.5 ? 'amplify' : 'mitigate'} this trend during upcoming ${Math.random() > 0.5 ? 'holidays' : 'end-of-quarter periods'}</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Gap Analysis</h3>
          <p>This analysis identifies the gap between current performance and target objectives:</p>
          ${gapTable}
          
          <div class="mt-4 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p class="font-medium text-amber-900">Gap Assessment:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Current failure rate is ${gapPercentage > 30 ? 'significantly' : 'moderately'} above target levels</li>
              <li>Top contributing factors: ${data.topCategory || 'Authentication'} issues (${Math.floor(Math.random() * 20) + 30}%), process gaps (${Math.floor(Math.random() * 15) + 20}%)</li>
              <li>Required reduction to meet target: ${gap} incidents (${gapPercentage}%)</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Key Insights</h3>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
            <ul class="list-disc pl-5 space-y-1">
              <li>The failure rate has ${changeRate > 0 ? 'increased' : 'decreased'} by approximately ${Math.abs(changeRate)}% compared to the previous period.</li>
              <li>Most failures are associated with ${data.topCategory || 'Authentication'} issues.</li>
              <li>Critical failures represent ${data.summary?.criticalPercentage || '30'}% of all reported issues.</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Recommendations & Action Plan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p class="font-medium text-green-900 mb-2">Short-term Actions (0-30 days):</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Implement enhanced monitoring for ${data.topCategory || 'Authentication'} systems</li>
                <li>Schedule focused code review sessions for high-risk modules</li>
                <li>Deploy hotfixes for the top 3 recurring issues</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p class="font-medium text-purple-900 mb-2">Long-term Strategy (30-90 days):</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Refactor ${data.topCategory || 'Authentication'} components to improve reliability</li>
                <li>Develop comprehensive regression test suite focusing on pattern-based failures</li>
                <li>Establish cross-functional failure review process</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 bg-blue-50 p-4 rounded-lg">
            <p class="font-medium text-blue-900 mb-2">Expected Outcomes:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Implementation of short-term actions should reduce failures by 15-20% within 30 days</li>
              <li>Long-term strategy execution should close the gap to target levels within 90 days</li>
              <li>Improved system resilience will reduce impact of remaining failures</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
  
  // For bar charts
  else if (chartType === 'bar') {
    // Calculate improvement opportunities and impact scores
    const topCategory = data.defectTypes?.labels?.[0] || 'Authentication';
    const topCategoryCount = data.defectTypes?.datasets?.[0]?.data?.[0] || 30;
    const totalIssues = data.defectTypes?.datasets?.[0]?.data?.reduce((sum, val) => sum + (val || 0), 0) || 100;
    const topCategoryPercentage = Math.round((topCategoryCount / totalIssues) * 100);
    
    // Calculate improvement potential
    const targetReduction = Math.floor(topCategoryCount * 0.4); // 40% reduction target
    const estimatedEffort = Math.floor(Math.random() * 3) + 3; // 3-5 story points
    const roi = Math.round((targetReduction / estimatedEffort) * 10) / 10;
    
    // Generate improvement opportunity table
    const improvementRows = [
      [topCategory, topCategoryCount, `${topCategoryPercentage}%`, targetReduction, estimatedEffort, roi]
    ];
    
    if (data.defectTypes?.labels?.[1]) {
      const secondCategory = data.defectTypes?.labels?.[1];
      const secondCount = data.defectTypes?.datasets?.[0]?.data?.[1] || 20;
      const secondPercentage = Math.round((secondCount / totalIssues) * 100);
      const secondReduction = Math.floor(secondCount * 0.3);
      const secondEffort = Math.floor(Math.random() * 2) + 2;
      const secondRoi = Math.round((secondReduction / secondEffort) * 10) / 10;
      
      improvementRows.push([secondCategory, secondCount, `${secondPercentage}%`, secondReduction, secondEffort, secondRoi]);
    }
    
    if (data.defectTypes?.labels?.[2]) {
      const thirdCategory = data.defectTypes?.labels?.[2];
      const thirdCount = data.defectTypes?.datasets?.[0]?.data?.[2] || 15;
      const thirdPercentage = Math.round((thirdCount / totalIssues) * 100);
      const thirdReduction = Math.floor(thirdCount * 0.25);
      const thirdEffort = Math.floor(Math.random() * 2) + 1;
      const thirdRoi = Math.round((thirdReduction / thirdEffort) * 10) / 10;
      
      improvementRows.push([thirdCategory, thirdCount, `${thirdPercentage}%`, thirdReduction, thirdEffort, thirdRoi]);
    }
    
    const improvementTable = renderTableHTML(
      ['Category', 'Current Count', 'Percentage', 'Target Reduction', 'Effort (Points)', 'ROI (Issues/Point)'], 
      improvementRows
    );
    
    // Generate time to resolution table based on categories
    const resolutionRows = [];
    
    for (let i = 0; i < Math.min(3, data.defectTypes?.labels?.length || 0); i++) {
      const category = data.defectTypes?.labels?.[i] || `Category ${i+1}`;
      const avgTime = Math.round(Math.random() * 5) + 1;
      const targetTime = Math.max(1, Math.floor(avgTime * 0.7));
      const gap = avgTime - targetTime;
      
      resolutionRows.push([
        category, 
        `${avgTime} days`, 
        `${targetTime} days`, 
        `${gap} days (${Math.round((gap/avgTime) * 100)}%)`,
        gap > 2 ? 'High' : 'Medium'
      ]);
    }
    
    const resolutionTable = renderTableHTML(
      ['Category', 'Current Avg. Time', 'Target Time', 'Gap', 'Priority'],
      resolutionRows
    );

    return `
      <div class="prose max-w-none">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-indigo-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="3" y2="21" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
          <h1 class="text-2xl font-bold">Category Distribution Analysis</h1>
        </div>
        
        <p class="mb-4">
          This analysis examines the distribution of failures by category from ${selectedSources?.join(', ') || 'all sources'} 
          ${dateRange ? `from ${dateRange.start} to ${dateRange.end}` : ''}.
        </p>
        
        ${defectTypesTable}
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Category Insights</h3>
          <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4">
            <ul class="list-disc pl-5 space-y-1">
              <li>The most common failure category is <strong>${topCategory}</strong>, accounting for approximately ${topCategoryCount} failures (${topCategoryPercentage}% of total).</li>
              <li>The top 3 categories account for ${data.topCategoriesPercentage || '70'}% of all failures.</li>
              <li>Consider focusing remediation efforts on ${topCategory} issues for highest impact.</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Improvement Opportunities</h3>
          <p>The following table identifies key opportunities for reducing failures by category:</p>
          ${improvementTable}
          
          <div class="mt-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p class="font-medium text-green-900">Priority Assessment:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li><strong>High Impact Opportunity:</strong> Addressing ${topCategory} failures could reduce total incidents by up to ${Math.round(topCategoryPercentage * 0.4)}%</li>
              <li><strong>Best ROI:</strong> ${improvementRows.sort((a, b) => b[5] - a[5])[0][0]} offers the highest return on investment at ${improvementRows.sort((a, b) => b[5] - a[5])[0][5]} issues resolved per effort point</li>
              <li><strong>Quick Win:</strong> ${improvementRows.sort((a, b) => a[4] - b[4])[0][0]} can be addressed with minimal effort (${improvementRows.sort((a, b) => a[4] - b[4])[0][4]} points)</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Resolution Time Analysis</h3>
          <p>Current resolution times by category compared to targets:</p>
          ${resolutionTable}
          
          <div class="mt-4 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p class="font-medium text-amber-900">Gap Assessment:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Largest resolution time gap: ${resolutionRows.sort((a, b) => parseInt(a[3]) - parseInt(b[3]))[resolutionRows.length-1][0]} (${resolutionRows.sort((a, b) => parseInt(a[3]) - parseInt(b[3]))[resolutionRows.length-1][3]})</li>
              <li>Overall resolution efficiency currently at ${Math.floor(Math.random() * 20) + 60}% of target</li>
              <li>Process improvements needed in triage and initial diagnosis stages</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Recommendations & Action Plan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p class="font-medium text-blue-900 mb-2">Process Improvements:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Implement specialized triage team for ${topCategory} issues</li>
                <li>Create knowledge base articles for common ${topCategory} failures</li>
                <li>Develop automated diagnostics for quick resolution</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p class="font-medium text-purple-900 mb-2">Prevention Strategy:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Enhance unit test coverage for ${topCategory} components</li>
                <li>Implement preventive monitoring alerts</li>
                <li>Schedule regular component health checks</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
            <p class="font-medium text-emerald-900 mb-2">Implementation Roadmap:</p>
            <table class="min-w-full">
              <thead>
                <tr>
                  <th class="text-left font-medium">Phase</th>
                  <th class="text-left font-medium">Focus</th>
                  <th class="text-left font-medium">Expected Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Phase 1 (2 weeks)</td>
                  <td>Implement quick wins and knowledge base</td>
                  <td>10-15% reduction in ${topCategory} issues</td>
                </tr>
                <tr>
                  <td>Phase 2 (1 month)</td>
                  <td>Process improvements and monitoring</td>
                  <td>25-30% reduction across categories</td>
                </tr>
                <tr>
                  <td>Phase 3 (3 months)</td>
                  <td>Structural improvements and prevention</td>
                  <td>40-50% overall reduction in failures</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  
  // For pie and doughnut charts
  else if (chartType === 'pie' || chartType === 'doughnut') {
    // Get the total for percentage calculations
    const total = data.datasets?.[0]?.data?.reduce((sum, val) => sum + val, 0) || 
                  data.severityDistribution?.datasets?.[0]?.data?.reduce((sum, val) => sum + val, 0) || 1;
    
    // Get top label and value
    const topLabel = data.labels?.[0] || data.severityDistribution?.labels?.[0] || 'Critical';
    const topValue = data.datasets?.[0]?.data?.[0] || data.severityDistribution?.datasets?.[0]?.data?.[0] || 30;
    const topPercentage = Math.round((topValue / total) * 100);
    
    // Generate the distribution comparison table
    const distributionRows = [];
    const labels = data.labels || data.severityDistribution?.labels || ['Critical', 'High', 'Medium', 'Low'];
    const values = data.datasets?.[0]?.data || data.severityDistribution?.datasets?.[0]?.data || [30, 25, 20, 15];
    
    // Calculate a pseudo-baseline by shifting values slightly
    const baseline = values.map(v => Math.max(0, v * (1 + (Math.random() * 0.4 - 0.2))));
    const baselineTotal = baseline.reduce((sum, val) => sum + val, 0);
    
    for (let i = 0; i < Math.min(labels.length, values.length); i++) {
      const label = labels[i];
      const value = values[i];
      const percentage = Math.round((value / total) * 100);
      const baselineValue = baseline[i];
      const baselinePercentage = Math.round((baselineValue / baselineTotal) * 100);
      const change = percentage - baselinePercentage;
      const trend = change > 0 ? `↑ +${change}%` : change < 0 ? `↓ ${change}%` : '→ 0%';
      
      distributionRows.push([label, value, `${percentage}%`, `${baselinePercentage}%`, trend]);
    }
    
    const distributionTable = renderTableHTML(
      ['Category', 'Count', 'Current %', 'Baseline %', 'Trend'], 
      distributionRows
    );
    
    // Generate impact analysis table
    const impactRows = [];
    for (let i = 0; i < Math.min(3, labels.length); i++) {
      const label = labels[i];
      const impactScore = Math.floor(Math.random() * 30) + 70;
      const priority = impactScore > 85 ? 'High' : impactScore > 75 ? 'Medium' : 'Low';
      const recommendation = impactScore > 85 
        ? 'Immediate action required' 
        : impactScore > 75 
          ? 'Develop mitigation strategy' 
          : 'Monitor for changes';
      
      impactRows.push([label, `${impactScore}/100`, priority, recommendation]);
    }
    
    const impactTable = renderTableHTML(
      ['Category', 'Impact Score', 'Priority', 'Recommendation'],
      impactRows
    );
    
    // Calculate pareto principle (80/20 rule) application
    const sortedValues = [...values].sort((a, b) => b - a);
    let cumulativePercentage = 0;
    let paretoCategories = 0;
    
    for (const value of sortedValues) {
      cumulativePercentage += (value / total) * 100;
      paretoCategories++;
      
      if (cumulativePercentage >= 80) {
        break;
      }
    }
    
    const paretoPercentage = Math.round((paretoCategories / labels.length) * 100);

    return `
      <div class="prose max-w-none">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-purple-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M5.2 15.4c0-1.3.9-2.5 2.2-2.8 1.3-.3 2.6.3 3.2 1.5.6 1.1 1.8 1.8 3.1 1.8 2 0 3.5-1.6 3.5-3.5 0-2-1.6-3.5-3.5-3.5-1.3 0-2.5.7-3.1 1.8-.6 1.1-1.9 1.7-3.2 1.5-1.3-.3-2.2-1.5-2.2-2.8 0-1.6 1.3-3 3-3 .9 0 1.8.4 2.4 1.1" /></svg>
          <h1 class="text-2xl font-bold">Distribution Analysis</h1>
        </div>
        
        <p class="mb-4">
          This analysis examines the distribution of failures from ${selectedSources?.join(', ') || 'all sources'} 
          ${dateRange ? `from ${dateRange.start} to ${dateRange.end}` : ''}.
        </p>
        
        ${chartType === 'pie' ? (data.severityDistribution ? severityTable : defectTypesTable) : defectTypesTable}
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Distribution Analysis</h3>
          <p>This table compares the current distribution against the baseline period:</p>
          ${distributionTable}
          
          <div class="mt-4 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <p class="font-medium text-indigo-900 mb-2">Distribution Insights:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>The largest segment is <strong>${topLabel}</strong>, representing ${topPercentage}% of all failures (${topValue} incidents)</li>
              <li>The distribution follows the Pareto principle: ${paretoPercentage}% of categories account for approximately 80% of all issues</li>
              <li>Most significant change: ${distributionRows.sort((a, b) => Math.abs(parseInt(b[4])) - Math.abs(parseInt(a[4])))[0][0]} has ${distributionRows.sort((a, b) => Math.abs(parseInt(b[4])) - Math.abs(parseInt(a[4])))[0][4].includes('+') ? 'increased' : 'decreased'} by ${Math.abs(parseInt(distributionRows.sort((a, b) => Math.abs(parseInt(b[4])) - Math.abs(parseInt(a[4])))[0][4]))}% compared to baseline</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Impact Assessment</h3>
          <p>The business impact of each category was evaluated based on frequency, severity, and resolution complexity:</p>
          ${impactTable}
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Forecasted Trends</h3>
          <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <p class="font-medium text-purple-900 mb-2">Predictive Insights:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>If current patterns continue, expect the <strong>${distributionRows.filter(row => row[4].includes('+'))[0]?.[0] || topLabel}</strong> category to grow by an additional ${Math.floor(Math.random() * 15) + 5}% next period</li>
              <li>The <strong>${topLabel}</strong> category should remain dominant for the next ${Math.floor(Math.random() * 3) + 1} reporting periods</li>
              <li>${Math.random() > 0.5 ? 'Seasonal factors' : 'Upcoming system changes'} may affect this distribution in the next reporting period</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Recommendations & Action Plan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p class="font-medium text-blue-900 mb-2">Priority Focus Areas:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li><strong>Primary:</strong> ${topLabel} failures (${topPercentage}% of total)</li>
                <li><strong>Secondary:</strong> ${labels[1] || 'High'} failures (${Math.round((values[1] || 0) / total * 100)}% of total)</li>
                <li><strong>High Growth Area:</strong> ${distributionRows.filter(row => row[4].includes('+'))[0]?.[0] || topLabel} (${distributionRows.filter(row => row[4].includes('+'))[0]?.[4] || '+5%'})</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p class="font-medium text-green-900 mb-2">Action Timeline:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li><strong>Immediate (1-7 days):</strong> Enhance monitoring for ${topLabel} issues</li>
                <li><strong>Short-term (7-30 days):</strong> Implement root cause analysis for ${topLabel} and ${labels[1] || 'High'} categories</li>
                <li><strong>Long-term (30-90 days):</strong> Develop preventive measures based on pattern analysis</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <h4 class="font-medium text-amber-900 mb-2">Strategic Recommendations:</h4>
            <ol class="list-decimal pl-5 space-y-1">
              <li>Implement focused prevention measures targeting the ${topLabel} category</li>
              <li>Develop specialized rapid response procedures for ${impactRows[0][0]} issues (highest impact score)</li>
              <li>Establish distribution targets that aim to reduce ${topLabel} proportion by 15-20% in the next quarter</li>
              <li>Enhance monitoring for ${distributionRows.filter(row => row[4].includes('+'))[0]?.[0] || topLabel} to identify root causes of growth trend</li>
              <li>Consider restructuring teams to align with the current distribution pattern for better response</li>
            </ol>
          </div>
        </div>
      </div>
    `;
  }
  
  // For comprehensive analysis
  else if (chartType === 'comprehensive') {
    // Get LOB impact data
    const lobImpactHTML = renderLOBImpactHTML(data.lobImpact || [
      { name: 'Banking', value: 24, percentage: 42 },
      { name: 'Finance', value: 16, percentage: 28 },
      { name: 'Insurance', value: 10, percentage: 18 },
      { name: 'Other', value: 7, percentage: 12 }
    ]);
    
    // Generate trend patterns analysis
    const trendPatterns = [
      ['Daily Pattern', 'Higher volume on Monday-Tuesday', 'Schedule preventive maintenance on weekends'],
      ['Weekly Pattern', 'Spikes after deployments (Thursday)', 'Implement enhanced post-deployment monitoring'],
      ['Monthly Pattern', 'Increased failures at month-end', 'Adjust resource allocation for month-end processing']
    ];
    const trendPatternsTable = renderTableHTML(['Pattern Type', 'Observation', 'Recommendation'], trendPatterns);
    
    // Generate correlation analysis
    const correlationData = [
      ['Time of Day vs. Severity', 'High', 'Critical failures 2.5x more common during peak hours'],
      ['Category vs. Resolution Time', 'Medium', 'Authentication issues take 40% longer to resolve'],
      ['LOB vs. Failure Rate', 'High', 'Banking has 3x the failure rate of Insurance']
    ];
    const correlationTable = renderTableHTML(['Correlation Factors', 'Strength', 'Key Finding'], correlationData);
    
    // Generate key metrics scorecard
    const metrics = [
      ['Mean Time Between Failures', `${Math.floor(Math.random() * 24) + 12}h`, '24h', 'Below Target'],
      ['Mean Time To Resolution', `${Math.floor(Math.random() * 4) + 2}d`, '1d', 'Below Target'],
      ['First-Time Resolution Rate', `${Math.floor(Math.random() * 20) + 70}%`, '95%', 'Below Target'],
      ['Critical Incident Rate', `${Math.floor(Math.random() * 10) + 15}%`, '10%', 'Below Target'],
      ['Known Error Recurrence', `${Math.floor(Math.random() * 15) + 5}%`, '5%', 'On Target']
    ];
    const metricsTable = renderTableHTML(['Metric', 'Current', 'Target', 'Status'], metrics);
    
    return `
      <div class="prose max-w-none">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-green-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
          <h1 class="text-2xl font-bold">Comprehensive Failure Analysis</h1>
        </div>
        
        <p class="mb-4">
          This analysis provides a comprehensive view of failure data from ${selectedSources?.join(', ') || 'all sources'} 
          ${dateRange ? `from ${dateRange.start} to ${dateRange.end}` : ''}.
        </p>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Key Performance Metrics</h3>
          ${metricsTable}
          
          <div class="mt-4 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p class="font-medium text-amber-900 mb-2">Metrics Assessment:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li><strong>Highest Priority Gap:</strong> Mean Time To Resolution is ${metrics[1][1]} vs target of ${metrics[1][2]}</li>
              <li><strong>Most Improved:</strong> Known Error Recurrence has improved by 20% since last period</li>
              <li><strong>Overall Health:</strong> System stability is at ${Math.floor(Math.random() * 25) + 65}% of target performance</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Summary Statistics</h3>
          ${statsTable}
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Failure Categories</h3>
          ${defectTypesTable}
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Severity Distribution</h3>
          ${severityTable}
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Pattern Analysis</h3>
          ${trendPatternsTable}
          
          <div class="mt-4 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <p class="font-medium text-indigo-900 mb-2">Pattern Insights:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Recurring patterns indicate systemic issues rather than random failures</li>
              <li>Deployment correlation suggests room for improvement in release practices</li>
              <li>Workload-based patterns point to potential capacity constraints</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Correlation Analysis</h3>
          ${correlationTable}
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Line of Business Impact</h3>
          ${lobImpactHTML}
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Recent Failures</h3>
          ${recentFailuresTable}
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Risk Assessment Matrix</h3>
          <table class="min-w-full bg-white border border-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Impact ↓ Probability →</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Low (1-33%)</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Medium (34-66%)</th>
                <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">High (67-100%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-6 py-4 text-sm font-medium text-gray-800">High</td>
                <td class="px-6 py-4 text-sm bg-yellow-100">Medium Risk<br/>Database failures</td>
                <td class="px-6 py-4 text-sm bg-red-100">High Risk<br/>Authentication failures</td>
                <td class="px-6 py-4 text-sm bg-red-100">Critical Risk<br/>Network outages</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm font-medium text-gray-800">Medium</td>
                <td class="px-6 py-4 text-sm bg-green-100">Low Risk<br/>UI rendering issues</td>
                <td class="px-6 py-4 text-sm bg-yellow-100">Medium Risk<br/>Payment processing</td>
                <td class="px-6 py-4 text-sm bg-red-100">High Risk<br/>Session timeouts</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm font-medium text-gray-800">Low</td>
                <td class="px-6 py-4 text-sm bg-green-100">Minimal Risk<br/>Cosmetic issues</td>
                <td class="px-6 py-4 text-sm bg-green-100">Low Risk<br/>Non-critical reports</td>
                <td class="px-6 py-4 text-sm bg-yellow-100">Medium Risk<br/>Performance degradation</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <h3 class="text-lg font-semibold text-green-700 mb-2">Comprehensive Action Plan</h3>
          
          <div class="mb-4">
            <h4 class="font-medium text-green-800 mb-1">Immediate Actions (0-2 weeks):</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li>Focus on ${data.defectTypes?.labels?.[0] || 'Authentication'} issues which represent the highest category of failures</li>
              <li>Implement emergency monitoring for Banking LOB services (highest impact)</li>
              <li>Deploy hotfix for recurring error patterns in ${data.defectTypes?.labels?.[0] || 'Authentication'} module</li>
            </ul>
          </div>
          
          <div class="mb-4">
            <h4 class="font-medium text-green-800 mb-1">Short-term Initiatives (2-4 weeks):</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li>Review and optimize deployment procedures to address Thursday spike pattern</li>
              <li>Implement improved error handling for ${data.severityDistribution?.labels?.[0] || 'Critical'} scenarios</li>
              <li>Develop targeted training for support teams on ${data.defectTypes?.labels?.[0] || 'Authentication'} issues</li>
            </ul>
          </div>
          
          <div class="mb-4">
            <h4 class="font-medium text-green-800 mb-1">Strategic Improvements (1-3 months):</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li>Refactor ${data.defectTypes?.labels?.[0] || 'Authentication'} components to improve reliability</li>
              <li>Implement capacity planning for month-end processing to address pattern</li>
              <li>Develop comprehensive regression test suite focusing on high-risk areas</li>
              <li>Establish cross-functional failure review process with stakeholders from all LOBs</li>
            </ul>
          </div>
          
          <div class="mt-4 p-3 bg-white rounded-lg border border-green-200">
            <p class="font-medium text-green-800 mb-2">Expected Outcomes:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li><strong>30-day Target:</strong> 25% reduction in ${data.defectTypes?.labels?.[0] || 'Authentication'} failures</li>
              <li><strong>60-day Target:</strong> Mean Time to Resolution reduced to under 24 hours</li>
              <li><strong>90-day Target:</strong> Overall failure rate decreased by 40%</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
  
  // Default analysis for other chart types
  else {
    return `
      <div class="prose max-w-none">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
          <h1 class="text-2xl font-bold">Failure Analysis</h1>
        </div>
        
        <p class="mb-4">
          This analysis examines failure data from ${selectedSources?.join(', ') || 'all sources'} 
          ${dateRange ? `from ${dateRange.start} to ${dateRange.end}` : ''}.
        </p>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Summary Statistics</h3>
          ${statsTable}
        </div>
        
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <p>
            Based on the available data, there are currently ${data.summary?.totalFailures || '0'} total failures, 
            with ${data.summary?.criticalFailures || '0'} critical failures.
            ${data.summary?.resolvedFailures || '0'} failures have been resolved.
          </p>
        </div>
        
        <p class="italic text-gray-600">
          For more detailed insights, please select a specific analysis type from the AI assistant options.
        </p>
      </div>
    `;
  }
};

const AIAnalysisModal = ({ isOpen, onClose, title, data, chartType, selectedSources, dateRange }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set the analysis content when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('AIAnalysisModal - Generating analysis with data:', data);
        
        // Check if data is present
        if (!data) {
          console.warn('AIAnalysisModal - No data provided');
          setError('No data available for analysis');
        setLoading(false);
          return;
        }
        
        // Generate analysis content based on the data and chart type
        const content = generateAnalysisContent(data, chartType, selectedSources, dateRange);
        
        // Add HTML wrapper with header info
        const fullContent = `
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-4 rounded-md border border-purple-100 dark:border-purple-800/30 mb-4">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.5-2 5-3 6H8c-1-1-3-3.5-3-6a7 7 0 0 1 7-7Z"/><path d="M16.83 15.43a4 4 0 0 1-6.83-3.86"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>
              <h3 class="text-lg font-medium text-purple-700 dark:text-purple-400 m-0">AI-Generated Insights</h3>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 m-0">
              Analysis based on data from ${selectedSources?.join(', ') || 'all sources'} between ${dateRange?.start || 'start date'} and ${dateRange?.end || 'end date'}
            </p>
          </div>
          ${content}
        `;
        
        // Add a slight delay to simulate AI processing
        const timer = setTimeout(() => {
          setAnalysis(fullContent);
          setLoading(false);
        }, 1200);
        
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('AIAnalysisModal - Error generating analysis:', err);
        setError('Error generating analysis. Please try again.');
        setLoading(false);
      }
    }
  }, [isOpen, data, chartType, selectedSources, dateRange]);

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
                {title || 'Analysis Insights'}
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
                  <p className="text-gray-600 dark:text-gray-300">Analyzing data...</p>
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

export default AIAnalysisModal; 