// src/services/modelService.js - FIXED with Debug Logging

class ModelService {
  constructor() {
    this.cachedModels = null;
    this.cacheExpiry = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  async _fetchApi(endpoint, options = {}) {
    const url = `${this.API_BASE_URL}${endpoint}`;
    console.log(`ModelService: Fetching from ${url}`);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.detail || JSON.stringify(errorJson);
      } catch (e) {
        errorDetail = errorText || `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorDetail);
    }

    return response.json();
  }

  /**
   * FIXED: Get all models from top-picks endpoint
   */
  async getModelData() {
    console.log('ModelService: Loading all available models from backend...');

    // Check cache first
    if (this.cachedModels && this.cacheExpiry > Date.now()) {
      console.log('ModelService: Using cached models');
      return this.cachedModels;
    }

    try {
      console.log('ModelService: Fetching from backend...');

      // CHANGED: Use top-picks to get all 6 models
      const topPicksData = await this._fetchApi('/ai/top-picks');
      console.log('ModelService: Raw top-picks response:', topPicksData);

      // Debug: Log each provider's models
      console.log('OpenAI models:', topPicksData.openai_top?.length || 0);
      console.log('Claude models:', topPicksData.claude_top?.length || 0);
      console.log('Gemini models:', topPicksData.gemini_top?.length || 0);

      // Transform to flat frontend format
      const frontendModels = this.transformTopPicksToFrontend(topPicksData);
      console.log('ModelService: Final transformed models:', frontendModels);
      console.log('ModelService: Total models count:', frontendModels.length);

      // Cache the results
      this.cachedModels = frontendModels;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return frontendModels;
    } catch (error) {
      console.error('ModelService: Failed to fetch models from backend:', error);
      const fallbackModels = this.getMinimalFallbackModels();
      console.log('ModelService: Using fallback models:', fallbackModels);
      return fallbackModels;
    }
  }

  /**
   * FIXED: Better transformation with debug logging
   */
  transformTopPicksToFrontend(topPicksData) {
    const frontendModels = [];

    // Define provider priority for sorting
    const providerPriority = { 'openai': 1, 'anthropic': 2, 'google': 3 };

    // Process OpenAI top picks
    if (topPicksData.openai_top && Array.isArray(topPicksData.openai_top)) {
      console.log('Processing OpenAI models:', topPicksData.openai_top);
      topPicksData.openai_top.forEach((model, index) => {
        const transformedModel = {
          id: model.id,
          name: model.name,
          description: this.getModelDescription(model),
          provider: 'openai',
          providerName: 'OpenAI',
          providerIcon: 'openai', // Use actual SVG identifier
          category: model.category,
          recommended: model.recommended,
          backendId: model.id,
          available: true,
          cost_tier: model.cost_tier,
          score: model.score,
          providerOrder: providerPriority.openai,
          modelOrder: index
        };
        frontendModels.push(transformedModel);
        console.log('Added OpenAI model:', transformedModel.name);
      });
    } else {
      console.warn('No OpenAI models found in response');
    }

    // Process Claude top picks
    if (topPicksData.claude_top && Array.isArray(topPicksData.claude_top)) {
      console.log('Processing Claude models:', topPicksData.claude_top);
      topPicksData.claude_top.forEach((model, index) => {
        const transformedModel = {
          id: model.id,
          name: model.name,
          description: this.getModelDescription(model),
          provider: 'anthropic',
          providerName: 'Anthropic',
          providerIcon: 'anthropic', // Use actual SVG identifier
          category: model.category,
          recommended: model.recommended,
          backendId: model.id,
          available: true,
          cost_tier: model.cost_tier,
          score: model.score,
          providerOrder: providerPriority.anthropic,
          modelOrder: index
        };
        frontendModels.push(transformedModel);
        console.log('Added Claude model:', transformedModel.name);
      });
    } else {
      console.warn('No Claude models found in response');
    }

    // Process Gemini top picks
    if (topPicksData.gemini_top && Array.isArray(topPicksData.gemini_top)) {
      console.log('Processing Gemini models:', topPicksData.gemini_top);
      topPicksData.gemini_top.forEach((model, index) => {
        const transformedModel = {
          id: model.id,
          name: model.name,
          description: this.getModelDescription(model),
          provider: 'google',
          providerName: 'Google',
          providerIcon: 'google', // Use actual SVG identifier
          category: model.category,
          recommended: model.recommended,
          backendId: model.id,
          available: true,
          cost_tier: model.cost_tier,
          score: model.score,
          providerOrder: providerPriority.google,
          modelOrder: index
        };
        frontendModels.push(transformedModel);
        console.log('Added Gemini model:', transformedModel.name);
      });
    } else {
      console.warn('No Gemini models found in response');
    }

    // Sort by provider order first, then by score within provider
    frontendModels.sort((a, b) => {
      if (a.providerOrder !== b.providerOrder) {
        return a.providerOrder - b.providerOrder;
      }
      return (a.score || 0) - (b.score || 0);
    });

    console.log(`✅ Final transformation result: ${frontendModels.length} models`);
    frontendModels.forEach(model => {
      console.log(`  - ${model.providerName}: ${model.name} (${model.id})`);
    });

    return frontendModels;
  }

  /**
   * Get top picks - same as getModelData now
   */
  async getTopPickModels() {
    console.log('ModelService: getTopPickModels called');
    return await this.getModelData();
  }

  /**
   * Enhanced model descriptions
   */
  getModelDescription(model) {
    const providerDescriptions = {
      'openai': {
        'gpt-4.1': 'Newest OpenAI model with enhanced reasoning',
        'gpt-4o': 'OpenAI\'s flagship multimodal model',
        'gpt-4o-mini': 'Fast and efficient OpenAI model',
        'gpt-4': 'Advanced OpenAI model'
      },
      'anthropic': {
        'claude-3-5-sonnet': 'Advanced Claude model for complex tasks',
        'claude-3-opus': 'Most capable Claude model'
      },
      'google': {
        'gemini-1.5-pro': 'Google\'s most advanced model',
        'gemini-1.5-flash': 'Fast and cost-effective Gemini model'
      }
    };

    // Try provider-specific description first
    if (model.provider && providerDescriptions[model.provider]) {
      for (const [modelKey, desc] of Object.entries(providerDescriptions[model.provider])) {
        if (model.id.includes(modelKey)) {
          return desc;
        }
      }
    }

    // Fallback descriptions
    const descriptions = {
      'latest': 'Latest and most advanced',
      'advanced': 'Advanced capabilities',
      'fast': 'Fast and efficient',
      'standard': 'Reliable performance'
    };

    return model.description || descriptions[model.category] || descriptions[model.cost_tier] || 'AI assistant';
  }

  async getRecommendedModel() {
    try {
      const data = await this._fetchApi('/ai/recommended');
      return {
        modelId: data.recommended,
        backendId: data.recommended
      };
    } catch (error) {
      console.error('Failed to get recommended model:', error);
      const models = await this.getModelData();
      const defaultModel = models.find(m => m.recommended) || models[0];
      return {
        modelId: defaultModel?.id || 'gpt-4o-mini',
        backendId: defaultModel?.id || 'gpt-4o-mini'
      };
    }
  }

  async getBackendModelId(frontendModelId) {
    if (!frontendModelId) {
      const recommended = await this.getRecommendedModel();
      return recommended.backendId;
    }

    const models = await this.getModelData();
    const model = models.find(m => m.id === frontendModelId);

    if (model) {
      return model.backendId || model.id;
    }

    console.warn(`Model ${frontendModelId} not found in cache, using as-is`);
    return frontendModelId;
  }

  /**
   * Fallback models with all 6 models for testing
   */
  getMinimalFallbackModels() {
    return [
      // OpenAI models
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Fast and efficient OpenAI model',
        provider: 'openai',
        providerName: 'OpenAI',
        providerIcon: 'openai',
        recommended: true,
        backendId: 'gpt-4o-mini',
        category: 'latest',
        cost_tier: 'premium',
        available: true,
        providerOrder: 1,
        modelOrder: 0
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'OpenAI\'s flagship model',
        provider: 'openai',
        providerName: 'OpenAI',
        providerIcon: 'openai',
        recommended: false,
        backendId: 'gpt-4o',
        category: 'advanced',
        cost_tier: 'premium',
        available: true,
        providerOrder: 1,
        modelOrder: 1
      },
      // Claude models
      {
        id: 'claude-3-5-sonnet-20240620',
        name: 'Claude 3.5 Sonnet',
        description: 'Advanced Claude model',
        provider: 'anthropic',
        providerName: 'Anthropic',
        providerIcon: 'anthropic',
        recommended: true,
        backendId: 'claude-3-5-sonnet-20240620',
        category: 'latest',
        cost_tier: 'premium',
        available: true,
        providerOrder: 2,
        modelOrder: 0
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Most capable Claude model',
        provider: 'anthropic',
        providerName: 'Anthropic',
        providerIcon: 'anthropic',
        recommended: false,
        backendId: 'claude-3-opus-20240229',
        category: 'advanced',
        cost_tier: 'premium',
        available: true,
        providerOrder: 2,
        modelOrder: 1
      },
      // Gemini models
      {
        id: 'gemini-1.5-pro-latest',
        name: 'Gemini 1.5 Pro',
        description: 'Google Gemini model',
        provider: 'google',
        providerName: 'Google',
        providerIcon: 'google',
        recommended: true,
        backendId: 'gemini-1.5-pro-latest',
        category: 'latest',
        cost_tier: 'premium',
        available: true,
        providerOrder: 3,
        modelOrder: 0
      },
      {
        id: 'gemini-1.5-flash-latest',
        name: 'Gemini 1.5 Flash',
        description: 'Fast Gemini model',
        provider: 'google',
        providerName: 'Google',
        providerIcon: 'google',
        recommended: true,
        backendId: 'gemini-1.5-flash-latest',
        category: 'fast',
        cost_tier: 'standard',
        available: true,
        providerOrder: 3,
        modelOrder: 1
      }
    ];
  }

  async refreshModels() {
    this.cachedModels = null;
    this.cacheExpiry = null;
    return await this.getModelData();
  }
}

export const modelService = new ModelService();
export default modelService;