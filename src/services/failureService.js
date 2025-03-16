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

// Function to get recent failures
// Can filter by days and/or limit the number of results
export const getRecentFailures = (data, options = { days: 30, limit: 10 }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - options.days);

  return data
    .filter(failure => new Date(failure.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, options.limit)
    .map(failure => ({
      ...failure,
      date: new Date(failure.date)
    }));
};

// Function to calculate metrics from failures data
export const calculateMetrics = (failures) => {
  if (!Array.isArray(failures)) {
    return {
      totalDefects: 0,
      majorIssues: 0,
      serviceNowIncidents: 0,
      criticalBugs: 0
    };
  }

  const metrics = {
    totalDefects: failures.length,
    majorIssues: failures.filter(f => 
      f.priority === 'High' || 
      f.severity === 'High' || 
      f.severity === 'Major'
    ).length,
    serviceNowIncidents: failures.filter(f => 
      f.source === 'ServiceNow' || 
      f.defectType === 'Incident'
    ).length,
    criticalBugs: failures.filter(f => 
      f.severity === 'Critical' || 
      f.priority === 'Critical' ||
      f.defectType === 'Critical Bug'
    ).length
  };

  return metrics;
}; 