// src/components/chat/ChatWelcomeState.jsx - Complete Updated Version with Provider Grouping
import React, { useState, useEffect, useRef } from 'react';
import { PencilIcon, BookOpenIcon, PhotoIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import ModelIcon from '../ui/ModelIcon';
import { modelService } from '../../services/modelService';

const ChatWelcomeState = ({ onModelSelect, selectedModel, onQuickAction, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Refs for horizontal scrolling
  const scrollContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load top-pick models from backend on component mount
  useEffect(() => {
    loadTopPickModels();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to group models by provider
  const groupModelsByProvider = (models) => {
    const grouped = models.reduce((acc, model) => {
      const provider = model.provider;
      if (!acc[provider]) {
        acc[provider] = [];
      }
      acc[provider].push(model);
      return acc;
    }, {});

    // Ensure consistent ordering: OpenAI, Anthropic, Google
    const orderedGrouped = {};
    if (grouped.openai) orderedGrouped.openai = grouped.openai;
    if (grouped.anthropic) orderedGrouped.anthropic = grouped.anthropic;
    if (grouped.google) orderedGrouped.google = grouped.google;

    return orderedGrouped;
  };

  const loadTopPickModels = async () => {
    try {
      setLoading(true);
      setError(null);

      // This will now load all 6 models from /api/ai/top-picks
      const models = await modelService.getTopPickModels();
      console.log('Loaded top pick models:', models);
      console.log('Total models loaded:', models.length);

      setAvailableModels(models);

      // Set recommended model as default if none selected
      if (!selectedModel && models.length > 0) {
        const recommended = models.find(m => m.recommended) || models[0];
        onModelSelect(recommended.id);
      }
    } catch (err) {
      console.error('Failed to load top pick models:', err);
      setError('Failed to load AI models');

      // Load fallback models
      const fallbackModels = await modelService.getMinimalFallbackModels();
      setAvailableModels(fallbackModels);

      if (!selectedModel && fallbackModels.length > 0) {
        onModelSelect(fallbackModels[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 400); // Increased scroll distance for provider groups
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + 400);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current ?
    scrollPosition < (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth) :
    false;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModelDisplayName = () => {
    const currentModel = availableModels.find(m => m.id === selectedModel);
    return currentModel?.name || 'Loading...';
  };

  const handleModelSelect = (modelId) => {
    onModelSelect && onModelSelect(modelId);
    setIsDropdownOpen(false);
  };

  const quickActions = [
    { icon: PencilIcon, label: 'Help me write', action: 'write' },
    { icon: BookOpenIcon, label: 'Learn about', action: 'learn' },
    { icon: PhotoIcon, label: 'Create image', action: 'image' },
    { icon: MagnifyingGlassIcon, label: 'Analyze image', action: 'analyze' },
    { icon: PlusIcon, label: 'See More', action: 'more' }
  ];

  // Get provider info for display
  const getProviderInfo = (provider) => {
    const providerMap = {
      openai: { name: 'OpenAI', icon: '🤖', color: 'from-green-500 to-emerald-600' },
      anthropic: { name: 'Anthropic', icon: '🧠', color: 'from-orange-500 to-red-600' },
      google: { name: 'Google', icon: '✨', color: 'from-blue-500 to-purple-600' }
    };
    return providerMap[provider] || { name: 'AI Provider', icon: '🤖', color: 'from-gray-500 to-gray-600' };
  };

  return (
    <div className="flex flex-col bg-gray-50 px-4 py-6 min-h-screen">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <div className="mb-5">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="welcome-greeting mb-2">
            {getGreeting()}
          </h1>
          <p className="welcome-subtitle">
            How can I help you today?
          </p>
        </div>

        {/* Chat Input Area */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200">
              <button className="mr-3 p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 welcome-input focus:ring-0"
              />

              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="ml-3 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center bg-white border border-gray-200 rounded-md px-2.5 py-1.5 model-dropdown-text text-gray-600 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer min-w-[140px]"
                >
                  <span className="mr-1.5 truncate">{getModelDisplayName()}</span>
                  <svg
                    className={`w-3 h-3 text-purple-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Dropdown Menu with Provider Grouping */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-96 overflow-y-auto">
                    {availableModels.length > 0 ? (
                      Object.entries(groupModelsByProvider(availableModels)).map(([provider, models]) => {
                        const providerInfo = getProviderInfo(provider);
                        return (
                          <div key={provider}>
                            {/* Provider Header in Dropdown */}
                            <div className={`px-3 py-2 bg-gradient-to-r ${providerInfo.color} text-white`}>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{providerInfo.icon}</span>
                                <span className="text-sm font-semibold">{providerInfo.name}</span>
                                <span className="text-xs opacity-75">({models.length} models)</span>
                              </div>
                            </div>

                            {/* Provider Models in Dropdown */}
                            {models.map((model) => (
                              <button
                                key={model.id}
                                onClick={() => handleModelSelect(model.id)}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-purple-50 transition-colors duration-150 flex items-center justify-between border-l-2 ${
                                  model.id === selectedModel
                                    ? 'bg-purple-50 text-purple-700 border-l-purple-500'
                                    : 'text-gray-700 border-l-transparent hover:border-l-purple-300'
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="font-medium flex items-center space-x-2">
                                    <span>{model.name}</span>
                                    {model.recommended && (
                                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                        ⭐
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {model.description?.substring(0, 50)}...
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-2">
                                  <span className="text-xs text-gray-400 capitalize">{model.category}</span>
                                  {model.id === selectedModel && (
                                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">Loading models...</div>
                    )}
                  </div>
                )}
              </div>

              <button className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <path d="M12 19v4"/>
                  <path d="M8 23h8"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 justify-center">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => onQuickAction && onQuickAction(action.action)}
              className="flex items-center px-4 py-2 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-full quick-action-text text-gray-700 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow transform hover:scale-[1.02]"
            >
              <action.icon className="w-3.5 h-3.5 mr-1.5" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Enhanced Models Section with Provider Grouping */}
        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-2"></div>
              <h3 className="text-lg font-semibold text-gray-900">Top AI Models</h3>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {availableModels.length} available
              </span>
            </div>
            <button
              onClick={loadTopPickModels}
              disabled={loading}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-sm text-gray-600">Loading latest AI models...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-3">
                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">{error}</div>
              </div>
              <button
                onClick={loadTopPickModels}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Enhanced Scrollable Container with Provider Grouping */}
          {!loading && !error && (
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={handleScrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft
                    ? 'bg-white hover:bg-gray-50 text-gray-700 hover:text-purple-600 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleScrollRight}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-200 ${
                  canScrollRight
                    ? 'bg-white hover:bg-gray-50 text-gray-700 hover:text-purple-600 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Enhanced Scrollable Container with Provider Grouping */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-8 overflow-x-auto scrollbar-hide px-10 py-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Group models by provider and render with headers */}
                {Object.entries(groupModelsByProvider(availableModels)).map(([provider, models]) => {
                  const providerInfo = getProviderInfo(provider);
                  return (
                    <div key={provider} className="flex-shrink-0">
                      {/* Provider Header */}
                      <div className="mb-4">
                        <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r ${providerInfo.color} text-white shadow-sm`}>
                          <span className="text-xl">{providerInfo.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{providerInfo.name}</h4>
                            <p className="text-xs opacity-90">{models.length} models</p>
                          </div>
                        </div>
                      </div>

                      {/* Provider Models */}
                      <div className="flex gap-4">
                        {models.map((model, index) => (
                          <div
                            key={`${model.id}-${index}`}
                            onClick={() => onModelSelect && onModelSelect(model.id)}
                            className={`flex-shrink-0 w-72 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              model.id === selectedModel
                                ? 'border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]'
                                : 'border-gray-200 hover:border-purple-300 hover:shadow-sm bg-white hover:transform hover:scale-[1.01]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <ModelIcon modelId={model.provider} className="w-8 h-8" />
                              <div className="flex flex-col items-end space-y-1">
                                {model.id === selectedModel && (
                                  <span className="model-card-badge text-purple-700 bg-purple-200 px-2 py-0.5 rounded-full text-xs font-medium">
                                    Selected
                                  </span>
                                )}
                                {model.recommended && (
                                  <span className="model-card-badge text-green-700 bg-green-200 px-2 py-0.5 rounded-full text-xs font-medium">
                                    Recommended
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className="model-card-title text-gray-900 mb-2 font-semibold">{model.name}</h4>
                            <p className="model-card-description text-gray-600 mb-3 text-sm">{model.description}</p>

                            {/* Model Details */}
                            <div className="flex items-center justify-between">
                              <span className="model-card-badge bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full capitalize text-xs">
                                {model.category}
                              </span>
                              <span className="model-card-badge text-purple-600 font-semibold capitalize text-xs">
                                {model.cost_tier}
                              </span>
                            </div>

                            {/* Score indicator (for debugging) */}
                            {process.env.NODE_ENV === 'development' && (
                              <div className="mt-2 text-xs text-gray-400">
                                Score: {model.score}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Scroll Indicators */}
              <div className="flex justify-center mt-4 space-x-1">
                {Object.keys(groupModelsByProvider(availableModels)).map((provider, index) => (
                  <div
                    key={provider}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      Math.floor(scrollPosition / 400) === index
                        ? 'bg-purple-600'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeState;