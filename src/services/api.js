// frontend/src/services/api.js

// 1. IMPORT THE AUTHHELPERS TO GET THE TOKEN
import { authHelpers } from './authHelpers';
import { validateModel, getRecommendedModels } from './modelService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Default models for fallback
const DEFAULT_MODELS = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  google: 'gemini-1.5-pro'
};

// --- Helper functions below are unchanged ---
const getProviderFromModel = (modelId) => {
  if (modelId.startsWith('gpt')) return 'openai';
  if (modelId.startsWith('claude')) return 'anthropic';
  if (modelId.startsWith('gemini')) return 'google';
  return 'unknown';
};

const getFallbackModel = async (provider) => {
  try {
    const recommended = await getRecommendedModels();
    return recommended[provider]?.id || DEFAULT_MODELS[provider];
  } catch (error) {
    console.error('Error getting fallback model:', error);
    return DEFAULT_MODELS[provider];
  }
};

const validateAndSubstituteModel = async (modelId) => {
  try {
    const isValid = await validateModel(modelId);
    if (isValid) {
      return modelId;
    }
    const provider = getProviderFromModel(modelId);
    const fallbackModel = await getFallbackModel(provider);
    console.warn(`Model ${modelId} is not available, using fallback: ${fallbackModel}`);
    return fallbackModel;
  } catch (error) {
    console.error('Error validating model:', error);
    return modelId;
  }
};
// --- End of unchanged helper functions ---


// Main API call function
export const sendMessage = async (message, selectedModel, options = {}) => {
  try {
    const validatedModel = await validateAndSubstituteModel(selectedModel);
    const requestBody = {
      message,
      model: validatedModel,
      ...options
    };
    console.log('Sending message with model:', validatedModel);

    // 2. CREATE HEADERS AND ADD THE AUTH TOKEN
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = authHelpers.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: headers, // Use the new headers object
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        // ... (rest of the error handling logic is unchanged)
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error && errorData.error.includes('not_found_error')) {
            console.error('Model not found, attempting with fallback model');
            const provider = getProviderFromModel(validatedModel);
            const fallbackModel = await getFallbackModel(provider);
            return sendMessage(message, fallbackModel, options);
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return { ...data, modelUsed: validatedModel };

  } catch (error) {
    // ... (rest of the catch block is unchanged)
    console.error('API call failed:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Backend server is not running. Please start your backend server on port 8000 or use the demo features.');
    }
    if (error.message.includes('not_found_error') || error.message.includes('404')) {
        const provider = getProviderFromModel(selectedModel);
        const fallbackModel = await getFallbackModel(provider);
        if (fallbackModel !== selectedModel) {
            console.log('Retrying with fallback model:', fallbackModel);
            return sendMessage(message, fallbackModel, options);
        }
    }
    throw error;
  }
};


// Streaming message function
export const sendMessageStream = async (message, selectedModel, onChunk, options = {}) => {
    try {
        const validatedModel = await validateAndSubstituteModel(selectedModel);

        // CREATE HEADERS AND ADD THE AUTH TOKEN FOR STREAMING
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = authHelpers.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
            method: 'POST',
            headers: headers, // Use the new headers object
            body: JSON.stringify({
                message,
                model: validatedModel,
                stream: true,
                ...options
            }),
        });

        // ... (rest of the streaming logic is unchanged)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') break;
                    try {
                        const parsed = JSON.parse(data);
                        onChunk(parsed);
                    } catch (e) {
                        console.error('Error parsing chunk:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Streaming API call failed:', error);
        throw error;
    }
};


// --- The remaining functions also need the token ---

export const getAvailableModels = async () => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = authHelpers.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/models/available`, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch available models:', error);
    throw error;
  }
};

export const testModel = async (modelId) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = authHelpers.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/models/test/${modelId}`, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to test model ${modelId}:`, error);
    throw error;
  }
};

// --- Exports remain the same ---
export const makeOptimizedAPICall = sendMessage;
export { authHelpers } from './authHelpers';
export const apiService = {
  sendMessage,
  sendMessageStream,
  getAvailableModels,
  testModel,
  validateAndSubstituteModel,
  getFallbackModel,
  getProviderFromModel
};
export default apiService;