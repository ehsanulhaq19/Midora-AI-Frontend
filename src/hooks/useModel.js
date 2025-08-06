// frontend/src/hooks/useModel.js
import { useState, useEffect, useCallback } from 'react';
import { modelService } from '../services/modelService';

export const useModel = (initialModel = null) => {
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available models
  const loadModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const models = await modelService.getFormattedModels();
      setAvailableModels(models);

      // If no model is selected, select the first available one
      if (!selectedModel) {
        const firstAvailable = models
          .flatMap(category => category.models)
          .find(model => model.available);

        if (firstAvailable) {
          setSelectedModel(firstAvailable.id);
        }
      } else {
        // Validate current model
        const isValid = await modelService.isModelAvailable(selectedModel);
        if (!isValid) {
          // Find a replacement model from the same provider
          const currentProvider = getProviderFromModel(selectedModel);
          const replacement = models
            .find(category => category.models.some(m => m.provider === currentProvider))
            ?.models.find(m => m.available && m.provider === currentProvider);

          if (replacement) {
            setSelectedModel(replacement.id);
          } else {
            // Fall back to any available model
            const firstAvailable = models
              .flatMap(category => category.models)
              .find(model => model.available);

            if (firstAvailable) {
              setSelectedModel(firstAvailable.id);
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading models:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedModel]);

  // Get provider from model name
  const getProviderFromModel = (modelId) => {
    if (!modelId) return null;
    if (modelId.startsWith('gpt')) return 'openai';
    if (modelId.startsWith('claude')) return 'anthropic';
    if (modelId.startsWith('gemini')) return 'google';
    return null;
  };

  // Get current model info
  const getCurrentModelInfo = useCallback(() => {
    if (!selectedModel || !availableModels.length) return null;

    for (const category of availableModels) {
      const model = category.models.find(m => m.id === selectedModel);
      if (model) {
        return {
          ...model,
          category: category.category,
          icon: category.icon
        };
      }
    }
    return null;
  }, [selectedModel, availableModels]);

  // Change model with validation
  const changeModel = useCallback(async (modelId) => {
    try {
      const isValid = await modelService.isModelAvailable(modelId);
      if (isValid) {
        setSelectedModel(modelId);
        // Save to localStorage for persistence
        localStorage.setItem('selectedModel', modelId);
        return true;
      } else {
        console.warn(`Model ${modelId} is not available`);
        return false;
      }
    } catch (error) {
      console.error('Error changing model:', error);
      return false;
    }
  }, []);

  // Get models by provider
  const getModelsByProvider = useCallback((provider) => {
    return availableModels
      .find(category => category.models.some(m => m.provider === provider))
      ?.models.filter(m => m.provider === provider) || [];
  }, [availableModels]);

  // Get recommended model for provider
  const getRecommendedForProvider = useCallback(async (provider) => {
    try {
      const recommended = await modelService.getRecommendedModels();
      return recommended[provider];
    } catch (error) {
      console.error('Error getting recommended model:', error);
      return null;
    }
  }, []);

  // Refresh models
  const refreshModels = useCallback(() => {
    modelService.lastFetch = null; // Force refresh
    loadModels();
  }, [loadModels]);

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Load saved model from localStorage on mount
  useEffect(() => {
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel && !selectedModel) {
      setSelectedModel(savedModel);
    }
  }, [selectedModel]);

  return {
    selectedModel,
    setSelectedModel: changeModel,
    availableModels,
    currentModelInfo: getCurrentModelInfo(),
    loading,
    error,
    refreshModels,
    getModelsByProvider,
    getRecommendedForProvider,
    isModelAvailable: modelService.isModelAvailable.bind(modelService)
  };
};