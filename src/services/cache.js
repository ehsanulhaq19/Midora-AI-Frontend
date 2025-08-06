// services/cache.js
// Response caching system for API calls

export const responseCache = {
  generateKey: function(prompt, model) {
    // Create a hash-like key from the prompt and model
    const normalizedPrompt = prompt.toLowerCase().trim().replace(/\s+/g, ' ');
    return `cache_${model}_${btoa(normalizedPrompt).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50)}`;
  },

  save: function(prompt, model, response, modelUsed) {
    const key = this.generateKey(prompt, model);
    const cacheData = {
      prompt: prompt,
      model: model,
      response: response,
      modelUsed: modelUsed,
      timestamp: Date.now(),
      useCount: 1
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  },

  get: function(prompt, model) {
    const key = this.generateKey(prompt, model);
    const cached = localStorage.getItem(key);

    if (cached) {
      const data = JSON.parse(cached);
      const oneHour = 60 * 60 * 1000;
      const isRecent = (Date.now() - data.timestamp) < oneHour;

      if (isRecent) {
        // Update use count
        data.useCount++;
        localStorage.setItem(key, JSON.stringify(data));
        return data;
      } else {
        // Remove expired cache
        localStorage.removeItem(key);
      }
    }
    return null;
  },

  isSimilar: function(prompt1, prompt2) {
    const normalize = (str) => str.toLowerCase().trim().replace(/\s+/g, ' ');
    const p1 = normalize(prompt1);
    const p2 = normalize(prompt2);

    // Check for exact match or very similar (>80% similarity)
    if (p1 === p2) return true;

    const similarity = this.calculateSimilarity(p1, p2);
    return similarity > 0.8;
  },

  calculateSimilarity: function(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  },

  levenshteinDistance: function(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  },

  clear: function() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  },

  getStats: function() {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));
    let totalSize = 0;
    let totalUseCount = 0;

    cacheKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += data.length;
        try {
          const parsed = JSON.parse(data);
          totalUseCount += parsed.useCount || 0;
        } catch (e) {
          // Skip invalid entries
        }
      }
    });

    return {
      entryCount: cacheKeys.length,
      totalSize,
      totalUseCount,
      averageUseCount: cacheKeys.length > 0 ? totalUseCount / cacheKeys.length : 0
    };
  }
};