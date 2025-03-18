import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Sparkles, Send, Cpu } from 'lucide-react';

const AIAssistantSection = ({ allData, selectedSources, dateRange }) => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your ServiceNow AI assistant. Ask me questions about your incident data, trends, or specific issues.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Add a delay to simulate thinking (between 2-4 seconds)
    const thinkingDelay = 2000 + Math.random() * 2000;
    
    // Generate AI response with delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputValue);
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'system', content: aiResponse }]);
      setIsLoading(false);
    }, thinkingDelay);
  };

  const generateAIResponse = async (question) => {
    // Convert question to lowercase for matching
    const questionLower = question.toLowerCase();
    
    // Extract summary data from allData for easy reference
    const totalIncidents = allData.summary.totalIncidents || 0;
    const openIncidents = allData.summary.openIncidents || 0;
    const resolvedIncidents = allData.summary.resolvedIncidents || 0;
    const criticalIncidents = allData.summary.criticalIncidents || 0;
    const avgResolutionTime = allData.summary.avgResolutionTime || 0;
    
    // ServiceNow specific responses
    const serviceNowResponses = {
      'incident': `ServiceNow Incident Analysis:

Total Incidents: ${totalIncidents}
Open Incidents: ${openIncidents}
Resolved Incidents: ${resolvedIncidents}
Critical Incidents: ${criticalIncidents}

Resolution Metrics:
- Average Resolution Time: ${avgResolutionTime.toFixed(1)} hours
- Resolution Rate: ${totalIncidents ? Math.round((resolvedIncidents/totalIncidents)*100) : 0}%

${allData.recentIncidents && allData.recentIncidents.length > 0 ? 
`Recent Incidents:
${allData.recentIncidents.slice(0, 3).map(incident => 
  `- ${incident.id}: ${incident.title} (${incident.status}, Priority: ${incident.priority})`
).join('\n')}` : ''}`,

      'trend': `ServiceNow Incident Trends:
      
Over the past ${dateRange.start === 'all time' ? 'period' : 'selected period'}, we've observed the following trends:

${allData.trends?.incidentsOverTime ? 
`- Incident volume has ${
  allData.trends.incidentsOverTime.length > 3 && 
  allData.trends.incidentsOverTime[allData.trends.incidentsOverTime.length-1].value > 
  allData.trends.incidentsOverTime[0].value ? 'increased' : 'decreased'
} over time.` : ''}

${allData.trends?.categories ? 
`- Top categories: ${
  allData.trends.categories
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(cat => cat.name)
    .join(', ')
}` : ''}

${allData.trends?.priorities ? 
`- Priority distribution: ${
  allData.trends.priorities
    .map(p => `P${p.name}: ${p.value} incidents`)
    .join(', ')
}` : ''}

${allData.rootCauses ? 
`- Primary root causes: ${
  allData.rootCauses
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(cause => cause.name)
    .join(', ')
}` : ''}`,

      'sla': `ServiceNow SLA Analysis:

${allData.slaData ? 
`SLA Compliance Rate: ${
  (() => {
    const metCount = allData.slaData.find(d => d.name === 'Yes')?.value || 0;
    const totalWithSLA = allData.slaData.reduce((sum, d) => sum + d.value, 0);
    return totalWithSLA ? `${Math.round((metCount / totalWithSLA) * 100)}%` : 'N/A';
  })()
}

Incidents meeting SLA: ${allData.slaData.find(d => d.name === 'Yes')?.value || 0}
Incidents breaching SLA: ${allData.slaData.find(d => d.name === 'No')?.value || 0}

This ${
  (() => {
    const metCount = allData.slaData.find(d => d.name === 'Yes')?.value || 0;
    const totalWithSLA = allData.slaData.reduce((sum, d) => sum + d.value, 0);
    const percentage = totalWithSLA ? Math.round((metCount / totalWithSLA) * 100) : 0;
    return percentage >= 90 ? 'excellent' : percentage >= 70 ? 'acceptable' : 'concerning';
  })()
} compliance rate ${
  (() => {
    const metCount = allData.slaData.find(d => d.name === 'Yes')?.value || 0;
    const totalWithSLA = allData.slaData.reduce((sum, d) => sum + d.value, 0);
    const percentage = totalWithSLA ? Math.round((metCount / totalWithSLA) * 100) : 0;
    return percentage >= 90 ? 'indicates strong service delivery performance' : 
           percentage >= 70 ? 'shows room for improvement in service delivery' : 
           'suggests significant issues with meeting service commitments';
  })()
}.` : 'No SLA data available.'}`
    };

    // General response for ServiceNow data
    const generalResponse = `ServiceNow Incident Overview:

I can provide insights on ${totalIncidents} incidents from your ServiceNow instance.

Key Stats:
- Open Incidents: ${openIncidents} (${totalIncidents ? Math.round((openIncidents/totalIncidents)*100) : 0}%)
- Resolved Incidents: ${resolvedIncidents} (${totalIncidents ? Math.round((resolvedIncidents/totalIncidents)*100) : 0}%)
- Critical Incidents: ${criticalIncidents} (${totalIncidents ? Math.round((criticalIncidents/totalIncidents)*100) : 0}%)
- Avg Resolution Time: ${avgResolutionTime.toFixed(1)} hours

I can help with more specific questions about:
- Incident trends over time
- SLA compliance rates 
- Priority and category distribution
- Root cause analysis
- Resolution metrics

What specific aspect of your ServiceNow data would you like to explore?`;

    // Check for matching keywords in ServiceNow responses
    for (const [keyword, response] of Object.entries(serviceNowResponses)) {
      if (questionLower.includes(keyword)) {
        return response;
      }
    }
    
    // Return general response if no specific keywords match
    return generalResponse;
  };

  return (
    <div className="ai-assistant-section">
      <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ backgroundColor: '#f9f9f9', minHeight: '320px' }}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-200 max-w-[80%] shadow-sm">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                      <BrainCircuit className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div className="font-medium text-purple-600 dark:text-purple-400 flex items-center">
                      <span>Thinking</span>
                      <span className="ml-1 animate-bounce">.</span>
                      <span className="ml-0.5 animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="ml-0.5 animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-12 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-16 animate-pulse"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-28 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-8 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                    <span>Analyzing ServiceNow data</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about ServiceNow incidents..."
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
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Cpu className="h-3 w-3 mr-1 text-purple-500" />
            <span>Try asking: "Show me incident trends" or "What's our SLA compliance?"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantSection; 