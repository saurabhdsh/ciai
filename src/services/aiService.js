import { getOpenAIConfig, headers } from '../config/api';

export const generateAnalysis = async (data) => {
  const config = getOpenAIConfig();
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: "You are an AI analyst specialized in software failure analysis and root cause investigation."
          },
          {
            role: "user",
            content: `Analyze the following failure data and provide insights: ${JSON.stringify(data)}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

export const generateRecommendations = async (analysis) => {
  const config = getOpenAIConfig();
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: "You are an AI expert in providing actionable recommendations based on software failure analysis."
          },
          {
            role: "user",
            content: `Based on this analysis, provide specific recommendations: ${JSON.stringify(analysis)}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}; 