// frontend/src/context/ModelProvider.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { modelService } from '../services/modelService';

const ModelContext = createContext();

export const useModel = () => useContext(ModelContext);

export const ModelProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [chatKey, setChatKey] = useState(Date.now());

  const [modelData, setModelData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        const data = await modelService.getModelData();
        setModelData(data);

        let defaultModel = null;
        // FIXED: data is a flat array of models, not categories
        if (data.length > 0) {
          // Find the first recommended and available model
          defaultModel = data.find(model => model.recommended && model.available);

          // If no recommended model, pick the first available one
          if (!defaultModel) {
            defaultModel = data.find(model => model.available);
          }

          // If still no model, just pick the first one
          if (!defaultModel && data.length > 0) {
            defaultModel = data[0];
          }

          if (defaultModel) {
            setSelectedModel(defaultModel.id);
          }
        }
        setError(null);
      } catch (e) {
        console.error("Failed to load models:", e);
        setError("Could not load AI models. Please ensure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const value = {
    selectedModel,
    setSelectedModel,
    modelData,
    isLoading,
    error,
    chatKey,
    setChatKey,
  };

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  );
};