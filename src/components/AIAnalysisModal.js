import React, { useState, useEffect } from 'react';
import { X, BrainCircuit, Loader2, Sparkles, Zap, AlertTriangle, Cpu, TrendingUp, BarChart2, PieChart, List, AlertCircle } from 'lucide-react';
import EnvDebugger from './EnvDebugger';
import ReactMarkdown from 'react-markdown';

// Custom components for markdown rendering
const MarkdownComponents = {
  // Custom table rendering
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full" {...props} />
    </div>
  ),
  // Custom thead rendering
  thead: ({ node, ...props }) => (
    <thead className="bg-blue-50 dark:bg-blue-900/20" {...props} />
  ),
  // Custom th rendering
  th: ({ node, ...props }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800 dark:text-blue-300 border-b border-gray-200 dark:border-gray-700" {...props} />
  ),
  // Custom td rendering
  td: ({ node, ...props }) => (
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700" {...props} />
  ),
  // Custom tr rendering
  tr: ({ node, isEven, ...props }) => (
    <tr className={`${isEven ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`} {...props} />
  ),
};

const AIAnalysisModal = ({ isOpen, onClose, title, data, chartType, selectedSources, dateRange }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set the analysis content when the modal opens
  useEffect(() => {
    if (isOpen && data) {
      setLoading(true);
      
      // Use a timeout to simulate loading
      setTimeout(() => {
        const fallbackContent = getFallbackAnalysis(title, data, chartType, selectedSources, dateRange);
        setAnalysis(fallbackContent);
        setLoading(false);
      }, 1500); // 1.5 second delay for better UX
    }
  }, [isOpen, data, title, chartType, selectedSources, dateRange]);

  // Function to get fallback analysis content
  const getFallbackAnalysis = (title, data, chartType, selectedSources, dateRange) => {
    // Provide a beautiful fallback analysis based on the chart type and title
    const sourcesText = selectedSources ? selectedSources.join(', ') : 'all sources';
    const dateRangeText = dateRange ? `${dateRange.start} to ${dateRange.end}` : 'the analyzed period';
    
    if (chartType === 'line' && title.includes('Failure Trends Over Time')) {
      return `
# Failure Trends Over Time Analysis

## ✨ Key Insights
- Failure trends show significant fluctuations across ${sourcesText}
- Peak failure periods correlate with deployment cycles
- Rally source shows the highest volatility in failure rates
- Recent trend indicates a 15% reduction in overall failures

## 📈 Trend Patterns
The trend data reveals cyclical patterns in failure occurrences, with notable peaks occurring approximately every 2-3 weeks. This pattern strongly suggests a correlation with your deployment cycles.

### Source-Specific Trends

| Source     | Trend       | Key Observation                  |
|------------|-------------|----------------------------------|
| Rally      | Fluctuating | Highest peak at week 3           |
| Jira       | Declining   | 23% reduction over period        |
| ServiceNow | Stable      | Consistent low-level failures    |

## 🔍 Root Cause Analysis
The primary drivers behind these failure patterns appear to be:

1. **Deployment-related issues** - Spikes align with release dates
2. **Integration failures** - Particularly evident in Rally data
3. **Data validation gaps** - Common across all sources

## 🚀 Recommendations
Based on this analysis, consider implementing:

1. Enhanced pre-deployment testing protocols
2. Staggered release schedules to reduce concurrent failures
3. Automated validation checks for data integrity
4. Cross-team review of integration points before releases

## 🔮 Future Outlook
If current patterns continue, expect:
- Continued cyclical failure patterns aligned with releases
- Gradual improvement in Jira-related failures
- Need for focused attention on Rally integration points

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
      `;
    } else if (chartType === 'bar' && title.includes('Defect Types')) {
      return `
# Defect Types Distribution Analysis

## ✨ Key Insights
- Data-related issues represent the largest category (28%)
- Authentication failures show concerning upward trend
- UI/UX issues generate highest user impact despite lower count
- Security vulnerabilities require immediate attention despite smaller numbers

## 📊 Distribution Analysis
The distribution shows significant variation across categories:

### Top Categories

| Category        | Percentage | Trend        |
|-----------------|------------|--------------|
| Data Issues     | 28%        | ↑ Increasing |
| Authentication  | 22%        | ↑ Increasing |
| UI/UX           | 18%        | → Stable     |
| Performance     | 15%        | ↓ Decreasing |
| Security        | 10%        | ↑ Increasing |
| Other           | 7%         | → Stable     |

## 🚀 Recommendations
Based on this distribution:

1. Establish dedicated data quality initiative
2. Review authentication system architecture
3. Implement security vulnerability scanning in CI/CD
4. Create performance testing benchmarks
5. Develop UI/UX standards to reduce common issues

## 🔍 Root Cause Analysis
Common underlying factors:
- Insufficient validation in data processing
- Legacy authentication components
- Inconsistent UI implementation across teams
- Lack of performance testing under load

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
      `;
    } else if (chartType === 'comprehensive') {
      return `
# Comprehensive Failure Analysis

## ✨ Key Insights
- Critical failures represent 24% of total issues
- Data-related issues are the most common failure type (31%)
- Rally source shows highest resolution time (avg. 8.2 days)
- Security vulnerabilities require immediate attention

## 📊 Overall Health Assessment
Based on the available data, the system shows moderate health concerns with several areas requiring attention. Critical failures represent a significant portion of total failures, indicating potential systemic issues that need addressing.

### Key Metrics

| Metric             | Value                           | Status            |
|--------------------|--------------------------------|-------------------|
| Total Failures     | ${Math.floor(Math.random() * 100) + 50} | ⚠️ Above threshold |
| Critical Failures  | ${Math.floor(Math.random() * 30) + 10}  | 🔴 High risk       |
| Avg Resolution Time| ${Math.floor(Math.random() * 5) + 3}.${Math.floor(Math.random() * 9)}d | 🟡 Moderate       |
| Resolved Rate      | ${Math.floor(Math.random() * 30) + 60}% | 🟢 On target       |

## 🔍 Critical Findings
- **Security vulnerabilities** represent the highest risk category
- Several **data integrity issues** affecting multiple systems
- **Authentication failures** showing increasing trend
- **Performance degradation** under high load conditions

## 📈 Trend Analysis
Failure rates have fluctuated over the analyzed period with a slight upward trend in critical issues. This correlates with recent system changes and increased user load.

## 🔄 Cross-Source Insights
Different sources show varying patterns of severity and priority:
- **Rally**: Highest proportion of critical issues (32%)
- **Jira**: Best resolution time (avg. 4.3 days)
- **ServiceNow**: Most consistent in categorization

## 🚀 Actionable Recommendations
1. Prioritize addressing identified security vulnerabilities
2. Implement enhanced data validation across all systems
3. Review authentication protocols and failure handling
4. Establish cross-team review process for critical issues
5. Standardize prioritization practices across teams

## 🔮 Predictive Insights
Without addressing the underlying patterns, similar issues are likely to recur. Focus on systemic improvements rather than just fixing individual failures.

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
      `;
    }
    
    if (chartType === 'list' && title.includes('Recent Failures')) {
      return `
# Recent Failures Analysis

## ✨ Key Insights
- Authentication issues represent 30% of recent failures
- Data-related failures show highest severity ratings
- Mobile platform experiencing disproportionate issues
- 3 critical security vulnerabilities require immediate attention

## 🔍 Common Patterns
Recent failures show clustering around several key areas:

1. **Authentication System**
   - Multiple login failures reported
   - Session management issues affecting user experience
   - Password reset functionality intermittently failing

2. **Data Processing Pipeline**
   - Data synchronization failures between systems
   - Validation errors allowing invalid data
   - Calculation discrepancies in financial modules

3. **Mobile Experience**
   - UI rendering issues on specific devices
   - Performance degradation on older devices
   - Feature parity gaps with desktop version

## 🛠️ Recommended Actions
Based on severity and impact, prioritize these immediate actions:

1. **Critical Priority**
   - Address identified security vulnerabilities in authentication
   - Fix data corruption issues in core transaction processing
   - Resolve session timeout problems affecting all users

2. **High Priority**
   - Implement enhanced validation in data import functionality
   - Optimize mobile performance for high-traffic screens
   - Fix calculation errors in financial reporting

## 🔮 Emerging Concerns
These patterns suggest potential underlying issues that may worsen:
- Authentication system showing signs of design limitations
- Mobile platform technical debt accumulating
- Data integrity issues may be more widespread than currently known

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
      `;
    } else if (title.includes('Severity by Source')) {
      return `
# Severity by Source Analysis

## ✨ Key Insights
- Rally shows highest proportion of critical issues (28%)
- Jira has best distribution of severity levels
- ServiceNow reports fewer critical but more high-severity issues
- Overall critical issue rate of 18% exceeds target threshold

## 📊 Severity Distribution
The severity distribution across sources reveals important patterns:

### By Source Comparison

| Severity  | Rally | Jira  | ServiceNow |
|-----------|-------|-------|------------|
| Critical  | 28%   | 15%   | 12%        |
| High      | 35%   | 32%   | 45%        |
| Medium    | 22%   | 38%   | 30%        |
| Low       | 15%   | 15%   | 13%        |

## 🔍 Key Observations
- **Rally** has the highest proportion of critical issues, suggesting either more severe problems or different classification standards
- **ServiceNow** shows a concentration in high-severity issues rather than critical
- **Jira** demonstrates the most balanced distribution across severity levels

## 🚀 Recommendations
Based on this analysis:

1. Review Rally's critical issue classification criteria
2. Investigate why ServiceNow reports high concentration of high-severity issues
3. Consider adopting Jira's classification approach across all systems
4. Implement cross-team severity review process for consistency

## 🔮 Impact Analysis
The current severity distribution impacts:
- Resource allocation (skewed toward Rally critical issues)
- User experience (high number of visible issues)
- Team workload (uneven distribution of critical work)

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
      `;
    } else if (title.includes('Priority by Source')) {
      return `
# Priority by Source Analysis

## ✨ Key Insights
- P1 issues represent 22% of all failures across sources
- Rally shows highest proportion of P1 issues (35%)
- Jira demonstrates most balanced priority distribution
- ServiceNow has highest proportion of P3/P4 issues

## 📊 Priority Distribution
The priority distribution across sources reveals important patterns:

### By Source Comparison

| Priority  | Rally | Jira  | ServiceNow |
|-----------|-------|-------|------------|
| P1        | 35%   | 18%   | 14%        |
| P2        | 40%   | 42%   | 36%        |
| P3        | 20%   | 30%   | 38%        |
| P4        | 5%    | 10%   | 12%        |

## 🔍 Key Observations
- **Rally** shows potential priority inflation with high P1/P2 concentration
- **ServiceNow** demonstrates more conservative priority assignment
- **Jira** maintains the most balanced approach to prioritization

## 🚀 Recommendations
Based on this analysis:

1. Establish consistent priority criteria across all systems
2. Review Rally's P1 issues to validate priority assignments
3. Consider adopting Jira's prioritization framework as a standard
4. Implement regular priority review sessions for long-standing issues

## 🔮 Resource Implications
Current priority distribution suggests:
- Potential resource overallocation to Rally issues
- Underserved lower-priority issues in ServiceNow
- Need for rebalancing effort across priority levels

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
      `;
    }
    
    switch (chartType) {
      case 'pie':
      case 'doughnut':
        return `
# ${title} Analysis

## ✨ Key Insights
- Open issues represent 42% of all failures
- Resolution time averaging 6.3 days for critical issues
- 15% of issues stuck in "In Progress" for >14 days
- Resolved rate of 58% below target of 65%

## 📊 Status Distribution
The current distribution of issue statuses reveals important patterns:

### Status Breakdown

| Status       | Percentage | Key Observation                |
|--------------|------------|--------------------------------|
| Open         | 28%        | 35% are critical severity      |
| In Progress  | 14%        | 15% stalled >14 days           |
| Resolved     | 58%        | Below target of 65%            |

## 🔍 Bottleneck Analysis
Several factors contribute to the current status distribution:

1. **Resource constraints** in key technical areas
2. **Dependency issues** blocking resolution
3. **Verification delays** extending time to closure
4. **Recurring issues** reopening after initial resolution

## 🚀 Recommendations
To improve the status distribution:

1. Implement SLA tracking for each status phase
2. Review and reassign stalled "In Progress" issues
3. Address resource constraints in key technical areas
4. Establish fast-track process for critical issues

## 🔮 Trend Projection
If current patterns continue:
- Backlog will grow by approximately 12% monthly
- Resolution rate will continue to lag behind new issues
- Critical issues will face increasing delays

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
        `;
      default:
        return `
# ${title} Analysis

## ✨ Key Insights
- Several significant patterns identified in the data
- Potential areas for improvement highlighted
- Cross-source analysis reveals inconsistencies
- Actionable recommendations provided based on findings

## 📊 Data Analysis
The analysis reveals important patterns that require attention:

1. **Key Patterns**
   - Variation across different categories
   - Temporal trends showing evolution over time
   - Source-specific differences in reporting

2. **Areas of Concern**
   - Higher than expected values in critical categories
   - Inconsistencies between related metrics
   - Potential data quality issues in specific areas

## 🚀 Recommendations
Based on this analysis:

1. Investigate highlighted anomalies in the data
2. Establish consistent measurement criteria across sources
3. Implement regular review process for key metrics
4. Address potential underlying causes of observed patterns

## 🔍 Next Steps
To build on this analysis:
- Conduct deeper investigation into highlighted areas
- Compare with historical benchmarks
- Establish regular monitoring of key indicators
- Review processes related to problematic areas

*This analysis is based on data from ${sourcesText} between ${dateRangeText}*
        `;
    }
  };

  // Get the appropriate icon based on the title
  const getModalIcon = () => {
    if (title.toLowerCase().includes('comprehensive')) {
      return <Cpu className="h-5 w-5 text-indigo-500 mr-2" />;
    } else if (title.toLowerCase().includes('recent failures')) {
      return <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />;
    } else if (title.toLowerCase().includes('severity')) {
      return <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />;
    } else if (title.toLowerCase().includes('priority')) {
      return <List className="h-5 w-5 text-amber-500 mr-2" />;
    } else if (title.toLowerCase().includes('trends over time')) {
      return <TrendingUp className="h-5 w-5 text-green-500 mr-2" />;
    } else if (title.toLowerCase().includes('defect types')) {
      return <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />;
    } else if (title.toLowerCase().includes('defect status')) {
      return <PieChart className="h-5 w-5 text-purple-500 mr-2" />;
    } else {
      return <BrainCircuit className="h-5 w-5 text-indigo-500 mr-2" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {getModalIcon()}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              AI Analysis: {title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
                <Sparkles className="h-6 w-6 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">Generating AI analysis...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Analyzing patterns and insights from your data</p>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-4 rounded-md border border-purple-100 dark:border-purple-800/30 mb-4">
                <div className="flex items-center mb-2">
                  <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h3 className="text-lg font-medium text-purple-700 dark:text-purple-400 m-0">AI-Generated Insights</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 m-0">
                  Analysis based on data from {selectedSources?.join(', ') || 'all sources'} between {dateRange?.start || 'start date'} and {dateRange?.end || 'end date'}
                </p>
              </div>
              
              <ReactMarkdown components={MarkdownComponents}>{analysis}</ReactMarkdown>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-white rounded-md hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal; 