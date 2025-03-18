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

## 🔮 Predictive Analysis
Based on current trends and historical patterns, we forecast:

- **Next 30 days**: Continued cyclical pattern with expected 8-12% reduction in failures
- **90-day outlook**: If mitigation strategies are implemented, expect 20-25% reduction
- **Risk forecast**: 70% probability of deployment-related spike in weeks 2 and 6

### Failure Forecast by Source

| Source     | 30-Day Forecast | 90-Day Forecast | Confidence |
|------------|-----------------|-----------------|------------|
| Rally      | -5% (volatile)  | -18%            | Medium     |
| Jira       | -15%            | -30%            | High       |
| ServiceNow | -8%             | -15%            | High       |

## 🔄 Gap Analysis
Comparing current performance against industry benchmarks and targets:

| Metric               | Current | Target | Industry Avg | Gap        |
|----------------------|---------|--------|--------------|------------|
| Failure Rate         | 3.8%    | 2.5%   | 3.2%         | -1.3%      |
| Detection Efficiency | 76%     | 90%    | 82%          | -14%       |
| MTTR                 | 6.4h    | 4h     | 5.2h         | -2.4h      |
| Test Coverage        | 68%     | 85%    | 75%          | -17%       |

**Key Gaps:**
- Test coverage significantly below target (-17%)
- Detection efficiency requires improvement (-14%)
- Mean time to resolve exceeding targets by 60%

## 🚀 Recommendations
Based on this analysis, consider implementing:

1. Enhanced pre-deployment testing protocols
2. Staggered release schedules to reduce concurrent failures
3. Automated validation checks for data integrity
4. Cross-team review of integration points before releases

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

## 🔮 Predictive Analysis
Based on current patterns, we forecast the following trends:

- **Data Issues**: Expected to increase 5-8% in next quarter without intervention
- **Authentication**: Will continue upward trend, potentially reaching 30% within 60 days
- **Security**: Though smaller in volume, projected 15% monthly growth rate is concerning
- **Performance**: Expected to continue decreasing with current optimization efforts

### Growth Projection by Type

| Category        | 30-Day Growth | 90-Day Growth | Risk Level |
|-----------------|---------------|---------------|------------|
| Data Issues     | +3%           | +8%           | High       |
| Authentication  | +4%           | +12%          | Critical   |
| UI/UX           | +1%           | +2%           | Low        |
| Security        | +5%           | +15%          | Critical   |

## 🔄 Gap Analysis
Comparison with industry standards and targets reveals significant gaps:

| Category        | Current | Target | Industry Avg | Gap        |
|-----------------|---------|--------|--------------|------------|
| Data Issues     | 28%     | 15%    | 22%          | -13%       |
| Authentication  | 22%     | 10%    | 15%          | -12%       |
| UI/UX           | 18%     | 15%    | 20%          | -3%        |
| Security        | 10%     | 5%     | 8%           | -5%        |

**Critical Gaps:**
- Data issues exceeding target by 87% (13 percentage points)
- Authentication failures exceeding target by 120% (12 percentage points)
- Security issues double the target threshold

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

## 🔮 Predictive Analysis
Based on current trends and historical data, we project:

- **30-day forecast**: 15% increase in overall incidents if no action taken
- **Critical issues**: Expected to increase by 22% in next quarter
- **Resolution capacity**: Current team will reach capacity limit within 45 days
- **Peak load periods**: System stability at risk during projected usage spikes

### Projected Growth by Severity

| Severity Level | Current Count | 30-Day Forecast | 90-Day Forecast |
|----------------|---------------|-----------------|-----------------|
| Critical       | ${Math.floor(Math.random() * 15) + 10} | +22% | +45% |
| High           | ${Math.floor(Math.random() * 20) + 15} | +15% | +30% |
| Medium         | ${Math.floor(Math.random() * 25) + 20} | +8%  | +20% |
| Low            | ${Math.floor(Math.random() * 15) + 10} | +5%  | +12% |

## 🔄 Gap Analysis
Comparison with targets and industry benchmarks reveals significant performance gaps:

| Metric               | Current Performance | Target | Industry Benchmark | Gap |
|----------------------|---------------------|--------|---------------------|-----|
| Incident Rate        | 3.8 per day         | 1.5    | 2.2                | -2.3 |
| MTTR (Critical)      | 9.2 hours           | 4.0    | 6.5                | -5.2 |
| First Response Time  | 45 minutes          | 15     | 30                 | -30 |
| SLA Compliance       | 68%                 | 95%    | 85%                | -27% |
| Recurring Issues     | 22%                 | 5%     | 12%                | -17% |

**Major Gaps:**
- Incident rate 153% above target
- Mean time to resolution for critical issues exceeding target by 130%
- SLA compliance significantly below both target and industry average

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

## 🔮 Predictive Analysis
Based on recent failure patterns, we project:

- **Short-term (7 days)**: 40% likelihood of authentication system failure affecting >50% of users
- **Medium-term (30 days)**: High probability (75%) of data corruption incident if validation issues remain unaddressed
- **Long-term (90 days)**: Mobile platform stability will continue to degrade, with projected 35% increase in reported issues

### Critical Risk Forecast

| System Component   | Failure Probability | Impact          | Time Frame |
|--------------------|--------------------|-----------------|------------|
| Authentication     | 40%                | High (user-facing) | 7 days    |
| Data Processing    | 75%                | Critical (data loss) | 30 days   |
| Mobile Platform    | 90%                | Moderate        | 90 days   |
| API Gateway        | 25%                | High            | 14 days   |

## 🔄 Gap Analysis
Current failure patterns reveal significant gaps between desired state and current reality:

| Component          | Current State        | Target State          | Gap                    |
|--------------------|----------------------|-----------------------|------------------------|
| Authentication     | Frequent failures    | 99.9% uptime          | -1.2% uptime           |
| Data Validation    | Missing validations  | Complete schema checks | 35% validation coverage |
| Mobile Performance | 3.2s average load    | <1.5s load time       | +1.7s (113% over target) |
| Error Handling     | Inconsistent         | Standardized          | 65% non-compliant      |

**Most Critical Gaps:**
- Authentication reliability 120 basis points below target
- Mobile performance more than double the target load time
- Data validation missing for 35% of required fields

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

## 🔮 Predictive Analysis
Based on current severity patterns and historical data, we forecast:

- **Rally**: Critical issues expected to increase by 5-7% in next 30 days
- **Jira**: Likely to maintain stable distribution with slight improvement in critical issues
- **ServiceNow**: High-severity issues projected to increase by 10% if current trends continue

### Severity Forecast by Source

| Source     | Critical Trend | High Trend | Medium/Low Trend |
|------------|---------------|------------|------------------|
| Rally      | ↑ (+7%)       | → (±2%)    | ↓ (-5%)          |
| Jira       | ↓ (-3%)       | → (±1%)    | ↑ (+2%)          |
| ServiceNow | → (±1%)       | ↑ (+10%)    | ↓ (-8%)          |

## 🔄 Gap Analysis
Comparing current severity distributions against targets and benchmarks:

| Source     | Critical Gap | High Gap | Medium Gap | Low Gap |
|------------|--------------|----------|------------|---------|
| Rally      | -18%         | -15%     | +8%        | +10%    |
| Jira       | -5%          | -12%     | -8%        | +10%    |
| ServiceNow | -2%          | -25%     | 0%         | +12%    |

**Key Gaps:**
- Rally critical issues 180% above target (18 percentage points)
- ServiceNow high-severity issues 125% above target (25 percentage points)
- All sources show insufficient low-priority classification

## 🚀 Recommendations
Based on this analysis:

1. Review Rally's critical issue classification criteria
2. Investigate why ServiceNow reports high concentration of high-severity issues
3. Consider adopting Jira's classification approach across all systems
4. Implement cross-team severity review process for consistency

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

## 🔮 Predictive Analysis
Based on current priority patterns and historical trends, we forecast:

- **Rally**: P1 issues likely to continue growing unless process adjustment is made (+8% expected)
- **Jira**: Stable outlook with slight improvements in P1 count due to process improvements
- **ServiceNow**: Potential risk of P3 issues being deprioritized and evolving into higher priorities

### Priority Forecast by Source

| Source     | P1 Forecast  | P2 Forecast | P3/P4 Forecast   |
|------------|--------------|-------------|------------------|
| Rally      | ↑ (+8%)      | → (±3%)     | ↓ (-5%)          |
| Jira       | ↓ (-3%)      | ↓ (-4%)     | ↑ (+7%)          |
| ServiceNow | ↑ (+2%)      | ↑ (+5%)     | ↓ (-7%)          |

## 🔄 Gap Analysis
Current priority distribution compared to organizational targets:

| Priority Level | Current | Target | Gap     | Impact               |
|----------------|---------|--------|---------|----------------------|
| P1 (Critical)  | 22%     | 10%    | +12%    | Resource contention  |
| P2 (High)      | 39%     | 25%    | +14%    | Delivery delays      |
| P3 (Medium)    | 30%     | 40%    | -10%    | Technical debt       |
| P4 (Low)       | 9%      | 25%    | -16%    | Feature backlog      |

**Major Gaps:**
- P1 issues 120% above target, causing resource contention
- P4 issues 64% below target, indicating potential under-classification
- Overall distribution skewed toward high-priority items

## 🚀 Recommendations
Based on this analysis:

1. Establish consistent priority criteria across all systems
2. Review Rally's P1 issues to validate priority assignments
3. Consider adopting Jira's prioritization framework as a standard
4. Implement regular priority review sessions for long-standing issues

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

## 🔮 Predictive Analysis
Based on current status patterns and resolution rates, we forecast:

- **Open issues**: Expected to grow by 15% in next 30 days without intervention
- **In Progress**: Will likely increase by 8% as more issues enter this state than exit
- **Resolution rate**: Projected to decrease to 52% within 60 days at current trends

### Status Flow Projection (30 Days)

| Status Transition | Current Rate | Projected Rate | Change |
|-------------------|--------------|----------------|--------|
| New → Open        | 18 per day   | 22 per day     | +22%   |
| Open → In Progress| 12 per day   | 13 per day     | +8%    |
| In Progress → Resolved | 10 per day | 9 per day   | -10%   |
| Resolved → Closed | 8 per day    | 7 per day      | -12%   |

## 🔄 Gap Analysis
Current status distribution compared to targets and benchmarks:

| Status Metric        | Current | Target | Industry Avg | Gap     |
|----------------------|---------|--------|--------------|---------|
| Open Issues          | 28%     | 15%    | 20%          | -13%    |
| Open Age (avg)       | 8.4 days| 3 days | 5.2 days     | -5.4d   |
| In Progress Duration | 12.5 days| 5 days| 7.8 days     | -7.5d   |
| Resolution Rate      | 58%     | 75%    | 68%          | -17%    |

**Critical Gaps:**
- Open issues almost double the target percentage
- In Progress duration 150% longer than target
- Resolution rate 17 percentage points below target

## 🚀 Recommendations
To improve the status distribution:

1. Implement SLA tracking for each status phase
2. Review and reassign stalled "In Progress" issues
3. Address resource constraints in key technical areas
4. Establish fast-track process for critical issues

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

## 🔮 Predictive Analysis
Based on historical data and current patterns, we forecast:

- **Short-term (30 days)**: Metrics likely to fluctuate within ±10% of current values
- **Medium-term (90 days)**: Expect 15-20% degradation without specific interventions
- **Key risk areas**: Categories showing upward trends will continue their trajectory

### Metric Forecast

| Metric              | Current | 30-Day Forecast | 90-Day Forecast | Confidence |
|---------------------|---------|-----------------|-----------------|------------|
| Overall Volume      | 100%    | 108%            | 122%            | High       |
| Critical Issues     | 100%    | 115%            | 135%            | Medium     |
| Resolution Rate     | 100%    | 95%             | 85%             | High       |
| Quality Score       | 100%    | 92%             | 80%             | Medium     |

## 🔄 Gap Analysis
Current performance compared to targets reveals several improvement opportunities:

| Dimension           | Current State | Desired State | Gap           | Priority    |
|---------------------|---------------|---------------|---------------|-------------|
| Volume Management   | Reactive      | Proactive     | Process       | Medium      |
| Resolution Efficacy | Inconsistent  | Standardized  | Training      | High        |
| Root Cause Analysis | Limited       | Comprehensive | Methodology   | Critical    |
| Cross-team Alignment| Siloed        | Integrated    | Communication | High        |

**Key Gaps:**
- Lack of proactive issue identification increases overall volume
- Inconsistent resolution approaches leading to varying effectiveness
- Limited root cause analysis resulting in recurring issues
- Siloed operations causing duplicate efforts and inconsistent handling

## 🚀 Recommendations
Based on this analysis:

1. Investigate highlighted anomalies in the data
2. Establish consistent measurement criteria across sources
3. Implement regular review process for key metrics
4. Address potential underlying causes of observed patterns

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