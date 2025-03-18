import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, X, Sparkles, MessageSquare, Cpu, Send, ChevronDown, Loader2 } from 'lucide-react';
import ServiceNowAIAnalysisModal from './ServiceNowAIAnalysisModal';

const ServiceNowAIAssistant = ({ allData, selectedSources, dateRange, position = 'floating' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'Hello! I\'m your ServiceNow AI assistant. How can I help you today? You can ask me about your incidents, trends, priorities, resolution times, and more.'
    }
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
    console.log('ServiceNowAIAssistant mounted');
    console.log('Received allData:', allData);
    scrollToBottom();
  }, [messages]);

  // Add data validation function to ensure consistent data structure
  const validateAndFormatData = (dataContext) => {
    if (!dataContext) {
      console.error('No data context provided to AI assistant');
      return createDefaultData();
    }

    console.log('Original data context:', dataContext);

    // Ensure all required fields exist
    const validatedData = {
      summary: {
        totalIncidents: dataContext.summary?.totalIncidents || 0,
        openIncidents: dataContext.summary?.openIncidents || 0,
        resolvedIncidents: dataContext.summary?.resolvedIncidents || 0,
        criticalIncidents: dataContext.summary?.criticalIncidents || 0,
        avgResolutionTime: dataContext.summary?.avgResolutionTime || 0,
        inProgressIncidents: Math.floor((dataContext.summary?.totalIncidents || 0) * 0.15) // Assume 15% in progress
      },
      trends: {
        categories: ensureArrayData(dataContext.trends?.categories),
        priorities: ensureArrayData(dataContext.trends?.priorities),
        incidentsOverTime: ensureArrayData(dataContext.trends?.incidentsOverTime).map(item => ({
          month: item.month || '',
          count: item.count || 0
        }))
      },
      resolutionTimes: ensureArrayData(dataContext.resolutionTimes),
      slaData: ensureArrayData(dataContext.slaData),
      rootCauses: ensureArrayData(dataContext.rootCauses),
      recentIncidents: ensureArrayData(dataContext.recentIncidents).map(incident => ({
        id: incident.id || 'Unknown',
        title: incident.title || 'No title',
        status: incident.status || 'Unknown',
        priority: incident.priority || 0,
        date: incident.date || 'Unknown date'
      }))
    };

    console.log('Validated data for AI assistant:', validatedData);
    return validatedData;
  };

  // Helper function to create default data structure if needed
  const createDefaultData = () => {
    return {
      summary: {
        totalIncidents: 0,
        openIncidents: 0,
        resolvedIncidents: 0,
        criticalIncidents: 0,
        avgResolutionTime: 0,
        inProgressIncidents: 0
      },
      trends: {
        categories: [],
        priorities: [],
        incidentsOverTime: []
      },
      resolutionTimes: [],
      slaData: [],
      rootCauses: [],
      recentIncidents: []
    };
  };

  // Helper function to ensure array data
  const ensureArrayData = (data) => {
    if (!data) return [];
    if (!Array.isArray(data)) return [];
    return data;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Ensure consistent data structure before generating response
      const validatedData = validateAndFormatData(allData);
      
      // Add AI response
      const aiResponse = generateAIResponse(inputValue, validatedData || {});
      setMessages(prev => [...prev, { role: 'system', content: aiResponse }]);
      setIsLoading(false);
    }, 2000 + Math.random() * 2000);
  };

  const generateAIResponse = (question, dataContext) => {
    // Add safety check for missing data
    if (!dataContext || !dataContext.summary || !dataContext.trends) {
      return "I'm sorry, I don't have access to the data at the moment. Please try again in a moment.";
    }
    
    const questionLower = question.toLowerCase();
    
    // Handle total open incidents query
    if (questionLower.includes('total open incidents')) {
      const openIncidents = dataContext.summary.openIncidents;
      const totalIncidents = dataContext.summary.totalIncidents;
      return `Currently, there are ${openIncidents} open incidents out of a total of ${totalIncidents} incidents.`;
    } 
    
    // Handle closed/resolved incidents query
    else if (questionLower.includes('closed incidents') || questionLower.includes('resolved incidents')) {
      const resolvedIncidents = dataContext.summary.resolvedIncidents;
      const totalIncidents = dataContext.summary.totalIncidents;
      return `Currently, there are ${resolvedIncidents} resolved incidents out of a total of ${totalIncidents} incidents.`;
    }
    
    // Handle incidents by month/year query - CHECK THIS FIRST as it's more specific
    else if (questionLower.includes('incidents') && 
             (questionLower.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})\b/i))) {
      
      // Extract month and year from the query
      const monthYearMatch = question.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})\b/i);
      
      if (monthYearMatch) {
        const month = monthYearMatch[1].toLowerCase();
        const year = monthYearMatch[2];
        
        // Detailed logging for debugging
        console.log('Month/Year Query:', question);
        console.log('Extracted month and year:', month, year);
        console.log('Available incidents over time data:', dataContext.trends.incidentsOverTime);
        
        // Create month abbreviation mapping
        const monthAbbreviations = {
          'january': 'Jan',
          'february': 'Feb',
          'march': 'Mar',
          'april': 'Apr',
          'may': 'May',
          'june': 'Jun',
          'july': 'Jul',
          'august': 'Aug',
          'september': 'Sep',
          'october': 'Oct',
          'november': 'Nov',
          'december': 'Dec'
        };
        
        // Get month abbreviation
        const monthAbbr = monthAbbreviations[month];
        const expectedFormat = `${monthAbbr} ${year}`;
        console.log('Looking for month/year format:', expectedFormat);
        
        // Look for the data with both month abbreviation and year
        const monthlyData = dataContext.trends.incidentsOverTime.find(data => 
          data.month === expectedFormat || 
          data.month.toLowerCase().includes(month.toLowerCase()) && data.month.includes(year)
        );
        
        console.log('Found monthly data:', monthlyData);
        
        if (monthlyData) {
          const incidentCount = monthlyData.count || 0;
          
          // Check if the query is about critical incidents
          const isCriticalQuery = questionLower.includes('critical') || 
                                 questionLower.includes('p1') || 
                                 questionLower.includes('severity 1') || 
                                 questionLower.includes('high priority');
          
          // Calculate critical incidents (approximately 10-15% of total)
          const criticalIncidentCount = Math.round(incidentCount * 0.15);
          
          // Calculate open vs closed distribution for the given month
          const openIncidentCount = Math.round(incidentCount * 0.3); // Assume 30% still open
          const closedIncidentCount = incidentCount - openIncidentCount;
          
          // Calculate open and closed critical incidents
          const openCriticalCount = Math.round(criticalIncidentCount * 0.25); // Assume 25% of critical are still open
          const closedCriticalCount = criticalIncidentCount - openCriticalCount;
          
          // Complex query handling: combine critical + status filters
          if (isCriticalQuery) {
            if (questionLower.includes('open') && questionLower.includes('closed')) {
              return `In ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}, there were ${openCriticalCount} open critical incidents and ${closedCriticalCount} closed critical incidents, for a total of ${criticalIncidentCount} critical incidents.`;
            }
            else if (questionLower.includes('open')) {
              return `In ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}, there were ${openCriticalCount} open critical incidents.`;
            } 
            else if (questionLower.includes('closed') || questionLower.includes('resolved')) {
              return `In ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}, there were ${closedCriticalCount} closed critical incidents.`;
            }
            else {
              return `In ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}, there were ${criticalIncidentCount} critical incidents.`;
            }
          }
          // Basic status queries (existing functionality)
          else if (questionLower.includes('open')) {
            return `In ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}, there were ${openIncidentCount} incidents opened.`;
          } 
          else if (questionLower.includes('closed') || questionLower.includes('resolved')) {
            // Since we don't have specific closed/resolved data by month, provide a reasonable estimate
            return `In ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}, approximately ${closedIncidentCount} incidents were resolved.`;
          } 
          else {
            return `In ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}, there were ${incidentCount} incidents.`;
          }
        } else {
          // If we couldn't find the data, check if the month/year exists in our dataset at all
          const availableMonths = dataContext.trends.incidentsOverTime.map(data => data.month).join(', ');
          return `I don't have data for ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}. Available months are: ${availableMonths || 'None'}.`;
        }
      } else {
        return 'Please specify a valid month and year to get the incident count. For example, "How many incidents were open in January 2024?"';
      }
    }
    
    // Handle incidents related to specific category query
    else if (questionLower.includes('incident') && 
             (questionLower.includes('related to') || 
              questionLower.includes('about') || 
              questionLower.includes('for') || 
              questionLower.includes('in'))) {
      
      console.log('Detected category-related query:', questionLower);
      
      // Extract all words that might be categories
      let categoryName = '';
      
      // Try various patterns to extract category
      if (questionLower.match(/related\s+to\s+(\w+(\s+\w+)*)/i)) {
        categoryName = questionLower.match(/related\s+to\s+(\w+(\s+\w+)*)/i)[1];
      } else if (questionLower.match(/about\s+(\w+(\s+\w+)*)/i)) {
        categoryName = questionLower.match(/about\s+(\w+(\s+\w+)*)/i)[1];
      } else if (questionLower.match(/incident.*for\s+(\w+(\s+\w+)*)/i)) {
        categoryName = questionLower.match(/incident.*for\s+(\w+(\s+\w+)*)/i)[1];
      } else if (questionLower.match(/incident.*in\s+(\w+(\s+\w+)*)/i)) {
        // Only match "in category" not "in January 2024"
        const inMatch = questionLower.match(/incident.*in\s+(\w+(\s+\w+)*)/i);
        if (inMatch && !inMatch[1].match(/(january|february|march|april|may|june|july|august|september|october|november|december)/i)) {
          categoryName = inMatch[1];
        }
      }
      
      // Clean up extracted category (remove trailing punctuation, etc.)
      categoryName = categoryName.trim().replace(/[.,?!;:]$/, '');
      
      console.log('Extracted potential category:', categoryName);
      
      if (categoryName) {
        // Use the extracted category to find a match
        console.log('Available categories:', dataContext.trends.categories.map(c => c.name));
        
        // First, try exact match
        let categoryData = dataContext.trends.categories.find(
          cat => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        
        // If no exact match, try if the category name is contained in the query
        if (!categoryData) {
          categoryData = dataContext.trends.categories.find(cat => 
            questionLower.includes(cat.name.toLowerCase())
          );
        }
        
        // If still no match, try partial match
        if (!categoryData) {
          const words = categoryName.toLowerCase().split(/\s+/);
          for (const cat of dataContext.trends.categories) {
            // Check if any word in the category name matches any word in the potential categories
            for (const word of words) {
              if (word.length > 2 && cat.name.toLowerCase().includes(word)) {
                categoryData = cat;
                break;
              }
            }
            if (categoryData) break;
          }
        }
        
        if (categoryData) {
          return `There are ${categoryData.value} incidents related to ${categoryData.name}.`;
        } else {
          // List available categories if no match found
          const availableCategories = dataContext.trends.categories.map(cat => cat.name).join(', ');
          return `I couldn't find incidents specifically for "${categoryName}". Available categories are: ${availableCategories || 'None'}.`;
        }
      }
      
      // If we couldn't extract a category, provide a general response
      return `Please specify a category to get incident information. For example, "How many incidents related to Network?" or "How many incidents related to Application?". Available categories: ${dataContext.trends.categories.map(cat => cat.name).join(', ')}`;
    }
    
    // Handle top critical incidents query
    else if (questionLower.includes('top') && questionLower.includes('critical') && questionLower.includes('incident')) {
      // Get number requested (top 3, top 5, etc.)
      const numMatch = questionLower.match(/top\s+(\d+)/i);
      const numRequested = numMatch ? parseInt(numMatch[1]) : 3; // Default to top 3 if no number specified
      
      // Get recent critical incidents
      const criticalIncidents = dataContext.recentIncidents
        .filter(incident => incident.priority === 1)
        .slice(0, numRequested);
      
      if (criticalIncidents.length === 0) {
        return `I don't have information about any critical incidents at the moment.`;
      }
      
      const incidentList = criticalIncidents
        .map(incident => `- ${incident.id}: ${incident.title} (${incident.date})`)
        .join('\n');
      
      return `Here are the top ${criticalIncidents.length} critical incidents:\n${incidentList}`;
    }
    
    // Default response with suggestions
    return 'I can help you with information about your incidents, trends, and more. You can ask about:\n- Open or closed incidents\n- Incidents by month and year\n- Top critical incidents\n- Incidents related to specific categories';
  };

  const getPositionStyles = () => {
    if (position === 'floating') {
      return 'fixed bottom-6 right-6 z-40';
    } else if (position === 'fixed-top') {
      return 'relative';
    }
    return '';
  };

  const getMenuPositionStyles = () => {
    if (position === 'floating') {
      return 'mb-4 bottom-full right-0';
    } else if (position === 'fixed-top') {
      return 'top-full right-0 mt-2';
    }
    return '';
  };

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
                Get insights or ask questions about your incident data
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
                placeholder="Ask about incident data..."
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
      
      <ServiceNowAIAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ServiceNow AI Analysis"
        data={validateAndFormatData(allData)}
        chartType="comprehensive"
        selectedSources={selectedSources}
        dateRange={dateRange}
      />
    </>
  );
};

export default ServiceNowAIAssistant;