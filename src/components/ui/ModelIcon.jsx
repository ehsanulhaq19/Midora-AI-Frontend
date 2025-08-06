// src/components/ui/ModelIcon.jsx - Updated with Better SVG Handling
import React, { useState } from 'react';

// VITE-STYLE: Import SVG files as URL strings
import ClaudeIcon from '../../assets/icons/claude.svg?url';
import OpenAIIcon from '../../assets/icons/openai.svg?url';
import GeminiIcon from '../../assets/icons/gemini.svg?url';

const ModelIcon = ({ modelId, className = "w-6 h-6" }) => {
  const [imageError, setImageError] = useState(false);

  // Helper function to determine provider from model ID
  const getProviderFromModelId = (modelId) => {
    if (!modelId) return 'unknown';

    const lowerModelId = modelId.toLowerCase();

    // OpenAI models - handle all GPT variants
    if (lowerModelId.includes('gpt') ||
        lowerModelId.includes('openai') ||
        lowerModelId.includes('o1-preview') ||
        lowerModelId.includes('o1-mini')) {
      return 'openai';
    }

    // Anthropic/Claude models
    if (lowerModelId.includes('claude') ||
        lowerModelId.includes('anthropic')) {
      return 'anthropic';
    }

    // Google/Gemini models
    if (lowerModelId.includes('gemini') ||
        lowerModelId.includes('google') ||
        lowerModelId.includes('bard')) {
      return 'google';
    }

    return 'unknown';
  };

  // Map providers to their SVG URLs and fallback info
  const iconMap = {
    openai: {
      svg: OpenAIIcon,
      fallback: '⚡', // OpenAI-like icon
      bgColor: 'bg-gray-900',
      textColor: 'text-white'
    },
    anthropic: {
      svg: ClaudeIcon,
      fallback: '🤖', // Claude-like icon
      bgColor: 'bg-orange-600',
      textColor: 'text-white'
    },
    google: {
      svg: GeminiIcon,
      fallback: '✨', // Gemini-like icon
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    }
  };

  // Get provider from model ID
  const provider = getProviderFromModelId(modelId);
  const iconData = iconMap[provider];

  // If no specific icon found or provider unknown, use generic fallback
  if (!iconData || imageError) {
    const fallbackData = iconData || {
      fallback: 'AI',
      bgColor: 'bg-gray-600',
      textColor: 'text-white'
    };

    return (
      <div className={`${className} ${fallbackData.bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
        <span className={`${fallbackData.textColor} font-bold text-xs`}>
          {fallbackData.fallback}
        </span>
      </div>
    );
  }

  // Handle image load error
  const handleImageError = () => {
    console.debug(`Failed to load SVG icon for ${provider}, using fallback`);
    setImageError(true);
  };

  // Render the SVG image
  return (
    <img
      src={iconData.svg}
      alt={`${provider} model icon`}
      className={`${className} rounded-sm`}
      onError={handleImageError}
      style={{
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))', // Subtle shadow
      }}
    />
  );
};

export default ModelIcon;