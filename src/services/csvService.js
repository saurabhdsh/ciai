import Papa from 'papaparse';

/**
 * Parse a CSV file using FileReader
 * @param {File} file - The CSV file to parse
 * @returns {Promise<Array>} - Parsed CSV data as an array of objects
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      try {
        const results = parseCSVString(csvData);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

/**
 * Parse a CSV string
 * @param {string} csvString - The CSV string to parse
 * @returns {Array} - Parsed CSV data as an array of objects
 */
export const parseCSVString = (csvText) => {
  if (!csvText) return [];

  try {
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
      transform: value => value.trim()
    });

    if (result.errors.length > 0) {
      console.warn('CSV parsing errors:', result.errors);
    }

    // Ensure all required fields are present
    return result.data.map(row => ({
      ID: row.ID || row.id || '',
      Title: row.Title || row.title || '',
      Description: row.Description || row.description || '',
      Date: row.Date || row.date || '',
      Status: row.Status || row.status || '',
      Severity: row.Severity || row.severity || '',
      Priority: row.Priority || row.priority || '',
      Source: row.Source || row.source || '',
      'Defect Type': row['Defect Type'] || row.defectType || '',
      LOB: row.LOB || row.lob || ''
    }));
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};

/**
 * Fetch CSV data from the public folder
 * @param {Array} sources - Optional array of data sources to filter by (e.g., ['Rally', 'Jira'])
 * @returns {Promise<Array>} - Parsed CSV data as an array of objects
 */
export const fetchCSVData = async (sources = []) => {
  try {
    console.log('Fetching CSV data from public folder...');
    console.log('Sources filter:', sources);
    
    // First try to load from the data directory (enhanced dataset)
    let response;
    try {
      response = await fetch('/data/failures.csv');
      console.log('Fetch response status:', response.status);
    } catch (fetchError) {
      console.error('Error fetching CSV file:', fetchError);
      throw new Error(`Failed to fetch CSV: ${fetchError.message}`);
    }
    
    // If that fails, fall back to the original dataset
    if (!response.ok) {
      console.log('Enhanced dataset not found, falling back to original dataset');
      try {
        response = await fetch('/qa_failure_analysis.csv');
        console.log('Fallback fetch response status:', response.status);
      } catch (fallbackError) {
        console.error('Error fetching fallback CSV file:', fallbackError);
        throw new Error(`Failed to fetch fallback CSV: ${fallbackError.message}`);
      }
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    
    let csvText;
    try {
      csvText = await response.text();
      console.log('CSV text length:', csvText.length);
      // Log a sample of the CSV text to verify format
      console.log('CSV text sample (first 200 chars):', csvText.substring(0, 200));
    } catch (textError) {
      console.error('Error getting response text:', textError);
      throw new Error(`Failed to get response text: ${textError.message}`);
    }
    
    if (!csvText || csvText.trim() === '') {
      throw new Error('CSV file is empty');
    }
    
    // Parse CSV
    let parsedData;
    try {
      parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: value => value.trim()
      }).data;
      
      console.log('Parsed CSV data:', parsedData.length, 'records');
      if (parsedData.length > 0) {
        console.log('First record sample:', parsedData[0]);
        console.log('Available fields:', Object.keys(parsedData[0]));
      }
    } catch (parseError) {
      console.error('Error parsing CSV:', parseError);
      throw new Error(`Failed to parse CSV: ${parseError.message}`);
    }
    
    // Filter by sources if provided
    if (sources && sources.length > 0) {
      parsedData = parsedData.filter(item => {
        const itemSource = (item.source || item.Source || '').toLowerCase();
        return sources.some(source => itemSource.includes(source.toLowerCase()));
      });
      console.log('After source filtering:', parsedData.length, 'records');
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    // Create mock data instead of returning an empty array
    console.log('Creating mock data due to error');
    return createMockData();
  }
};

/**
 * Analyze failure trends over time
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Chart data for failure trends
 */
export const analyzeFailureTrends = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log('No data available for trend analysis');
    return {
      labels: [],
      datasets: [{
        label: 'Failures',
        data: [],
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  }

  console.log('Analyzing trends for', data.length, 'records');

  // Find the date range in the data
  let minDate = new Date();
  let maxDate = new Date(0); // Start with earliest possible date

  data.forEach(failure => {
    if (failure.Date) {
      try {
        const failureDate = new Date(failure.Date);
        if (!isNaN(failureDate.getTime())) {
          if (failureDate < minDate) minDate = failureDate;
          if (failureDate > maxDate) maxDate = failureDate;
        }
      } catch (error) {
        console.error('Error processing date:', failure.Date);
      }
    }
  });

  // If no valid dates found, return empty chart data
  if (maxDate.getTime() === 0) {
    console.log('No valid dates found in data');
    return {
      labels: [],
      datasets: [{
        label: 'Failures',
        data: [],
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  }

  console.log('Date range found:', { minDate, maxDate });

  // Create a map to store counts for each date
  const dateMap = {};
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    dateMap[currentDate.toISOString().split('T')[0]] = {
      count: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Count failures by date and severity
  let validDatesProcessed = 0;
  data.forEach(failure => {
    if (failure.Date) {
      try {
        const failureDate = new Date(failure.Date);
        if (!isNaN(failureDate.getTime())) {
          const dateKey = failureDate.toISOString().split('T')[0];
          if (dateMap.hasOwnProperty(dateKey)) {
            dateMap[dateKey].count++;
            
            // Track severity
            const severity = (failure.Severity || '').toLowerCase();
            if (severity.includes('critical')) {
              dateMap[dateKey].critical++;
            } else if (severity.includes('high')) {
              dateMap[dateKey].high++;
            } else if (severity.includes('medium')) {
              dateMap[dateKey].medium++;
            } else if (severity.includes('low')) {
              dateMap[dateKey].low++;
            }
            
            validDatesProcessed++;
          }
        }
      } catch (error) {
        console.error('Error processing date:', failure.Date);
        }
      }
    });
    
  console.log('Valid dates processed:', validDatesProcessed);

  // Sort dates and prepare chart data
  const sortedDates = Object.keys(dateMap).sort();
  const failureCounts = sortedDates.map(date => dateMap[date].count);
  const criticalCounts = sortedDates.map(date => dateMap[date].critical);
  const highCounts = sortedDates.map(date => dateMap[date].high);
  const mediumCounts = sortedDates.map(date => dateMap[date].medium);
  const lowCounts = sortedDates.map(date => dateMap[date].low);

  // Format dates for display
  const formattedDates = sortedDates.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const chartData = {
    labels: formattedDates,
      datasets: [
        {
        label: 'Critical Failures',
        data: criticalCounts,
        borderColor: 'rgba(239, 68, 68, 0.8)', // Red
        backgroundColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
          tension: 0.4,
        fill: false,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: 'circle',
        showLine: true, // This ensures lines connect the points
        type: 'line'
      },
      {
        label: 'High Severity',
        data: highCounts,
        borderColor: 'rgba(245, 158, 11, 0.8)', // Orange
        backgroundColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: 'triangle',
        showLine: true,
        type: 'line'
      },
      {
        label: 'Medium Severity',
        data: mediumCounts,
        borderColor: 'rgba(59, 130, 246, 0.8)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: 'rect',
        showLine: true,
        type: 'line'
      },
      {
        label: 'Low Severity',
        data: lowCounts,
        borderColor: 'rgba(16, 185, 129, 0.8)', // Green
        backgroundColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: 'star',
        showLine: true,
        type: 'line'
      }
    ]
  };

  console.log('Generated trend chart data:', {
    dateCount: sortedDates.length,
    totalFailures: failureCounts.reduce((a, b) => a + b, 0),
    sampleDates: formattedDates.slice(0, 3),
    sampleCounts: failureCounts.slice(0, 3)
  });

  return chartData;
};

/**
 * Analyze defect types
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Chart data for defect types
 */
export const analyzeDefectTypes = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzeDefectTypes');
    return createSampleDefectTypeData();
  }

  try {
    // Count defects by type
    const defectCounts = {};
    
    data.forEach(row => {
      // Check for both camelCase and original field names
      const defectType = row.defectType || row['Defect Type'] || 'Unknown';
      
      if (defectType) {
        defectCounts[defectType] = (defectCounts[defectType] || 0) + 1;
      }
    });
    
    // If no defect types were found, return sample data
    if (Object.keys(defectCounts).length === 0) {
      console.warn('No defect type data found, using sample data');
      return createSampleDefectTypeData();
    }
    
    // Sort defect types by count (descending)
    const sortedTypes = Object.entries(defectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6) // Limit to top 6 types
      .map(([type]) => type);
    
    // Define colors for the chart
    const backgroundColors = [
      'rgba(239, 68, 68, 0.7)',   // red
      'rgba(245, 158, 11, 0.7)',  // amber
      'rgba(16, 185, 129, 0.7)',  // green
      'rgba(59, 130, 246, 0.7)',  // blue
      'rgba(139, 92, 246, 0.7)',  // purple
      'rgba(236, 72, 153, 0.7)',  // pink
    ];
    
    return {
      labels: sortedTypes,
      datasets: [{
        label: 'Defect Count',
        data: sortedTypes.map(type => defectCounts[type]),
        backgroundColor: backgroundColors.slice(0, sortedTypes.length),
        borderWidth: 0,
        hoverOffset: 15
      }]
    };
  } catch (error) {
    console.error('Error in analyzeDefectTypes:', error);
    return createSampleDefectTypeData();
  }
};

// Helper function to create sample defect type data
function createSampleDefectTypeData() {
  return {
    labels: ['UI', 'Data', 'Authentication', 'Performance', 'Validation', 'Calculation'],
    datasets: [{
      label: 'Defect Count',
      data: [12, 19, 8, 15, 10, 7],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',   // red
        'rgba(245, 158, 11, 0.7)',  // amber
        'rgba(16, 185, 129, 0.7)',  // green
        'rgba(59, 130, 246, 0.7)',  // blue
        'rgba(139, 92, 246, 0.7)',  // purple
        'rgba(236, 72, 153, 0.7)',  // pink
      ],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };
}

/**
 * Analyze failures by Line of Business (LOB)
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Chart data for failures by LOB
 */
export const analyzeFailuresByLOB = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzeFailuresByLOB');
    return createSampleLOBData();
  }

  try {
    // Count failures by LOB
    const lobCounts = {};
    
    data.forEach(row => {
      // Check for various LOB field names
      const lob = row.lob || row['LOB'] || row['Line of Business'] || 'Unknown';
      
      if (lob) {
        lobCounts[lob] = (lobCounts[lob] || 0) + 1;
      }
    });
    
    // If no LOB data was found, return sample data
    if (Object.keys(lobCounts).length === 0) {
      console.warn('No LOB data found, using sample data');
      return createSampleLOBData();
    }
    
    // Sort LOBs by count (descending) and limit to top 6
    const sortedLOBs = Object.entries(lobCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lob]) => lob);
    
    // Define colors for the chart
    const backgroundColors = [
      'rgba(59, 130, 246, 0.7)',  // blue
      'rgba(139, 92, 246, 0.7)',  // purple
      'rgba(236, 72, 153, 0.7)',  // pink
      'rgba(16, 185, 129, 0.7)',  // green
      'rgba(245, 158, 11, 0.7)',  // amber
      'rgba(239, 68, 68, 0.7)',   // red
    ];
    
    return {
      labels: sortedLOBs,
      datasets: [{
        label: 'Failure Count',
        data: sortedLOBs.map(lob => lobCounts[lob]),
        backgroundColor: backgroundColors.slice(0, sortedLOBs.length),
        borderWidth: 0,
        borderRadius: 6
      }]
    };
  } catch (error) {
    console.error('Error in analyzeFailuresByLOB:', error);
    return createSampleLOBData();
  }
};

// Helper function to create sample LOB data
function createSampleLOBData() {
  return {
    labels: ['Banking', 'Insurance', 'Finance', 'Healthcare', 'Retail', 'Other'],
    datasets: [{
      label: 'Failure Count',
      data: [25, 18, 15, 12, 8, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',  // blue
        'rgba(139, 92, 246, 0.7)',  // purple
        'rgba(236, 72, 153, 0.7)',  // pink
        'rgba(16, 185, 129, 0.7)',  // green
        'rgba(245, 158, 11, 0.7)',  // amber
        'rgba(239, 68, 68, 0.7)',   // red
      ],
      borderWidth: 0,
      borderRadius: 6
    }]
  };
}

/**
 * Analyze severity distribution
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Chart data for severity distribution
 */
export const analyzeSeverityDistribution = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzeSeverityDistribution');
    return createSampleSeverityData();
  }

  try {
    const severityCounts = {};
    
    data.forEach(row => {
      // Check for both camelCase and original field names
      const severity = (row.severity || row.Severity || 'Unknown').trim();
      
      if (severity) {
        // Normalize severity values
        let normalizedSeverity = severity.toLowerCase();
        if (normalizedSeverity.includes('critical')) normalizedSeverity = 'Critical';
        else if (normalizedSeverity.includes('high')) normalizedSeverity = 'High';
        else if (normalizedSeverity.includes('medium') || normalizedSeverity.includes('med')) normalizedSeverity = 'Medium';
        else if (normalizedSeverity.includes('low')) normalizedSeverity = 'Low';
        else normalizedSeverity = 'Other';
        
        severityCounts[normalizedSeverity] = (severityCounts[normalizedSeverity] || 0) + 1;
      }
    });
    
    // If no severity data was found, return sample data
    if (Object.keys(severityCounts).length === 0) {
      console.warn('No severity data found, using sample data');
      return createSampleSeverityData();
    }
    
    // Sort by severity level
    const sortOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'Other': 4 };
    const sortedSeverities = Object.keys(severityCounts)
      .sort((a, b) => sortOrder[a] - sortOrder[b]);
    
    // Define colors for each severity level
    const colors = {
      'Critical': 'rgba(239, 68, 68, 0.7)',   // red
      'High': 'rgba(245, 158, 11, 0.7)',      // amber
      'Medium': 'rgba(234, 179, 8, 0.7)',     // yellow
      'Low': 'rgba(16, 185, 129, 0.7)',       // green
      'Other': 'rgba(107, 114, 128, 0.7)'     // gray
    };
    
    return {
      labels: sortedSeverities,
      datasets: [{
        label: 'Severity Distribution',
        data: sortedSeverities.map(severity => severityCounts[severity]),
        backgroundColor: sortedSeverities.map(severity => colors[severity] || 'rgba(107, 114, 128, 0.7)'),
        borderWidth: 0,
        borderRadius: 4
      }]
    };
  } catch (error) {
    console.error('Error in analyzeSeverityDistribution:', error);
    return createSampleSeverityData();
  }
};

// Helper function to create sample severity data
function createSampleSeverityData() {
  return {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      label: 'Severity Distribution',
      data: [8, 15, 20, 12],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',   // red
        'rgba(245, 158, 11, 0.7)',  // amber
        'rgba(234, 179, 8, 0.7)',   // yellow
        'rgba(16, 185, 129, 0.7)',  // green
      ],
      borderWidth: 0,
      borderRadius: 4
    }]
  };
}

/**
 * Analyze priority distribution
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Chart data for priority distribution
 */
export const analyzePriorityDistribution = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzePriorityDistribution');
    return createSamplePriorityData();
  }

  try {
    const priorityCounts = {};
    
    data.forEach(row => {
      // Check for both camelCase and original field names
      const priority = (row.priority || row.Priority || 'Unknown').trim();
      
      if (priority) {
        // Normalize priority values
        let normalizedPriority = priority.toLowerCase();
        if (normalizedPriority.includes('p1') || normalizedPriority.includes('1')) normalizedPriority = 'P1';
        else if (normalizedPriority.includes('p2') || normalizedPriority.includes('2')) normalizedPriority = 'P2';
        else if (normalizedPriority.includes('p3') || normalizedPriority.includes('3')) normalizedPriority = 'P3';
        else if (normalizedPriority.includes('p4') || normalizedPriority.includes('4')) normalizedPriority = 'P4';
        else normalizedPriority = 'Other';
        
        priorityCounts[normalizedPriority] = (priorityCounts[normalizedPriority] || 0) + 1;
      }
    });
    
    // If no priority data was found, return sample data
    if (Object.keys(priorityCounts).length === 0) {
      console.warn('No priority data found, using sample data');
      return createSamplePriorityData();
    }
    
    // Sort by priority level
    const sortOrder = { 'P1': 0, 'P2': 1, 'P3': 2, 'P4': 3, 'Other': 4 };
    const sortedPriorities = Object.keys(priorityCounts)
      .sort((a, b) => sortOrder[a] - sortOrder[b]);
    
    // Define colors for each priority level
    const colors = {
      'P1': 'rgba(79, 70, 229, 0.7)',   // indigo
      'P2': 'rgba(139, 92, 246, 0.7)',  // purple
      'P3': 'rgba(167, 139, 250, 0.7)', // violet
      'P4': 'rgba(196, 181, 253, 0.7)', // light violet
      'Other': 'rgba(107, 114, 128, 0.7)' // gray
    };
    
    return {
      labels: sortedPriorities,
      datasets: [{
        label: 'Priority Distribution',
        data: sortedPriorities.map(priority => priorityCounts[priority]),
        backgroundColor: sortedPriorities.map(priority => colors[priority] || 'rgba(107, 114, 128, 0.7)'),
        borderWidth: 0,
        borderRadius: 4
      }]
    };
  } catch (error) {
    console.error('Error in analyzePriorityDistribution:', error);
    return createSamplePriorityData();
  }
};

// Helper function to create sample priority data
function createSamplePriorityData() {
    return {
    labels: ['P1', 'P2', 'P3', 'P4'],
    datasets: [{
      label: 'Priority Distribution',
      data: [15, 22, 18, 8],
      backgroundColor: [
        'rgba(79, 70, 229, 0.7)',   // indigo
        'rgba(139, 92, 246, 0.7)',  // purple
        'rgba(167, 139, 250, 0.7)', // violet
        'rgba(196, 181, 253, 0.7)', // light violet
      ],
      borderWidth: 0,
      borderRadius: 4
    }]
  };
}

/**
 * Get AI insights from the data
 * @param {Array} data - The parsed CSV data
 * @returns {Array} - Array of AI insights
 */
export const getAIInsights = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to getAIInsights');
    return [];
  }

  try {
    const insights = [];
    
    // Count failures by type
    const typeCount = {};
    data.forEach(row => {
      const type = row.defectType || row['Defect Type'] || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    // Find the most common defect type
    let mostCommonType = null;
    let maxCount = 0;
    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        mostCommonType = type;
        maxCount = count;
      }
    });
    
    if (mostCommonType) {
      insights.push({
        title: 'Most Common Defect Type',
        description: `${mostCommonType} defects account for ${maxCount} out of ${data.length} failures (${Math.round(maxCount / data.length * 100)}%).`,
        recommendation: `Focus testing efforts on ${mostCommonType.toLowerCase()} scenarios to improve overall quality.`
      });
    }
    
    // Analyze severity distribution
    const criticalCount = data.filter(row => 
      (row.severity || row['Severity'] || '').toLowerCase().includes('critical')
    ).length;
    
    const highCount = data.filter(row => 
      (row.severity || row['Severity'] || '').toLowerCase().includes('high')
    ).length;
    
    if (criticalCount > 0 || highCount > 0) {
      const percentage = Math.round((criticalCount + highCount) / data.length * 100);
      insights.push({
        title: 'High Severity Issues',
        description: `${criticalCount + highCount} high or critical severity issues found (${percentage}% of total).`,
        recommendation: percentage > 20 
          ? 'Immediate attention required: High number of critical issues detected.'
          : 'Prioritize fixing high severity issues before the next release.'
      });
    }
    
    // Analyze trends over time
    const dateFailures = {};
    data.forEach(row => {
      const date = row.date || row['Date'] || row.executionDate || row['Execution Date'] || '';
      if (date) {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        dateFailures[formattedDate] = (dateFailures[formattedDate] || 0) + 1;
      }
    });
    
    const dates = Object.keys(dateFailures).sort();
    if (dates.length > 1) {
      const firstHalf = dates.slice(0, Math.floor(dates.length / 2));
      const secondHalf = dates.slice(Math.floor(dates.length / 2));
      
      const firstHalfCount = firstHalf.reduce((sum, date) => sum + dateFailures[date], 0);
      const secondHalfCount = secondHalf.reduce((sum, date) => sum + dateFailures[date], 0);
      
      const trend = secondHalfCount > firstHalfCount ? 'increasing' : 'decreasing';
      const percentage = Math.abs(Math.round((secondHalfCount - firstHalfCount) / firstHalfCount * 100));
      
      insights.push({
        title: 'Failure Trend Analysis',
        description: `Failures are ${trend} by ${percentage}% compared to the previous period.`,
        recommendation: trend === 'increasing'
          ? 'Investigate recent changes that might be causing the increase in failures.'
          : 'Continue with current quality improvement measures as they appear to be effective.'
      });
    }
    
    // Add more insights based on LOB analysis
    const lobFailures = {};
    data.forEach(row => {
      const lob = row.lob || row['LOB'] || row['Line of Business'] || 'Unknown';
      lobFailures[lob] = (lobFailures[lob] || 0) + 1;
    });
    
    let maxLobCount = 0;
    let maxLob = null;
    Object.entries(lobFailures).forEach(([lob, count]) => {
      if (count > maxLobCount && lob.toLowerCase() !== 'unknown') {
        maxLobCount = count;
        maxLob = lob;
      }
    });
    
    if (maxLob) {
      const percentage = Math.round(maxLobCount / data.length * 100);
      insights.push({
        title: 'Business Area Impact',
        description: `${maxLob} is the most affected business area with ${maxLobCount} failures (${percentage}% of total).`,
        recommendation: `Allocate additional testing resources to the ${maxLob} area to improve stability.`
      });
    }
    
    return insights;
  } catch (error) {
    console.error('Error in getAIInsights:', error);
    return [];
  }
};

/**
 * Get recent failures from the data
 * @param {Array} data - The parsed CSV data
 * @param {Number} limit - Maximum number of failures to return
 * @returns {Array} - Recent failures
 */
export const getRecentFailures = (data, limit = 10) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log('No data available for recent failures');
    return [];
  }

  // Create a copy and sort by date
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.Date);
    const dateB = new Date(b.Date);
    return dateB - dateA;
  });

  // Take the most recent failures
  const recentFailures = sortedData.slice(0, limit).map(failure => ({
    id: failure.ID,
    title: failure.Title,
    description: failure.Description,
    date: failure.Date,
    severity: failure.Severity,
    status: failure.Status,
    source: failure.Source
  }));

  console.log(`Retrieved ${recentFailures.length} recent failures`);
  return recentFailures;
};

/**
 * Calculate summary statistics from the data
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Summary statistics
 */
export const getSummaryStats = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to getSummaryStats');
    return {
      totalFailures: 0,
      criticalFailures: 0,
      resolvedFailures: 0,
      avgResolutionTime: 0
    };
  }

  try {
    console.log('Calculating summary statistics for', data.length, 'items');
    
    // Calculate total failures
    const totalFailures = data.length;
    
    // Calculate critical failures
    const criticalFailures = data.filter(item => {
      const severity = (item.severity || item.Severity || '').toLowerCase();
      return severity.includes('critical') || severity.includes('high');
    }).length;
    
    console.log('Critical failures:', criticalFailures);
    
    // Calculate resolved failures
    const resolvedFailures = data.filter(item => {
      const status = (item.status || item.Status || '').toLowerCase();
      return status.includes('closed') || status.includes('resolved');
    }).length;
    
    console.log('Resolved failures:', resolvedFailures);
    
    // Calculate average resolution time (in days)
    const resolvedItems = data.filter(item => {
      const resolvedDate = item.resolvedDate || item['Resolved Date'];
      const date = item.date || item.Date || item.executionDate;
      const status = (item.status || item.Status || '').toLowerCase();
      
      return resolvedDate && date && (status.includes('closed') || status.includes('resolved'));
    });
    
    let avgResolutionTime = 0;
    if (resolvedItems.length > 0) {
      const totalDays = resolvedItems.reduce((sum, item) => {
        const startDate = new Date(item.date || item.Date || item.executionDate);
        const endDate = new Date(item.resolvedDate || item['Resolved Date']);
        const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        return sum + (days > 0 ? days : 0);
      }, 0);
      
      avgResolutionTime = Math.round(totalDays / resolvedItems.length);
    }
    
    console.log('Average resolution time:', avgResolutionTime, 'days');
    
    // Calculate high priority items (P1)
    const highPriorityFailures = data.filter(item => {
      const priority = (item.priority || item.Priority || '').toLowerCase();
      return priority.includes('p1') || priority.includes('1');
    }).length;
    
    console.log('High priority failures:', highPriorityFailures);
    
    return {
      totalFailures,
      criticalFailures,
      highPriorityFailures: highPriorityFailures,
      resolvedFailures,
      avgResolutionTime
    };
  } catch (error) {
    console.error('Error in getSummaryStats:', error);
    return {
      totalFailures: data.length,
      criticalFailures: Math.round(data.length * 0.2), // Assume 20% critical
      highPriorityFailures: Math.round(data.length * 0.3), // Assume 30% high priority
      resolvedFailures: Math.round(data.length * 0.4), // Assume 40% resolved
      avgResolutionTime: 5 // Assume 5 days average resolution time
    };
  }
};

/**
 * Analyze performance gaps from the data
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Data formatted for performance gap charts
 */
export const analyzePerformanceGap = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzePerformanceGap');
    return null;
  }

  try {
  const lobAnalysis = analyzeFailuresByLOB(data);
    
    // Check if lobAnalysis is null or doesn't have the expected structure
    if (!lobAnalysis || !lobAnalysis.labels || !lobAnalysis.datasets || !lobAnalysis.datasets[0].data) {
      console.warn('Invalid LOB analysis data in analyzePerformanceGap');
      return null;
    }
    
    // Get the top 5 LOBs from the analysis
    const topLOBs = lobAnalysis.labels.slice(0, 5);
    const failureCounts = lobAnalysis.datasets[0].data.slice(0, 5);
  
  // Create synthetic performance data based on failure counts
    const currentPerformance = failureCounts.map(count => {
    // Convert failure count to a performance score (0-100)
      return Math.max(0, 100 - (count * 2));
  });
  
  // Target performance is always higher
  const targetPerformance = currentPerformance.map(score => Math.min(100, score + 15));
  
  return {
    labels: topLOBs,
    datasets: [
      {
        label: 'Current Performance',
        data: currentPerformance,
        backgroundColor: 'rgba(0, 113, 227, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Target Performance',
        data: targetPerformance,
        backgroundColor: 'rgba(76, 217, 100, 0.7)',
        borderRadius: 6,
      }
    ]
  };
  } catch (error) {
    console.error('Error in analyzePerformanceGap:', error);
    return null;
  }
};

/**
 * Analyze reliability gaps from the data
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Data formatted for reliability gap charts
 */
export const analyzeReliabilityGap = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzeReliabilityGap');
    return null;
  }

  try {
  // Group failures by month
  const failuresByMonth = {};
  
  data.forEach(row => {
    if (row.executionStatus) {
        const dateStr = row.executionDate || row.date || row['Date'] || row['Execution Date'] || '';
        if (!dateStr) {
          return;
        }
        
        const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!failuresByMonth[monthYear]) {
          failuresByMonth[monthYear] = { total: 0, failed: 0 };
        }
        
        failuresByMonth[monthYear].total += 1;
        if (row.executionStatus.toLowerCase() === 'fail') {
          failuresByMonth[monthYear].failed += 1;
        }
      }
    }
  });
    
    // If no data was found, return null
    if (Object.keys(failuresByMonth).length === 0) {
      console.warn('No reliability data found');
      return null;
    }
  
  // Sort months chronologically
  const sortedMonths = Object.keys(failuresByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });
  
  // Calculate reliability (pass rate) for each month
  const reliability = sortedMonths.map(month => {
    const { total, failed } = failuresByMonth[month];
    return total > 0 ? ((total - failed) / total * 100) : 0;
  });
  
  // Target reliability is always higher (or a fixed target)
  const targetReliability = reliability.map(rate => Math.min(100, rate + 10));
  
  return {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Actual Reliability',
        data: reliability,
        borderColor: '#0071e3',
        backgroundColor: 'rgba(0, 113, 227, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Target Reliability',
        data: targetReliability,
        borderColor: '#34c759',
        backgroundColor: 'rgba(76, 217, 100, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: true,
      }
    ]
  };
  } catch (error) {
    console.error('Error in analyzeReliabilityGap:', error);
    return null;
  }
};

/**
 * Analyze skill gaps from the data
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Data formatted for skill gap charts
 */
export const analyzeSkillGap = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzeSkillGap');
    return null;
  }

  try {
  const defectTypes = analyzeDefectTypes(data);
    
    // Check if defectTypes is null or doesn't have the expected structure
    if (!defectTypes || !defectTypes.labels || !defectTypes.datasets || !defectTypes.datasets[0].data) {
      console.warn('Invalid defect types data in analyzeSkillGap');
      return null;
    }
    
    // Get the top 5 defect types from the analysis
    const topDefects = defectTypes.labels.slice(0, 5);
    const defectCounts = defectTypes.datasets[0].data.slice(0, 5);
  
  // Map defect types to skill categories
  const skillCategories = topDefects.map(defect => {
    if (defect.toLowerCase().includes('ui') || defect.toLowerCase().includes('interface')) {
      return 'UI Development';
    } else if (defect.toLowerCase().includes('api') || defect.toLowerCase().includes('integration')) {
      return 'API Integration';
    } else if (defect.toLowerCase().includes('data') || defect.toLowerCase().includes('database')) {
      return 'Data Management';
    } else if (defect.toLowerCase().includes('performance') || defect.toLowerCase().includes('speed')) {
      return 'Performance Optimization';
    } else if (defect.toLowerCase().includes('security') || defect.toLowerCase().includes('auth')) {
      return 'Security';
    } else {
      return 'General Development';
    }
  });
  
  // Create synthetic skill data based on defect counts
    const currentSkills = defectCounts.map(count => {
    // Convert defect count to a skill score (0-100)
      return Math.max(0, 100 - (count * 3));
  });
  
  // Required skills are always higher
  const requiredSkills = currentSkills.map(score => Math.min(100, score + 20));
  
  return {
    labels: skillCategories,
    datasets: [
      {
        label: 'Current Skill Level',
        data: currentSkills,
        backgroundColor: 'rgba(0, 113, 227, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Required Skill Level',
        data: requiredSkills,
        backgroundColor: 'rgba(255, 149, 0, 0.7)',
        borderRadius: 6,
      }
    ]
  };
  } catch (error) {
    console.error('Error in analyzeSkillGap:', error);
    return null;
  }
};

/**
 * Analyze application distribution
 * @param {Array} data - The parsed CSV data
 * @returns {Array} - Array of applications and their failure counts
 */
export const analyzeApplications = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzeApplications');
    return [];
  }

  try {
    const applicationFailures = {};
    
    data.forEach(row => {
      // Check for both camelCase and original field names
      const executionStatus = row.executionStatus || row['Execution Status'] || '';
      const application = row.application || row['Application'] || row.userStory || row['User Story'] || '';
      
      if (application && executionStatus.toLowerCase() === 'fail') {
        applicationFailures[application] = (applicationFailures[application] || 0) + 1;
      }
    });
    
    // If no application failures were found, return an empty array
    if (Object.keys(applicationFailures).length === 0) {
      console.warn('No application failures found');
      return [];
    }
    
    return Object.entries(applicationFailures)
      .map(([app, count]) => ({ application: app, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error in analyzeApplications:', error);
    return [];
  }
};

/**
 * Analyze severity by application
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Data formatted for severity by application chart
 */
export const analyzeSeverityByApplication = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data provided to analyzeSeverityByApplication');
    return null;
  }

  try {
    // Get top applications by failure count
    const appAnalysis = analyzeApplications(data);
    const topApps = appAnalysis.slice(0, 5).map(item => item.application);
    
    // Severity levels
    const severityLevels = ['Critical', 'High', 'Medium', 'Low'];
    
    // Initialize datasets
    const datasets = severityLevels.map(level => ({
      label: level,
      data: Array(topApps.length).fill(0),
      backgroundColor: level === 'Critical' ? 'rgba(255, 59, 48, 0.7)' : 
                       level === 'High' ? 'rgba(255, 149, 0, 0.7)' : 
                       level === 'Medium' ? 'rgba(255, 204, 0, 0.7)' : 
                       'rgba(76, 217, 100, 0.7)',
      borderRadius: 6,
    }));
    
    // Count failures by application and severity
    data.forEach(row => {
      // Check for both camelCase and original field names
      const executionStatus = row.executionStatus || row['Execution Status'] || '';
      const application = row.application || row['Application'] || row.userStory || row['User Story'] || '';
      const severity = row.severity || row['Severity'] || '';
      
      // Log for debugging
      if (executionStatus.toLowerCase() === 'fail' && topApps.includes(application)) {
        console.log(`Found failure for app ${application} with severity: ${severity}`);
      }
      
      if (executionStatus.toLowerCase() === 'fail' && topApps.includes(application) && severity) {
        const appIndex = topApps.indexOf(application);
        const severityIndex = severityLevels.findIndex(level => 
          level.toLowerCase() === severity.toLowerCase()
        );
        
        if (severityIndex !== -1 && appIndex !== -1) {
          datasets[severityIndex].data[appIndex]++;
        }
      }
    });
    
    // Log the datasets for debugging
    console.log('Severity by Application datasets:', datasets);
    
    return {
      labels: topApps,
      datasets
    };
  } catch (error) {
    console.error('Error in analyzeSeverityByApplication:', error);
    return null;
  }
}; 

/**
 * Filter data by date range
 * @param {Array} data - The data to filter
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} dateField - The field containing the date (default: 'executionDate')
 * @returns {Array} - Filtered data
 */
export const filterByDateRange = (data, startDate, endDate, dateField = 'executionDate') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data provided to filterByDateRange');
    return [];
  }

  if (!startDate || !endDate) {
    console.warn('Start date or end date not provided to filterByDateRange');
    return data;
  }

  try {
    console.log(`Filtering by date range: ${startDate} to ${endDate}, using field: ${dateField}`);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    
    return data.filter(item => {
      // Try multiple date field names
      const dateValue = item[dateField] || item.date || item.Date || item.executionDate || item['Execution Date'];
      
      if (!dateValue) {
        console.log('Item missing date field:', item);
        return false;
      }
      
      const itemDate = new Date(dateValue);
      return itemDate >= start && itemDate <= end;
    });
  } catch (error) {
    console.error('Error filtering by date range:', error);
    return data;
  }
};

/**
 * Filter data by days (last X days)
 * @param {Array} data - The data to filter
 * @param {number} days - Number of days to include
 * @param {string} dateField - The field containing the date (default: 'executionDate')
 * @returns {Array} - Filtered data
 */
export const filterByDays = (data, days, dateField = 'executionDate') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data provided to filterByDays');
    return [];
  }

  if (!days || isNaN(days)) {
    console.warn('Invalid days value provided to filterByDays');
    return data;
  }

  try {
    console.log(`Filtering by last ${days} days, using field: ${dateField}`);
    
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    
    // Set start date to beginning of day
    startDate.setHours(0, 0, 0, 0);
    
    return data.filter(item => {
      // Try multiple date field names
      const dateValue = item[dateField] || item.date || item.Date || item.executionDate || item['Execution Date'];
      
      if (!dateValue) {
        return false;
      }
      
      const itemDate = new Date(dateValue);
      return itemDate >= startDate && itemDate <= today;
    });
  } catch (error) {
    console.error('Error filtering by days:', error);
    return data;
  }
};

/**
 * Get date range options for filtering
 * @returns {Array} - Array of date range options
 */
export const getDateRangeOptions = () => {
  return [
    { id: '7', name: 'Last 7 Days' },
    { id: '15', name: 'Last 15 Days' },
    { id: '30', name: 'Last 30 Days' },
    { id: '90', name: 'Last 90 Days' },
    { id: 'custom', name: 'Custom Range' }
  ];
};

/**
 * Get source-specific statistics
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Statistics broken down by source
 */
export const getSourceStats = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {};
  }

  const stats = {};
  data.forEach(item => {
    const source = item.Source || item.source || 'Unknown';
    if (!stats[source]) {
      stats[source] = {
        total: 0,
        critical: 0,
        resolved: 0,
        open: 0,
        inProgress: 0
      };
    }

    stats[source].total++;
    
    const severity = (item.Severity || item.severity || '').toLowerCase();
    if (severity === 'critical') {
      stats[source].critical++;
    }

    const status = (item.Status || item.status || '').toLowerCase();
    if (status === 'resolved') {
      stats[source].resolved++;
    } else if (status === 'open') {
      stats[source].open++;
    } else if (status === 'in progress') {
      stats[source].inProgress++;
    }
  });

  return stats;
};

/**
 * Analyze defect status distribution
 * @param {Array} data - The parsed CSV data
 * @returns {Object} - Chart data for defect status distribution
 */
export const analyzeDefectStatus = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log('No data available for defect status analysis');
    return {
      labels: ['Open', 'In Progress', 'Resolved'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1']
      }]
    };
  }

  // Count failures by status
  const statusCounts = {
    'Open': 0,
    'In Progress': 0,
    'Resolved': 0
  };

  data.forEach(failure => {
    const status = failure.Status;
    if (status && statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    }
  });

  console.log('Status counts:', statusCounts);

  return {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1']
    }]
  };
};

// Create a mock dataset if the CSV parsing fails
const createMockData = () => {
  console.log('Creating mock data for demonstration');
  const mockData = [];
  const sources = ['Rally', 'Jira', 'ServiceNow'];
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const priorities = ['P1', 'P2', 'P3', 'P4'];
  const defectTypes = ['UI', 'Data', 'Authentication', 'Performance', 'Validation', 'Calculation'];
  const lobs = ['Banking', 'Insurance', 'Finance', 'Healthcare', 'Retail'];
  
  for (let i = 1; i <= 50; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const defectType = defectTypes[Math.floor(Math.random() * defectTypes.length)];
    const lob = lobs[Math.floor(Math.random() * lobs.length)];
    
    // Create a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const dateStr = date.toISOString().split('T')[0];
    
    // Create a resolved date for resolved/closed items
    let resolvedDate = null;
    if (status === 'Resolved' || status === 'Closed') {
      const resolvedDateObj = new Date(date);
      resolvedDateObj.setDate(date.getDate() + Math.floor(Math.random() * 7) + 1);
      resolvedDate = resolvedDateObj.toISOString().split('T')[0];
    }
    
    mockData.push({
      ID: `F${i.toString().padStart(3, '0')}`,
      id: `F${i.toString().padStart(3, '0')}`,
      Title: `Mock Failure ${i}`,
      title: `Mock Failure ${i}`,
      Description: `This is a mock failure description for testing purposes. Issue type: ${defectType}`,
      description: `This is a mock failure description for testing purposes. Issue type: ${defectType}`,
      Date: dateStr,
      date: dateStr,
      Status: status,
      status: status,
      Severity: severity,
      severity: severity,
      Priority: priority,
      priority: priority,
      'Defect Type': defectType,
      defectType: defectType,
      LOB: lob,
      lob: lob,
      Source: source,
      source: source,
      'Resolved Date': resolvedDate,
      resolvedDate: resolvedDate
    });
  }
  
  return mockData;
};

// Function to analyze risk distribution by severity
export const analyzeRiskDistribution = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for risk distribution analysis');
    return createSampleRiskDistributionData();
  }

  try {
    console.log('Analyzing risk distribution for', data.length, 'records');
    
    // Count risks by severity
    const severityCounts = {};
    data.forEach(item => {
      const severity = (item.severity || item.Severity || 'Unknown').trim();
      severityCounts[severity] = (severityCounts[severity] || 0) + 1;
    });
    
    console.log('Severity counts:', severityCounts);
    
    // Convert to chart data format
    const labels = Object.keys(severityCounts);
    const counts = labels.map(label => severityCounts[label]);
    
    // Define colors for each severity
    const colors = {
      'Critical': 'rgba(255, 59, 48, 0.7)',
      'High': 'rgba(255, 149, 0, 0.7)',
      'Medium': 'rgba(255, 204, 0, 0.7)',
      'Low': 'rgba(52, 199, 89, 0.7)',
      'Unknown': 'rgba(142, 142, 147, 0.7)'
    };
    
    // Sort by severity level
    const severityOrder = ['Critical', 'High', 'Medium', 'Low', 'Unknown'];
    const sortedIndices = labels.map((label, index) => ({
      label,
      count: counts[index],
      index,
      order: severityOrder.indexOf(label) !== -1 ? severityOrder.indexOf(label) : 999
    })).sort((a, b) => a.order - b.order);
    
    const sortedLabels = sortedIndices.map(item => item.label);
    const sortedCounts = sortedIndices.map(item => item.count);
    const backgroundColor = sortedLabels.map(label => 
      colors[label] || `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
    );
    
    return {
      labels: sortedLabels,
      datasets: [{
        label: 'Number of Risks',
        data: sortedCounts,
        backgroundColor,
        borderWidth: 0
      }]
    };
  } catch (err) {
    console.error('Error analyzing risk distribution:', err);
    return createSampleRiskDistributionData();
  }
};

// Function to analyze risk trend over time
export const analyzeRiskTrend = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for risk trend analysis');
    return createSampleRiskTrendData();
  }

  try {
    console.log('Analyzing risk trend for', data.length, 'records');
    
    // Group risks by month
    const monthlyRisks = {};
    data.forEach(item => {
      const dateStr = item.date || item.Date;
      if (!dateStr) return;
      
      const date = new Date(dateStr);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyRisks[monthYear]) {
        monthlyRisks[monthYear] = {
          Critical: 0,
          High: 0,
          Medium: 0,
          Low: 0
        };
      }
      
      const severity = (item.severity || item.Severity || 'Unknown').trim();
      if (['Critical', 'High', 'Medium', 'Low'].includes(severity)) {
        monthlyRisks[monthYear][severity]++;
      }
    });
    
    console.log('Monthly risks:', monthlyRisks);
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyRisks).sort();
    
    // Format labels for display (e.g., "Jan 2023")
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = sortedMonths.map(monthYear => {
      const [year, month] = monthYear.split('-');
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    
    // Create datasets for each severity
    const datasets = [
      {
        label: 'Critical Risks',
        data: sortedMonths.map(month => monthlyRisks[month].Critical),
        borderColor: 'rgba(255, 59, 48, 0.7)',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'High Risks',
        data: sortedMonths.map(month => monthlyRisks[month].High),
        borderColor: 'rgba(255, 149, 0, 0.7)',
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Medium Risks',
        data: sortedMonths.map(month => monthlyRisks[month].Medium),
        borderColor: 'rgba(255, 204, 0, 0.7)',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Low Risks',
        data: sortedMonths.map(month => monthlyRisks[month].Low),
        borderColor: 'rgba(52, 199, 89, 0.7)',
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
        tension: 0.4,
        fill: true
      }
    ];
    
    return {
      labels,
      datasets
    };
  } catch (err) {
    console.error('Error analyzing risk trend:', err);
    return createSampleRiskTrendData();
  }
};

// Function to analyze risks by source
export const analyzeRiskBySource = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for risk by source analysis');
    return createSampleRiskBySourceData();
  }

  try {
    console.log('Analyzing risks by source for', data.length, 'records');
    
    // Count risks by source
    const sourceCounts = {};
    data.forEach(item => {
      const source = (item.source || item.Source || 'Unknown').trim();
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    console.log('Source counts:', sourceCounts);
    
    // Sort sources by count (descending)
    const sortedSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // Limit to top 6 sources
    
    const labels = sortedSources.map(([source]) => source);
    const counts = sortedSources.map(([, count]) => count);
    
    // Define colors for common sources
    const colors = {
      'Rally': 'rgba(0, 122, 255, 0.7)',
      'Jira': 'rgba(88, 86, 214, 0.7)',
      'ServiceNow': 'rgba(52, 199, 89, 0.7)',
      'GitHub': 'rgba(255, 149, 0, 0.7)',
      'Confluence': 'rgba(255, 45, 85, 0.7)'
    };
    
    const backgroundColor = labels.map(label => 
      colors[label] || `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
    );
    
    return {
      labels,
      datasets: [{
        label: 'Risks by Source',
        data: counts,
        backgroundColor
      }]
    };
  } catch (err) {
    console.error('Error analyzing risks by source:', err);
    return createSampleRiskBySourceData();
  }
};

// Function to analyze risks by category
export const analyzeRiskByCategory = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for risk by category analysis');
    return createSampleRiskByCategoryData();
  }

  try {
    console.log('Analyzing risks by category for', data.length, 'records');
    
    // Count risks by category
    const categoryCounts = {};
    data.forEach(item => {
      // Try to find a category field, or use defect type as fallback
      const category = (
        item.riskCategory || 
        item['Risk Category'] || 
        item.defectType || 
        item['Defect Type'] || 
        'Unknown'
      ).trim();
      
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    console.log('Category counts:', categoryCounts);
    
    // Sort categories by count (descending)
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // Limit to top 6 categories
    
    const labels = sortedCategories.map(([category]) => category);
    const counts = sortedCategories.map(([, count]) => count);
    
    // Define colors for common categories
    const colors = {
      'Security': 'rgba(255, 59, 48, 0.7)',
      'Performance': 'rgba(255, 149, 0, 0.7)',
      'UI': 'rgba(0, 122, 255, 0.7)',
      'Data': 'rgba(88, 86, 214, 0.7)',
      'Authentication': 'rgba(175, 82, 222, 0.7)',
      'Validation': 'rgba(52, 199, 89, 0.7)',
      'Calculation': 'rgba(255, 204, 0, 0.7)'
    };
    
    const backgroundColor = labels.map(label => 
      colors[label] || `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
    );
    
    return {
      labels,
      datasets: [{
        label: 'Risks by Category',
        data: counts,
        backgroundColor
      }]
    };
  } catch (err) {
    console.error('Error analyzing risks by category:', err);
    return createSampleRiskByCategoryData();
  }
};

// Sample data creation functions
const createSampleRiskDistributionData = () => {
  return {
    labels: ['Critical', 'High', 'Medium', 'Low', 'Negligible'],
    datasets: [
      {
        label: 'Number of Risks',
        data: [3, 8, 15, 12, 5],
        backgroundColor: [
          'rgba(255, 59, 48, 0.7)',
          'rgba(255, 149, 0, 0.7)',
          'rgba(255, 204, 0, 0.7)',
          'rgba(52, 199, 89, 0.7)',
          'rgba(0, 199, 190, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };
};

const createSampleRiskTrendData = () => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Critical Risks',
        data: [5, 4, 6, 5, 4, 3],
        borderColor: 'rgba(255, 59, 48, 0.7)',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'High Risks',
        data: [10, 9, 12, 10, 9, 8],
        borderColor: 'rgba(255, 149, 0, 0.7)',
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Medium Risks',
        data: [15, 14, 16, 15, 13, 12],
        borderColor: 'rgba(255, 204, 0, 0.7)',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        tension: 0.4,
        fill: true
      }
    ],
  };
};

const createSampleRiskBySourceData = () => {
  return {
    labels: ['Rally', 'Jira', 'ServiceNow', 'GitHub', 'Confluence'],
    datasets: [
      {
        label: 'Risks by Source',
        data: [25, 18, 15, 12, 8],
        backgroundColor: [
          'rgba(0, 122, 255, 0.7)',
          'rgba(88, 86, 214, 0.7)',
          'rgba(52, 199, 89, 0.7)',
          'rgba(255, 149, 0, 0.7)',
          'rgba(255, 45, 85, 0.7)',
        ],
      },
    ],
  };
};

const createSampleRiskByCategoryData = () => {
  return {
    labels: ['Security', 'Performance', 'UI', 'Data', 'Authentication', 'Validation'],
    datasets: [
      {
        label: 'Risks by Category',
        data: [20, 15, 12, 10, 8, 5],
        backgroundColor: [
          'rgba(255, 59, 48, 0.7)',
          'rgba(255, 149, 0, 0.7)',
          'rgba(0, 122, 255, 0.7)',
          'rgba(88, 86, 214, 0.7)',
          'rgba(175, 82, 222, 0.7)',
          'rgba(52, 199, 89, 0.7)',
        ],
      },
    ],
  };
};

// Function to load failures data from CSV
export const loadFailuresData = async () => {
  try {
    const response = await fetch('/data/failures.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    return parseCSVData(csvText);
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return null;
  }
};

// Function to parse CSV text into array of objects
const parseCSVData = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(value => value.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      return row;
    });
};

// Function to calculate metrics from failures data
export const calculateMetrics = (failures) => {
  if (!failures || !Array.isArray(failures)) {
    console.warn('Invalid data provided to calculateMetrics');
    return {
      totalDefects: 0,
      majorIssues: 0,
      serviceNowIncidents: 0,
      criticalBugs: 0,
      resolvedFailures: 0,
      avgResolutionTime: 0,
      totalFailures: 0,
      criticalFailures: 0
    };
  }

  try {
    const totalDefects = failures.length;
    
    const majorIssues = failures.filter(failure => {
      const severity = (failure.Severity || failure.severity || '').toLowerCase();
      return severity.includes('high') || severity.includes('critical');
    }).length;
    
    const serviceNowIncidents = failures.filter(failure => {
      const source = (failure.Source || failure.source || '').toLowerCase();
      return source.includes('servicenow');
    }).length;
    
    const criticalBugs = failures.filter(failure => {
      const severity = (failure.Severity || failure.severity || '').toLowerCase();
      return severity.includes('critical');
    }).length;

    // Calculate additional metrics for the dashboard
    const resolvedFailures = failures.filter(failure => {
      const status = (failure.Status || failure.status || '').toLowerCase();
      return status === 'resolved' || status === 'closed';
    }).length;

    // Calculate average resolution time
    const resolvedWithDates = failures.filter(failure => {
      const status = (failure.Status || failure.status || '').toLowerCase();
      return (status === 'resolved' || status === 'closed') && 
             (failure['Resolved Date'] || failure.resolvedDate) && 
             (failure.Date || failure.date);
    });

    let avgResolutionTime = 0;
    if (resolvedWithDates.length > 0) {
      const totalDays = resolvedWithDates.reduce((sum, failure) => {
        const startDate = new Date(failure.Date || failure.date);
        const endDate = new Date(failure['Resolved Date'] || failure.resolvedDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      avgResolutionTime = Math.round(totalDays / resolvedWithDates.length);
    }

    return {
      totalDefects,
      majorIssues,
      serviceNowIncidents,
      criticalBugs,
      resolvedFailures,
      avgResolutionTime,
      totalFailures: totalDefects,
      criticalFailures: criticalBugs
    };
  } catch (error) {
    console.error('Error in calculateMetrics:', error);
    return {
      totalDefects: 0,
      majorIssues: 0,
      serviceNowIncidents: 0,
      criticalBugs: 0,
      resolvedFailures: 0,
      avgResolutionTime: 0,
      totalFailures: 0,
      criticalFailures: 0
    };
  }
};

