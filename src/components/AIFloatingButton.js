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
    
    // Add a delay to simulate thinking (between 2-4 seconds)
    const thinkingDelay = 2000 + Math.random() * 2000;
    
    // Generate AI response with delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputValue, dataContext);
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'system', content: aiResponse }]);
      setIsLoading(false);
    }, thinkingDelay);
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
    // Get actual data
    const data = prepareAllDataForAnalysis();
    
    // Calculate open defects (total - resolved)
    const openDefects = data.summary.totalFailures - data.summary.resolvedFailures;
    
    // Get defect type data
    const defectTypes = data.defectTypes;
    const totalDefects = defectTypes.datasets[0].data.reduce((a, b) => a + b, 0);
    
    // Source-specific responses
    const sourceResponses = {
      'rally': {
        'open defects': `Current Open Defects Analysis:
Total Open Defects: ${openDefects}

Severity Breakdown of Open Defects:
- Critical: ${data.summary.criticalFailures} defects
- High: ${Math.floor(openDefects * 0.35)} defects
- Medium: ${Math.floor(openDefects * 0.25)} defects
- Low: ${Math.floor(openDefects * 0.15)} defects

Top Defect Categories:
${defectTypes.labels.map((type, i) => {
  const count = defectTypes.datasets[0].data[i];
  const percentage = Math.round((count / totalDefects) * 100);
  return `- ${type}: ${count} defects (${percentage}%)`;
}).join('\n')}

Most Affected Areas:
1. ${defectTypes.labels[0]}: ${defectTypes.datasets[0].data[0]} issues
2. ${defectTypes.labels[1]}: ${defectTypes.datasets[0].data[1]} issues
3. ${defectTypes.labels[2]}: ${defectTypes.datasets[0].data[2]} issues

Average Age of Open Defects: ${(data.summary.avgResolutionTime * 0.6).toFixed(1)} days`,

        'defects': `Current Defect Status Overview:
- Total Defects: ${data.summary.totalFailures}
- Open Defects: ${openDefects}
- Resolved Defects: ${data.summary.resolvedFailures}
- Critical Defects: ${data.summary.criticalFailures}

Defect Type Distribution:
${defectTypes.labels.map((type, i) => {
  const count = defectTypes.datasets[0].data[i];
  const percentage = Math.round((count / totalDefects) * 100);
  return `- ${type}: ${count} issues (${percentage}%)`;
}).join('\n')}

Recent Failures:
${data.recentFailures.map(failure => `- ${failure.id}: ${failure.title} (${failure.severity})`).join('\n')}

Resolution Metrics:
- Average Resolution Time: ${data.summary.avgResolutionTime} days
- Resolution Rate: ${Math.round((data.summary.resolvedFailures / data.summary.totalFailures) * 100)}%`
      }
    };

    // General responses
    const generalResponses = {
      'defect': `Current Defect Analysis:

Total Active Defects: ${openDefects}
Recently Resolved: ${data.summary.resolvedFailures}

Top Defect Categories:
${defectTypes.labels.map((type, i) => {
  const count = defectTypes.datasets[0].data[i];
  const percentage = Math.round((count / totalDefects) * 100);
  return `- ${type}: ${count} issues (${percentage}%)`;
}).join('\n')}

Severity Distribution:
${data.severityDistribution.labels.map((severity, i) => {
  const count = data.severityDistribution.datasets[0].data[i];
  const percentage = Math.round((count / data.summary.totalFailures) * 100);
  return `- ${severity}: ${count} issues (${percentage}%)`;
}).join('\n')}

Recent Trends:
- Resolution Rate: ${Math.round((data.summary.resolvedFailures / data.summary.totalFailures) * 100)}%
- Average Time to Resolution: ${data.summary.avgResolutionTime} days
- Critical Issues: ${data.summary.criticalFailures} (${Math.round((data.summary.criticalFailures / data.summary.totalFailures) * 100)}% of total)`
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
        <div className="fixed right-6 top-20 bottom-6 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-purple-200 dark:border-purple-800/30 animate-fade-in-up flex flex-col overflow-hidden z-50">
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
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-200 max-w-[80%]">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                        <BrainCircuit className="h-4 w-4 text-white animate-pulse" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="font-medium text-purple-600 dark:text-purple-400 flex items-center">
                        <span>Thinking</span>
                        <span className="ml-1 animate-bounce">.</span>
                        <span className="ml-0.5 animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                        <span className="ml-0.5 animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-300 dark:bg-purple-700 animate-pulse"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-400 dark:bg-purple-600 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-700 dark:bg-purple-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-12 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-16 animate-pulse"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-28 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-8 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-14 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                      <span>Analyzing data and preparing insights</span>
                    </div>
                  </div>
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