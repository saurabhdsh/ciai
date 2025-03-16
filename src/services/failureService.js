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
export const getRecentFailures = (data, options = { days: 30, limit: 5 }) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - options.days);

  // Sort failures by date in descending order
  const sortedFailures = data
    .filter(failure => {
      const failureDate = new Date(failure.Date || failure.date);
      return failureDate >= startDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.Date || a.date);
      const dateB = new Date(b.Date || b.date);
      return dateB - dateA;
    })
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
      defectType: failure["Defect Type"] || failure.defectType,
      lob: failure.LOB || failure.lob
    }));

  return sortedFailures;
};

// Function to calculate metrics from failures data
export const calculateMetrics = (data) => {
  if (!data || !Array.isArray(data)) {
    return {
      totalDefects: 0,
      majorIssues: 0,
      serviceNowIncidents: 0,
      criticalBugs: 0
    };
  }

  const metrics = {
    totalDefects: data.length,
    majorIssues: data.filter(item => 
      (item.Severity === 'High' || item.severity === 'High') && 
      (item.Status !== 'Resolved' && item.status !== 'Resolved')
    ).length,
    serviceNowIncidents: data.filter(item => 
      (item.Source === 'ServiceNow' || item.source === 'ServiceNow')
    ).length,
    criticalBugs: data.filter(item => 
      (item.Severity === 'Critical' || item.severity === 'Critical') && 
      (item["Defect Type"] === 'Security' || item.defectType === 'Security')
    ).length
  };

  return metrics;
}; 