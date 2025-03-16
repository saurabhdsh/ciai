import Papa from 'papaparse';

export const parseCSVString = (csvText) => {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Convert headers to camelCase and standardize names
      return header.toLowerCase()
        .replace(/[\s-_]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, c => c.toLowerCase());
    }
  });

  if (results.errors.length > 0) {
    console.error('CSV parsing errors:', results.errors);
  }

  return results.data.map(row => ({
    id: row.id || row.defectId || `F${Math.random().toString(36).substr(2, 9)}`,
    title: row.title || row.description || 'Untitled Failure',
    description: row.description || row.details || row.title || '',
    date: new Date(row.date || row.timestamp || row.createdAt || Date.now()),
    severity: row.severity || row.priority || 'Medium',
    status: row.status || 'Open',
    source: row.source || row.system || 'Unknown',
    priority: row.priority || row.severity || 'Medium',
    defectType: row.defectType || row.type || 'Bug',
    lob: row.lob || row.lineOfBusiness || 'General'
  }));
}; 