// src/services/autoNamingService.js

class AutoNamingService {

  /**
   * Generate a smart chat title from the first user message
   * @param {string} message - The first user message
   * @param {string} modelId - Optional model ID for context
   * @returns {string} - Generated title
   */
  generateChatTitle(message, modelId = null) {
    if (!message || typeof message !== 'string') {
      return 'New Chat';
    }

    // Clean the message
    const cleanMessage = message.trim();

    // If message is too short, use it as-is (up to 50 chars)
    if (cleanMessage.length <= 15) {
      return cleanMessage || 'New Chat';
    }

    // Try different strategies to generate a good title
    const strategies = [
      this.extractQuestion.bind(this),
      this.extractKeyPhrase.bind(this),
      this.extractFirstSentence.bind(this),
      this.truncateMessage.bind(this)
    ];

    for (const strategy of strategies) {
      const title = strategy(cleanMessage);
      if (title && title !== 'New Chat') {
        return this.capitalizeTitle(title);
      }
    }

    return 'New Chat';
  }

  /**
   * Extract question from message
   */
  extractQuestion(message) {
    // Look for question patterns
    const questionPatterns = [
      /^(what|how|why|when|where|who|which|can|could|would|should|is|are|do|does|did)\s+.+\?/i,
      /^.+\?$/
    ];

    for (const pattern of questionPatterns) {
      const match = message.match(pattern);
      if (match) {
        let question = match[0].trim();
        // Limit length
        if (question.length > 60) {
          question = question.substring(0, 57) + '...';
        }
        return question;
      }
    }

    return null;
  }

  /**
   * Extract key phrase using common patterns
   */
  extractKeyPhrase(message) {
    // Common request patterns
    const patterns = [
      /^(help me|explain|tell me about|write|create|make|build|design|plan)\s+(.+?)(?:\.|$)/i,
      /^(i want to|i need to|i'm trying to|i'd like to)\s+(.+?)(?:\.|$)/i,
      /^(can you|could you|would you|please)\s+(.+?)(?:\.|$)/i,
      /^let's\s+(.+?)(?:\.|$)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        let phrase = match[match.length - 1].trim();

        // Clean up the phrase
        phrase = phrase.replace(/[^\w\s-]/g, '').trim();

        if (phrase.length > 50) {
          phrase = phrase.substring(0, 47) + '...';
        }

        if (phrase.length > 5) {
          return phrase;
        }
      }
    }

    return null;
  }

  /**
   * Extract first meaningful sentence
   */
  extractFirstSentence(message) {
    // Split by sentence endings
    const sentences = message.split(/[.!?]+/);

    if (sentences.length > 0) {
      let firstSentence = sentences[0].trim();

      // Remove common conversation starters
      firstSentence = firstSentence.replace(/^(hi|hello|hey|greetings)[,\s]*/i, '');

      if (firstSentence.length > 10 && firstSentence.length <= 60) {
        return firstSentence;
      }

      if (firstSentence.length > 60) {
        return firstSentence.substring(0, 57) + '...';
      }
    }

    return null;
  }

  /**
   * Fallback: intelligently truncate the message
   */
  truncateMessage(message) {
    // Remove common prefixes
    let cleaned = message.replace(/^(hi|hello|hey|greetings)[,\s]*/i, '');

    // If still too long, truncate at word boundary
    if (cleaned.length > 50) {
      const words = cleaned.split(' ');
      let truncated = '';

      for (const word of words) {
        if ((truncated + ' ' + word).length > 47) {
          break;
        }
        truncated += (truncated ? ' ' : '') + word;
      }

      return truncated + '...';
    }

    return cleaned || message.substring(0, 50);
  }

  /**
   * Capitalize title properly
   */
  capitalizeTitle(title) {
    if (!title) return title;

    // Don't change if it already has mixed case
    if (title !== title.toLowerCase() && title !== title.toUpperCase()) {
      return title;
    }

    // Capitalize first letter of each major word
    const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'up', 'via'];

    return title.split(' ').map((word, index) => {
      if (index === 0 || !minorWords.includes(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    }).join(' ');
  }

  /**
   * Generate title with AI context (for future AI-based naming)
   */
  async generateWithAI(message, modelId = null) {
    // This could call your AI service to generate smarter titles
    // For now, fallback to rule-based generation
    return this.generateChatTitle(message, modelId);
  }

  /**
   * Validate and clean a title
   */
  validateTitle(title) {
    if (!title || typeof title !== 'string') {
      return 'New Chat';
    }

    const cleaned = title.trim();

    // Check length
    if (cleaned.length === 0) {
      return 'New Chat';
    }

    if (cleaned.length > 100) {
      return cleaned.substring(0, 97) + '...';
    }

    return cleaned;
  }
}

// Export singleton instance
export const autoNamingService = new AutoNamingService();
export default autoNamingService;