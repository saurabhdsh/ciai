const config = {
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    model: "gpt-4-turbo-preview",
    temperature: 0.7,
    maxTokens: 2000
  }
};

export const getOpenAIConfig = () => {
  if (!config.openai.apiKey) {
    console.warn('OpenAI API key is not set. Please check your environment variables.');
  }
  return config.openai;
};

export const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${config.openai.apiKey}`
};

export default config; 