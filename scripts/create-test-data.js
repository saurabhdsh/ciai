const fs = require('fs');
const path = require('path');

const csvHeader = `Incident ID,Short Description,Description,Priority,Severity,Status,Category,Subcategory,Opened Date,Resolved Date,Resolution Time (hours),Assigned Group,Assigned To,Affected CI,Impact,Resolution Notes,Knowledge Article Created,Reopened Count,Root Cause,Service Offering,SLA Met`;

// Generate incidents for January 2025
const generateJan2025Incidents = () => {
  const incidents = [];
  const categories = ['Network', 'Security', 'Application', 'Database', 'Hardware', 'Software'];
  const subcategories = {
    'Network': ['Connectivity', 'DNS', 'Load Balancing', 'VPN', 'Wireless'],
    'Security': ['Authentication', 'Certificates', 'Malware', 'Permissions', 'Vulnerability'],
    'Application': ['Functionality', 'Performance', 'Mobile', 'Reporting', 'UI/UX'],
    'Database': ['Performance', 'Backup', 'Connectivity', 'Query', 'Replication'],
    'Hardware': ['Server', 'Storage', 'Networking', 'Workstation', 'Printing'],
    'Software': ['Operating System', 'Middleware', 'Licensing', 'Integration', 'Updates']
  };
  
  // Create January 2025 incidents (1 per day)
  for (let day = 1; day <= 15; day++) {
    const categoryIndex = day % categories.length;
    const category = categories[categoryIndex];
    const subcategoryOptions = subcategories[category];
    const subcategory = subcategoryOptions[day % subcategoryOptions.length];
    
    // Determine status - more resolved for earlier days
    let status;
    if (day < 5) status = 'Resolved';
    else if (day < 10) status = day % 3 === 0 ? 'In Progress' : 'Resolved';
    else status = day % 3 === 0 ? 'Open' : (day % 3 === 1 ? 'In Progress' : 'Resolved');
    
    // Create date
    const date = new Date(2025, 0, day);
    
    // Create resolution date and time if resolved
    let resolvedDate = '';
    let resolutionTime = '';
    
    if (status === 'Resolved') {
      const resolveDate = new Date(date);
      resolveDate.setHours(resolveDate.getHours() + (4 + Math.random() * 8));
      resolvedDate = resolveDate.toISOString();
      resolutionTime = (4 + Math.random() * 8).toFixed(2);
    }
    
    incidents.push({
      id: `INC${1000 + day}`,
      shortDesc: `${category} ${subcategory} Issue`,
      desc: `Test incident for ${category} related to ${subcategory}`,
      priority: day % 4 === 0 ? 1 : (day % 3 === 0 ? 2 : 3),
      severity: day % 3 === 0 ? 1 : 2,
      status,
      category,
      subcategory,
      openedDate: date.toISOString(),
      resolvedDate,
      resolutionTime,
      assignedGroup: `${category} Team`,
      assignedTo: `Tech ${day}`,
      slaMet: status === 'Resolved' ? (day % 4 === 0 ? 'No' : 'Yes') : '',
      reopenCount: day % 7 === 0 ? 1 : 0,
      rootCause: day % 5 === 0 ? 'Configuration' : (day % 4 === 0 ? 'Software Bug' : (day % 3 === 0 ? 'Hardware Failure' : 'Human Error'))
    });
  }
  
  return incidents;
};

// Generate incidents for each month in the previous year
const generatePastYearIncidents = () => {
  const incidents = [];
  const categories = ['Network', 'Security', 'Application', 'Database', 'Hardware', 'Software'];
  const now = new Date();
  
  // For each month in the past year
  for (let monthsAgo = 1; monthsAgo <= 12; monthsAgo++) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - monthsAgo);
    
    // Create 3-7 incidents per month
    const incidentsPerMonth = 3 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < incidentsPerMonth; i++) {
      const day = 1 + Math.floor(Math.random() * 28);
      date.setDate(day);
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const priority = 1 + Math.floor(Math.random() * 3);
      const severity = 1 + Math.floor(Math.random() * 2);
      
      // All older incidents are resolved
      const status = 'Resolved';
      
      // Create resolution date
      const resolveDate = new Date(date);
      resolveDate.setHours(resolveDate.getHours() + (4 + Math.random() * 20));
      const resolvedDate = resolveDate.toISOString();
      const resolutionTime = (4 + Math.random() * 20).toFixed(2);
      
      incidents.push({
        id: `INC${2000 + (monthsAgo * 10) + i}`,
        shortDesc: `${category} Issue from ${monthsAgo} months ago`,
        desc: `Test incident from the past`,
        priority,
        severity,
        status,
        category,
        subcategory: 'General',
        openedDate: date.toISOString(),
        resolvedDate,
        resolutionTime,
        assignedGroup: `${category} Team`,
        assignedTo: `Tech ${i}`,
        slaMet: i % 3 === 0 ? 'No' : 'Yes',
        reopenCount: i % 5 === 0 ? 1 : 0,
        rootCause: i % 4 === 0 ? 'Configuration' : (i % 3 === 0 ? 'Software Bug' : 'Hardware Failure')
      });
    }
  }
  
  return incidents;
};

// Convert incident object to CSV row
const incidentToCsvRow = (incident) => {
  return `"${incident.id}","${incident.shortDesc}","${incident.desc}",${incident.priority},${incident.severity},"${incident.status}","${incident.category}","${incident.subcategory}","${incident.openedDate}","${incident.resolvedDate}",${incident.resolutionTime},"${incident.assignedGroup}","${incident.assignedTo}","System ${incident.category}","Department","Resolution notes","${incident.slaMet === 'Yes' ? 'Yes' : 'No'}",${incident.reopenCount},"${incident.rootCause}","Core Services","${incident.slaMet}"`;
};

// Generate the CSV content
const generateCsvContent = () => {
  const jan2025Incidents = generateJan2025Incidents();
  const pastIncidents = generatePastYearIncidents();
  const allIncidents = [...jan2025Incidents, ...pastIncidents];
  
  const rows = allIncidents.map(incidentToCsvRow);
  return [csvHeader, ...rows].join('\n');
};

// Write CSV data to file
const csvContent = generateCsvContent();
const publicDataDir = path.join(__dirname, '../public/data');

// Create directory if it doesn't exist
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Write to file
fs.writeFileSync(path.join(publicDataDir, 'servicenow_incidents.csv'), csvContent);
console.log('Test data CSV file created successfully!'); 