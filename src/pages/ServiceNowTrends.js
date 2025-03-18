import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Alert, Divider, Row, Col, Select, DatePicker, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { parse, format } from 'date-fns';
import Papa from 'papaparse';
import AIAnalysisButton from '../components/AIAnalysisButton';
import AIAnalysisModal from '../components/AIAnalysisModal';
import AIFloatingButton from '../components/AIFloatingButton';
import AIAssistantSection from '../components/AIAssistantSection';
import ServiceNowAIAssistant from '../components/ServiceNowAIAssistant';
import { BrainCircuit } from 'lucide-react';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const ServiceNowTrends = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [categories, setCategories] = useState([]);
  
  // AI modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalTitle, setAiModalTitle] = useState('');
  const [aiModalData, setAiModalData] = useState(null);
  const [aiModalChartType, setAiModalChartType] = useState('');

  useEffect(() => {
    fetchIncidentData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [incidents, categoryFilter, dateRange]);

  // Generate mock data for testing if CSV load fails
  const generateMockData = () => {
    console.log('Generating mock incident data for testing');
    const categories = ['Network', 'Security', 'Application', 'Database', 'Hardware', 'Software'];
    const subcategories = {
      'Network': ['Connectivity', 'DNS', 'Load Balancing', 'VPN', 'Wireless'],
      'Security': ['Authentication', 'Certificates', 'Malware', 'Permissions', 'Vulnerability'],
      'Application': ['Functionality', 'Performance', 'Mobile', 'Reporting', 'UI/UX'],
      'Database': ['Performance', 'Backup', 'Connectivity', 'Query', 'Replication'],
      'Hardware': ['Server', 'Storage', 'Networking', 'Workstation', 'Printing'],
      'Software': ['Operating System', 'Middleware', 'Licensing', 'Integration', 'Updates']
    };
    const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const priorities = [1, 2, 3, 4];
    const severities = [1, 2, 3];
    const rootCauses = ['Configuration', 'Hardware Failure', 'Software Bug', 'Human Error', 
                      'External Dependency', 'Network Issue', 'Security Breach', 'Capacity',
                      'Change Management', 'Training', 'Documentation', 'Process Failure'];
    const slaOptions = ['Yes', 'No'];
    
    // Create a more realistic distribution - more incidents in recent days
    const mockIncidents = [];
    const numIncidents = 75; // Total number of incidents
    
    // Create some data for each month in the last 6 months for better trends
    const now = new Date();
    
    // Ensure we have some incidents in January 2025 for testing
    const jan2025Incidents = 5; // Number of incidents to create for Jan 2025
    
    for (let i = 0; i < jan2025Incidents; i++) {
      const openedDate = new Date(2025, 0, Math.floor(Math.random() * 31) + 1); // Jan 2025
      
      // 80% of incidents have a resolution date
      const hasResolution = Math.random() > 0.2;
      let resolvedDate = null;
      let resolutionTime = null;
      
      if (hasResolution) {
        resolvedDate = new Date(openedDate);
        // Different resolution times based on priority
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        let maxHours = 48;
        if (priority === 1) maxHours = 8; // P1 issues resolved faster
        else if (priority === 2) maxHours = 24;
        
        const hoursToResolve = Math.random() * maxHours;
        resolvedDate.setHours(resolvedDate.getHours() + hoursToResolve);
        resolutionTime = hoursToResolve;
      }
      
      // Distribute categories somewhat evenly
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      
      // Get subcategory for this category
      const subcategoryOptions = subcategories[category];
      const subcategory = subcategoryOptions[Math.floor(Math.random() * subcategoryOptions.length)];
      
      // Distribute statuses - more 'Resolved' than others
      let status;
      const statusRand = Math.random();
      if (statusRand < 0.2) status = 'Open';
      else if (statusRand < 0.4) status = 'In Progress';
      else if (statusRand < 0.9) status = 'Resolved';
      else status = 'Closed';
      
      // Determine priority and severity
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      // Pick a root cause
      const rootCause = rootCauses[Math.floor(Math.random() * rootCauses.length)];
      
      // SLA compliance
      const slaMet = Math.random() < 0.7 ? 'Yes' : 'No';
      
      // Reopened count
      const reopenedCount = Math.random() < 0.8 ? 0 : (Math.random() < 0.8 ? 1 : 2);
      
      mockIncidents.push({
        "Incident ID": `INC${String(1000 + mockIncidents.length).padStart(4, '0')}`,
        "Short Description": `${category} ${subcategory} Issue`,
        "Description": `This is a mock ${severity === 1 ? 'critical' : (severity === 2 ? 'high' : 'moderate')} 
                     ${category} incident related to ${subcategory}`,
        "Priority": priority,
        "Severity": severity,
        "Status": status,
        "Category": category,
        "Subcategory": subcategory,
        "Opened Date": openedDate.toISOString(),
        "Resolved Date": resolvedDate ? resolvedDate.toISOString() : '',
        "Resolution Time (hours)": resolutionTime,
        "Root Cause": rootCause,
        "SLA Met": slaMet,
        "Reopened Count": reopenedCount,
        // Processed properties
        Priority: priority,
        Severity: severity,
        ResolutionTime: resolutionTime,
        OpenedDate: openedDate,
        ResolvedDate: resolvedDate,
        ReopenedCount: reopenedCount
      });
    }
    
    // Create incidents spread across other months
    for (let i = 0; i < numIncidents - jan2025Incidents; i++) {
      // Distribute across last 6 months with more recent incidents
      const monthsAgo = Math.floor(Math.random() * 6);
      const daysInMonth = Math.floor(Math.random() * 30);
      
      const openedDate = new Date();
      openedDate.setMonth(now.getMonth() - monthsAgo);
      openedDate.setDate(now.getDate() - daysInMonth);
      
      // 80% of incidents have a resolution date
      const hasResolution = Math.random() > 0.2;
      let resolvedDate = null;
      let resolutionTime = null;
      
      if (hasResolution) {
        resolvedDate = new Date(openedDate);
        // Different resolution times based on priority
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        let maxHours = 48;
        if (priority === 1) maxHours = 8; // P1 issues resolved faster
        else if (priority === 2) maxHours = 24;
        
        const hoursToResolve = Math.random() * maxHours;
        resolvedDate.setHours(resolvedDate.getHours() + hoursToResolve);
        resolutionTime = hoursToResolve;
      }
      
      // Distribute categories somewhat evenly
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      
      // Get subcategory for this category
      const subcategoryOptions = subcategories[category];
      const subcategory = subcategoryOptions[Math.floor(Math.random() * subcategoryOptions.length)];
      
      // Distribute statuses - more 'Resolved' than others
      let status;
      const statusRand = Math.random();
      if (statusRand < 0.2) status = 'Open';
      else if (statusRand < 0.4) status = 'In Progress';
      else if (statusRand < 0.9) status = 'Resolved';
      else status = 'Closed';
      
      // Determine priority and severity - higher chance of P2/P3 than P1/P4
      let priority;
      const prioRand = Math.random();
      if (prioRand < 0.1) priority = 1;
      else if (prioRand < 0.4) priority = 2;
      else if (prioRand < 0.8) priority = 3;
      else priority = 4;
      
      // Severity distribution
      let severity;
      const sevRand = Math.random();
      if (sevRand < 0.2) severity = 1;
      else if (sevRand < 0.6) severity = 2;
      else severity = 3;
      
      // Pick a root cause - weighted distribution
      const rootCauseIndex = Math.floor(Math.pow(Math.random(), 1.5) * rootCauses.length);
      const rootCause = rootCauses[Math.min(rootCauseIndex, rootCauses.length - 1)];
      
      // SLA compliance - 70% meet SLA
      const slaMet = Math.random() < 0.7 ? 'Yes' : 'No';
      
      // Reopened count - few incidents get reopened
      const reopenedCount = Math.random() < 0.8 ? 0 : (Math.random() < 0.8 ? 1 : 2);
      
      mockIncidents.push({
        "Incident ID": `INC${String(1000 + mockIncidents.length).padStart(4, '0')}`,
        "Short Description": `${category} ${subcategory} Issue`,
        "Description": `This is a mock ${severity === 1 ? 'critical' : (severity === 2 ? 'high' : 'moderate')} 
                     ${category} incident related to ${subcategory}`,
        "Priority": priority,
        "Severity": severity,
        "Status": status,
        "Category": category,
        "Subcategory": subcategory,
        "Opened Date": openedDate.toISOString(),
        "Resolved Date": resolvedDate ? resolvedDate.toISOString() : '',
        "Resolution Time (hours)": resolutionTime,
        "Root Cause": rootCause,
        "SLA Met": slaMet,
        "Reopened Count": reopenedCount,
        // Processed properties
        Priority: priority,
        Severity: severity,
        ResolutionTime: resolutionTime,
        OpenedDate: openedDate,
        ResolvedDate: resolvedDate,
        ReopenedCount: reopenedCount
      });
    }
    
    console.log(`Generated ${mockIncidents.length} mock incidents for testing`);
    return mockIncidents;
  };

  const fetchIncidentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting incident data fetch process');
      
      // Try multiple potential paths for the CSV file
      const possiblePaths = [
        '/data/servicenow_incidents.csv',
        '/ciai/data/servicenow_incidents.csv', // Path for GitHub Pages
        '/ReactFailure/data/servicenow_incidents.csv',
        './data/servicenow_incidents.csv',
        '../data/servicenow_incidents.csv',
        `${window.location.pathname.split('/').slice(0, -1).join('/')}/data/servicenow_incidents.csv`,
        `${process.env.PUBLIC_URL}/data/servicenow_incidents.csv` // Using PUBLIC_URL for proper path resolution
      ];
      
      let csvData = null;
      let lastError = null;
      
      // Try each path until one works
      for (const path of possiblePaths) {
        try {
          console.log(`Attempting to load from path: ${path}`);
          const response = await fetch(path);
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          csvData = await response.text();
          console.log(`Successfully loaded data from ${path}`);
          break; // Exit the loop if successful
        } catch (err) {
          console.log(`Failed to load from ${path}: ${err.message}`);
          lastError = err;
        }
      }
      
      let parsedData = [];
      let csvSuccess = false;
      
      if (csvData) {
        try {
          // Try to parse CSV data
          const results = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true
          });
          
          console.log(`Parsed ${results.data.length} records from CSV`);
          
          // Filter out any empty rows (often at the end of CSV)
          const validData = results.data.filter(item => 
            item["Incident ID"] && item["Incident ID"].trim() !== "");
          
          if (validData.length > 0) {
            parsedData = validData.map(incident => ({
              ...incident,
              Priority: parseInt(incident.Priority) || 0,
              Severity: parseInt(incident.Severity) || 0,
              ResolutionTime: parseFloat(incident["Resolution Time (hours)"]) || 0,
              OpenedDate: incident["Opened Date"] ? new Date(incident["Opened Date"]) : null,
              ResolvedDate: incident["Resolved Date"] ? new Date(incident["Resolved Date"]) : null,
              ReopenedCount: parseInt(incident["Reopened Count"]) || 0
            }));
            
            console.log(`Successfully processed ${parsedData.length} valid incidents from CSV`);
            csvSuccess = true;
          } else {
            console.log('No valid data found in CSV');
          }
        } catch (parseError) {
          console.error('Error parsing CSV data:', parseError);
          lastError = parseError;
        }
      }
      
      // If CSV parsing failed or returned no data, use mock data
      if (!csvSuccess) {
        console.warn('Using mock data instead of CSV data');
        parsedData = generateMockData();
      }
      
      // Set state with either CSV data or mock data
      setIncidents(parsedData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(parsedData
        .filter(item => item.Category) 
        .map(item => item.Category))];
      
      console.log(`Found ${uniqueCategories.length} unique categories`);
      setCategories(uniqueCategories);
      
    } catch (err) {
      console.error('Unhandled error in fetchIncidentData:', err);
      setError(`Error loading incident data: ${err.message}`);
      
      // Even in case of error, provide mock data
      console.warn('Using mock data due to error');
      const mockData = generateMockData();
      setIncidents(mockData);
      
      const uniqueCategories = [...new Set(mockData.map(item => item.Category))];
      setCategories(uniqueCategories);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!incidents || incidents.length === 0) {
      console.log('No incidents to filter');
      setFilteredIncidents([]);
      return;
    }
    
    console.log(`Applying filters to ${incidents.length} incidents. Category: ${categoryFilter}, Date range: ${dateRange[0] ? 'set' : 'not set'}`);
    
    let filtered = [...incidents];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      console.log(`Filtering by category: ${categoryFilter}`);
      filtered = filtered.filter(incident => incident.Category === categoryFilter);
      console.log(`${filtered.length} incidents match the category filter`);
    }
    
    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      console.log(`Filtering by date range: ${dateRange[0].toISOString()} to ${dateRange[1].toISOString()}`);
      filtered = filtered.filter(incident => {
        if (!incident.OpenedDate) {
          console.log(`Incident ${incident["Incident ID"]} has no opened date, excluding from results`);
          return false;
        }
        
        const incidentDate = new Date(incident.OpenedDate);
        
        if (isNaN(incidentDate.getTime())) {
          console.log(`Incident ${incident["Incident ID"]} has invalid date: ${incident.OpenedDate}, excluding from results`);
          return false;
        }
        
        return incidentDate >= dateRange[0] && incidentDate <= dateRange[1];
      });
      console.log(`${filtered.length} incidents match the date range filter`);
    }
    
    console.log(`Setting filtered incidents: ${filtered.length} records`);
    setFilteredIncidents(filtered);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // For the incidents by category chart
  const getCategoryData = () => {
    if (!filteredIncidents || filteredIncidents.length === 0) {
      console.log('No incidents available for category analysis');
      return [];
    }
    
    console.log(`Preparing category data for ${filteredIncidents.length} incidents`);
    const categoryCount = {};
    
    filteredIncidents.forEach(incident => {
      if (incident.Category && incident.Category.trim() !== '') {
        categoryCount[incident.Category] = (categoryCount[incident.Category] || 0) + 1;
      }
    });
    
    const result = Object.keys(categoryCount).map(category => ({
      name: category,
      value: categoryCount[category]
    }));
    
    console.log(`Generated ${result.length} categories for chart`);
    return result;
  };

  // For the incidents by priority chart
  const getPriorityData = () => {
    if (!filteredIncidents || filteredIncidents.length === 0) {
      console.log('No incidents available for priority analysis');
      return [];
    }
    
    console.log(`Preparing priority data for ${filteredIncidents.length} incidents`);
    const priorityCount = {1: 0, 2: 0, 3: 0, 4: 0};
    
    filteredIncidents.forEach(incident => {
      if (incident.Priority !== undefined && !isNaN(incident.Priority)) {
        priorityCount[incident.Priority] = (priorityCount[incident.Priority] || 0) + 1;
      }
    });
    
    const result = Object.keys(priorityCount)
      .sort((a, b) => Number(a) - Number(b))
      .map(priority => ({
        name: `P${priority}`,
        value: priorityCount[priority]
      }));
    
    console.log(`Generated priority data with ${result.length} priority levels`);
    return result;
  };

  // For resolution time by category
  const getResolutionTimeData = () => {
    if (!filteredIncidents || filteredIncidents.length === 0) {
      console.log('No incidents available for resolution time analysis');
      return [];
    }
    
    console.log(`Preparing resolution time data for ${filteredIncidents.length} incidents`);
    const resolutionTimeByCategory = {};
    const countByCategory = {};
    
    filteredIncidents.forEach(incident => {
      if (incident.Category && 
          incident.ResolutionTime !== undefined && 
          !isNaN(incident.ResolutionTime) && 
          incident.ResolutionTime > 0) {
        
        resolutionTimeByCategory[incident.Category] = (resolutionTimeByCategory[incident.Category] || 0) + incident.ResolutionTime;
        countByCategory[incident.Category] = (countByCategory[incident.Category] || 0) + 1;
      }
    });
    
    const result = Object.keys(resolutionTimeByCategory)
      .filter(category => countByCategory[category] > 0)
      .map(category => ({
        name: category,
        avgTime: resolutionTimeByCategory[category] / countByCategory[category]
      }))
      .sort((a, b) => b.avgTime - a.avgTime);
    
    console.log(`Generated resolution time data for ${result.length} categories`);
    return result;
  };

  // Get the incidents over time chart
  const getIncidentsOverTime = () => {
    const incidentsByMonth = {};
    
    // If no incidents, return empty array
    if (!filteredIncidents || filteredIncidents.length === 0) {
      console.log('No incidents available for time trend analysis');
      return [];
    }
    
    console.log(`Preparing time trend data for ${filteredIncidents.length} incidents`);
    
    // Count incidents by month
    filteredIncidents.forEach(incident => {
      if (incident.OpenedDate) {
        try {
          // Use a consistent date format
          const date = new Date(incident.OpenedDate);
          if (isNaN(date.getTime())) {
            console.log(`Invalid date: ${incident.OpenedDate}`);
            return; // Skip this incident
          }
          
          const monthYear = format(date, 'MMM yyyy');
          incidentsByMonth[monthYear] = (incidentsByMonth[monthYear] || 0) + 1;
        } catch (error) {
          console.error(`Error formatting date for incident ${incident["Incident ID"]}:`, error);
        }
      }
    });
    
    console.log(`Found incidents across ${Object.keys(incidentsByMonth).length} months`);
    
    // Convert the data to the format expected by the chart
    const result = Object.keys(incidentsByMonth).map(month => ({
      month,
      count: incidentsByMonth[month] || 0
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
    
    console.log(`Generated ${result.length} data points for time trend chart`);
    return result;
  };

  // For SLA status chart
  const getSLAData = () => {
    if (!filteredIncidents || filteredIncidents.length === 0) {
      console.log('No incidents available for SLA analysis');
      return [];
    }
    
    console.log(`Preparing SLA data for ${filteredIncidents.length} incidents`);
    const slaCount = {"Yes": 0, "No": 0};
    
    filteredIncidents.forEach(incident => {
      if (incident["SLA Met"] && (incident["SLA Met"] === "Yes" || incident["SLA Met"] === "No")) {
        slaCount[incident["SLA Met"]] = (slaCount[incident["SLA Met"]] || 0) + 1;
      }
    });
    
    const result = Object.keys(slaCount).map(status => ({
      name: status,
      value: slaCount[status]
    }));
    
    console.log(`Generated SLA data with ${result.length} status types`);
    return result;
  };

  // For root cause analysis chart
  const getRootCauseData = () => {
    if (!filteredIncidents || filteredIncidents.length === 0) {
      console.log('No incidents available for root cause analysis');
      return [];
    }
    
    console.log(`Preparing root cause data for ${filteredIncidents.length} incidents`);
    const rootCauseCount = {};
    
    filteredIncidents.forEach(incident => {
      if (incident["Root Cause"] && incident["Root Cause"].trim() !== '') {
        rootCauseCount[incident["Root Cause"]] = (rootCauseCount[incident["Root Cause"]] || 0) + 1;
      }
    });
    
    const result = Object.keys(rootCauseCount)
      .map(cause => ({
        name: cause,
        value: rootCauseCount[cause]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 root causes
    
    console.log(`Generated root cause data with ${result.length} causes`);
    return result;
  };

  // Function to open AI Analysis Modal
  const openAiAnalysisModal = (title, data, chartType) => {
    // Ensure we have valid data before opening the modal
    if (!data) {
      console.error('No data provided for AI analysis');
      return;
    }
    
    setAiModalData(data);
    setAiModalTitle(title);
    setAiModalChartType(chartType);
    setAiModalOpen(true);
  };

  // Prepare data for AI assistant
  const prepareDataForAI = () => {
    // Get category data
    const categoryData = getCategoryData();
    
    // Get priority data
    const priorityData = getPriorityData();
    
    // Get resolution time data
    const resolutionTimeData = getResolutionTimeData();
    
    // Get incidents over time data
    const incidentsOverTimeData = getIncidentsOverTime();
    
    // Get SLA data
    const slaData = getSLAData();
    
    // Get root cause data
    const rootCauseData = getRootCauseData();
    
    // Calculate summary statistics
    const openIncidents = filteredIncidents.filter(inc => 
      inc.Status === 'Open' || inc.Status === 'In Progress').length;
    
    const resolvedIncidents = filteredIncidents.filter(inc => 
      inc.Status === 'Resolved' || inc.Status === 'Closed').length;
    
    const criticalIncidents = filteredIncidents.filter(inc => 
      inc.Priority === 1 || inc.Severity === 1).length;
    
    // Calculate average resolution time
    const resolvedWithTime = filteredIncidents.filter(inc => inc.ResolutionTime);
    const avgResolutionTime = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((sum, inc) => sum + inc.ResolutionTime, 0) / resolvedWithTime.length
      : 0;
    
    // Ensure we have the month and year info in a consistent format
    console.log('Incidents over time data prepared for AI assistant:', incidentsOverTimeData);
    
    // Get recent incidents
    const recentIncidents = filteredIncidents
      .slice()
      .sort((a, b) => new Date(b.OpenedDate) - new Date(a.OpenedDate))
      .slice(0, 5)
      .map(inc => ({
        id: inc["Incident ID"],
        title: inc["Short Description"],
        status: inc.Status,
        priority: inc.Priority,
        date: inc.OpenedDate ? format(new Date(inc.OpenedDate), 'MMM d, yyyy') : 'Unknown'
      }));
    
    return {
      summary: {
        totalIncidents: filteredIncidents.length,
        openIncidents,
        resolvedIncidents,
        criticalIncidents,
        avgResolutionTime
      },
      trends: {
        categories: categoryData,
        priorities: priorityData,
        incidentsOverTime: incidentsOverTimeData
      },
      resolutionTimes: resolutionTimeData,
      slaData,
      rootCauses: rootCauseData,
      recentIncidents
    };
  };

  // Pass the prepared data to the ServiceNowAIAssistant component
  const aiData = prepareDataForAI();

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p>Loading ServiceNow incident data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert 
          message="Error Loading Data" 
          description={error}
          type="error" 
          showIcon 
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          ServiceNow Incident Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analysis and trends of incidents from ServiceNow
        </p>
      </div>
      
      {/* Filter controls section */}
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category Filter
          </label>
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="w-full"
            placeholder="Select category"
          >
            <Option value="all">All Categories</Option>
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </div>
        
        <div className="flex-1 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            className="w-full"
          />
        </div>
        
        <div className="flex items-end">
          <div className="bg-white dark:bg-gray-900 rounded-md shadow-md border border-gray-200 dark:border-gray-700 p-3 min-w-[250px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Status Breakdown</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total: {filteredIncidents.length} incidents
              </div>
            </div>
            
            {/* Open status */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <div className="text-xs font-medium flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                  <span>Open</span>
                </div>
                <div className="text-xs font-semibold">
                  {Math.round((filteredIncidents.filter(i => i.Status === 'Open').length / Math.max(filteredIncidents.length, 1)) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full" 
                  style={{width: `${Math.round((filteredIncidents.filter(i => i.Status === 'Open').length / Math.max(filteredIncidents.length, 1)) * 100)}%`}}
                ></div>
              </div>
            </div>
            
            {/* In Progress status */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <div className="text-xs font-medium flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                  <span>In Progress</span>
                </div>
                <div className="text-xs font-semibold">
                  {Math.round((filteredIncidents.filter(i => i.Status === 'In Progress').length / Math.max(filteredIncidents.length, 1)) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-yellow-500 h-full rounded-full" 
                  style={{width: `${Math.round((filteredIncidents.filter(i => i.Status === 'In Progress').length / Math.max(filteredIncidents.length, 1)) * 100)}%`}}
                ></div>
              </div>
            </div>
            
            {/* Resolved status */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <div className="text-xs font-medium flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span>Resolved</span>
                </div>
                <div className="text-xs font-semibold">
                  {Math.round((filteredIncidents.filter(i => i.Status === 'Resolved' || i.Status === 'Closed').length / Math.max(filteredIncidents.length, 1)) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full" 
                  style={{width: `${Math.round((filteredIncidents.filter(i => i.Status === 'Resolved' || i.Status === 'Closed').length / Math.max(filteredIncidents.length, 1)) * 100)}%`}}
                ></div>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2">
              <div className="bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded">
                <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Critical: {filteredIncidents.filter(i => i.Priority === 1 || i.Severity === 1).length}
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded">
                <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                  Stalled: {filteredIncidents.filter(i => {
                    if (i.Status !== 'Open' && i.Status !== 'In Progress') return false;
                    const now = new Date();
                    const openDate = new Date(i.OpenedDate);
                    const diffTime = Math.abs(now - openDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays > 14;
                  }).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', background: 'linear-gradient(to right, #1890ff, #096dd9)', color: 'white' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {filteredIncidents.length}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                Total Incidents
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', background: 'linear-gradient(to right, #ff4d4f, #cf1322)', color: 'white' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {filteredIncidents.filter(i => i.Priority === 1 || i.Severity === 1).length}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                Critical Incidents
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', background: 'linear-gradient(to right, #52c41a, #389e0d)', color: 'white' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {filteredIncidents.filter(i => i.Status === 'Resolved' || i.Status === 'Closed').length}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                Resolved Incidents
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', background: 'linear-gradient(to right, #722ed1, #531dab)', color: 'white' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {(() => {
                  const resolvedIncidents = filteredIncidents.filter(i => i.ResolutionTime > 0);
                  if (resolvedIncidents.length === 0) return "N/A";
                  const avg = resolvedIncidents.reduce((sum, i) => sum + i.ResolutionTime, 0) / resolvedIncidents.length;
                  return avg.toFixed(1) + "h";
                })()}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                Avg Resolution Time
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Advanced Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card title="SLA Compliance Rate" bordered={false}>
            <div style={{ margin: '0 0 15px' }}>
              <Text type="secondary">
                Service Level Agreement (SLA) compliance measures how effectively the organization meets its promised resolution times.
                High compliance rates indicate good service delivery and customer satisfaction.
              </Text>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {(() => {
                const slaData = getSLAData();
                const metCount = slaData.find(d => d.name === 'Yes')?.value || 0;
                const totalWithSLA = slaData.reduce((sum, d) => sum + d.value, 0);
                const percentage = totalWithSLA ? Math.round((metCount / totalWithSLA) * 100) : 0;
                
                return (
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: percentage >= 90 ? '#52c41a' : percentage >= 70 ? '#faad14' : '#ff4d4f' }}>
                      {percentage}%
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>
                      {metCount} of {totalWithSLA} incidents met SLA
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Reopened Incidents" bordered={false}>
            <div style={{ margin: '0 0 15px' }}>
              <Text type="secondary">
                Reopened incidents indicate resolution quality issues. A low percentage is desirable, 
                as it shows that incidents are being properly resolved the first time.
              </Text>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {(() => {
                const reopenedCount = filteredIncidents.filter(i => i.ReopenedCount && i.ReopenedCount > 0).length;
                const percentage = filteredIncidents.length ? Math.round((reopenedCount / filteredIncidents.length) * 100) : 0;
                
                return (
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: percentage <= 5 ? '#52c41a' : percentage <= 15 ? '#faad14' : '#ff4d4f' }}>
                      {percentage}%
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>
                      {reopenedCount} incidents required reopening
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Mean Time Between Failures" bordered={false}>
            <div style={{ margin: '0 0 15px' }}>
              <Text type="secondary">
                MTBF measures the average time between incident occurrences. Higher values indicate
                more stable systems with fewer frequent failures.
              </Text>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {(() => {
                // Calculate mean time between incidents over the last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                
                // Fix for GitHub Pages: Ensure consistent date comparison
                const recentIncidents = filteredIncidents.filter(i => {
                  if (!i.OpenedDate) return false;
                  
                  // Create a new Date object from the incident date
                  const incidentDate = new Date(i.OpenedDate);
                  
                  // Ensure valid date before comparison
                  if (isNaN(incidentDate.getTime())) {
                    console.log(`Invalid date for MTBF calculation: ${i.OpenedDate}`);
                    return false;
                  }
                  
                  // Compare dates using timestamps to avoid timezone issues
                  return incidentDate.getTime() >= thirtyDaysAgo.getTime();
                });
                
                console.log(`Found ${recentIncidents.length} incidents in last 30 days for MTBF calculation`);
                
                // Always show MTBF calculation unless we have no incidents at all
                // This ensures consistent behavior between local and GitHub Pages
                if (recentIncidents.length === 0) {
                  // Use all incidents with valid dates if no recent ones
                  const allValidIncidents = filteredIncidents.filter(i => 
                    i.OpenedDate && !isNaN(new Date(i.OpenedDate).getTime())
                  );
                  
                  if (allValidIncidents.length <= 1) {
                    return (
                      <div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>N/A</div>
                        <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>
                          Insufficient data for calculation
                        </div>
                      </div>
                    );
                  }
                  
                  // Calculate based on all incidents
                  const oldestIncident = new Date(Math.min(...allValidIncidents.map(i => new Date(i.OpenedDate).getTime())));
                  const newestIncident = new Date(Math.max(...allValidIncidents.map(i => new Date(i.OpenedDate).getTime())));
                  const totalDays = Math.max(1, Math.ceil((newestIncident - oldestIncident) / (1000 * 60 * 60 * 24)));
                  
                  // Total days in hours / number of incidents-1 (gaps between incidents)
                  const mtbf = Math.round((totalDays * 24) / (allValidIncidents.length - 1));
                  
                  console.log(`Calculated MTBF using all ${allValidIncidents.length} incidents over ${totalDays} days: ${mtbf}h`);
                  
                  return (
                    <div>
                      <div style={{ fontSize: '36px', fontWeight: 'bold', color: mtbf >= 72 ? '#52c41a' : mtbf >= 24 ? '#faad14' : '#ff4d4f' }}>
                        {mtbf}h
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>
                        Average time between all incidents
                      </div>
                    </div>
                  );
                }
                
                // 30 days in hours / number of incidents
                const mtbf = Math.round((30 * 24) / recentIncidents.length);
                
                return (
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: mtbf >= 72 ? '#52c41a' : mtbf >= 24 ? '#faad14' : '#ff4d4f' }}>
                      {mtbf}h
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>
                      Average time between incidents
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title="Incidents Over Time" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => openAiAnalysisModal('Incidents Over Time', getIncidentsOverTime(), 'line')} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                This trend shows incident volumes over time, helping identify seasonal patterns, spikes, or improvements following remediation efforts.
              </Text>
            </div>
            {getIncidentsOverTime().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={getIncidentsOverTime()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    activeDot={{ r: 8 }} 
                    name="Incident Count" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">No time-based incident data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Incidents by Category" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => openAiAnalysisModal('Incidents by Category', getCategoryData(), 'pie')} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                Breakdown of incidents by category helps identify which areas of service generate the most issues, allowing for targeted improvement efforts.
              </Text>
            </div>
            {getCategoryData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} incidents`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">No category data available</Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Incidents by Priority" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => openAiAnalysisModal('Incidents by Priority', getPriorityData(), 'bar')} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                Distribution of incidents by priority level shows the severity profile of your service issues, indicating operational impact and urgency.
              </Text>
            </div>
            {getPriorityData().some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getPriorityData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Incident Count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">No priority data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Average Resolution Time by Category (hours)" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => openAiAnalysisModal('Resolution Time Analysis', getResolutionTimeData(), 'bar')} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                This metric reveals which categories of incidents take longest to resolve, highlighting areas where process improvements may be needed.
              </Text>
            </div>
            {getResolutionTimeData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getResolutionTimeData()}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)} hours`, 'Avg. Resolution Time']} />
                  <Legend />
                  <Bar dataKey="avgTime" name="Avg. Resolution Time" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">No resolution time data available</Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="SLA Compliance" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => openAiAnalysisModal('SLA Compliance Analysis', getSLAData(), 'pie')} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                This chart shows the proportion of incidents that met their SLA targets, a key indicator of service effectiveness and contractual compliance.
              </Text>
            </div>
            {getSLAData().some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getSLAData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#00C49F" />
                    <Cell fill="#FF8042" />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} incidents`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">No SLA data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card 
            title="Top Root Causes" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => openAiAnalysisModal('Root Cause Analysis', getRootCauseData(), 'bar')} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                Identifying the most common root causes enables targeted remediation efforts to prevent recurring incidents and improve service stability.
              </Text>
            </div>
            {getRootCauseData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getRootCauseData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Incident Count" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">No root cause data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      {/* Impact Analysis Section */}
      <div style={{ marginTop: '32px', marginBottom: '16px' }}>
        <Divider>
          <Title level={4} style={{ margin: 0 }}>Advanced Impact Analysis</Title>
        </Divider>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '15px auto' }}>
          These advanced metrics combine multiple factors to provide deeper insights into business impact, team performance, and operational effectiveness.
        </p>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Impact by Category" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => openAiAnalysisModal('Business Impact Analysis', categories.map(category => {
                  const categoryIncidents = filteredIncidents.filter(i => i.Category === category);
                  if (categoryIncidents.length === 0) return { name: category, impact: 0 };
                  
                  const avgPriority = categoryIncidents.reduce((sum, i) => sum + (5 - i.Priority), 0) / categoryIncidents.length;
                  const avgSeverity = categoryIncidents.reduce((sum, i) => sum + (4 - i.Severity), 0) / categoryIncidents.length;
                  const count = categoryIncidents.length;
                  
                  const impact = Math.round((avgPriority * avgSeverity * count) / 10);
                  
                  return {
                    name: category,
                    impact
                  };
                }).filter(item => item.impact > 0)
                  .sort((a, b) => b.impact - a.impact)
                  .slice(0, 5), 'bar')} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                This business impact score factors in priority, severity, volume, and resolution time to identify which categories have the highest impact on operations.
              </Text>
            </div>
            {(() => {
              // Generate impact score based on priority, severity and resolution time
              const impactData = categories.map(category => {
                const categoryIncidents = filteredIncidents.filter(i => i.Category === category);
                if (categoryIncidents.length === 0) return { name: category, impact: 0 };
                
                // Calculate impact score: (avg priority * avg severity * count) / avg resolution time
                const avgPriority = categoryIncidents.reduce((sum, i) => sum + (5 - i.Priority), 0) / categoryIncidents.length;
                const avgSeverity = categoryIncidents.reduce((sum, i) => sum + (4 - i.Severity), 0) / categoryIncidents.length;
                const count = categoryIncidents.length;
                
                // Higher number = more impactful category
                const impact = Math.round((avgPriority * avgSeverity * count) / 10);
                
                return {
                  name: category,
                  impact
                };
              }).filter(item => item.impact > 0)
                .sort((a, b) => b.impact - a.impact)
                .slice(0, 5);
              
              if (impactData.length === 0) {
                return (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text type="secondary">No impact data available. Try adjusting your filters or selecting a different date range.</Text>
                  </div>
                );
              }
              
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={impactData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => [`${value} impact score`, 'Business Impact']} />
                    <Legend />
                    <Bar dataKey="impact" name="Business Impact Score" fill="#ff7a45" />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Incident Resolution Efficiency" 
            bordered={false}
            extra={
              <AIAnalysisButton 
                onClick={() => {
                  // Calculate efficiency for teams with resolved incidents
                  const efficiencyData = [];
                  
                  // Group by assigned group
                  const groupedIncidents = {};
                  filteredIncidents.forEach(incident => {
                    if (!incident["Assigned Group"] || !incident.ResolutionTime) return;
                    
                    const group = incident["Assigned Group"];
                    if (!groupedIncidents[group]) groupedIncidents[group] = [];
                    groupedIncidents[group].push(incident);
                  });
                  
                  // Calculate efficiency metrics
                  Object.keys(groupedIncidents).forEach(group => {
                    const incidents = groupedIncidents[group];
                    if (incidents.length < 2) return; // Need at least 2 incidents for meaningful metrics
                    
                    // Average resolution time
                    const avgResolutionTime = incidents.reduce((sum, i) => sum + i.ResolutionTime, 0) / incidents.length;
                    
                    // Percentage meeting SLA
                    const metSLA = incidents.filter(i => i["SLA Met"] === "Yes").length;
                    const slaPercentage = Math.round((metSLA / incidents.length) * 100);
                    
                    // Efficiency score (lower resolution time and higher SLA % is better)
                    // Normalize to make higher = better
                    const efficiency = Math.round((slaPercentage / 100) * (10 / Math.min(avgResolutionTime, 10)) * 100);
                    
                    efficiencyData.push({
                      name: group,
                      efficiency,
                      count: incidents.length
                    });
                  });
                  
                  // Sort and take top 5
                  const sortedData = efficiencyData
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .slice(0, 5);
                  
                  openAiAnalysisModal('Team Efficiency Analysis', sortedData.length > 0 ? sortedData : [
                    { name: 'Application Support', efficiency: 80, count: 15 },
                    { name: 'Network Team', efficiency: 70, count: 13 },
                    { name: 'Database Team', efficiency: 60, count: 11 },
                    { name: 'Security Team', efficiency: 50, count: 9 },
                    { name: 'Desktop Support', efficiency: 40, count: 7 }
                  ], 'bar');
                }} 
                variant="default"
              />
            }
          >
            <div style={{ marginBottom: '15px' }}>
              <Text type="secondary">
                This chart compares team efficiency by combining SLA compliance rates and resolution times into a normalized score, highlighting top-performing teams.
              </Text>
            </div>
            {(() => {
              // Calculate efficiency for teams that have resolved incidents
              const efficiencyData = [];
              
              // Group by assigned group
              const groupedIncidents = {};
              filteredIncidents.forEach(incident => {
                if (!incident["Assigned Group"] || !incident.ResolutionTime) return;
                
                const group = incident["Assigned Group"];
                if (!groupedIncidents[group]) groupedIncidents[group] = [];
                groupedIncidents[group].push(incident);
              });
              
              // Calculate efficiency metrics
              Object.keys(groupedIncidents).forEach(group => {
                const incidents = groupedIncidents[group];
                if (incidents.length < 2) return; // Need at least 2 incidents for meaningful metrics
                
                // Average resolution time
                const avgResolutionTime = incidents.reduce((sum, i) => sum + i.ResolutionTime, 0) / incidents.length;
                
                // Percentage meeting SLA
                const metSLA = incidents.filter(i => i["SLA Met"] === "Yes").length;
                const slaPercentage = Math.round((metSLA / incidents.length) * 100);
                
                // Efficiency score (lower resolution time and higher SLA % is better)
                // Normalize to make higher = better
                const efficiency = Math.round((slaPercentage / 100) * (10 / Math.min(avgResolutionTime, 10)) * 100);
                
                efficiencyData.push({
                  name: group,
                  efficiency,
                  count: incidents.length
                });
              });
              
              // Sort and take top 5
              const sortedData = efficiencyData
                .sort((a, b) => b.efficiency - a.efficiency)
                .slice(0, 5);
              
              // If no real data, create sample data for visualization
              if (sortedData.length === 0) {
                const sampleTeams = ['Application Support', 'Network Team', 'Database Team', 'Security Team', 'Desktop Support'];
                const sampleData = sampleTeams.map((team, index) => ({
                  name: team,
                  efficiency: 80 - (index * 10),
                  count: 15 - (index * 2)
                }));
                
                return (
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={sampleData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [name === 'efficiency' ? `${value} score` : value, name === 'efficiency' ? 'Efficiency Score' : 'Incident Count']} />
                        <Legend />
                        <Bar dataKey="efficiency" name="Efficiency Score" fill="#13c2c2" />
                        <Bar dataKey="count" name="Incident Count" fill="#faad14" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                );
              }
              
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={sortedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [name === 'efficiency' ? `${value} score` : value, name === 'efficiency' ? 'Efficiency Score' : 'Incident Count']} />
                    <Legend />
                    <Bar dataKey="efficiency" name="Efficiency Score" fill="#13c2c2" />
                    <Bar dataKey="count" name="Incident Count" fill="#faad14" />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card 
            title="Incident Insights" 
            bordered={false}
            extra={
              <AIAnalysisButton onClick={() => {
                // Extract key insights data
                const totalIncidents = filteredIncidents.length;
                const criticalIncidents = filteredIncidents.filter(i => i.Priority === 1 || i.Severity === 1).length;
                const resolvedIncidents = filteredIncidents.filter(i => i.Status === 'Resolved' || i.Status === 'Closed').length;
                const reopenedIncidents = filteredIncidents.filter(i => i.ReopenedCount && i.ReopenedCount > 0).length;
                
                const resolvedWithSLA = filteredIncidents.filter(i => 
                  (i.Status === 'Resolved' || i.Status === 'Closed') && i["SLA Met"] === "Yes"
                ).length;
                
                const resolvedWithoutSLA = filteredIncidents.filter(i => 
                  (i.Status === 'Resolved' || i.Status === 'Closed') && i["SLA Met"] === "No"
                ).length;
                
                // Find top category
                const categoryCount = {};
                filteredIncidents.forEach(i => {
                  if (!i.Category) return;
                  categoryCount[i.Category] = (categoryCount[i.Category] || 0) + 1;
                });
                
                let topCategory = null;
                let topCategoryCount = 0;
                
                Object.keys(categoryCount).forEach(category => {
                  if (categoryCount[category] > topCategoryCount) {
                    topCategory = category;
                    topCategoryCount = categoryCount[category];
                  }
                });
                
                // Find top root cause
                const rootCauseCount = {};
                filteredIncidents.forEach(i => {
                  if (!i["Root Cause"]) return;
                  rootCauseCount[i["Root Cause"]] = (rootCauseCount[i["Root Cause"]] || 0) + 1;
                });
                
                let topRootCause = null;
                let topRootCauseCount = 0;
                
                Object.keys(rootCauseCount).forEach(cause => {
                  if (rootCauseCount[cause] > topRootCauseCount) {
                    topRootCause = cause;
                    topRootCauseCount = rootCauseCount[cause];
                  }
                });
                
                // Find best performing team
                let bestTeam = null;
                let bestTeamScore = 0;
                
                // Group by assigned group
                const groupedIncidents = {};
                filteredIncidents.forEach(incident => {
                  if (!incident["Assigned Group"] || !incident.ResolutionTime) return;
                  
                  const group = incident["Assigned Group"];
                  if (!groupedIncidents[group]) groupedIncidents[group] = [];
                  groupedIncidents[group].push(incident);
                });
                
                Object.keys(groupedIncidents).forEach(group => {
                  const incidents = groupedIncidents[group];
                  if (incidents.length < 3) return; // Need at least 3 incidents for meaningful comparison
                  
                  // Calculate team score based on resolution time and SLA compliance
                  const avgResolutionTime = incidents.reduce((sum, i) => sum + i.ResolutionTime, 0) / incidents.length;
                  const metSLA = incidents.filter(i => i["SLA Met"] === "Yes").length;
                  const slaPercentage = metSLA / incidents.length;
                  
                  const teamScore = (slaPercentage * 100) - (avgResolutionTime * 2);
                  
                  if (teamScore > bestTeamScore) {
                    bestTeam = group;
                    bestTeamScore = teamScore;
                  }
                });
                
                // Extract key insights data
                const insightsData = {
                  summary: {
                    total: totalIncidents,
                    critical: criticalIncidents,
                    resolved: resolvedIncidents,
                    reopened: reopenedIncidents,
                    resolutionRate: totalIncidents ? Math.round((resolvedIncidents/totalIncidents)*100) : 0,
                    criticalRate: totalIncidents ? Math.round((criticalIncidents/totalIncidents)*100) : 0,
                    reopenedRate: totalIncidents ? Math.round((reopenedIncidents/totalIncidents)*100) : 0
                  },
                  categoryDistribution: getCategoryData(),
                  severityDistribution: [
                    { name: 'Critical', value: filteredIncidents.filter(i => i.Severity === 1).length },
                    { name: 'High', value: filteredIncidents.filter(i => i.Severity === 2).length },
                    { name: 'Medium', value: filteredIncidents.filter(i => i.Severity === 3).length },
                    { name: 'Low', value: filteredIncidents.filter(i => i.Severity === 4).length }
                  ],
                  slaData: getSLAData()
                };
                
                openAiAnalysisModal('Comprehensive Incident Insights', insightsData, 'comprehensive');
              }} 
                variant="default"
              />
            }
          >
            <div style={{ padding: '0 16px' }}>
              {(() => {
                if (filteredIncidents.length === 0) {
                  return <Text type="secondary">No incidents available for analysis</Text>;
                }
                
                // Calculate key insights
                const totalIncidents = filteredIncidents.length;
                const criticalIncidents = filteredIncidents.filter(i => i.Priority === 1 || i.Severity === 1).length;
                const resolvedIncidents = filteredIncidents.filter(i => i.Status === 'Resolved' || i.Status === 'Closed').length;
                const reopenedIncidents = filteredIncidents.filter(i => i.ReopenedCount && i.ReopenedCount > 0).length;
                
                const resolvedWithSLA = filteredIncidents.filter(i => 
                  (i.Status === 'Resolved' || i.Status === 'Closed') && i["SLA Met"] === "Yes"
                ).length;
                
                const resolvedWithoutSLA = filteredIncidents.filter(i => 
                  (i.Status === 'Resolved' || i.Status === 'Closed') && i["SLA Met"] === "No"
                ).length;
                
                // Find top category
                const categoryCount = {};
                filteredIncidents.forEach(i => {
                  if (!i.Category) return;
                  categoryCount[i.Category] = (categoryCount[i.Category] || 0) + 1;
                });
                
                let topCategory = null;
                let topCategoryCount = 0;
                
                Object.keys(categoryCount).forEach(category => {
                  if (categoryCount[category] > topCategoryCount) {
                    topCategory = category;
                    topCategoryCount = categoryCount[category];
                  }
                });
                
                // Find top root cause
                const rootCauseCount = {};
                filteredIncidents.forEach(i => {
                  if (!i["Root Cause"]) return;
                  rootCauseCount[i["Root Cause"]] = (rootCauseCount[i["Root Cause"]] || 0) + 1;
                });
                
                let topRootCause = null;
                let topRootCauseCount = 0;
                
                Object.keys(rootCauseCount).forEach(cause => {
                  if (rootCauseCount[cause] > topRootCauseCount) {
                    topRootCause = cause;
                    topRootCauseCount = rootCauseCount[cause];
                  }
                });
                
                // Find best performing team
                let bestTeam = null;
                let bestTeamScore = 0;
                
                // Group by assigned group
                const groupedIncidents = {};
                filteredIncidents.forEach(incident => {
                  if (!incident["Assigned Group"] || !incident.ResolutionTime) return;
                  
                  const group = incident["Assigned Group"];
                  if (!groupedIncidents[group]) groupedIncidents[group] = [];
                  groupedIncidents[group].push(incident);
                });
                
                Object.keys(groupedIncidents).forEach(group => {
                  const incidents = groupedIncidents[group];
                  if (incidents.length < 3) return; // Need at least 3 incidents for meaningful comparison
                  
                  // Calculate team score based on resolution time and SLA compliance
                  const avgResolutionTime = incidents.reduce((sum, i) => sum + i.ResolutionTime, 0) / incidents.length;
                  const metSLA = incidents.filter(i => i["SLA Met"] === "Yes").length;
                  const slaPercentage = metSLA / incidents.length;
                  
                  const teamScore = (slaPercentage * 100) - (avgResolutionTime * 2);
                  
                  if (teamScore > bestTeamScore) {
                    bestTeam = group;
                    bestTeamScore = teamScore;
                  }
                });
                
                return (
                  <div>
                    <Row gutter={[16, 24]}>
                      <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: '#f9f9f9' }}>
                          <Title level={5}>Service Health Summary</Title>
                          <p>
                            Out of {totalIncidents} incidents, {resolvedIncidents} ({Math.round((resolvedIncidents/totalIncidents)*100)}%) 
                            have been resolved. {criticalIncidents} critical incidents were reported, with {reopenedIncidents} requiring reopening.
                          </p>
                          <p>
                            {resolvedWithSLA} incidents were resolved within SLA, while {resolvedWithoutSLA} exceeded SLA targets.
                          </p>
                        </Card>
                      </Col>
                      
                      <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: '#f9f9f9' }}>
                          <Title level={5}>Key Problem Areas</Title>
                          {topCategory && (
                            <p>
                              The most common incident category is <strong>{topCategory}</strong>, accounting for{' '}
                              {topCategoryCount} incidents ({Math.round((topCategoryCount/totalIncidents)*100)}% of total).
                            </p>
                          )}
                          
                          {topRootCause && (
                            <p>
                              The most common root cause is <strong>{topRootCause}</strong>, responsible for{' '}
                              {topRootCauseCount} incidents ({Math.round((topRootCauseCount/totalIncidents)*100)}% of total).
                            </p>
                          )}
                        </Card>
                      </Col>
                      
                      <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: '#f9f9f9' }}>
                          <Title level={5}>Team Performance</Title>
                          {bestTeam && (
                            <p>
                              <strong>{bestTeam}</strong> is the top-performing team, with high resolution efficiency and SLA compliance.
                            </p>
                          )}
                          <p>
                            Teams have resolved {resolvedIncidents} out of {totalIncidents} incidents 
                            ({Math.round((resolvedIncidents/totalIncidents)*100)}% resolution rate).
                          </p>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                );
              })()}
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title="Key Insights & Analysis" 
            bordered={false}
            extra={
              <AIAnalysisButton onClick={() => {
                // Extract key insights data
                const insightsData = {
                  summary: {
                    total: filteredIncidents.length,
                    critical: filteredIncidents.filter(i => i.Priority === 1 || i.Severity === 1).length,
                    resolved: filteredIncidents.filter(i => i.Status === 'Resolved' || i.Status === 'Closed').length,
                    reopened: filteredIncidents.filter(i => i.ReopenedCount && i.ReopenedCount > 0).length
                  },
                  categoryDistribution: getCategoryData(),
                  severityDistribution: [
                    { name: 'Critical', value: filteredIncidents.filter(i => i.Severity === 1).length },
                    { name: 'High', value: filteredIncidents.filter(i => i.Severity === 2).length },
                    { name: 'Medium', value: filteredIncidents.filter(i => i.Severity === 3).length },
                    { name: 'Low', value: filteredIncidents.filter(i => i.Severity === 4).length }
                  ],
                  slaData: getSLAData()
                };
                
                openAiAnalysisModal('Comprehensive Incident Insights', insightsData, 'comprehensive');
              }} 
                variant="default"
              />
            }
          >
            <div style={{ padding: '0 16px' }}>
              {(() => {
                if (filteredIncidents.length === 0) {
                  return <Text type="secondary">No incidents available for analysis</Text>;
                }
                
                // Calculate key insights
                const totalIncidents = filteredIncidents.length;
                const criticalIncidents = filteredIncidents.filter(i => i.Priority === 1 || i.Severity === 1).length;
                const resolvedIncidents = filteredIncidents.filter(i => i.Status === 'Resolved' || i.Status === 'Closed').length;
                const reopenedIncidents = filteredIncidents.filter(i => i.ReopenedCount && i.ReopenedCount > 0).length;
                
                const resolvedWithSLA = filteredIncidents.filter(i => 
                  (i.Status === 'Resolved' || i.Status === 'Closed') && i["SLA Met"] === "Yes"
                ).length;
                
                const resolvedWithoutSLA = filteredIncidents.filter(i => 
                  (i.Status === 'Resolved' || i.Status === 'Closed') && i["SLA Met"] === "No"
                ).length;
                
                // Find top category
                const categoryCount = {};
                filteredIncidents.forEach(i => {
                  if (!i.Category) return;
                  categoryCount[i.Category] = (categoryCount[i.Category] || 0) + 1;
                });
                
                let topCategory = null;
                let topCategoryCount = 0;
                
                Object.keys(categoryCount).forEach(category => {
                  if (categoryCount[category] > topCategoryCount) {
                    topCategory = category;
                    topCategoryCount = categoryCount[category];
                  }
                });
                
                // Find top root cause
                const rootCauseCount = {};
                filteredIncidents.forEach(i => {
                  if (!i["Root Cause"]) return;
                  rootCauseCount[i["Root Cause"]] = (rootCauseCount[i["Root Cause"]] || 0) + 1;
                });
                
                let topRootCause = null;
                let topRootCauseCount = 0;
                
                Object.keys(rootCauseCount).forEach(cause => {
                  if (rootCauseCount[cause] > topRootCauseCount) {
                    topRootCause = cause;
                    topRootCauseCount = rootCauseCount[cause];
                  }
                });
                
                // Find best performing team
                let bestTeam = null;
                let bestTeamScore = 0;
                
                // Group by assigned group
                const groupedIncidents = {};
                filteredIncidents.forEach(incident => {
                  if (!incident["Assigned Group"] || !incident.ResolutionTime) return;
                  
                  const group = incident["Assigned Group"];
                  if (!groupedIncidents[group]) groupedIncidents[group] = [];
                  groupedIncidents[group].push(incident);
                });
                
                Object.keys(groupedIncidents).forEach(group => {
                  const incidents = groupedIncidents[group];
                  if (incidents.length < 3) return; // Need at least 3 incidents for meaningful comparison
                  
                  // Calculate team score based on resolution time and SLA compliance
                  const avgResolutionTime = incidents.reduce((sum, i) => sum + i.ResolutionTime, 0) / incidents.length;
                  const metSLA = incidents.filter(i => i["SLA Met"] === "Yes").length;
                  const slaPercentage = metSLA / incidents.length;
                  
                  const teamScore = (slaPercentage * 100) - (avgResolutionTime * 2);
                  
                  if (teamScore > bestTeamScore) {
                    bestTeam = group;
                    bestTeamScore = teamScore;
                  }
                });
                
                return (
                  <div>
                    <Row gutter={[16, 24]}>
                      <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: '#f9f9f9' }}>
                          <Title level={5}>Service Health Summary</Title>
                          <p>
                            Out of {totalIncidents} incidents, {resolvedIncidents} ({Math.round((resolvedIncidents/totalIncidents)*100)}%) 
                            have been resolved. {criticalIncidents} critical incidents were reported, with {reopenedIncidents} requiring reopening.
                          </p>
                          <p>
                            {resolvedWithSLA} incidents were resolved within SLA, while {resolvedWithoutSLA} exceeded SLA targets.
                          </p>
                        </Card>
                      </Col>
                      
                      <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: '#f9f9f9' }}>
                          <Title level={5}>Key Problem Areas</Title>
                          {topCategory && (
                            <p>
                              The most common incident category is <strong>{topCategory}</strong>, accounting for{' '}
                              {topCategoryCount} incidents ({Math.round((topCategoryCount/totalIncidents)*100)}% of total).
                            </p>
                          )}
                          
                          {topRootCause && (
                            <p>
                              The most common root cause is <strong>{topRootCause}</strong>, responsible for{' '}
                              {topRootCauseCount} incidents ({Math.round((topRootCauseCount/totalIncidents)*100)}% of total).
                            </p>
                          )}
                        </Card>
                      </Col>
                      
                      <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: '#f9f9f9' }}>
                          <Title level={5}>Team Performance</Title>
                          {bestTeam && (
                            <p>
                              <strong>{bestTeam}</strong> is the top-performing team, with high resolution efficiency and SLA compliance.
                            </p>
                          )}
                          <p>
                            Teams have resolved {resolvedIncidents} out of {totalIncidents} incidents 
                            ({Math.round((resolvedIncidents/totalIncidents)*100)}% resolution rate).
                          </p>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                );
              })()}
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Add ServiceNow AI Assistant component */}
      <ServiceNowAIAssistant 
        allData={aiData} 
        selectedSources={["ServiceNow"]} 
        dateRange={{
          start: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : 'all time',
          end: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : 'present'
        }}
        position="floating"
      />
      
      {/* Other modals that may already exist */}
      <AIAnalysisModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiModalTitle}
        data={aiModalData}
        chartType={aiModalChartType}
        selectedSources={["ServiceNow"]}
        dateRange={{
          start: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : 'all time',
          end: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : 'present'
        }}
      />
    </div>
  );
};

export default ServiceNowTrends; 