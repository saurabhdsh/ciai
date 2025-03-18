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

/**
 * Get recent failures from the data
 * @param {Array} data - The failure data
 * @param {Object} options - Options for filtering recent failures
 * @param {number} options.limit - Maximum number of failures to return (default: 10)
 * @returns {Array} - Array of recent failures
 */
export const getRecentFailures = (data, options = { limit: 10 }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data provided to getRecentFailures');
    return [];
  }

  try {
    // Sort failures by date in descending order
    const sortedFailures = [...data].sort((a, b) => {
      const dateA = new Date(a.Date || a.date || '');
      const dateB = new Date(b.Date || b.date || '');
      return dateB - dateA;
    });

    // Take the most recent failures up to the limit
    return sortedFailures
      .slice(0, options.limit)
      .map(failure => ({
        id: failure.ID || failure.id,
        title: failure.Title || failure.title,
        description: failure.Description || failure.description,
        date: failure.Date || failure.date,
        severity: failure.Severity || failure.severity,
        status: failure.Status || failure.status,
        source: failure.Source || failure.source,
        priority: failure.Priority || failure.priority,
        defectType: failure['Defect Type'] || failure.defectType,
        lob: failure.LOB || failure.lob
      }));
  } catch (error) {
    console.error('Error in getRecentFailures:', error);
    return [];
  }
};

// Function to calculate metrics from failures data
export const calculateMetrics = (failures) => {
  if (!failures || !Array.isArray(failures)) {
    console.warn('Invalid data provided to calculateMetrics');
    return {
      totalDefects: 0,
      majorIssues: 0,
      serviceNowIncidents: 0,
      criticalBugs: 0
    };
  }

  try {
    const totalDefects = failures.length;
    
    const majorIssues = failures.filter(failure => {
      const severity = (failure.Severity || failure.severity || '').toLowerCase();
      const priority = (failure.Priority || failure.priority || '').toLowerCase();
      const status = (failure.Status || failure.status || '').toLowerCase();
      return (severity.includes('high') || priority.includes('p1')) && !status.includes('resolved');
    }).length;
    
    const serviceNowIncidents = failures.filter(failure => {
      const source = (failure.Source || failure.source || '').toLowerCase();
      const status = (failure.Status || failure.status || '').toLowerCase();
      return source.includes('servicenow') && !status.includes('resolved');
    }).length;
    
    const criticalBugs = failures.filter(failure => {
      const severity = (failure.Severity || failure.severity || '').toLowerCase();
      const status = (failure.Status || failure.status || '').toLowerCase();
      return severity.includes('critical') && !status.includes('resolved');
    }).length;

    return {
      totalDefects,
      majorIssues,
      serviceNowIncidents,
      criticalBugs
    };
  } catch (error) {
    console.error('Error in calculateMetrics:', error);
    return {
      totalDefects: 0,
      majorIssues: 0,
      serviceNowIncidents: 0,
      criticalBugs: 0
    };
  }
};

export const calculateFailureTrendMetrics = (data) => {
  if (!data || !Array.isArray(data)) {
    return {
      totalFailures: 0,
      criticalFailures: 0,
      resolvedFailures: 0,
      averageResolutionTime: 0
    };
  }

  const now = new Date();
  
  const metrics = {
    totalFailures: data.length,
    criticalFailures: data.filter(item => 
      item.Severity === 'Critical' || item.severity === 'Critical'
    ).length,
    resolvedFailures: data.filter(item => 
      item.Status === 'Resolved' || item.status === 'Resolved'
    ).length,
    averageResolutionTime: calculateAverageResolutionTime(data)
  };

  return metrics;
};

export const calculateAverageResolutionTime = (data) => {
  const resolvedItems = data.filter(item => 
    (item.Status === 'Resolved' || item.status === 'Resolved') && 
    item['Resolved Date']
  );

  if (resolvedItems.length === 0) return 0;

  const totalDays = resolvedItems.reduce((sum, item) => {
    const startDate = new Date(item.Date || item.date);
    const endDate = new Date(item['Resolved Date']);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return Math.round(totalDays / resolvedItems.length);
};

export const calculateSeverityBySource = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',  // red
          'rgba(245, 158, 11, 0.7)', // orange
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)'  // green
        ],
        label: 'Severity'
      }]
    };
  }

  // Initialize counters for each severity level
  const severityCounts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0
  };

  // Count failures by severity
  data.forEach(failure => {
    const severity = (failure.Severity || failure.severity || '').trim();
    if (severity in severityCounts) {
      severityCounts[severity]++;
    }
  });

  // Calculate percentages
  const total = Object.values(severityCounts).reduce((sum, count) => sum + count, 0);
  const severityPercentages = Object.values(severityCounts).map(count => 
    total > 0 ? Math.round((count / total) * 100) : 0
  );

  return {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: severityPercentages,
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',  // red
        'rgba(245, 158, 11, 0.7)', // orange
        'rgba(59, 130, 246, 0.7)', // blue
        'rgba(16, 185, 129, 0.7)'  // green
      ],
      label: 'Severity'
    }]
  };
};

export const calculatePriorityBySource = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      labels: ['P1', 'P2', 'P3', 'P4'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',  // red
          'rgba(245, 158, 11, 0.7)', // orange
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)'  // green
        ],
        label: 'Priority'
      }]
    };
  }

  // Initialize counters for each priority level
  const priorityCounts = {
    P1: 0,
    P2: 0,
    P3: 0,
    P4: 0
  };

  // Count failures by priority
  data.forEach(failure => {
    const priority = (failure.Priority || failure.priority || '').trim();
    if (priority in priorityCounts) {
      priorityCounts[priority]++;
    }
  });

  // Calculate percentages
  const total = Object.values(priorityCounts).reduce((sum, count) => sum + count, 0);
  const priorityPercentages = Object.values(priorityCounts).map(count => 
    total > 0 ? Math.round((count / total) * 100) : 0
  );

  return {
    labels: ['P1', 'P2', 'P3', 'P4'],
    datasets: [{
      data: priorityPercentages,
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',  // red
        'rgba(245, 158, 11, 0.7)', // orange
        'rgba(59, 130, 246, 0.7)', // blue
        'rgba(16, 185, 129, 0.7)'  // green
      ],
      label: 'Priority'
    }]
  };
};

export const getSourceMetrics = (data) => {
  if (!data || !Array.isArray(data)) return [];

  const sourceMap = {};
  
  data.forEach(item => {
    const source = item.Source || item.source;
    if (!sourceMap[source]) {
      sourceMap[source] = {
        name: source,
        total: 0,
        critical: 0,
        resolved: 0,
        pending: 0
      };
    }
    
    sourceMap[source].total++;
    
    if (item.Severity === 'Critical' || item.severity === 'Critical') {
      sourceMap[source].critical++;
    }
    
    if (item.Status === 'Resolved' || item.status === 'Resolved') {
      sourceMap[source].resolved++;
    } else {
      sourceMap[source].pending++;
    }
  });

  return Object.values(sourceMap);
}; 