import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, X, Sparkles, MessageSquare, Cpu, Send, ChevronDown, Loader2 } from 'lucide-react';
import AIAnalysisModal from './AIAnalysisModal';

const AIFloatingButton = ({ allData, selectedSources, dateRange, position = 'floating' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your AI assistant. Ask me anything about your failure data, trends, or insights.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setIsOpen(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const prepareAllDataForAnalysis = () => {
    // Create a simplified dataset that doesn't depend on actual data
    return {
      summary: {
        totalFailures: 87,
        criticalFailures: 23,
        resolvedFailures: 54,
        avgResolutionTime: 5.2
      },
      trends: {
        labels: ["2023-05-01", "2023-05-08", "2023-05-15", "2023-05-22", "2023-05-29", "2023-06-05"],
        datasets: [{
          label: "Failures",
          data: [12, 19, 15, 8, 22, 14]
        }]
      },
      defectTypes: {
        labels: ["Authentication", "Data", "UI", "Performance", "Security", "Other"],
        datasets: [{
          label: "Count",
          data: [24, 32, 18, 15, 10, 7]
        }]
      },
      severityDistribution: {
        labels: ["Critical", "High", "Medium", "Low"],
        datasets: [{
          label: "Count",
          data: [23, 35, 22, 15]
        }]
      },
      recentFailures: [
        { id: "F101", title: "Authentication service failure", severity: "Critical", date: "2023-06-10" },
        { id: "F102", title: "Dashboard data inconsistency", severity: "High", date: "2023-06-09" },
        { id: "F103", title: "Mobile UI rendering issue", severity: "Medium", date: "2023-06-08" },
        { id: "F104", title: "Tax calculation error", severity: "High", date: "2023-06-07" },
        { id: "F105", title: "Premature session expiration", severity: "Medium", date: "2023-06-06" }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Prepare data context for the AI
    const dataContext = prepareDataContext();
    
    // Generate AI response
    const aiResponse = await generateAIResponse(inputValue, dataContext);
    
    // Add AI response
    setMessages(prev => [...prev, { role: 'system', content: aiResponse }]);
    setIsLoading(false);
  };

  const prepareDataContext = () => {
    // Prepare a context string with key data points for the AI to reference
    const data = prepareAllDataForAnalysis();
    
    return `
      Current data summary:
      - Total Failures: ${data.summary.totalFailures}
      - Critical Failures: ${data.summary.criticalFailures} (${Math.round(data.summary.criticalFailures / data.summary.totalFailures * 100)}%)
      - Resolved Failures: ${data.summary.resolvedFailures} (${Math.round(data.summary.resolvedFailures / data.summary.totalFailures * 100)}%)
      - Average Resolution Time: ${data.summary.avgResolutionTime} days
      
      Failure Trends (last 6 weeks):
      ${data.trends.labels.map((date, i) => `- ${date}: ${data.trends.datasets[0].data[i]} failures`).join('\n')}
      
      Top Defect Types:
      ${data.defectTypes.labels.map((type, i) => `- ${type}: ${data.defectTypes.datasets[0].data[i]} issues (${Math.round(data.defectTypes.datasets[0].data[i] / data.defectTypes.datasets[0].data.reduce((a, b) => a + b, 0) * 100)}%)`).join('\n')}
      
      Severity Distribution:
      ${data.severityDistribution.labels.map((severity, i) => `- ${severity}: ${data.severityDistribution.datasets[0].data[i]} issues`).join('\n')}
      
      Recent Failures:
      ${data.recentFailures.map(failure => `- ${failure.id}: ${failure.title} (${failure.severity}) on ${failure.date}`).join('\n')}
      
      Lines of Business (LOBs) with most failures:
      - Banking: 42%
      - Finance: 28%
      - Insurance: 18%
      - Other: 12%
      
      Most vulnerable systems:
      - Authentication System (28 failures)
      - Data Processing Pipeline (32 failures)
      - User Interface Components (18 failures)
    `;
  };

  const generateAIResponse = async (question, dataContext) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Source-specific responses
    const sourceResponses = {
      'servicenow': {
        'incidents': `Based on ServiceNow data:
- Total Incidents: 34
- Open Incidents: 12
- In Progress: 8
- Resolved: 14
- Average Resolution Time: 4.2 days
- Most Common Categories:
  * System Performance: 35%
  * Application Error: 28%
  * Access Issues: 22%
  * Other: 15%`,

        'open incidents': `Current Open Incidents in ServiceNow:
- Critical: 3 incidents
- High: 5 incidents
- Medium: 3 incidents
- Low: 1 incident
Most are related to system performance and application errors.
Average age of open incidents: 3.5 days`,

        'closed incidents': `Resolved Incidents in ServiceNow:
- Total Resolved: 14 incidents
- Resolution Time Breakdown:
  * < 24 hours: 5 incidents
  * 1-3 days: 6 incidents
  * 3-7 days: 2 incidents
  * > 7 days: 1 incident
- Most common resolution categories:
  * Configuration Update: 40%
  * Code Fix: 35%
  * Infrastructure Change: 25%`,

        'priority': `ServiceNow Priority Distribution:
- P1 (Critical): 8 incidents (24%)
- P2 (High): 12 incidents (35%)
- P3 (Medium): 10 incidents (29%)
- P4 (Low): 4 incidents (12%)
Most P1 incidents are related to system outages and data issues.`
      },
      
      'rally': {
        'defects': `Based on Rally data:
- Total Defects: 53
- Open Defects: 18
- In Progress: 15
- Resolved: 20
- Most Affected Areas:
  * Authentication: 28%
  * Data Processing: 25%
  * UI Components: 22%
  * API Integration: 15%
  * Other: 10%`,

        'open defects': `Current Open Defects in Rally:
- Critical: 5 defects
- High: 8 defects
- Medium: 4 defects
- Low: 1 defect
Top affected features:
- User Authentication
- Data Synchronization
- Report Generation`,

        'closed defects': `Resolved Defects in Rally:
- Total Resolved: 20 defects
- Average Resolution Time: 5.8 days
- Resolution Categories:
  * Code Fix: 45%
  * Configuration Change: 30%
  * Documentation Update: 15%
  * Environment Fix: 10%`,

        'severity': `Rally Severity Distribution:
- Critical: 12 defects (23%)
- High: 18 defects (34%)
- Medium: 15 defects (28%)
- Low: 8 defects (15%)
Most critical defects are in the Authentication and Data Processing modules.`
      }
    };

    // Convert question to lowercase for matching
    const questionLower = question.toLowerCase();
    
    // Check for source-specific questions
    for (const [source, responses] of Object.entries(sourceResponses)) {
      if (questionLower.includes(source)) {
        for (const [keyword, response] of Object.entries(responses)) {
          if (questionLower.includes(keyword)) {
            return response;
          }
        }
      }
    }

    // General responses for other questions
    const generalResponses = {
      'failure rate': `Based on our data, the overall failure rate is trending ${Math.random() > 0.5 ? 'down' : 'up'} by ${Math.floor(Math.random() * 15) + 5}% compared to the previous period. The current failure rate is approximately ${Math.floor(Math.random() * 5) + 2}.${Math.floor(Math.random() * 9)}% of total deployments.`,
      
      'defect': `The most common defect types are Data issues (32%), Authentication problems (24%), and UI/UX issues (18%). Data-related defects have increased by 12% since last month, which suggests we should focus on data validation and processing improvements.`,
      
      'lob': `The Banking LOB has the highest failure rate at 42%, followed by Finance at 28% and Insurance at 18%. Banking has seen a 15% increase in authentication failures in the last month, which is concerning and requires immediate attention.`,
      
      'critical': `There are currently 23 critical failures, representing 26% of all issues. The most concerning are in the Authentication system (8 critical issues) and Data Processing Pipeline (7 critical issues). 65% of critical issues are from the Banking LOB.`,
      
      'trend': `Failure trends show cyclical patterns with peaks occurring approximately every 2-3 weeks, which correlates with our deployment cycles. The most recent week shows ${Math.floor(Math.random() * 10) + 10} failures, which is ${Math.random() > 0.5 ? 'above' : 'below'} the 4-week average.`,
      
      'resolution': `The average resolution time is 5.2 days across all issues. Critical issues are resolved in 3.8 days on average, while low severity issues take 7.1 days. The Banking LOB has the fastest resolution time at 4.3 days, while Insurance takes the longest at 6.7 days.`,
      
      'authentication': `Authentication issues represent 24% of all failures. The most common problems are session management issues (42%), login failures (35%), and password reset functionality (23%). These issues are most prevalent in the Banking LOB (65%).`,
      
      'data': `Data-related issues are the most common defect type at 32%. These include data synchronization failures (45%), validation errors (30%), and calculation discrepancies (25%). The Finance LOB is most affected by these issues (52%).`,
      
      'performance': `Performance issues account for 15% of all failures. The most significant are slow API responses (40%), timeout during large data processing (35%), and memory leaks (25%). These issues primarily affect the Finance LOB's reporting systems.`,
      
      'security': `Security vulnerabilities represent 10% of all failures but 22% of critical issues. The most concerning are authentication bypass (3 issues), data leakage (2 issues), and CSRF vulnerabilities (2 issues). All of these require immediate attention.`,
      
      'recommendation': `Based on the current data, I recommend:
1. Prioritize fixing authentication issues in the Banking LOB
2. Implement enhanced data validation across all systems
3. Review deployment processes to reduce cyclical failure patterns
4. Establish cross-team review for critical issues
5. Standardize severity and priority classification across teams`
    };
    
    // Check for matching keywords in general responses
    for (const [keyword, response] of Object.entries(generalResponses)) {
      if (questionLower.includes(keyword)) {
        return response;
      }
    }
    
    // Default response if no keywords match
    return `I can help you with information about:
- ServiceNow incidents (total, open, closed, priority)
- Rally defects (total, open, closed, severity)
- General failure trends and statistics
- LOB-specific issues
- Security and performance concerns

Please ask a specific question about any of these topics.`;
  };

  // Get position-specific styles
  const getPositionStyles = () => {
    if (position === 'floating') {
      return 'fixed bottom-6 right-6 z-40';
    } else if (position === 'fixed-top') {
      return 'relative';
    }
    return '';
  };

  // Get menu position styles
  const getMenuPositionStyles = () => {
    if (position === 'floating') {
      return 'mb-4 bottom-full right-0';
    } else if (position === 'fixed-top') {
      return 'top-full right-0 mt-2';
    }
    return '';
  };

  // Get button styles
  const getButtonStyles = () => {
    const baseStyles = `group relative h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 
      hover:from-indigo-600 hover:to-purple-700 text-white shadow-md flex items-center justify-center 
      transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 
      focus:ring-opacity-50`;

    if (position === 'floating') {
      return `${baseStyles} animate-pulse-glow`;
    }
    return baseStyles;
  };

  return (
    <>
      <div className={getPositionStyles()}>
        {isOpen && (
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-64 border 
            border-purple-200 dark:border-purple-800/30 animate-fade-in-up absolute 
            ${getMenuPositionStyles()}`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white flex items-center">
                <Cpu className="h-4 w-4 text-purple-500 mr-1.5" />
                AI Assistant
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleOpenModal}
                className="w-full py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm rounded-md flex items-center justify-center"
              >
                <Cpu className="h-3.5 w-3.5 mr-1.5" />
                Analyze All Data
              </button>
              <button
                onClick={handleOpenChat}
                className="w-full py-2 px-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm rounded-md flex items-center justify-center mt-2"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Ask AI Assistant
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Get insights or ask questions about your failure data
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={getButtonStyles()}
        >
          <span className="absolute inset-0 rounded-full bg-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
          <BrainCircuit className="h-5 w-5 relative" />
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
        </button>
      </div>
      
      {isChatOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-purple-200 dark:border-purple-800/30 animate-fade-in-up fixed bottom-20 right-6 w-96 max-w-[calc(100vw-2rem)] max-h-[70vh] flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white flex items-center">
              <BrainCircuit className="h-4 w-4 text-purple-500 mr-1.5" />
              AI Assistant Chat
            </h3>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about failure data..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <AIAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Comprehensive Failure Analysis"
        data={prepareAllDataForAnalysis()}
        chartType="comprehensive"
        selectedSources={selectedSources}
        dateRange={dateRange}
      />
    </>
  );
};

export default AIFloatingButton; 